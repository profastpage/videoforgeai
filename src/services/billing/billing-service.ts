import type { PlanId } from "@/config/plans";
import type { CreditsBalance, CreditsTransaction, Plan, Subscription } from "@/lib/schemas/billing";
import type { AuthSession } from "@/lib/schemas/auth";
import type { CreateVideoGenerationInput } from "@/lib/schemas/video";
import type Stripe from "stripe";
import { creditsRepository } from "@/server/repositories/credits.repository";
import { plansRepository } from "@/server/repositories/plans.repository";
import { subscriptionsRepository } from "@/server/repositories/subscriptions.repository";
import { usersRepository } from "@/server/repositories/users.repository";
import { AppServiceError } from "@/lib/errors";
import {
  createBillingPortalSession,
  createStripeCheckoutSession,
  getPlanIdFromStripePriceId,
  normalizeStripeSubscriptionStatus,
  retrieveStripeCheckoutSession,
  retrieveStripeSubscription,
} from "@/services/billing/stripe-service";

const resolutionMultipliers = {
  "720p": 1,
} as const;

const typeMultipliers = {
  "text-to-video": 1,
  "image-to-video": 1.2,
} as const;

export async function getBillingSnapshot(session: AuthSession) {
  const [subscription, balance, transactions] = await Promise.all([
    subscriptionsRepository.findByUserId(session.user.id),
    creditsRepository.getBalanceByUserId(session.user.id),
    creditsRepository.listTransactionsByUserId(session.user.id),
  ]);
  const plan = await plansRepository.findById(subscription?.planId ?? session.planId);

  if (!plan || !balance) {
    throw new AppServiceError(
      "BILLING_NOT_FOUND",
      "Billing data is not available for this workspace.",
      404,
    );
  }

  return {
    plan,
    balance,
    subscription,
    transactions,
  };
}

export function estimateGenerationCredits(input: CreateVideoGenerationInput) {
  const durationBase = Math.ceil(input.durationSeconds / 5) * 4;
  const resolutionFactor = resolutionMultipliers[input.resolution];
  const typeFactor = typeMultipliers[input.generationType];

  return Math.ceil(durationBase * resolutionFactor * typeFactor);
}

export async function assertEnoughCredits(userId: string, requiredCredits: number) {
  const balance = await creditsRepository.getBalanceByUserId(userId);

  if (!balance || balance.availableCredits < requiredCredits) {
    throw new AppServiceError(
      "INSUFFICIENT_CREDITS",
      "You do not have enough credits to start this generation.",
      402,
    );
  }

  return balance;
}

export async function consumeGenerationCredits(input: {
  userId: string;
  amount: number;
  generationId: string;
  reason: string;
}) {
  await creditsRepository.consumeCredits(input);
}

export async function refundGenerationCredits(input: {
  userId: string;
  amount: number;
  generationId: string;
  reason: string;
}) {
  await creditsRepository.refundCredits(input);
}

export async function beginBillingCheckout(session: AuthSession, planId: Plan["id"]) {
  const [plan, subscription] = await Promise.all([
    plansRepository.findById(planId),
    subscriptionsRepository.findByUserId(session.user.id),
  ]);

  if (!plan) {
    throw new AppServiceError("PLAN_NOT_FOUND", "Requested plan is not available.", 404);
  }

  if (subscription?.stripeCustomerId && subscription?.stripeSubscriptionId) {
    const portalSession = await createBillingPortalSession({
      stripeCustomerId: subscription.stripeCustomerId,
    });

    return {
      url: portalSession.url,
      mode: "portal" as const,
    };
  }

  const checkoutSession = await createStripeCheckoutSession({
    planId: plan.id as PlanId,
    userId: session.user.id,
    email: session.user.email,
  });

  return {
    url: checkoutSession.url,
    mode: "checkout" as const,
  };
}

export async function beginBillingPortal(session: AuthSession) {
  const subscription = await subscriptionsRepository.findByUserId(session.user.id);

  if (!subscription?.stripeCustomerId) {
    throw new AppServiceError(
      "BILLING_PORTAL_UNAVAILABLE",
      "The billing portal becomes available after the first Stripe checkout.",
      409,
    );
  }

  const portalSession = await createBillingPortalSession({
    stripeCustomerId: subscription.stripeCustomerId,
  });

  return {
    url: portalSession.url,
    mode: "portal" as const,
  };
}

export async function syncCheckoutSessionForUser(sessionId: string, expectedUserId?: string) {
  const checkoutSession = await retrieveStripeCheckoutSession(sessionId);
  const userId =
    checkoutSession.client_reference_id ??
    checkoutSession.metadata?.userId ??
    undefined;

  if (expectedUserId && userId !== expectedUserId) {
    throw new AppServiceError(
      "CHECKOUT_SESSION_MISMATCH",
      "Checkout session does not belong to the current user.",
      403,
    );
  }

  if (!userId) {
    throw new AppServiceError(
      "CHECKOUT_USER_NOT_FOUND",
      "Stripe checkout session is missing a linked workspace user.",
      400,
    );
  }

  const stripeSubscription =
    typeof checkoutSession.subscription === "string"
      ? await retrieveStripeSubscription(checkoutSession.subscription)
      : checkoutSession.subscription;

  if (!stripeSubscription) {
    throw new AppServiceError(
      "CHECKOUT_SUBSCRIPTION_NOT_FOUND",
      "Stripe checkout session did not include a subscription.",
      400,
    );
  }

  return syncStripeSubscriptionState(stripeSubscription, userId);
}

export async function syncStripeSubscriptionState(
  stripeSubscription: Stripe.Subscription,
  fallbackUserId?: string,
) {
  const stripeSubscriptionId = stripeSubscription.id;
  const stripeCustomerId =
    typeof stripeSubscription.customer === "string"
      ? stripeSubscription.customer
      : stripeSubscription.customer.id;
  const stripeSubscriptionWithPeriods = stripeSubscription as Stripe.Subscription & {
    current_period_end?: number | null;
  };

  const existing =
    (await subscriptionsRepository.findByStripeSubscriptionId(stripeSubscriptionId)) ??
    (await subscriptionsRepository.findByStripeCustomerId(stripeCustomerId));
  const userId = fallbackUserId ?? stripeSubscription.metadata.userId ?? existing?.userId;
  const priceId = stripeSubscription.items.data[0]?.price.id ?? null;
  const planId =
    (priceId ? getPlanIdFromStripePriceId(priceId) : null) ??
    stripeSubscription.metadata.planId ??
    existing?.planId;

  if (!userId || !planId) {
    throw new AppServiceError(
      "STRIPE_SUBSCRIPTION_SYNC_FAILED",
      "Stripe subscription could not be mapped to a local workspace plan.",
      400,
    );
  }

  const subscription = await subscriptionsRepository.upsert({
    userId,
    planId: planId as PlanId,
    stripeCustomerId,
    stripeSubscriptionId,
    status: normalizeStripeSubscriptionStatus(stripeSubscription.status),
    billingCycleAnchor: stripeSubscription.billing_cycle_anchor
      ? new Date(stripeSubscription.billing_cycle_anchor * 1000).toISOString()
      : null,
    currentPeriodEnd: stripeSubscriptionWithPeriods.current_period_end
      ? new Date(stripeSubscriptionWithPeriods.current_period_end * 1000).toISOString()
      : null,
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
  });

  await usersRepository.updatePlan(userId, planId as PlanId);

  if (subscription.status === "active" || subscription.status === "trialing") {
    const syncedPlan = await plansRepository.findById(planId as PlanId);

    if (syncedPlan) {
      await creditsRepository.ensurePlanAllowance({
        userId,
        targetCredits: syncedPlan.monthlyCredits,
        reason: `Plan allowance synced from Stripe for ${syncedPlan.name}`,
      });
    }
  }

  return subscription;
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      if (checkoutSession.mode !== "subscription" || !checkoutSession.subscription) {
        return { processed: false, eventType: event.type };
      }

      await syncCheckoutSessionForUser(
        checkoutSession.id,
        checkoutSession.client_reference_id ?? checkoutSession.metadata?.userId ?? undefined,
      );

      return { processed: true, eventType: event.type };
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncStripeSubscriptionState(subscription);
      return { processed: true, eventType: event.type };
    }
    default:
      return { processed: false, eventType: event.type };
  }
}

export type BillingSnapshot = {
  plan: Plan;
  balance: CreditsBalance;
  subscription: Subscription | null;
  transactions: CreditsTransaction[];
};

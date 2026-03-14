import type Stripe from "stripe";
import { env } from "@/server/env";
import { getStripeClient } from "@/server/stripe/client";
import { AppServiceError } from "@/lib/errors";
import { planCatalog, type PlanId } from "@/config/plans";

const stripePriceMap = {
  demo: env.STRIPE_PRICE_DEMO,
  lite: env.STRIPE_PRICE_LITE,
  pro: env.STRIPE_PRICE_PRO,
  business: env.STRIPE_PRICE_BUSINESS,
} as const satisfies Record<PlanId, string | undefined>;

export function getStripePriceId(planId: string) {
  return stripePriceMap[planId as PlanId] ?? null;
}

export function getPlanIdFromStripePriceId(priceId: string) {
  return (
    planCatalog.find((plan) => getStripePriceId(plan.id) === priceId)?.id ?? null
  );
}

export function normalizeStripeSubscriptionStatus(
  status: Stripe.Subscription.Status,
) {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
    case "paused":
    case "unpaid":
      return "past_due";
    case "canceled":
      return "canceled";
    case "incomplete":
    case "incomplete_expired":
      return "incomplete";
    default:
      return "incomplete";
  }
}

function requireStripeClient() {
  const stripe = getStripeClient();

  if (!stripe) {
    throw new AppServiceError(
      "STRIPE_NOT_CONFIGURED",
      "Stripe billing is not configured on this environment yet.",
      503,
    );
  }

  return stripe;
}

export async function createStripeCheckoutSession(input: {
  planId: PlanId;
  userId: string;
  email: string;
}) {
  const stripe = requireStripeClient();
  const priceId = getStripePriceId(input.planId);

  if (!priceId) {
    throw new AppServiceError(
      "PLAN_PRICE_NOT_CONFIGURED",
      "Stripe price id is missing for the selected plan.",
      500,
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: input.userId,
    customer_email: input.email,
    allow_promotion_codes: true,
    metadata: {
      userId: input.userId,
      planId: input.planId,
    },
    subscription_data: {
      metadata: {
        userId: input.userId,
        planId: input.planId,
      },
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url:
      `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?checkout=cancelled`,
  });

  if (!session.url) {
    throw new AppServiceError(
      "CHECKOUT_CREATE_FAILED",
      "Stripe checkout session did not return a redirect URL.",
      500,
    );
  }

  return session;
}

export async function createBillingPortalSession(input: {
  stripeCustomerId: string;
}) {
  const stripe = requireStripeClient();

  return stripe.billingPortal.sessions.create({
    customer: input.stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });
}

export async function constructStripeWebhookEvent(input: {
  payload: string;
  signature: string | null;
}) {
  const stripe = requireStripeClient();

  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new AppServiceError(
      "STRIPE_WEBHOOK_NOT_CONFIGURED",
      "Stripe webhook secret is missing.",
      500,
    );
  }

  if (!input.signature) {
    throw new AppServiceError(
      "INVALID_WEBHOOK_SIGNATURE",
      "Stripe webhook signature header is missing.",
      400,
    );
  }

  try {
    return stripe.webhooks.constructEvent(
      input.payload,
      input.signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    throw new AppServiceError(
      "INVALID_WEBHOOK_SIGNATURE",
      "Stripe webhook signature verification failed.",
      400,
    );
  }
}

export async function retrieveStripeCheckoutSession(sessionId: string) {
  const stripe = requireStripeClient();

  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });
}

export async function retrieveStripeSubscription(subscriptionId: string) {
  const stripe = requireStripeClient();
  return stripe.subscriptions.retrieve(subscriptionId);
}

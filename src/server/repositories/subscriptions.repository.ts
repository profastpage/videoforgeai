import type { PlanId } from "@/config/plans";
import {
  subscriptionSchema,
  type SubscriptionStatus,
} from "@/lib/schemas/billing";
import { createMockSubscription } from "@/server/mock-db/factories";

const subscriptionStore = [
  subscriptionSchema.parse({
    id: "e7108fd0-7244-4f09-8f21-a5f45ea2ca79",
    userId: "0ed7596f-f5e7-470e-9d3a-d9e1085ed267",
    planId: "pro",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    status: "active",
    billingCycleAnchor: null,
    currentPeriodEnd: "2026-04-01T00:00:00.000Z",
    cancelAtPeriodEnd: false,
  }),
];

export class SubscriptionsRepository {
  async findByUserId(userId: string) {
    const existing =
      subscriptionStore.find((subscription) => subscription.userId === userId) ??
      null;

    if (existing) {
      return existing;
    }

    const subscription = createMockSubscription(userId);
    subscriptionStore.unshift(subscription);
    return subscription;
  }

  async findByStripeCustomerId(stripeCustomerId: string) {
    return (
      subscriptionStore.find(
        (subscription) => subscription.stripeCustomerId === stripeCustomerId,
      ) ?? null
    );
  }

  async findByStripeSubscriptionId(stripeSubscriptionId: string) {
    return (
      subscriptionStore.find(
        (subscription) =>
          subscription.stripeSubscriptionId === stripeSubscriptionId,
      ) ?? null
    );
  }

  async upsert(input: {
    userId: string;
    planId: PlanId;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    status: SubscriptionStatus;
    billingCycleAnchor?: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  }) {
    const existing =
      (input.stripeSubscriptionId
        ? await this.findByStripeSubscriptionId(input.stripeSubscriptionId)
        : null) ??
      (input.stripeCustomerId
        ? await this.findByStripeCustomerId(input.stripeCustomerId)
        : null) ??
      (await this.findByUserId(input.userId));

    const next = subscriptionSchema.parse({
      id: existing?.id ?? crypto.randomUUID(),
      userId: input.userId,
      planId: input.planId,
      stripeCustomerId: input.stripeCustomerId ?? existing?.stripeCustomerId ?? null,
      stripeSubscriptionId:
        input.stripeSubscriptionId ?? existing?.stripeSubscriptionId ?? null,
      status: input.status,
      billingCycleAnchor:
        input.billingCycleAnchor ?? existing?.billingCycleAnchor ?? null,
      currentPeriodEnd: input.currentPeriodEnd,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd,
    });

    const index = subscriptionStore.findIndex(
      (subscription) => subscription.id === next.id,
    );

    if (index >= 0) {
      subscriptionStore[index] = next;
    } else {
      subscriptionStore.unshift(next);
    }

    return next;
  }
}

export const subscriptionsRepository = new SubscriptionsRepository();

import { z } from "zod";
import { planCatalog } from "@/config/plans";

export const planIdSchema = z.enum(planCatalog.map((plan) => plan.id) as [string, ...string[]]);
export const billingPrioritySchema = z.enum(["standard", "priority", "highest"]);

export const planSchema = z.object({
  id: planIdSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  monthlyPrice: z.number().nonnegative(),
  monthlyCredits: z.number().int().positive(),
  includedVideos: z.number().int().positive(),
  standardDurationSeconds: z.number().int().positive(),
  maxDurationSeconds: z.number().int().positive(),
  historyLimitDays: z.number().int().positive(),
  concurrencyLimit: z.number().int().positive(),
  priority: billingPrioritySchema,
  features: z.array(z.string().min(1)).min(1),
});

export const subscriptionStatusSchema = z.enum([
  "trialing",
  "active",
  "past_due",
  "canceled",
  "incomplete",
]);

export const subscriptionSchema = z.object({
  id: z.string().min(1),
  userId: z.string().uuid(),
  planId: planIdSchema,
  stripeCustomerId: z.string().min(1).nullable(),
  stripeSubscriptionId: z.string().min(1).nullable(),
  status: subscriptionStatusSchema,
  billingCycleAnchor: z.string().datetime().nullable(),
  currentPeriodEnd: z.string().datetime().nullable(),
  cancelAtPeriodEnd: z.boolean(),
});

export const createCheckoutSessionSchema = z.object({
  planId: planIdSchema,
});

export const creditsBalanceSchema = z.object({
  userId: z.string().uuid(),
  availableCredits: z.number().int().nonnegative(),
  reservedCredits: z.number().int().nonnegative(),
  lifetimeUsedCredits: z.number().int().nonnegative(),
});

export const creditsTransactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  generationId: z.string().uuid().nullable(),
  amount: z.number().int(),
  type: z.enum(["grant", "usage", "refund", "adjustment"]),
  reason: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type Plan = z.infer<typeof planSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
export type CreditsBalance = z.infer<typeof creditsBalanceSchema>;
export type CreditsTransaction = z.infer<typeof creditsTransactionSchema>;
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

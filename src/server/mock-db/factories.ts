import {
  authSessionSchema,
  type AuthSession,
} from "@/lib/schemas/auth";
import {
  creditsBalanceSchema,
  creditsTransactionSchema,
  subscriptionSchema,
} from "@/lib/schemas/billing";
import { videoGenerationSchema } from "@/lib/schemas/video";
import { env } from "@/server/env";

function getRoleForEmail(email: string) {
  return env.SUPERADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";
}

export function createMockSession(input: {
  userId: string;
  email: string;
  fullName: string;
  companyName?: string | null;
}): AuthSession {
  return authSessionSchema.parse({
    user: {
      id: input.userId,
      email: input.email,
      role: getRoleForEmail(input.email),
    },
    profile: {
      id: input.userId,
      fullName: input.fullName,
      avatarUrl: null,
      companyName: input.companyName ?? "VideoForge Workspace",
      timezone: "America/Lima",
      themePreference: "system",
    },
    planId: "demo",
    isAuthenticated: true,
  });
}

export function createMockBalance(userId: string) {
  return creditsBalanceSchema.parse({
    userId,
    availableCredits: 11,
    reservedCredits: 0,
    lifetimeUsedCredits: 0,
  });
}

export function createMockSubscription(userId: string) {
  return subscriptionSchema.parse({
    id: crypto.randomUUID(),
    userId,
    planId: "demo",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    status: "active",
    billingCycleAnchor: null,
    currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    cancelAtPeriodEnd: false,
  });
}

export function createMockTransaction(userId: string) {
  return creditsTransactionSchema.parse({
    id: crypto.randomUUID(),
    userId,
    generationId: null,
    amount: 11,
    type: "grant",
    reason: "Starter demo credits granted on workspace creation",
    createdAt: new Date().toISOString(),
  });
}

export function createSeedGenerationsForUser(userId: string) {
  return [
    videoGenerationSchema.parse({
      id: crypto.randomUUID(),
      userId,
      projectName: "Welcome Promo Reel",
      prompt:
        "Create a welcome promo showing how fast VideoForge AI turns a prompt into a polished business-ready video with strong CTA framing.",
      negativePrompt: "Avoid clutter and low-contrast scenes.",
      generationType: "text-to-video",
      status: "completed",
      aspectRatio: "9:16",
      resolution: "720p",
      durationSeconds: 10,
      style: "performance-ads",
      templateSlug: "startup-demo-sizzle",
      sourceImageUrl: null,
      providerKey: "mock",
      providerJobId: `mock-${userId}-welcome`,
      progress: 100,
      estimatedCredits: 11,
      consumedCredits: 11,
      errorCode: null,
      errorMessage: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 88).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 88).toISOString(),
    }),
  ];
}

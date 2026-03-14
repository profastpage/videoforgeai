import { z } from "zod";
import { PROVIDER_KEYS, VIDEO_ASPECT_RATIOS } from "@/lib/constants";

export const videoProviderKeySchema = z.enum(PROVIDER_KEYS);
export const videoAspectRatioSchema = z.enum(VIDEO_ASPECT_RATIOS);
export const videoGenerationStatusSchema = z.enum([
  "queued",
  "rendering",
  "ready",
  "failed",
]);
export const providerAvailabilitySchema = z.enum(["available", "planned"]);

export const demoSessionSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
});

export const videoTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  hook: z.string().min(1),
  durationSeconds: z.number().int().positive(),
  aspectRatio: videoAspectRatioSchema,
  provider: videoProviderKeySchema,
  tags: z.array(z.string().min(1)).min(1),
  gradientFrom: z.string().min(1),
  gradientTo: z.string().min(1),
});

export const videoGenerationSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  templateId: z.string().min(1),
  title: z.string().min(1),
  prompt: z.string().min(20).max(400),
  targetAudience: z.string().min(2).max(80),
  cta: z.string().min(2).max(120),
  aspectRatio: videoAspectRatioSchema,
  provider: videoProviderKeySchema,
  status: videoGenerationStatusSchema,
  durationSeconds: z.number().int().positive(),
  creditsUsed: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  summary: z.string().min(1),
  assetUrl: z.string().min(1).optional(),
});

export const dashboardMetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  detail: z.string().min(1),
});

export const billingSummarySchema = z.object({
  planName: z.string().min(1),
  monthlyCredits: z.number().int().positive(),
  creditsUsed: z.number().int().nonnegative(),
  creditsRemaining: z.number().int().nonnegative(),
  renewalDate: z.string().min(1),
  seatCount: z.number().int().positive(),
});

export const providerSummarySchema = z.object({
  key: videoProviderKeySchema,
  label: z.string().min(1),
  description: z.string().min(1),
  status: providerAvailabilitySchema,
  capabilities: z.array(z.string().min(1)).min(1),
});

export const dashboardSnapshotSchema = z.object({
  session: demoSessionSchema,
  templates: z.array(videoTemplateSchema),
  generations: z.array(videoGenerationSchema),
  metrics: z.array(dashboardMetricSchema),
  billing: billingSummarySchema,
  providers: z.array(providerSummarySchema),
  activeProviderKey: videoProviderKeySchema,
});

export const createVideoGenerationSchema = z.object({
  templateId: z.string().min(1),
  prompt: z.string().trim().min(20).max(400),
  targetAudience: z.string().trim().min(2).max(80),
  cta: z.string().trim().min(2).max(120),
  aspectRatio: videoAspectRatioSchema,
  provider: videoProviderKeySchema.optional(),
});

export const createVideoGenerationResultSchema = z.object({
  generation: videoGenerationSchema,
  billing: billingSummarySchema,
  metrics: z.array(dashboardMetricSchema),
  activeProvider: providerSummarySchema,
});

export const apiErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
});

export type DemoSession = z.infer<typeof demoSessionSchema>;
export type VideoProviderKey = z.infer<typeof videoProviderKeySchema>;
export type VideoTemplate = z.infer<typeof videoTemplateSchema>;
export type VideoGeneration = z.infer<typeof videoGenerationSchema>;
export type DashboardMetric = z.infer<typeof dashboardMetricSchema>;
export type BillingSummary = z.infer<typeof billingSummarySchema>;
export type ProviderSummary = z.infer<typeof providerSummarySchema>;
export type DashboardSnapshot = z.infer<typeof dashboardSnapshotSchema>;
export type CreateVideoGenerationInput = z.infer<
  typeof createVideoGenerationSchema
>;
export type CreateVideoGenerationResult = z.infer<
  typeof createVideoGenerationResultSchema
>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type VideoAspectRatio = z.infer<typeof videoAspectRatioSchema>;

export type ApiResponse<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };

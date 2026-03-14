import { z } from "zod";
import {
  videoAspectRatioSchema,
  videoDurationSchema,
  videoGenerationTypeSchema,
  videoStyleSchema,
} from "@/lib/schemas/video";
import { locales } from "@/lib/i18n/messages";

export const enhanceVideoBriefInputSchema = z.object({
  idea: z.string().trim().min(10).max(400),
  locale: z.enum(locales),
  generationType: videoGenerationTypeSchema,
  preferredAspectRatio: videoAspectRatioSchema.optional(),
  preferredDurationSeconds: videoDurationSchema.optional(),
});

export const enhancedVideoBriefSchema = z.object({
  projectName: z.string().trim().min(2).max(100),
  hook: z.string().trim().min(10).max(120),
  prompt: z.string().trim().min(20).max(600),
  negativePrompt: z.string().trim().max(240),
  callToAction: z.string().trim().min(4).max(90),
  style: videoStyleSchema,
  aspectRatio: videoAspectRatioSchema,
  durationSeconds: videoDurationSchema,
});

export type EnhanceVideoBriefInput = z.infer<typeof enhanceVideoBriefInputSchema>;
export type EnhancedVideoBrief = z.infer<typeof enhancedVideoBriefSchema>;

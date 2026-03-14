import { z } from "zod";
import {
  videoAspectRatios,
  videoDurations,
  videoGenerationStatuses,
  videoGenerationTypes,
  videoResolutions,
  videoStyles,
} from "@/config/video";

export const videoAspectRatioSchema = z.enum(videoAspectRatios);
export const videoResolutionSchema = z.enum(videoResolutions);
export const videoDurationSchema = z.union(
  videoDurations.map((duration) => z.literal(duration)) as [
    z.ZodLiteral<(typeof videoDurations)[number]>,
    z.ZodLiteral<(typeof videoDurations)[number]>,
  ],
);
export const videoStyleSchema = z.enum(videoStyles);
export const videoGenerationTypeSchema = z.enum(videoGenerationTypes);
export const videoGenerationStatusSchema = z.enum(videoGenerationStatuses);

export const generationAssetSchema = z.object({
  id: z.string().uuid(),
  generationId: z.string().uuid(),
  kind: z.enum(["preview", "source", "final"]),
  url: z.string().url(),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative().nullable(),
});

export const videoGenerationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  projectName: z.string().min(2).max(100),
  prompt: z.string().trim().min(20).max(600),
  negativePrompt: z.string().trim().max(240).nullable(),
  generationType: videoGenerationTypeSchema,
  status: videoGenerationStatusSchema,
  aspectRatio: videoAspectRatioSchema,
  resolution: videoResolutionSchema,
  durationSeconds: videoDurationSchema,
  style: videoStyleSchema,
  templateSlug: z.string().min(1).nullable(),
  sourceImageUrl: z.string().url().nullable(),
  providerKey: z.string().min(1),
  providerJobId: z.string().min(1).nullable(),
  progress: z.number().min(0).max(100),
  estimatedCredits: z.number().int().positive(),
  consumedCredits: z.number().int().nonnegative().nullable(),
  errorCode: z.string().nullable(),
  errorMessage: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});

export const createVideoGenerationSchema = z
  .object({
    projectName: z.string().trim().min(2).max(100),
    prompt: z.string().trim().min(20).max(600),
    negativePrompt: z.string().trim().max(240).optional(),
    generationType: videoGenerationTypeSchema,
    aspectRatio: videoAspectRatioSchema,
    resolution: videoResolutionSchema,
    durationSeconds: videoDurationSchema,
    style: videoStyleSchema,
    templateSlug: z.string().min(1).optional(),
    sourceImageUrl: z.string().url().optional(),
  })
  .superRefine((input, context) => {
    if (input.generationType === "image-to-video" && !input.sourceImageUrl) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source image is required for image-to-video generations.",
        path: ["sourceImageUrl"],
      });
    }
  });

export type VideoGeneration = z.infer<typeof videoGenerationSchema>;
export type CreateVideoGenerationInput = z.infer<typeof createVideoGenerationSchema>;
export type GenerationAsset = z.infer<typeof generationAssetSchema>;

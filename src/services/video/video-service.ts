import {
  createVideoGenerationSchema,
  type CreateVideoGenerationInput,
  type VideoGeneration,
} from "@/lib/schemas/video";
import type { AuthSession } from "@/lib/schemas/auth";
import { AppServiceError } from "@/lib/errors";
import { localizeGenerationViews } from "@/lib/i18n/demo-content";
import type { Locale } from "@/lib/i18n/messages";
import { auditLogsRepository } from "@/server/repositories/audit-logs.repository";
import { logger } from "@/server/logger";
import { videoGenerationsRepository } from "@/server/repositories/video-generations.repository";
import {
  assertEnoughCredits,
  consumeGenerationCredits,
  estimateGenerationCredits,
  refundGenerationCredits,
} from "@/services/billing/billing-service";
import { getVideoProvider, listVideoProviders } from "@/services/video/providers/registry";

function getMockAssetUrls(generation: VideoGeneration) {
  if (generation.status === "completed") {
    return {
      previewUrl:
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      downloadUrl:
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    };
  }

  return {
    previewUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    downloadUrl: null,
  };
}

async function getGenerationAssetUrls(generation: VideoGeneration) {
  if (generation.providerKey === "mock" || !generation.providerJobId) {
    return getMockAssetUrls(generation);
  }

  if (generation.status !== "completed") {
    return {
      previewUrl: null,
      downloadUrl: null,
    };
  }

  try {
    const provider = getVideoProvider(generation.providerKey);
    const result = await provider.getGenerationResult(generation.providerJobId);

    return {
      previewUrl: result.previewUrl ?? result.finalUrl ?? null,
      downloadUrl: result.finalUrl ?? null,
    };
  } catch (error) {
    logger.warn("Could not resolve provider asset URLs, falling back to empty assets", {
      generationId: generation.id,
      providerKey: generation.providerKey,
      error,
    });
    return {
      previewUrl: null,
      downloadUrl: null,
    };
  }
}

async function toGenerationView(generation: VideoGeneration) {
  return {
    ...generation,
    ...(await getGenerationAssetUrls(generation)),
  };
}

export type VideoGenerationView = Awaited<ReturnType<typeof toGenerationView>>;

export async function listUserGenerations(session: AuthSession, locale: Locale = "en") {
  const generations = await videoGenerationsRepository.listByUserId(session.user.id);
  const refreshed = await Promise.all(
    generations.map(async (generation) => {
      if (!["queued", "processing"].includes(generation.status)) {
        return generation;
      }

      return refreshGenerationStatus(session, generation.id);
    }),
  );

  return localizeGenerationViews(await Promise.all(refreshed.map(toGenerationView)), locale);
}

export async function createVideoGeneration(
  session: AuthSession,
  input: CreateVideoGenerationInput,
) {
  const parsedInput = createVideoGenerationSchema.parse(input);
  const estimatedCredits = estimateGenerationCredits(parsedInput);
  await assertEnoughCredits(session.user.id, estimatedCredits);

  const generation = await videoGenerationsRepository.create({
    id: crypto.randomUUID(),
    userId: session.user.id,
    projectName: parsedInput.projectName,
    prompt: parsedInput.prompt,
    negativePrompt: parsedInput.negativePrompt ?? null,
    generationType: parsedInput.generationType,
    status: "queued",
    aspectRatio: parsedInput.aspectRatio,
    resolution: parsedInput.resolution,
    durationSeconds: parsedInput.durationSeconds,
    style: parsedInput.style,
    templateSlug: parsedInput.templateSlug ?? null,
    sourceImageUrl: parsedInput.sourceImageUrl ?? null,
    providerKey: "mock",
    providerJobId: null,
    progress: 0,
    estimatedCredits,
    consumedCredits: null,
    errorCode: null,
    errorMessage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  });

  const provider = getVideoProvider();
  const job = await provider.createGeneration({
    ...parsedInput,
    generationId: generation.id,
  });

  const nextGeneration = await videoGenerationsRepository.update(generation.id, {
    providerKey: provider.key,
    providerJobId: job.providerJobId,
    status: job.status,
    progress: job.progress,
    updatedAt: new Date().toISOString(),
  });

  if (!nextGeneration) {
    throw new AppServiceError(
      "GENERATION_CREATE_FAILED",
      "The generation was queued but could not be persisted.",
      500,
    );
  }

  await auditLogsRepository.create({
    actorUserId: session.user.id,
    eventType: "video_generation.created",
    entityType: "video_generation",
    entityId: nextGeneration.id,
    payload: {
      estimatedCredits,
      providerKey: provider.key,
    },
  });

  return toGenerationView(nextGeneration);
}

export async function refreshGenerationStatus(
  session: AuthSession,
  generationId: string,
) {
  const generation = await videoGenerationsRepository.findById(generationId);

  if (!generation || generation.userId !== session.user.id) {
    throw new AppServiceError("GENERATION_NOT_FOUND", "Generation not found.", 404);
  }

  if (!generation.providerJobId) {
    return generation;
  }

  const provider = getVideoProvider(generation.providerKey);
  const providerStatus = await provider.getGenerationStatus(generation.providerJobId);

  const updatedGeneration = await videoGenerationsRepository.update(generation.id, {
    status: providerStatus.status,
    progress: providerStatus.progress,
    errorCode: providerStatus.errorCode ?? null,
    errorMessage: providerStatus.errorMessage ?? null,
    updatedAt: new Date().toISOString(),
    completedAt:
      providerStatus.status === "completed" ? new Date().toISOString() : generation.completedAt,
  });

  if (!updatedGeneration) {
    throw new AppServiceError(
      "GENERATION_UPDATE_FAILED",
      "Could not update generation status.",
      500,
    );
  }

  if (
    providerStatus.status === "completed" &&
    updatedGeneration.consumedCredits === null
  ) {
    await consumeGenerationCredits({
      userId: updatedGeneration.userId,
      amount: updatedGeneration.estimatedCredits,
      generationId: updatedGeneration.id,
      reason: `${updatedGeneration.projectName} completed`,
    });

    const completedGeneration = await videoGenerationsRepository.update(updatedGeneration.id, {
      consumedCredits: updatedGeneration.estimatedCredits,
    });

    return toGenerationView(completedGeneration ?? updatedGeneration);
  }

  if (
    providerStatus.status === "failed" &&
    updatedGeneration.consumedCredits !== null
  ) {
    await refundGenerationCredits({
      userId: updatedGeneration.userId,
      amount: updatedGeneration.consumedCredits,
      generationId: updatedGeneration.id,
      reason: `${updatedGeneration.projectName} failed`,
    });
  }

  return toGenerationView(updatedGeneration);
}

export async function cancelGeneration(session: AuthSession, generationId: string) {
  const generation = await videoGenerationsRepository.findById(generationId);

  if (!generation || generation.userId !== session.user.id) {
    throw new AppServiceError("GENERATION_NOT_FOUND", "Generation not found.", 404);
  }

  if (!generation.providerJobId) {
    throw new AppServiceError(
      "GENERATION_NOT_CANCELLABLE",
      "This generation cannot be cancelled.",
      400,
    );
  }

  const provider = getVideoProvider(generation.providerKey);
  const result = await provider.cancelGeneration(generation.providerJobId);

  if (!result.cancelled) {
    throw new AppServiceError(
      "GENERATION_CANCEL_FAILED",
      "The generation could not be cancelled.",
      400,
    );
  }

  const updated = await videoGenerationsRepository.update(generation.id, {
    status: "cancelled",
    updatedAt: new Date().toISOString(),
  });

  return toGenerationView(updated ?? generation);
}

export async function duplicateGeneration(session: AuthSession, generationId: string) {
  const generation = await videoGenerationsRepository.findById(generationId);

  if (!generation || generation.userId !== session.user.id) {
    throw new AppServiceError("GENERATION_NOT_FOUND", "Generation not found.", 404);
  }

  return createVideoGeneration(session, {
    projectName: `${generation.projectName} Copy`,
    prompt: generation.prompt,
    negativePrompt: generation.negativePrompt ?? undefined,
    generationType: generation.generationType,
    aspectRatio: generation.aspectRatio,
    resolution: generation.resolution,
    durationSeconds: generation.durationSeconds,
    style: generation.style,
    templateSlug: generation.templateSlug ?? undefined,
    sourceImageUrl: generation.sourceImageUrl ?? undefined,
  });
}

export async function getVideoWorkspace(session: AuthSession, locale: Locale = "en") {
  const generations = await listUserGenerations(session, locale);

  return {
    generations,
    providers: listVideoProviders(),
  };
}

import { AppServiceError } from "@/lib/errors";
import { env } from "@/server/env";
import { logger } from "@/server/logger";
import type {
  CreateGenerationPayload,
  ProviderErrorCode,
  VideoProviderAdapter,
  VideoProviderJob,
} from "@/services/video/providers/base";

type FalQueueResponse = {
  request_id: string;
  status?: string;
};

type FalStatusResponse = {
  status: string;
  request_id?: string;
  response_url?: string;
  cancel_url?: string;
  status_url?: string;
  logs?: Array<{ message?: string }>;
  metrics?: {
    inference_time?: number;
  };
};

type FalResultVideo = {
  url?: string;
  content_type?: string;
  file_name?: string;
  file_size?: number;
};

type FalResultResponse = {
  videos?: FalResultVideo[];
  video?: FalResultVideo;
  seed?: number;
  has_nsfw_concepts?: boolean[];
};

function getFalApiKey() {
  return env.FAL_API_KEY ?? env.VIDEO_PROVIDER_API_KEY ?? null;
}

export function isFalProviderConfigured() {
  return Boolean(getFalApiKey());
}

function requireFalApiKey() {
  const apiKey = getFalApiKey();

  if (!apiKey) {
    throw new AppServiceError(
      "PROVIDER_ERROR",
      "fal provider is not configured. Add FAL_API_KEY before enabling live video generation.",
      503,
    );
  }

  return apiKey;
}

function parseModelPath(modelPath: string) {
  const segments = modelPath.split("/");

  if (segments.length < 2) {
    throw new AppServiceError(
      "PROVIDER_ERROR",
      "Invalid fal model path configuration.",
      500,
    );
  }

  return {
    submitPath: modelPath,
    queuePath: segments.slice(0, 2).join("/"),
  };
}

function getFalModelPath(generationType: CreateGenerationPayload["generationType"]) {
  return generationType === "image-to-video"
    ? env.FAL_KLING_IMAGE_MODEL
    : env.FAL_KLING_TEXT_MODEL;
}

function encodeProviderJobId(input: {
  generationType: CreateGenerationPayload["generationType"];
  requestId: string;
}) {
  return `${input.generationType}:${input.requestId}`;
}

function decodeProviderJobId(providerJobId: string) {
  const [generationType, requestId] = providerJobId.split(":", 2);

  if (
    (generationType !== "text-to-video" && generationType !== "image-to-video") ||
    !requestId
  ) {
    return {
      generationType: "text-to-video" as const,
      requestId: providerJobId,
    };
  }

  return {
    generationType: generationType as CreateGenerationPayload["generationType"],
    requestId,
  };
}

function getFalHeaders() {
  return {
    Authorization: `Key ${requireFalApiKey()}`,
    "Content-Type": "application/json",
  };
}

function clampSupportedDuration(durationSeconds: number) {
  return durationSeconds <= 5 ? 5 : 10;
}

function mapFalStatus(status: string): VideoProviderJob["status"] {
  switch (status.toUpperCase()) {
    case "IN_QUEUE":
      return "queued";
    case "IN_PROGRESS":
      return "processing";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    case "FAILED":
      return "failed";
    default:
      return "processing";
  }
}

function estimateProgress(status: string) {
  switch (status.toUpperCase()) {
    case "IN_QUEUE":
      return 12;
    case "IN_PROGRESS":
      return 62;
    case "COMPLETED":
      return 100;
    case "CANCELLED":
    case "FAILED":
      return 0;
    default:
      return 18;
  }
}

function mapFalErrorCode(statusCode: number): ProviderErrorCode {
  switch (statusCode) {
    case 400:
    case 404:
    case 422:
      return "INVALID_REQUEST";
    case 401:
    case 403:
      return "UNAUTHORIZED";
    case 408:
      return "TIMEOUT";
    case 429:
      return "RATE_LIMITED";
    case 500:
    case 502:
    case 503:
    case 504:
      return "PROVIDER_ERROR";
    default:
      return "UNKNOWN";
  }
}

async function falFetch<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${env.FAL_QUEUE_BASE_URL}/${path}`, {
    ...init,
    headers: {
      ...getFalHeaders(),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    logger.warn("fal provider request failed", {
      path,
      status: response.status,
      body,
    });
    throw new AppServiceError(
      mapFalErrorCode(response.status),
      body || "fal request failed.",
      response.status >= 400 && response.status < 600 ? response.status : 502,
    );
  }

  return (await response.json()) as T;
}

function getResultVideo(result: FalResultResponse) {
  return result.video ?? result.videos?.[0] ?? null;
}

async function getFalResult(queuePath: string, providerJobId: string) {
  return falFetch<FalResultResponse>(`${queuePath}/requests/${providerJobId}`);
}

function toProviderJob(input: {
  providerJobId: string;
  status: string;
  result?: FalResultResponse | null;
  errorMessage?: string;
}): VideoProviderJob {
  const video = input.result ? getResultVideo(input.result) : null;
  const mappedStatus = mapFalStatus(input.status);

  return {
    providerJobId: input.providerJobId,
    status: mappedStatus,
    progress: estimateProgress(input.status),
    previewUrl: video?.url,
    finalUrl: mappedStatus === "completed" ? video?.url : undefined,
    errorCode: mappedStatus === "failed" ? "PROVIDER_ERROR" : undefined,
    errorMessage: input.errorMessage,
  };
}

export const falVideoProvider: VideoProviderAdapter = {
  key: "fal",
  label: "fal + Kling 2.5 Turbo Pro",
  async createGeneration(payload) {
    const modelPath = getFalModelPath(payload.generationType);
    const { submitPath } = parseModelPath(modelPath);
    const duration = clampSupportedDuration(payload.durationSeconds);

    if (duration !== payload.durationSeconds) {
      logger.info("fal provider adjusted unsupported duration", {
        requestedDuration: payload.durationSeconds,
        appliedDuration: duration,
        generationId: payload.generationId,
      });
    }

    const requestBody =
      payload.generationType === "image-to-video"
        ? {
            prompt: payload.prompt,
            negative_prompt: payload.negativePrompt ?? undefined,
            image_url: payload.sourceImageUrl,
            duration,
            aspect_ratio: payload.aspectRatio,
          }
        : {
            prompt: payload.prompt,
            negative_prompt: payload.negativePrompt ?? undefined,
            duration,
            aspect_ratio: payload.aspectRatio,
          };

    const result = await falFetch<FalQueueResponse>(submitPath, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    return {
      providerJobId: encodeProviderJobId({
        generationType: payload.generationType,
        requestId: result.request_id,
      }),
      status: "queued",
      progress: 10,
    };
  },
  async getGenerationStatus(providerJobId) {
    const decoded = decodeProviderJobId(providerJobId);
    const queuePath = parseModelPath(getFalModelPath(decoded.generationType)).queuePath;
    const status = await falFetch<FalStatusResponse>(
      `${queuePath}/requests/${decoded.requestId}/status`,
    );

    if (status.status.toUpperCase() === "COMPLETED") {
      const result = await getFalResult(queuePath, decoded.requestId);
      return toProviderJob({
        providerJobId,
        status: status.status,
        result,
      });
    }

    return toProviderJob({
      providerJobId,
      status: status.status,
      errorMessage: status.logs?.at(-1)?.message,
    });
  },
  async getGenerationResult(providerJobId) {
    const decoded = decodeProviderJobId(providerJobId);
    const queuePath = parseModelPath(getFalModelPath(decoded.generationType)).queuePath;
    const result = await getFalResult(queuePath, decoded.requestId);

    return toProviderJob({
      providerJobId,
      status: "COMPLETED",
      result,
    });
  },
  async cancelGeneration(providerJobId) {
    const decoded = decodeProviderJobId(providerJobId);
    const queuePath = parseModelPath(getFalModelPath(decoded.generationType)).queuePath;

    await falFetch<{ status: string }>(`${queuePath}/requests/${decoded.requestId}/cancel`, {
      method: "PUT",
    });

    return { cancelled: true };
  },
};

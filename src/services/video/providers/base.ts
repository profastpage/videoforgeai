import type { CreateVideoGenerationInput, VideoGeneration } from "@/lib/schemas/video";

export type ProviderErrorCode =
  | "INVALID_REQUEST"
  | "UNAUTHORIZED"
  | "TIMEOUT"
  | "RATE_LIMITED"
  | "PROVIDER_ERROR"
  | "UNKNOWN";

export type VideoProviderJob = {
  providerJobId: string;
  status: VideoGeneration["status"];
  progress: number;
  previewUrl?: string;
  finalUrl?: string;
  errorCode?: ProviderErrorCode;
  errorMessage?: string;
};

export type CreateGenerationPayload = CreateVideoGenerationInput & {
  generationId: string;
};

export interface VideoProviderAdapter {
  key: string;
  label: string;
  createGeneration(payload: CreateGenerationPayload): Promise<VideoProviderJob>;
  getGenerationStatus(providerJobId: string): Promise<VideoProviderJob>;
  getGenerationResult(providerJobId: string): Promise<VideoProviderJob>;
  cancelGeneration(providerJobId: string): Promise<{ cancelled: boolean }>;
}

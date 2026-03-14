import { logger } from "@/server/logger";
import { mockVideoProvider } from "@/services/video/providers/mock";
import { falVideoProvider, isFalProviderConfigured } from "@/services/video/providers/fal";
import type { VideoProviderAdapter } from "@/services/video/providers/base";
import { env } from "@/server/env";

const providers: Record<string, VideoProviderAdapter> = {
  fal: falVideoProvider,
  mock: mockVideoProvider,
};

export function getVideoProvider(key?: string) {
  if (key === "fal" && !isFalProviderConfigured()) {
    logger.warn("fal provider requested without API key, falling back to mock");
    return mockVideoProvider;
  }

  if (key && providers[key]) {
    return providers[key];
  }

  if (env.VIDEO_PROVIDER === "fal" && !isFalProviderConfigured()) {
    logger.warn("VIDEO_PROVIDER=fal but FAL_API_KEY is missing, falling back to mock");
    return mockVideoProvider;
  }

  return providers[env.VIDEO_PROVIDER] ?? mockVideoProvider;
}

export function listVideoProviders() {
  return [
    {
      key: "fal",
      label: "fal + Kling 2.5 Turbo Pro",
      status: isFalProviderConfigured() ? "active" : "ready",
      description: "Live short-form video generation through fal with Kling 2.5 Turbo Pro at launch.",
    },
    {
      key: "mock",
      label: "Mock Provider",
      status: "active",
      description: "Safe development adapter that simulates queue and completion states.",
    },
  ] as const;
}

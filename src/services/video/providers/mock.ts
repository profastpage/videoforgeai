import type { VideoProviderAdapter, VideoProviderJob } from "@/services/video/providers/base";

const mockState = new Map<string, VideoProviderJob>();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockVideoProvider: VideoProviderAdapter = {
  key: "mock",
  label: "Mock Provider",
  async createGeneration(payload) {
    const job: VideoProviderJob = {
      providerJobId: `mock-${payload.generationId}`,
      status: "queued",
      progress: 12,
      previewUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    };

    mockState.set(job.providerJobId, job);
    return job;
  },
  async getGenerationStatus(providerJobId) {
    const current = mockState.get(providerJobId);

    if (!current) {
      return {
        providerJobId,
        status: "failed",
        progress: 0,
        errorCode: "UNKNOWN",
        errorMessage: "Mock job not found.",
      };
    }

    await delay(120);

    if (current.progress < 100) {
      const nextProgress = Math.min(current.progress + 24, 100);
      const nextStatus = nextProgress >= 100 ? "completed" : "processing";
      const nextJob: VideoProviderJob = {
        ...current,
        progress: nextProgress,
        status: nextStatus,
        finalUrl:
          nextProgress >= 100
            ? "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
            : undefined,
      };

      mockState.set(providerJobId, nextJob);
      return nextJob;
    }

    return current;
  },
  async getGenerationResult(providerJobId) {
    return this.getGenerationStatus(providerJobId);
  },
  async cancelGeneration(providerJobId) {
    const current = mockState.get(providerJobId);
    if (!current) {
      return { cancelled: false };
    }

    mockState.set(providerJobId, {
      ...current,
      status: "cancelled",
      progress: current.progress,
    });

    return { cancelled: true };
  },
};

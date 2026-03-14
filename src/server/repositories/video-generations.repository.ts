import type { VideoGeneration } from "@/lib/schemas/video";
import { videoGenerationSchema } from "@/lib/schemas/video";
import { seededVideoGenerations } from "@/server/mock-db/video-generations";
import { createSeedGenerationsForUser } from "@/server/mock-db/factories";

const store = [...seededVideoGenerations];

export class VideoGenerationsRepository {
  async listByUserId(userId: string) {
    const existing = store.filter((generation) => generation.userId === userId);

    if (existing.length === 0) {
      store.unshift(...createSeedGenerationsForUser(userId));
    }

    return store
      .filter((generation) => generation.userId === userId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  async findById(id: string) {
    return store.find((generation) => generation.id === id) ?? null;
  }

  async create(input: VideoGeneration) {
    const parsed = videoGenerationSchema.parse(input);
    store.unshift(parsed);
    return parsed;
  }

  async update(id: string, patch: Partial<VideoGeneration>) {
    const index = store.findIndex((generation) => generation.id === id);

    if (index === -1) {
      return null;
    }

    const nextValue = videoGenerationSchema.parse({
      ...store[index],
      ...patch,
    });

    store[index] = nextValue;
    return nextValue;
  }
}

export const videoGenerationsRepository = new VideoGenerationsRepository();

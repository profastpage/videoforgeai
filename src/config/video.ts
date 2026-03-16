export const videoAspectRatios = ["16:9", "9:16", "1:1"] as const;
export const videoResolutions = ["720p"] as const;
export const videoDurations = [5, 10] as const;
export const videoStyles = [
  "sleek-corporate",
  "performance-ads",
  "ugc-social",
  "luxury-editorial",
  "cinematic-product",
] as const;
export const videoGenerationTypes = ["text-to-video", "image-to-video"] as const;
export const videoGenerationStatuses = [
  "queued",
  "processing",
  "completed",
  "failed",
  "cancelled",
] as const;
export const storageDrivers = ["mock", "supabase", "r2", "cloudinary"] as const;
export const jobDrivers = ["mock", "upstash", "bullmq", "trigger"] as const;

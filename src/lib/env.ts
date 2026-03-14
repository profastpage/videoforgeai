import { z } from "zod";
import { APP_NAME } from "@/lib/constants";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default(APP_NAME),
  VIDEO_PROVIDER: z.enum(["mock", "runway", "pika"]).default("mock"),
  DEMO_USER_EMAIL: z.string().email().default("alex@northstarhq.com"),
  DEMO_USER_NAME: z.string().min(1).default("Alex Morgan"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? APP_NAME,
  VIDEO_PROVIDER: process.env.VIDEO_PROVIDER ?? "mock",
  DEMO_USER_EMAIL: process.env.DEMO_USER_EMAIL ?? "alex@northstarhq.com",
  DEMO_USER_NAME: process.env.DEMO_USER_NAME ?? "Alex Morgan",
});

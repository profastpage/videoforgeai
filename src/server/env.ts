import { z } from "zod";
import { jobDrivers, storageDrivers } from "@/config/video";

const optionalString = () =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().optional(),
  );

const optionalUrl = () =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().url().optional(),
  );

const optionalCsv = () =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string" || value.trim() === "") {
        return undefined;
      }

      return value
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
    },
    z.array(z.string().email()).optional(),
  );

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("VideoForge AI"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_FIREBASE_API_KEY: optionalString(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: optionalString(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: optionalString(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: optionalString(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: optionalString(),
  NEXT_PUBLIC_FIREBASE_APP_ID: optionalString(),
  NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST: optionalString(),
  FIREBASE_PROJECT_ID: optionalString(),
  FIREBASE_CLIENT_EMAIL: optionalString(),
  FIREBASE_PRIVATE_KEY: optionalString(),
  FIREBASE_AUTH_EMULATOR_HOST: optionalString(),
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString(),
  SUPABASE_SERVICE_ROLE_KEY: optionalString(),
  SUPABASE_JWT_SECRET: optionalString(),
  DATABASE_URL: optionalString(),
  VIDEO_PROVIDER: z.string().default("fal"),
  VIDEO_PROVIDER_API_KEY: optionalString(),
  VIDEO_PROVIDER_WEBHOOK_SECRET: optionalString(),
  FAL_API_KEY: optionalString(),
  FAL_QUEUE_BASE_URL: z.string().url().default("https://queue.fal.run"),
  FAL_KLING_TEXT_MODEL: z.string().default("fal-ai/kling-video/v2.5-turbo/pro/text-to-video"),
  FAL_KLING_IMAGE_MODEL: z.string().default("fal-ai/kling-video/v2.5-turbo/pro/image-to-video"),
  OPENAI_API_KEY: optionalString(),
  OPENAI_MODEL: z.string().default("gpt-5-mini"),
  DEMO_USER_EMAIL: z.string().email().default("alex@northstarhq.com"),
  DEMO_USER_NAME: z.string().min(1).default("Alex Morgan"),
  SUPERADMIN_EMAILS: optionalCsv().default(["profastpage@gmail.com", "alex@northstarhq.com"]),
  STRIPE_SECRET_KEY: optionalString(),
  STRIPE_WEBHOOK_SECRET: optionalString(),
  STRIPE_PRICE_DEMO: optionalString(),
  STRIPE_PRICE_LITE: optionalString(),
  STRIPE_PRICE_PRO: optionalString(),
  STRIPE_PRICE_BUSINESS: optionalString(),
  STORAGE_DRIVER: z.enum(storageDrivers).default("mock"),
  SUPABASE_STORAGE_BUCKET: z.string().default("videoforge-assets"),
  R2_ACCOUNT_ID: optionalString(),
  R2_ACCESS_KEY_ID: optionalString(),
  R2_SECRET_ACCESS_KEY: optionalString(),
  R2_BUCKET: optionalString(),
  R2_PUBLIC_URL: optionalString(),
  JOB_DRIVER: z.enum(jobDrivers).default("mock"),
  UPSTASH_REDIS_REST_URL: optionalString(),
  UPSTASH_REDIS_REST_TOKEN: optionalString(),
  APP_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export const env = envSchema.parse(process.env);

import { z } from "zod";
import { apiFailure, apiSuccess } from "@/lib/http";
import { AppServiceError } from "@/lib/errors";
import { getCurrentSession } from "@/services/auth/auth-service";
import { uploadToStorage } from "@/services/storage/storage-service";
import { logger } from "@/server/logger";
import { env } from "@/server/env";
import { storageDrivers } from "@/config/video";

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const uploadMetadataSchema = z.object({
  namespace: z.string().trim().min(1).default("sources"),
});

function getNamespace(value: unknown) {
  const parsed = uploadMetadataSchema.parse({ namespace: value ?? "sources" });
  return parsed.namespace;
}

function isAllowedMimeType(type: string) {
  return ALLOWED_IMAGE_MIME_TYPES.includes(type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number]);
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return apiFailure("UNAUTHORIZED", "Sign in required.", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const namespace = getNamespace(formData.get("namespace"));
    if (!file || !(file instanceof Blob)) {
      return apiFailure("INVALID_INPUT", "No source image found in request.", 400);
    }

    if (typeof file.size !== "number" || file.size <= 0) {
      return apiFailure("INVALID_INPUT", "Empty image upload is not allowed.", 400);
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return apiFailure("INVALID_INPUT", "Image upload is too large. Max is 10MB.", 400);
    }

    const mimeType = file.type?.toLowerCase() ?? "";
    if (!isAllowedMimeType(mimeType)) {
      return apiFailure(
        "INVALID_INPUT",
        "Only JPG, PNG, WebP and GIF images are allowed for image-to-video source uploads.",
        400,
      );
    }

    if (!storageDrivers.includes(env.STORAGE_DRIVER)) {
      return apiFailure("INVALID_CONFIGURATION", "Configured storage driver is not valid.", 500);
    }

    const uploaded = await uploadToStorage({
      file: file as File,
      folder:
        namespace === "renders"
          ? env.CLOUDINARY_RENDER_FOLDER
          : env.CLOUDINARY_SOURCE_FOLDER,
    });

    logger.info("Storage upload completed", {
      storageDriver: env.STORAGE_DRIVER,
      namespace,
      path: uploaded.path,
    });

    return apiSuccess({ sourceUrl: uploaded.publicUrl, sourcePath: uploaded.path });
  } catch (error) {
    if (error instanceof AppServiceError) {
      return apiFailure(error.code, error.message, error.status);
    }

    if (error instanceof z.ZodError) {
      return apiFailure(
        "INVALID_INPUT",
        error.issues[0]?.message ?? "Invalid upload metadata.",
        400,
      );
    }

    return apiFailure("UPLOAD_FAILED", "Could not upload source image.", 500);
  }
}

import { createHash } from "node:crypto";
import { AppServiceError } from "@/lib/errors";
import { logger } from "@/server/logger";
import { env } from "@/server/env";
import type {
  StorageUploadInput,
  StorageUploadUrlInput,
} from "@/services/storage/storage-service";

type CloudinaryUploadResponse = {
  public_id: string;
  secure_url: string;
  url?: string;
};

type CloudinaryError = {
  error?: {
    message?: string;
  };
};

type CloudinaryUploadOptions = {
  folder: string;
  timestamp: string;
  publicId?: string;
};

function requireCloudinaryConfig() {
  if (!env.CLOUDINARY_CLOUD_NAME) {
    throw new AppServiceError(
      "CLOUDINARY_NOT_CONFIGURED",
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME before uploading files.",
      500,
    );
  }
}

function resolveCloudinaryFolder(input: StorageUploadInput | StorageUploadUrlInput) {
  return input.folder || env.CLOUDINARY_SOURCE_FOLDER;
}

function resolveCloudinaryUploadEndpoint(resourceType: "image" | "video") {
  return `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
}

function createUploadSignature({
  folder,
  timestamp,
  publicId,
}: CloudinaryUploadOptions) {
  if (!env.CLOUDINARY_API_SECRET) {
    throw new AppServiceError(
      "CLOUDINARY_NOT_CONFIGURED",
      "Cloudinary API secret is required for signed uploads.",
      500,
    );
  }

  const signable = {
    folder,
    timestamp,
    ...(publicId ? { public_id: publicId } : {}),
  };
  const base = Object.entries(signable)
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("&");

  return createHash("sha1").update(`${base}${env.CLOUDINARY_API_SECRET}`).digest("hex");
}

function getUploadErrorMessage(bodyText: string | null) {
  if (!bodyText) {
    return "Cloudinary upload failed.";
  }

  try {
    const parsed = JSON.parse(bodyText) as CloudinaryError;
    return parsed.error?.message ?? bodyText;
  } catch {
    return bodyText;
  }
}

function appendCloudinaryAuth(formData: FormData, options: CloudinaryUploadOptions) {
  if (env.CLOUDINARY_UPLOAD_PRESET) {
    formData.append("upload_preset", env.CLOUDINARY_UPLOAD_PRESET);
    return;
  }

  if (!env.CLOUDINARY_API_KEY) {
    throw new AppServiceError(
      "CLOUDINARY_NOT_CONFIGURED",
      "Cloudinary API key is required for signed uploads.",
      500,
    );
  }

  formData.append("api_key", env.CLOUDINARY_API_KEY);

  if (options.publicId) {
    formData.append("public_id", options.publicId);
  }

  formData.append(
    "signature",
    createUploadSignature({
      ...options,
    }),
  );
}

async function cloudinaryUpload({
  formData,
  resourceType,
}: {
  formData: FormData;
  resourceType: "image" | "video";
}) {
  requireCloudinaryConfig();

  const response = await fetch(resolveCloudinaryUploadEndpoint(resourceType), {
    method: "POST",
    body: formData,
  });

  return response;
}

function normalizeSourceId(input: StorageUploadInput | StorageUploadUrlInput) {
  const isFileUpload = "file" in input;
  const resourceType = input.resourceType ?? (isFileUpload ? "image" : "video");
  const folder = resolveCloudinaryFolder(input);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const publicId = input.publicId;

  return { resourceType, folder, timestamp, publicId };
}

async function uploadToCloudinary(input: StorageUploadInput | StorageUploadUrlInput) {
  const { folder, timestamp, publicId, resourceType } = normalizeSourceId(input);
  const formData = new FormData();

  if ("file" in input) {
    formData.append("file", input.file);
  } else {
    formData.append("file", input.sourceUrl);
  }

  formData.append("folder", folder);
  formData.append("timestamp", timestamp);

  appendCloudinaryAuth(formData, { folder, timestamp, publicId });

  const response = await cloudinaryUpload({ formData, resourceType });
  const bodyText = await response.text();

  if (!response.ok) {
    const errorMessage = getUploadErrorMessage(bodyText);
    logger.warn("Cloudinary upload failed", {
      status: response.status,
      errorMessage,
      folder,
      sourceType: "file" in input ? "file" : "url",
    });
    throw new AppServiceError(
      "CLOUDINARY_UPLOAD_ERROR",
      errorMessage,
      response.status >= 400 ? response.status : 502,
    );
  }

  const result = JSON.parse(bodyText) as CloudinaryUploadResponse;

  return {
    path: result.public_id,
    publicUrl: result.secure_url || result.url || "",
  };
}

export const cloudinaryStorageDriver = {
  key: "cloudinary",
  async getPublicUrl(path: string) {
    requireCloudinaryConfig();

    return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/${path}`;
  },
  async upload(input: StorageUploadInput) {
    return uploadToCloudinary(input);
  },
  async uploadFromUrl(input: StorageUploadUrlInput) {
    return uploadToCloudinary(input);
  },
};

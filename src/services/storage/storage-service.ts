import { AppServiceError } from "@/lib/errors";
import { logger } from "@/server/logger";
import { env } from "@/server/env";
import { mockStorageDriver } from "@/services/storage/drivers/mock-storage";
import { cloudinaryStorageDriver } from "@/services/storage/drivers/cloudinary-storage";
import { r2StorageDriver } from "@/services/storage/drivers/r2-storage";
import { supabaseStorageDriver } from "@/services/storage/drivers/supabase-storage";

export type StorageUploadInput = {
  file: File;
  folder: string;
  publicId?: string;
  resourceType?: "image" | "video";
};

export type StorageUploadUrlInput = {
  sourceUrl: string;
  folder: string;
  publicId?: string;
  resourceType?: "image" | "video";
};

export type StorageUploadResult = {
  path: string;
  publicUrl: string;
};

export interface StorageDriver {
  key: string;
  upload(input: StorageUploadInput): Promise<StorageUploadResult>;
  uploadFromUrl?(input: StorageUploadUrlInput): Promise<StorageUploadResult>;
  getPublicUrl(path: string): Promise<string>;
}

const drivers = {
  mock: mockStorageDriver,
  cloudinary: cloudinaryStorageDriver,
  supabase: supabaseStorageDriver,
  r2: r2StorageDriver,
};

export function getStorageDriver() {
  return drivers[env.STORAGE_DRIVER];
}

export function isStorageDriverConfigured() {
  try {
    return Boolean(getStorageDriver()?.getPublicUrl);
  } catch {
    return false;
  }
}

export function getStorageDriverWithError() {
  const driver = getStorageDriver();

  if (!driver) {
    throw new AppServiceError(
      "STORAGE_DRIVER_NOT_FOUND",
      `Storage driver '${env.STORAGE_DRIVER}' is not available.`,
      500,
    );
  }

  return driver as StorageDriver;
}

export function uploadToStorage(input: StorageUploadInput) {
  return getStorageDriverWithError().upload(input);
}

export async function uploadToStorageFromUrl(input: StorageUploadUrlInput) {
  const driver = getStorageDriverWithError();

  if (driver.uploadFromUrl) {
    return driver.uploadFromUrl(input);
  }

  const response = await fetch(input.sourceUrl);
  if (!response.ok) {
    throw new AppServiceError(
      "STORAGE_DOWNLOAD_FAILED",
      `Could not download source file from URL: ${input.sourceUrl}`,
      response.status,
    );
  }

  const blob = await response.blob();
  const sourceFile = new File(
    [blob],
    input.publicId ?? "videoforge-render",
    {
      type: blob.type || "video/mp4",
    },
  );

  logger.warn("Storage driver does not support URL upload; falling back to proxy upload", {
    storageDriver: driver.key,
    sourceUrl: input.sourceUrl,
  });

  return driver.upload({
    file: sourceFile,
    folder: input.folder,
    publicId: input.publicId,
    resourceType: input.resourceType,
  });
}

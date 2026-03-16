"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type UploadZoneProps = {
  onSelect: (url: string) => void;
  selectedUrl?: string;
  allowMockFallback?: boolean;
  mockUrl?: string;
  mockText?: string;
  uploadInProgress?: boolean;
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const COMPRESSIBLE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

function isCompressibleMimeType(mimeType: string) {
  return COMPRESSIBLE_MIME_TYPES.includes(mimeType as (typeof COMPRESSIBLE_MIME_TYPES)[number]);
}

function getOutputMimeType(inputType: string) {
  // Prefer WebP when possible (keeps dimensions and usually reduces bytes).
  // Fall back to JPEG if the browser does not support WebP encoding.
  return inputType === "image/png" ? "image/webp" : "image/webp";
}

function fileNameWithExtension(fileName: string, extension: string) {
  const base = fileName.replace(/\.[^.]+$/, "");
  return `${base}.${extension}`;
}

function blobToFile(blob: Blob, originalName: string) {
  const extension = blob.type === "image/webp" ? "webp" : blob.type === "image/jpeg" ? "jpg" : "bin";
  return new File([blob], fileNameWithExtension(originalName, extension), { type: blob.type });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression is not supported in this browser."));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

async function compressImageToUnderMaxBytes(file: File, maxBytes: number) {
  if (!isCompressibleMimeType(file.type)) {
    return file;
  }

  if (file.size <= maxBytes) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.drawImage(bitmap, 0, 0);

  // Try re-encoding at same dimensions, stepping quality down until we hit the limit.
  const preferredType = getOutputMimeType(file.type);
  const candidates: Array<{ type: string; quality: number }> = [
    { type: preferredType, quality: 0.92 },
    { type: preferredType, quality: 0.88 },
    { type: preferredType, quality: 0.84 },
    { type: preferredType, quality: 0.8 },
    { type: preferredType, quality: 0.76 },
    { type: preferredType, quality: 0.72 },
    { type: preferredType, quality: 0.68 },
    { type: preferredType, quality: 0.64 },
    { type: preferredType, quality: 0.6 },
  ];

  for (const candidate of candidates) {
    try {
      const blob = await canvasToBlob(canvas, candidate.type, candidate.quality);
      if (blob.size <= maxBytes) {
        return blobToFile(blob, file.name);
      }
    } catch {
      // If a browser cannot encode WebP, fall back to JPEG.
      if (candidate.type === "image/webp") {
        const blob = await canvasToBlob(canvas, "image/jpeg", candidate.quality);
        if (blob.size <= maxBytes) {
          return blobToFile(blob, file.name);
        }
      }
    }
  }

  return file;
}

export function UploadZone({
  onSelect,
  selectedUrl,
  allowMockFallback = true,
  mockUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
  mockText = "Mock image",
  uploadInProgress = false,
}: UploadZoneProps) {
  const { copy } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isBusy = isUploading || uploadInProgress;

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleUploadFromInput() {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.[0]) {
      return;
    }

    let file = fileInput.files[0];

    setIsUploading(true);

    try {
      if (file.size > MAX_IMAGE_BYTES) {
        file = await compressImageToUnderMaxBytes(file, MAX_IMAGE_BYTES);
      }

      if (file.size > MAX_IMAGE_BYTES) {
        throw new Error(copy.video.upload.uploadTooLarge);
      }

      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        data?: { sourceUrl?: string; sourcePath?: string };
        error?: {
          message: string;
        };
      };

      if (!response.ok || payload.error || !payload.data?.sourceUrl) {
        throw new Error(payload.error?.message ?? "Upload failed.");
      }

      onSelect(payload.data.sourceUrl);
      toast.success(copy.video.upload.uploadSuccess);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : copy.video.upload.uploadFailed,
      );
    } finally {
      setIsUploading(false);
      fileInput.value = "";
    }
  }

  function useMock() {
    onSelect(mockUrl);
    toast.success(copy.video.upload.mockSelected);
  }

  return (
    <div className="rounded-[24px] border border-dashed border-border bg-background/50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ImagePlus className="h-4 w-4 text-primary" />
            {copy.video.upload.title}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {copy.video.upload.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            aria-label={copy.video.upload.uploadImage}
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            type="file"
            onChange={handleUploadFromInput}
          />
          <Button variant="outline" onClick={openFilePicker} disabled={isBusy}>
            {isUploading ? copy.video.upload.uploading : copy.video.upload.uploadImage}
          </Button>
          {allowMockFallback ? (
            <Button variant="outline" onClick={useMock} disabled={isBusy}>
              {mockText}
            </Button>
          ) : null}
        </div>
      </div>
      {selectedUrl ? (
        <div className="mt-4 overflow-hidden rounded-[22px] border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedUrl}
            alt={copy.video.upload.mockImageAlt}
            className="h-48 w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}

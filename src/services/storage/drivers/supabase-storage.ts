import type { StorageUploadInput, StorageUploadResult } from "@/services/storage/storage-service";

export const supabaseStorageDriver = {
  key: "supabase",
  async getPublicUrl(path: string) {
    return path;
  },
  async upload(_input: StorageUploadInput): Promise<StorageUploadResult> {
    void _input;
    throw new Error("Supabase Storage driver is not configured yet.");
  },
};

import type { StorageUploadInput, StorageUploadResult } from "@/services/storage/storage-service";

export const mockStorageDriver = {
  key: "mock",
  async getPublicUrl(path: string) {
    return path;
  },
  async upload(_input: StorageUploadInput): Promise<StorageUploadResult> {
    void _input;
    return {
      path: "mock://uploads/demo-asset.png",
      publicUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    };
  },
};

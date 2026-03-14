export const mockStorageDriver = {
  key: "mock",
  async getPublicUrl(path: string) {
    return path;
  },
  async upload() {
    return {
      path: "mock://uploads/demo-asset.png",
      publicUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    };
  },
};

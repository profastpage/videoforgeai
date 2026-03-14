export const r2StorageDriver = {
  key: "r2",
  async getPublicUrl(path: string) {
    return path;
  },
  async upload() {
    throw new Error("R2 driver is not configured yet.");
  },
};

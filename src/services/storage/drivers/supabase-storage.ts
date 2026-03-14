export const supabaseStorageDriver = {
  key: "supabase",
  async getPublicUrl(path: string) {
    return path;
  },
  async upload() {
    throw new Error("Supabase Storage driver is not configured yet.");
  },
};

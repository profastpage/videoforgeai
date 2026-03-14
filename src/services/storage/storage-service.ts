import { env } from "@/server/env";
import { mockStorageDriver } from "@/services/storage/drivers/mock-storage";
import { r2StorageDriver } from "@/services/storage/drivers/r2-storage";
import { supabaseStorageDriver } from "@/services/storage/drivers/supabase-storage";

const drivers = {
  mock: mockStorageDriver,
  supabase: supabaseStorageDriver,
  r2: r2StorageDriver,
};

export function getStorageDriver() {
  return drivers[env.STORAGE_DRIVER];
}

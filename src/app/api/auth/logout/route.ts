import { apiSuccess } from "@/lib/http";
import { clearAuthSession } from "@/services/auth/auth-service";

export async function POST() {
  await clearAuthSession();
  return apiSuccess({ ok: true });
}

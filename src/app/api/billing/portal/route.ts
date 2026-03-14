import { apiFailure, apiSuccess } from "@/lib/http";
import { AppServiceError } from "@/lib/errors";
import { getCurrentSession } from "@/services/auth/auth-service";
import { beginBillingPortal } from "@/services/billing/billing-service";

export async function POST() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return apiFailure("UNAUTHORIZED", "Sign in required.", 401);
    }

    const portal = await beginBillingPortal(session);
    return apiSuccess(portal, 201);
  } catch (error) {
    if (error instanceof AppServiceError) {
      return apiFailure(error.code, error.message, error.status);
    }

    return apiFailure("INTERNAL_SERVER_ERROR", "Unexpected server error.", 500);
  }
}

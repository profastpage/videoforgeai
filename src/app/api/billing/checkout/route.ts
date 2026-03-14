import { ZodError } from "zod";
import { apiFailure, apiSuccess } from "@/lib/http";
import { AppServiceError } from "@/lib/errors";
import { createCheckoutSessionSchema } from "@/lib/schemas/billing";
import { getCurrentSession } from "@/services/auth/auth-service";
import { beginBillingCheckout } from "@/services/billing/billing-service";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return apiFailure("UNAUTHORIZED", "Sign in required.", 401);
    }

    const body = await request.json();
    const input = createCheckoutSessionSchema.parse(body);
    const checkout = await beginBillingCheckout(session, input.planId);

    return apiSuccess(checkout, 201);
  } catch (error) {
    if (error instanceof AppServiceError) {
      return apiFailure(error.code, error.message, error.status);
    }

    if (error instanceof ZodError) {
      return apiFailure(
        "INVALID_INPUT",
        error.issues[0]?.message ?? "Invalid request payload.",
        400,
      );
    }

    return apiFailure("INTERNAL_SERVER_ERROR", "Unexpected server error.", 500);
  }
}

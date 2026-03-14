import { apiFailure, apiSuccess } from "@/lib/http";
import { AppServiceError } from "@/lib/errors";
import { logger } from "@/server/logger";
import { handleStripeWebhookEvent } from "@/services/billing/billing-service";
import { constructStripeWebhookEvent } from "@/services/billing/stripe-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const event = await constructStripeWebhookEvent({
      payload,
      signature: request.headers.get("stripe-signature"),
    });
    const result = await handleStripeWebhookEvent(event);

    return apiSuccess({
      received: true,
      processed: result.processed,
      eventType: result.eventType,
    });
  } catch (error) {
    if (error instanceof AppServiceError) {
      return apiFailure(error.code, error.message, error.status);
    }

    logger.error("Unhandled Stripe webhook error", error);
    return apiFailure("INTERNAL_SERVER_ERROR", "Unexpected webhook error.", 500);
  }
}

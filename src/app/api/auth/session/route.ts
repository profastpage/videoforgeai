import { z, ZodError } from "zod";
import { apiFailure, apiSuccess } from "@/lib/http";
import { AppServiceError } from "@/lib/errors";
import {
  createFallbackSession,
  createSessionFromFirebaseIdToken,
  isFirebaseAuthEnabled,
} from "@/services/auth/auth-service";

const sessionPayloadSchema = z.object({
  idToken: z.string().min(1).optional(),
  email: z.string().email().optional(),
  fullName: z.string().min(1).optional(),
  companyName: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  try {
    const payload = sessionPayloadSchema.parse(await request.json());

    if (payload.idToken && isFirebaseAuthEnabled()) {
      const session = await createSessionFromFirebaseIdToken(payload.idToken);
      return apiSuccess({ session });
    }

    if (payload.email) {
      const session = await createFallbackSession({
        email: payload.email,
        fullName: payload.fullName,
        companyName: payload.companyName,
      });
      return apiSuccess({ session });
    }

    return apiFailure(
      "INVALID_AUTH_REQUEST",
      "Missing Firebase token or fallback identity payload.",
      400,
    );
  } catch (error) {
    if (error instanceof AppServiceError) {
      return apiFailure(error.code, error.message, error.status);
    }

    if (error instanceof ZodError) {
      return apiFailure(
        "INVALID_AUTH_REQUEST",
        error.issues[0]?.message ?? "Invalid auth payload.",
        400,
      );
    }

    return apiFailure("INTERNAL_SERVER_ERROR", "Unexpected auth error.", 500);
  }
}

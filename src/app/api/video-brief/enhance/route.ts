import { ZodError } from "zod";
import { apiFailure, apiSuccess } from "@/lib/http";
import { AppServiceError } from "@/lib/errors";
import { enhanceVideoBriefInputSchema } from "@/lib/schemas/video-brief";
import { getCurrentSession } from "@/services/auth/auth-service";
import { enhanceVideoBrief } from "@/services/video/brief-service";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return apiFailure("UNAUTHORIZED", "Sign in required.", 401);
    }

    const body = await request.json();
    const input = enhanceVideoBriefInputSchema.parse(body);
    const brief = await enhanceVideoBrief(input);
    return apiSuccess({ brief });
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


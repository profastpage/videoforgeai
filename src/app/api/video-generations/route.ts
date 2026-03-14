import { ZodError } from "zod";
import { createVideoGenerationSchema } from "@/lib/schemas/video";
import { apiFailure, apiSuccess } from "@/lib/http";
import { AppServiceError } from "@/lib/errors";
import { getCurrentSession } from "@/services/auth/auth-service";
import {
  createVideoGeneration,
  listUserGenerations,
} from "@/services/video/video-service";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return apiFailure("UNAUTHORIZED", "Sign in required.", 401);
  }

  const generations = await listUserGenerations(session);
  return apiSuccess({ generations });
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return apiFailure("UNAUTHORIZED", "Sign in required.", 401);
    }

    const body = await request.json();
    const input = createVideoGenerationSchema.parse(body);
    const generation = await createVideoGeneration(session, input);
    return apiSuccess({ generation }, 201);
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

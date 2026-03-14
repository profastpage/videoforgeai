import { apiFailure, apiSuccess } from "@/lib/http";
import { AppServiceError } from "@/lib/errors";
import { getCurrentSession } from "@/services/auth/auth-service";
import { refreshGenerationStatus } from "@/services/video/video-service";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: Params) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return apiFailure("UNAUTHORIZED", "Sign in required.", 401);
    }

    const { id } = await params;
    const generation = await refreshGenerationStatus(session, id);
    return apiSuccess({ generation });
  } catch (error) {
    if (error instanceof AppServiceError) {
      return apiFailure(error.code, error.message, error.status);
    }

    return apiFailure("INTERNAL_SERVER_ERROR", "Unexpected server error.", 500);
  }
}

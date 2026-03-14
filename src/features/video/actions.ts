"use server";

import { revalidatePath } from "next/cache";
import {
  cancelGeneration,
  createVideoGeneration,
  duplicateGeneration,
  refreshGenerationStatus,
} from "@/services/video/video-service";
import { enhanceVideoBrief } from "@/services/video/brief-service";
import { requireSession } from "@/services/auth/auth-service";
import { AppServiceError } from "@/lib/errors";
import type { CreateVideoGenerationInput } from "@/lib/schemas/video";
import type { EnhanceVideoBriefInput } from "@/lib/schemas/video-brief";

export async function enhanceVideoBriefAction(input: EnhanceVideoBriefInput) {
  try {
    await requireSession();
    const brief = await enhanceVideoBrief(input);
    return { brief };
  } catch (error) {
    if (error instanceof AppServiceError) {
      return {
        error:
          input.locale === "es"
            ? "No se pudo completar la mejora con IA en este momento."
            : error.message,
      };
    }

    return {
      error:
        input.locale === "es"
          ? "No se pudo generar el brief con IA."
          : "The AI brief could not be generated.",
    };
  }
}

export async function createVideoGenerationAction(input: CreateVideoGenerationInput) {
  try {
    const session = await requireSession();
    const generation = await createVideoGeneration(session, input);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/create");
    revalidatePath("/dashboard/history");
    return { generation };
  } catch (error) {
    if (error instanceof AppServiceError) {
      return { error: error.message };
    }

    return { error: "The video could not be created." };
  }
}

export async function refreshGenerationStatusAction(generationId: string) {
  try {
    const session = await requireSession();
    const generation = await refreshGenerationStatus(session, generationId);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/history");
    return { generation };
  } catch (error) {
    if (error instanceof AppServiceError) {
      return { error: error.message };
    }

    return { error: "The generation status could not be refreshed." };
  }
}

export async function cancelGenerationAction(generationId: string) {
  try {
    const session = await requireSession();
    const generation = await cancelGeneration(session, generationId);
    revalidatePath("/dashboard/history");
    return { generation };
  } catch (error) {
    if (error instanceof AppServiceError) {
      return { error: error.message };
    }

    return { error: "The generation could not be cancelled." };
  }
}

export async function duplicateGenerationAction(generationId: string) {
  try {
    const session = await requireSession();
    const generation = await duplicateGeneration(session, generationId);
    revalidatePath("/dashboard/history");
    return { generation };
  } catch (error) {
    if (error instanceof AppServiceError) {
      return { error: error.message };
    }

    return { error: "The generation could not be duplicated." };
  }
}

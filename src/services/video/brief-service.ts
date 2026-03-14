import { AppServiceError } from "@/lib/errors";
import {
  enhancedVideoBriefSchema,
  enhanceVideoBriefInputSchema,
  type EnhanceVideoBriefInput,
} from "@/lib/schemas/video-brief";
import { env } from "@/server/env";
import { logger } from "@/server/logger";

const enhancedVideoBriefJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "projectName",
    "hook",
    "prompt",
    "negativePrompt",
    "callToAction",
    "style",
    "aspectRatio",
    "durationSeconds",
  ],
  properties: {
    projectName: { type: "string" },
    hook: { type: "string" },
    prompt: { type: "string" },
    negativePrompt: { type: "string" },
    callToAction: { type: "string" },
    style: {
      type: "string",
      enum: [
        "sleek-corporate",
        "performance-ads",
        "ugc-social",
        "luxury-editorial",
        "cinematic-product",
      ],
    },
    aspectRatio: {
      type: "string",
      enum: ["16:9", "9:16", "1:1"],
    },
    durationSeconds: { type: "integer", enum: [5, 10] },
  },
} as const;

function getFallbackBrief(input: EnhanceVideoBriefInput) {
  const spanish = input.locale === "es";
  const durationSeconds = input.preferredDurationSeconds ?? 10;
  const aspectRatio =
    input.preferredAspectRatio ??
    (input.generationType === "image-to-video" ? "1:1" : "9:16");
  const idea = input.idea.trim();

  return enhancedVideoBriefSchema.parse({
    projectName: spanish ? "Video comercial optimizado" : "Optimized marketing video",
    hook: spanish
      ? `Gancho claro para: ${idea.slice(0, 90)}`
      : `Clear opening hook for: ${idea.slice(0, 90)}`,
    prompt: spanish
      ? `Crea un video ${aspectRatio} de ${durationSeconds} segundos basado en esta idea: ${idea}. Abre con un hook directo, presenta el beneficio principal, muestra prueba visual del producto o servicio, manten un ritmo comercial premium y cierra con un CTA claro orientado a conversion.`
      : `Create a ${aspectRatio} ${durationSeconds}-second marketing video based on this idea: ${idea}. Open with a direct hook, present the main benefit, show visual proof of the product or service, keep a premium commercial pace, and close with a clear conversion-focused CTA.`,
    negativePrompt: spanish
      ? "Evita escenas confusas, texto excesivo, tipografia con bajo contraste y movimientos de camara bruscos."
      : "Avoid confusing scenes, excessive text, low-contrast typography, and shaky camera movement.",
    callToAction: spanish ? "Descubre la oferta hoy" : "Discover the offer today",
    style: "performance-ads",
    aspectRatio,
    durationSeconds,
  });
}

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const maybeText = "output_text" in payload ? payload.output_text : null;

  if (typeof maybeText === "string" && maybeText.trim().length > 0) {
    return maybeText;
  }

  const output = "output" in payload ? payload.output : null;

  if (!Array.isArray(output)) {
    return null;
  }

  for (const item of output) {
    if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) {
      continue;
    }

    for (const content of item.content) {
      if (!content || typeof content !== "object") {
        continue;
      }

      if ("text" in content && typeof content.text === "string" && content.text.trim().length > 0) {
        return content.text;
      }
    }
  }

  return null;
}

async function enhanceWithOpenAI(input: EnhanceVideoBriefInput) {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  const language = input.locale === "es" ? "Spanish" : "English";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are a senior direct-response creative strategist for short AI marketing videos. Turn rough ideas into concise, production-ready video briefs that improve conversion potential without inventing unrealistic claims.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                `Write the output in ${language}.`,
                `Idea: ${input.idea}`,
                `Generation type: ${input.generationType}`,
                `Preferred aspect ratio: ${input.preferredAspectRatio ?? "choose the best fit"}`,
                `Preferred duration: ${input.preferredDurationSeconds ?? 10} seconds`,
                "Return an optimized brief for a premium commercial AI video with a short project name, hook, CTA, prompt, and negative prompt.",
                "Keep the prompt realistic for current text-to-video or image-to-video models.",
              ].join("\n"),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "enhanced_video_brief",
          schema: enhancedVideoBriefJsonSchema,
          strict: true,
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    logger.warn("OpenAI brief enhancement request failed", {
      status: response.status,
      body,
    });
    throw new AppServiceError(
      "BRIEF_ENHANCEMENT_FAILED",
      "The AI brief enhancement could not be completed right now.",
      502,
    );
  }

  const payload = await response.json();
  const outputText = extractResponseText(payload);

  if (!outputText) {
    throw new AppServiceError(
      "BRIEF_ENHANCEMENT_FAILED",
      "The AI brief enhancement returned an empty response.",
      502,
    );
  }

  return enhancedVideoBriefSchema.parse(JSON.parse(outputText));
}

export async function enhanceVideoBrief(input: EnhanceVideoBriefInput) {
  const parsedInput = enhanceVideoBriefInputSchema.parse(input);

  try {
    const enhanced = await enhanceWithOpenAI(parsedInput);

    if (enhanced) {
      return enhanced;
    }
  } catch (error) {
    if (error instanceof AppServiceError) {
      throw error;
    }

    logger.warn("Falling back to mock brief enhancement", error);
  }

  return getFallbackBrief(parsedInput);
}

import type { AuthSession } from "@/lib/schemas/auth";
import type { Locale } from "@/lib/i18n/messages";
import { getBillingSnapshot } from "@/services/billing/billing-service";
import { getPromptTemplateCatalog } from "@/services/prompts/prompt-template-service";
import { getVideoWorkspace } from "@/services/video/video-service";

export async function getDashboardSnapshot(session: AuthSession, locale: Locale = "en") {
  const [billing, prompts, videoWorkspace] = await Promise.all([
    getBillingSnapshot(session),
    getPromptTemplateCatalog(locale),
    getVideoWorkspace(session, locale),
  ]);

  const completed = videoWorkspace.generations.filter(
    (generation) => generation.status === "completed",
  ).length;
  const processing = videoWorkspace.generations.filter((generation) =>
    ["queued", "processing"].includes(generation.status),
  ).length;

  return {
    session,
    billing,
    prompts,
    videoWorkspace,
    stats: [
      {
        label: "Credits available",
        value: billing.balance.availableCredits.toString(),
        description: `Plan ${billing.plan.name} renews ${billing.subscription?.currentPeriodEnd?.slice(0, 10) ?? "soon"}.`,
      },
      {
        label: "Videos completed",
        value: completed.toString(),
        description: "Completed renders available for preview and mock download.",
      },
      {
        label: "Active queue",
        value: processing.toString(),
        description: "Jobs moving through queued and processing states.",
      },
      {
        label: "Featured templates",
        value: prompts.featured.length.toString(),
        description: "Curated prompt starters across ten commercial categories.",
      },
    ],
  };
}

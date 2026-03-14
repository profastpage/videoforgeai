import type { PlanId } from "@/config/plans";
import type { LocaleMessages } from "@/lib/i18n/messages";
import type { PromptTemplate } from "@/lib/schemas/prompt";
import type { Subscription, SubscriptionStatus } from "@/lib/schemas/billing";
import type { VideoGeneration } from "@/lib/schemas/video";

export function getPlanLabel(copy: LocaleMessages, planId: string) {
  return copy.plans.labels[(planId as PlanId) ?? "free"] ?? planId;
}

export function getPlanDescription(copy: LocaleMessages, planId: string) {
  return copy.plans.descriptions[(planId as PlanId) ?? "free"] ?? planId;
}

export function getPlanFeatures(copy: LocaleMessages, planId: string) {
  return copy.plans.features[(planId as PlanId) ?? "free"] ?? [];
}

export function getPromptCategoryLabel(
  copy: LocaleMessages,
  category: PromptTemplate["category"],
) {
  return copy.video.categories[category] ?? category;
}

export function getGenerationStatusLabel(
  copy: LocaleMessages,
  status: VideoGeneration["status"] | "all",
) {
  return copy.video.statuses[status];
}

export function getSubscriptionStatusLabel(
  copy: LocaleMessages,
  status: Subscription["status"] | "mock",
) {
  return copy.billing.statuses[status as SubscriptionStatus | "mock"] ?? status;
}

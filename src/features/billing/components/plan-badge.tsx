"use client";

import type { PlanId } from "@/config/plans";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { getPlanLabel } from "@/lib/i18n/dashboard-formatters";

const variantMap: Record<PlanId, "default" | "primary" | "accent"> = {
  demo: "default",
  lite: "default",
  pro: "primary",
  business: "accent",
};

type PlanBadgeProps = {
  planId: string;
};

export function PlanBadge({ planId }: PlanBadgeProps) {
  const { copy } = useLocale();
  const variant =
    variantMap[(planId as PlanId) ?? "demo"] ?? "default";

  return <Badge variant={variant}>{getPlanLabel(copy, planId)}</Badge>;
}

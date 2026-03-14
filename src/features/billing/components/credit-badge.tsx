"use client";

import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";

type CreditBadgeProps = {
  credits: number;
};

export function CreditBadge({ credits }: CreditBadgeProps) {
  const { copy } = useLocale();

  return <Badge variant="primary">{credits} {copy.controls.credits}</Badge>;
}

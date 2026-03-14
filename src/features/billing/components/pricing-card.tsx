"use client";

import { CheckCircle2 } from "lucide-react";
import type { Plan } from "@/lib/schemas/billing";
import { cn } from "@/lib/utils";
import { PlanBadge } from "@/features/billing/components/plan-badge";
import { BillingRedirectButton } from "@/features/billing/components/billing-redirect-button";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlanDescription, getPlanFeatures, getPlanLabel } from "@/lib/i18n/dashboard-formatters";

type PricingCardProps = {
  plan: Plan;
  currentPlanId?: string;
};

export function PricingCard({ plan, currentPlanId }: PricingCardProps) {
  const { copy } = useLocale();
  const isCurrent = currentPlanId === plan.id;
  const planLabel = getPlanLabel(copy, plan.id);
  const planDescription = getPlanDescription(copy, plan.id);
  const planFeatures = getPlanFeatures(copy, plan.id);

  return (
    <Card className={cn("min-w-0", isCurrent && "ring-2 ring-primary")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <PlanBadge planId={plan.id} />
          {isCurrent ? (
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {copy.plans.current}
            </div>
          ) : null}
        </div>
        <CardTitle className="mt-3">{planLabel}</CardTitle>
        <div className="text-sm leading-6 text-muted-foreground">{planDescription}</div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <span className="text-4xl font-semibold tracking-tight">
            ${plan.monthlyPrice}
          </span>
          <span className="ml-2 text-sm text-muted-foreground">{copy.plans.perMonth}</span>
        </div>
        <div className="mb-5 rounded-[20px] border border-border bg-background/50 p-4 text-sm leading-6 text-muted-foreground">
          <div>
            {plan.includedVideos} {copy.plans.videosPerMonth}
          </div>
          <div>
            {copy.plans.standardDuration}: {plan.standardDurationSeconds}s
          </div>
        </div>
        <div className="space-y-3">
          {planFeatures.map((feature) => (
            <div key={feature} className="flex gap-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {isCurrent ? (
          <Button className="w-full" disabled variant="outline">
            {copy.plans.currentPlan}
          </Button>
        ) : (
          <BillingRedirectButton
            className="w-full"
            endpoint="/api/billing/checkout"
            idleLabel={copy.plans.choosePlan}
            payload={{ planId: plan.id }}
            pendingLabel={copy.billing.openingCheckout}
          />
        )}
      </CardFooter>
    </Card>
  );
}

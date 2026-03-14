import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingRedirectButton } from "@/features/billing/components/billing-redirect-button";
import { PricingCard } from "@/features/billing/components/pricing-card";
import { getPlanLabel, getSubscriptionStatusLabel } from "@/lib/i18n/dashboard-formatters";
import { getServerCopy } from "@/lib/i18n/server-copy";
import { logger } from "@/server/logger";
import { requireSession } from "@/services/auth/auth-service";
import { getBillingSnapshot } from "@/services/billing/billing-service";
import { syncCheckoutSessionForUser } from "@/services/billing/billing-service";
import { plansRepository } from "@/server/repositories/plans.repository";

type BillingPageProps = {
  searchParams: Promise<{
    checkout?: string;
    session_id?: string;
  }>;
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const session = await requireSession();
  const resolvedSearchParams = await searchParams;

  if (
    resolvedSearchParams.checkout === "success" &&
    resolvedSearchParams.session_id
  ) {
    try {
      await syncCheckoutSessionForUser(
        resolvedSearchParams.session_id,
        session.user.id,
      );
    } catch (error) {
      logger.warn("Stripe checkout return sync failed", error);
    }
  }

  const [{ copy, locale }, billing, plans] = await Promise.all([
    getServerCopy(),
    getBillingSnapshot(session),
    plansRepository.list(),
  ]);
  const localeCode = locale === "es" ? "es-PE" : "en-US";
  const renewalDate = billing.subscription?.currentPeriodEnd
    ? new Intl.DateTimeFormat(localeCode, { dateStyle: "medium" }).format(
        new Date(billing.subscription.currentPeriodEnd),
      )
    : locale === "es"
      ? "pronto"
      : "soon";

  return (
    <AppShell
      section="billing"
      credits={billing.balance.availableCredits}
      role={session.user.role}
    >
      <section className="grid gap-6 2xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <Card>
          <CardHeader>
            <CardTitle>{copy.billing.summaryTitle}</CardTitle>
            <CardDescription>{copy.billing.summaryDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resolvedSearchParams.checkout === "success" ? (
              <div className="rounded-[20px] border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground">
                {copy.billing.checkoutSuccess}
              </div>
            ) : null}
            {resolvedSearchParams.checkout === "cancelled" ? (
              <div className="rounded-[20px] border border-border bg-background/60 px-4 py-3 text-sm leading-6 text-muted-foreground">
                {copy.billing.checkoutCancelled}
              </div>
            ) : null}
            <div className="rounded-[22px] border border-border bg-background/50 p-4">
              <div className="text-sm font-semibold">{copy.billing.planLabel}</div>
              <div className="mt-2 text-2xl font-semibold">{getPlanLabel(copy, billing.plan.id)}</div>
              <p className="mt-2 text-sm text-muted-foreground">
                {billing.plan.includedVideos} {copy.plans.videosPerMonth}, {copy.plans.standardDuration} {billing.plan.standardDurationSeconds}s, {billing.plan.historyLimitDays} {copy.plans.historyDays}.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-background/50 p-4">
              <div className="text-sm font-semibold">{copy.billing.availableCreditsLabel}</div>
              <div className="mt-2 text-2xl font-semibold">
                {billing.balance.availableCredits}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {copy.plans.lifetimeUsedCredits}: {billing.balance.lifetimeUsedCredits}
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-background/50 p-4">
              <div className="text-sm font-semibold">{copy.billing.subscriptionStatusLabel}</div>
              <div className="mt-2 text-2xl font-semibold">
                {getSubscriptionStatusLabel(copy, billing.subscription?.status ?? "mock")}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {copy.billing.renewsOnLabel} {renewalDate}
              </p>
              {billing.subscription?.stripeCustomerId ? (
                <div className="mt-4">
                  <BillingRedirectButton
                    className="w-full sm:w-auto"
                    endpoint="/api/billing/portal"
                    idleLabel={copy.billing.manageSubscription}
                    pendingLabel={copy.billing.openingPortal}
                    variant="outline"
                  />
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  {copy.billing.manageHint}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currentPlanId={billing.plan.id}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditBadge } from "@/features/billing/components/credit-badge";
import { PlanBadge } from "@/features/billing/components/plan-badge";
import { StatCard } from "@/features/shared/components/stat-card";
import { VideoCard } from "@/features/video/components/video-card";
import { getPlanLabel, getSubscriptionStatusLabel } from "@/lib/i18n/dashboard-formatters";
import { getServerCopy } from "@/lib/i18n/server-copy";
import { requireSession } from "@/services/auth/auth-service";
import { getDashboardSnapshot } from "@/services/dashboard/dashboard-service";

export default async function DashboardPage() {
  const session = await requireSession();
  const { copy, locale } = await getServerCopy();
  const snapshot = await getDashboardSnapshot(session, locale);

  const localeCode = locale === "es" ? "es-PE" : "en-US";
  const renewalDate = snapshot.billing.subscription?.currentPeriodEnd
    ? new Intl.DateTimeFormat(localeCode, { dateStyle: "medium" }).format(
        new Date(snapshot.billing.subscription.currentPeriodEnd),
      )
    : locale === "es"
      ? "pronto"
      : "soon";
  const completedCount = snapshot.videoWorkspace.generations.filter(
    (generation) => generation.status === "completed",
  ).length;
  const processingCount = snapshot.videoWorkspace.generations.filter((generation) =>
    ["queued", "processing"].includes(generation.status),
  ).length;
  const stats = [
    {
      label: copy.dashboard.overview.stats.availableCredits,
      value: snapshot.billing.balance.availableCredits.toString(),
      description: copy.dashboard.overview.stats.availableCreditsDescription
        .replace("{plan}", getPlanLabel(copy, snapshot.billing.plan.id))
        .replace("{date}", renewalDate),
    },
    {
      label: copy.dashboard.overview.stats.videosCompleted,
      value: completedCount.toString(),
      description: copy.dashboard.overview.stats.videosCompletedDescription,
    },
    {
      label: copy.dashboard.overview.stats.activeQueue,
      value: processingCount.toString(),
      description: copy.dashboard.overview.stats.activeQueueDescription,
    },
    {
      label: copy.dashboard.overview.stats.featuredTemplates,
      value: snapshot.prompts.featured.length.toString(),
      description: copy.dashboard.overview.stats.featuredTemplatesDescription,
    },
  ];

  return (
    <AppShell
      section="overview"
      credits={snapshot.billing.balance.availableCredits}
      role={session.user.role}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{copy.dashboard.overview.summaryTitle}</CardTitle>
                <CardDescription>{copy.dashboard.overview.summaryDescription}</CardDescription>
              </div>
              <div className="flex gap-2">
                <PlanBadge planId={snapshot.billing.plan.id} />
                <CreditBadge credits={snapshot.billing.balance.availableCredits} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-border bg-background/50 p-4">
              <div className="text-sm font-semibold">{copy.dashboard.overview.currentPlan}</div>
              <div className="mt-3 text-2xl font-semibold">
                {getPlanLabel(copy, snapshot.billing.plan.id)}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {copy.dashboard.overview.currentPlanDescription
                  .replace("{videos}", snapshot.billing.plan.includedVideos.toString())
                  .replace("{seconds}", snapshot.billing.plan.maxDurationSeconds.toString())}
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-background/50 p-4">
              <div className="text-sm font-semibold">{copy.dashboard.overview.subscriptionStatus}</div>
              <div className="mt-3 text-2xl font-semibold capitalize">
                {getSubscriptionStatusLabel(copy, snapshot.billing.subscription?.status ?? "mock")}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {copy.billing.renewsOnLabel} {renewalDate}.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.dashboard.overview.featuredTitle}</CardTitle>
            <CardDescription>{copy.dashboard.overview.featuredDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {snapshot.prompts.featured.slice(0, 4).map((template) => (
              <div
                key={template.id}
                className="rounded-[22px] border border-border bg-background/50 p-4"
              >
                <div className="text-sm font-semibold">{template.title}</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {template.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{copy.dashboard.overview.recentTitle}</h2>
          <p className="text-sm text-muted-foreground">
            {copy.dashboard.overview.recentDescription}
          </p>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          {snapshot.videoWorkspace.generations.slice(0, 4).map((generation) => (
            <VideoCard key={generation.id} generation={generation} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

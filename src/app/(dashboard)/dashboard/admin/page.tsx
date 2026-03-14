import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientManager } from "@/features/clients/components/client-manager";
import { getPlanLabel } from "@/lib/i18n/dashboard-formatters";
import { getServerCopy } from "@/lib/i18n/server-copy";
import { requireAdminSession } from "@/services/auth/auth-service";
import { getDashboardSnapshot } from "@/services/dashboard/dashboard-service";
import { auditLogsRepository } from "@/server/repositories/audit-logs.repository";

export default async function AdminPage() {
  const session = await requireAdminSession();
  const { copy, locale } = await getServerCopy();
  const [snapshot, auditLogs] = await Promise.all([
    getDashboardSnapshot(session, locale),
    auditLogsRepository.listRecent(),
  ]);

  return (
    <AppShell
      section="admin"
      credits={snapshot.billing.balance.availableCredits}
      role={session.user.role}
    >
      <section className="grid gap-6 2xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Card>
          <CardHeader>
            <CardTitle>{copy.dashboard.admin.metricsTitle}</CardTitle>
            <CardDescription>{copy.dashboard.admin.metricsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-[22px] border border-border bg-background/50 p-4">
              <div className="text-sm font-semibold">{copy.dashboard.admin.activePlan}</div>
              <div className="mt-2 text-2xl font-semibold">{getPlanLabel(copy, snapshot.billing.plan.id)}</div>
            </div>
            <div className="rounded-[22px] border border-border bg-background/50 p-4">
              <div className="text-sm font-semibold">{copy.dashboard.admin.generationsInStore}</div>
              <div className="mt-2 text-2xl font-semibold">
                {snapshot.videoWorkspace.generations.length}
              </div>
            </div>
            <div className="rounded-[22px] border border-border bg-background/50 p-4">
              <div className="text-sm font-semibold">{copy.dashboard.admin.creditsRemaining}</div>
              <div className="mt-2 text-2xl font-semibold">
                {snapshot.billing.balance.availableCredits}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{copy.dashboard.admin.auditTitle}</CardTitle>
            <CardDescription>{copy.dashboard.admin.auditDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditLogs.length === 0 ? (
              <div className="rounded-[22px] border border-border bg-background/50 p-4 text-sm text-muted-foreground">
                {copy.dashboard.admin.noAuditEvents}
              </div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-[22px] border border-border bg-background/50 p-4"
                >
                  <div className="font-semibold">{log.eventType}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {log.entityType} - {log.entityId}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{copy.dashboard.admin.clientsTitle}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{copy.dashboard.admin.clientsDescription}</p>
        </div>
        <ClientManager />
      </section>
    </AppShell>
  );
}

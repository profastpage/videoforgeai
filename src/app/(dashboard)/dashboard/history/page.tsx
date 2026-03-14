import { AppShell } from "@/components/layout/app-shell";
import { HistoryExplorer } from "@/features/video/components/history-explorer";
import { getServerCopy } from "@/lib/i18n/server-copy";
import { getBillingSnapshot } from "@/services/billing/billing-service";
import { requireSession } from "@/services/auth/auth-service";
import { listUserGenerations } from "@/services/video/video-service";

export default async function HistoryPage() {
  const session = await requireSession();
  const { locale } = await getServerCopy();
  const [billing, generations] = await Promise.all([
    getBillingSnapshot(session),
    listUserGenerations(session, locale),
  ]);

  return (
    <AppShell
      section="history"
      credits={billing.balance.availableCredits}
      role={session.user.role}
    >
      <HistoryExplorer generations={generations} />
    </AppShell>
  );
}

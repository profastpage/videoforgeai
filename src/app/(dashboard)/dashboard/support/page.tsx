import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerCopy } from "@/lib/i18n/server-copy";
import { requireSession } from "@/services/auth/auth-service";
import { getBillingSnapshot } from "@/services/billing/billing-service";

export default async function SupportPage() {
  const session = await requireSession();
  const [{ copy }, billing] = await Promise.all([
    getServerCopy(),
    getBillingSnapshot(session),
  ]);

  return (
    <AppShell
      section="support"
      credits={billing.balance.availableCredits}
      role={session.user.role}
    >
      <Card>
        <CardHeader>
          <CardTitle>{copy.dashboard.support.title}</CardTitle>
          <CardDescription>{copy.dashboard.support.description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px] rounded-[24px] border border-dashed border-border bg-background/40" />
      </Card>
    </AppShell>
  );
}

import { AppShell } from "@/components/layout/app-shell";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getServerCopy } from "@/lib/i18n/server-copy";
import { requireSession } from "@/services/auth/auth-service";
import { getBillingSnapshot } from "@/services/billing/billing-service";

export default async function SettingsPage() {
  const session = await requireSession();
  const [{ copy }, billing] = await Promise.all([
    getServerCopy(),
    getBillingSnapshot(session),
  ]);

  return (
    <AppShell
      section="settings"
      credits={billing.balance.availableCredits}
      role={session.user.role}
    >
      <section className="grid gap-6 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>{copy.dashboard.settings.profileTitle}</CardTitle>
            <CardDescription>{copy.dashboard.settings.profileDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-[22px] border border-border bg-background/50 p-4">
              <div className="font-semibold">{session.profile.fullName}</div>
              <div className="mt-1 text-muted-foreground">{session.user.email}</div>
              <div className="mt-1 text-muted-foreground">{session.profile.companyName}</div>
            </div>
            <SignOutButton />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{copy.dashboard.settings.preferencesTitle}</CardTitle>
            <CardDescription>{copy.dashboard.settings.preferencesDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-3 rounded-[22px] border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold">{copy.dashboard.settings.themeMode}</div>
                <div className="text-sm text-muted-foreground">
                  {copy.dashboard.settings.themeModeDescription}
                </div>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex flex-col gap-3 rounded-[22px] border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold">{copy.dashboard.settings.emailNotifications}</div>
                <div className="text-sm text-muted-foreground">
                  {copy.dashboard.settings.emailNotificationsDescription}
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="rounded-[22px] border border-border bg-background/50 p-4">
              <div className="font-semibold">{copy.dashboard.settings.accountDeletion}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {copy.dashboard.settings.accountDeletionDescription}
              </div>
              <Button className="mt-4" variant="outline" disabled>
                {copy.dashboard.settings.deleteAccount}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

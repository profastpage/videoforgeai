import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPromptCategoryLabel } from "@/lib/i18n/dashboard-formatters";
import { getServerCopy } from "@/lib/i18n/server-copy";
import { requireSession } from "@/services/auth/auth-service";
import { getBillingSnapshot } from "@/services/billing/billing-service";
import { getPromptTemplateCatalog } from "@/services/prompts/prompt-template-service";

export default async function TemplatesPage() {
  const session = await requireSession();
  const { copy, locale } = await getServerCopy();
  const [billing, prompts] = await Promise.all([
    getBillingSnapshot(session),
    getPromptTemplateCatalog(locale),
  ]);

  return (
    <AppShell
      section="templates"
      credits={billing.balance.availableCredits}
      role={session.user.role}
    >
      <Card>
        <CardHeader>
          <CardTitle>{copy.dashboard.templates.title}</CardTitle>
          <CardDescription>{copy.dashboard.templates.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {prompts.templates.map((template) => (
            <div
              key={template.id}
              className="min-w-0 rounded-[24px] border border-border bg-background/50 p-5"
            >
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{getPromptCategoryLabel(copy, template.category)}</Badge>
                {template.isFeatured ? <Badge variant="primary">{copy.video.featuredBadge}</Badge> : null}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{template.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {template.description}
              </p>
              <p className="mt-4 text-sm leading-6">{template.prompt}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}

import { AppShell } from "@/components/layout/app-shell";
import { GenerationForm } from "@/features/video/components/generation-form";
import { getServerCopy } from "@/lib/i18n/server-copy";
import { requireSession } from "@/services/auth/auth-service";
import { getBillingSnapshot } from "@/services/billing/billing-service";
import { getPromptTemplateCatalog } from "@/services/prompts/prompt-template-service";

export default async function CreateVideoPage() {
  const session = await requireSession();
  const { locale } = await getServerCopy();
  const [billing, prompts] = await Promise.all([
    getBillingSnapshot(session),
    getPromptTemplateCatalog(locale),
  ]);

  return (
    <AppShell
      section="create"
      credits={billing.balance.availableCredits}
      role={session.user.role}
    >
      <GenerationForm
        templates={prompts.templates}
        availableCredits={billing.balance.availableCredits}
      />
    </AppShell>
  );
}

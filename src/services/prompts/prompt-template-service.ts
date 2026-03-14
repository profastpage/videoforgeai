import { promptTemplatesRepository } from "@/server/repositories/prompt-templates.repository";
import { localizePromptTemplates } from "@/lib/i18n/demo-content";
import type { Locale } from "@/lib/i18n/messages";

export async function getPromptTemplateCatalog(locale: Locale = "en") {
  const templates = localizePromptTemplates(await promptTemplatesRepository.list(), locale);
  const featured = templates.filter((template) => template.isFeatured);

  return {
    templates,
    featured,
  };
}

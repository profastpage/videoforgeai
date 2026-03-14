import { seededPromptTemplates } from "@/server/seeds/prompt-templates";

export class PromptTemplatesRepository {
  async list() {
    return seededPromptTemplates;
  }

  async listFeatured() {
    return seededPromptTemplates.filter((template) => template.isFeatured);
  }

  async findBySlug(slug: string) {
    return seededPromptTemplates.find((template) => template.slug === slug) ?? null;
  }
}

export const promptTemplatesRepository = new PromptTemplatesRepository();

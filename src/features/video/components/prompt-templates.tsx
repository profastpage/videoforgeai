"use client";

import type { PromptTemplate } from "@/lib/schemas/prompt";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPromptCategoryLabel } from "@/lib/i18n/dashboard-formatters";

type PromptTemplatesProps = {
  templates: PromptTemplate[];
  onSelect: (template: PromptTemplate) => void;
};

export function PromptTemplates({ templates, onSelect }: PromptTemplatesProps) {
  const { copy } = useLocale();

  return (
    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-1">
      {templates.map((template) => (
        <button key={template.id} type="button" onClick={() => onSelect(template)}>
          <Card className="h-full min-w-0 text-left transition hover:-translate-y-0.5 hover:border-primary/40">
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{getPromptCategoryLabel(copy, template.category)}</Badge>
                {template.isFeatured ? <Badge variant="primary">{copy.video.featuredBadge}</Badge> : null}
              </div>
              <CardTitle className="mt-3">{template.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-6 text-muted-foreground">
                {template.description}
              </p>
              <p className="line-clamp-3 text-sm leading-6 text-foreground/85">
                {template.prompt}
              </p>
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}

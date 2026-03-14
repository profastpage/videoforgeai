"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  compact?: boolean;
};

export function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { locale, setLocale, copy } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(nextLocale: "es" | "en") {
    if (locale === nextLocale) {
      return;
    }

    startTransition(() => {
      setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-background/80 p-1 backdrop-blur",
        compact && "px-1",
      )}
      aria-label={copy.controls.languageLabel}
    >
      {!compact ? <Languages className="ml-2 h-4 w-4 text-muted-foreground" /> : null}
      <Button
        type="button"
        variant={locale === "es" ? "default" : "ghost"}
        size={compact ? "icon" : "sm"}
        className={cn(compact ? "h-8 w-8 rounded-full" : "rounded-full px-3")}
        disabled={isPending}
        onClick={() => handleLocaleChange("es")}
      >
        ES
      </Button>
      <Button
        type="button"
        variant={locale === "en" ? "default" : "ghost"}
        size={compact ? "icon" : "sm"}
        className={cn(compact ? "h-8 w-8 rounded-full" : "rounded-full px-3")}
        disabled={isPending}
        onClick={() => handleLocaleChange("en")}
      >
        EN
      </Button>
    </div>
  );
}

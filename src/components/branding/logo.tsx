"use client";

import { Sparkles } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  const { locale } = useLocale();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_16px_40px_-24px_rgba(21,94,239,0.7)]">
        <Sparkles className="h-5 w-5" />
      </span>
      {!compact ? (
        <div className="space-y-0.5">
          <div className="text-sm font-semibold tracking-[0.24em] text-primary">VIDEOFORGE AI</div>
          <div className="text-xs text-muted-foreground">
            {locale === "es"
              ? "Sistema operativo comercial de video IA"
              : "Commercial AI video operating system"}
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { copy } = useLocale();
  const activeTheme = theme === "system" ? (resolvedTheme ?? "light") : (theme ?? "light");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-background/80 p-1 backdrop-blur",
        compact && "px-1",
      )}
      aria-label={copy.controls.themeLabel}
    >
      {!compact ? <SunMedium className="ml-2 h-4 w-4 text-muted-foreground" /> : null}
      <Button
        type="button"
        variant={activeTheme === "light" ? "default" : "ghost"}
        size={compact ? "icon" : "sm"}
        className={cn(compact ? "h-8 w-8 rounded-full" : "rounded-full px-3")}
        onClick={() => setTheme("light")}
      >
        {compact ? <SunMedium className="h-4 w-4" /> : copy.common.light}
      </Button>
      <Button
        type="button"
        variant={activeTheme === "dark" ? "default" : "ghost"}
        size={compact ? "icon" : "sm"}
        className={cn(compact ? "h-8 w-8 rounded-full" : "rounded-full px-3")}
        onClick={() => setTheme("dark")}
      >
        {compact ? <MoonStar className="h-4 w-4" /> : copy.common.dark}
      </Button>
    </div>
  );
}

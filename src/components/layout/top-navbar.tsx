"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { LanguageToggle } from "@/components/language/language-toggle";
import { useLocale } from "@/components/providers/locale-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ShellSection } from "@/lib/i18n/messages";

type TopNavbarProps = {
  section: ShellSection;
  credits: number;
};

export function TopNavbar({ section, credits }: TopNavbarProps) {
  const { copy } = useLocale();

  return (
    <div className="glass-card sticky top-3 z-30 hidden rounded-[24px] px-4 py-3 lg:block">
      <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="min-w-0 max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight">{copy.shell[section].title}</h1>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy.shell[section].subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 2xl:justify-end">
          <div className="relative hidden 2xl:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-72 pl-9"
              placeholder={copy.controls.topSearchPlaceholder}
            />
          </div>
          <div className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
            {credits} {copy.controls.credits}
          </div>
          <Button variant="outline" size="icon" aria-label={copy.common.notifications}>
            <Bell className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <LanguageToggle />
          <Link href="/dashboard/settings">
            <Avatar className="border border-border">
              <AvatarFallback>VF</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </div>
  );
}

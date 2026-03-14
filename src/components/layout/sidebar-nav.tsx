"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { useLocale } from "@/components/providers/locale-provider";
import type { NavigationItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  pathname: string;
  primaryItems: NavigationItem[];
  supportItems?: NavigationItem[];
};

export function SidebarNav({
  pathname,
  primaryItems,
  supportItems = [],
}: SidebarNavProps) {
  const { copy } = useLocale();

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <Logo />
      </div>
      <nav className="space-y-1.5">
        {primaryItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_18px_44px_-28px_rgba(21,94,239,0.7)]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {copy.navigation[item.labelKey]}
              </span>
              <ChevronRight className={cn("h-4 w-4 opacity-0 transition group-hover:opacity-100", isActive && "opacity-100")} />
            </Link>
          );
        })}
      </nav>
      {supportItems.length ? (
        <div className="mt-auto border-t border-border pt-5">
          {supportItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {copy.navigation[item.labelKey]}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "@/components/language/language-toggle";
import { Logo } from "@/components/branding/logo";
import { useLocale } from "@/components/providers/locale-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { getDashboardNavigation, supportNavigation } from "@/config/navigation";
import type { AuthSession } from "@/lib/schemas/auth";

export function MobileFixedHeader({ role }: { role: AuthSession["user"]["role"] }) {
  const pathname = usePathname();
  const { copy } = useLocale();
  const primaryItems = getDashboardNavigation(role);

  return (
    <header className="glass-card fixed inset-x-3 top-3 z-40 flex items-center justify-between rounded-[24px] px-3 py-2.5 sm:inset-x-4 sm:px-4 lg:hidden">
      <Link href="/dashboard" aria-label={copy.controls.openDashboard}>
        <Logo compact />
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle compact />
        <LanguageToggle compact />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label={copy.controls.openNavigation}>
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[88vw] max-w-sm">
            <SheetHeader>
              <SheetTitle>{copy.controls.mobileNavTitle}</SheetTitle>
              <SheetDescription>{copy.controls.mobileNavDescription}</SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <SidebarNav
                pathname={pathname}
                primaryItems={primaryItems}
                supportItems={supportNavigation}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

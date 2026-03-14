"use client";

import { usePathname } from "next/navigation";
import { MobileFixedHeader } from "@/components/layout/mobile-fixed-header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TopNavbar } from "@/components/layout/top-navbar";
import { getDashboardNavigation, supportNavigation } from "@/config/navigation";
import type { ShellSection } from "@/lib/i18n/messages";
import type { AuthSession } from "@/lib/schemas/auth";

type AppShellProps = {
  children: React.ReactNode;
  section: ShellSection;
  credits: number;
  role: AuthSession["user"]["role"];
};

export function AppShell({
  children,
  section,
  credits,
  role,
}: AppShellProps) {
  const pathname = usePathname();
  const primaryItems = getDashboardNavigation(role);

  return (
    <div className="min-h-screen">
      <MobileFixedHeader role={role} />
      <div className="page-shell grid min-h-screen gap-4 pt-20 lg:grid-cols-[264px_minmax(0,1fr)] lg:pt-6 xl:gap-5">
        <aside className="hidden py-3 lg:block">
          <div className="glass-card sticky top-3 h-[calc(100vh-1.5rem)] rounded-[30px] p-4 xl:p-5">
            <SidebarNav
              pathname={pathname}
              primaryItems={primaryItems}
              supportItems={supportNavigation}
            />
          </div>
        </aside>
        <div className="min-w-0 pb-8 lg:pb-10">
          <TopNavbar section={section} credits={credits} />
          <main className="mt-4 min-w-0 space-y-6 lg:mt-5">{children}</main>
        </div>
      </div>
    </div>
  );
}

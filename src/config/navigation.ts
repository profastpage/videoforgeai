import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  Gauge,
  History,
  LifeBuoy,
  Settings,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import type { AuthSession } from "@/lib/schemas/auth";

export type NavigationItem = {
  href: string;
  labelKey:
    | "overview"
    | "create"
    | "history"
    | "templates"
    | "billing"
    | "settings"
    | "admin"
    | "support";
  icon: LucideIcon;
};

export const marketingNavigation = [
  { href: "#features", labelKey: "features" },
  { href: "#use-cases", labelKey: "useCases" },
  { href: "#pricing", labelKey: "pricing" },
  { href: "#faq", labelKey: "faq" },
] as const;

const baseDashboardNavigation: NavigationItem[] = [
  { href: "/dashboard", labelKey: "overview", icon: Gauge },
  { href: "/dashboard/create", labelKey: "create", icon: WandSparkles },
  { href: "/dashboard/history", labelKey: "history", icon: History },
  { href: "/dashboard/templates", labelKey: "templates", icon: Sparkles },
  { href: "/dashboard/billing", labelKey: "billing", icon: CreditCard },
  { href: "/dashboard/settings", labelKey: "settings", icon: Settings },
];

const adminNavigation: NavigationItem[] = [
  { href: "/dashboard/admin", labelKey: "admin", icon: Sparkles },
];

export function getDashboardNavigation(role: AuthSession["user"]["role"]) {
  return role === "admin"
    ? [...baseDashboardNavigation, ...adminNavigation]
    : baseDashboardNavigation;
}

export const supportNavigation: NavigationItem[] = [
  { href: "/dashboard/support", labelKey: "support", icon: LifeBuoy },
];

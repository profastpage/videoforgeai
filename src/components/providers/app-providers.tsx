"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { LocaleProvider } from "@/components/providers/locale-provider";
import type { Locale } from "@/lib/i18n/messages";

type AppProvidersProps = {
  children: React.ReactNode;
  initialLocale: Locale;
};

export function AppProviders({ children, initialLocale }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LocaleProvider initialLocale={initialLocale}>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </LocaleProvider>
    </ThemeProvider>
  );
}

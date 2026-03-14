import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { LanguageToggle } from "@/components/language/language-toggle";
import { useLocale } from "@/components/providers/locale-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/branding/logo";

type AuthSplitLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthSplitLayout({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthSplitLayoutProps) {
  const { locale } = useLocale();
  const panel =
    locale === "es"
      ? {
          badge: "Video IA para equipos modernos de revenue",
          title:
            "Videos con IA de nivel comercial para lanzamientos, ads, promos de producto y campanas sociales.",
          description:
            "Pasa de prompt a una salida mock lista para publicar con planes, creditos, templates, historial e integraciones futuras en una sola arquitectura.",
          cardTitle: "De borrador a render en segundos",
          cardDescription: "Estructurado para Supabase, Stripe y providers reales de video IA.",
        }
      : {
          badge: "AI video for modern revenue teams",
          title:
            "Commercial-grade AI videos for launches, ads, product promos and social campaigns.",
          description:
            "Move from prompt to publish-ready mock output with plans, credits, templates, history and future provider integrations all in one architecture.",
          cardTitle: "Draft to render in seconds",
          cardDescription: "Structured for Supabase, Stripe and real AI video providers.",
        };

  return (
    <div className="page-shell grid min-h-screen items-center gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="glass-card relative hidden min-h-[720px] overflow-hidden rounded-[36px] p-8 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,176,255,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_30%)]" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <Logo />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
          <div className="space-y-5">
            <Badge variant="primary">{panel.badge}</Badge>
            <div className="space-y-3">
              <h2 className="max-w-xl text-4xl font-semibold tracking-tight">
                {panel.title}
              </h2>
              <p className="max-w-lg text-base leading-8 text-muted-foreground">
                {panel.description}
              </p>
            </div>
            <div className="rounded-[28px] border border-border bg-background/50 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold">{panel.cardTitle}</div>
                  <div className="text-sm text-muted-foreground">
                    {panel.cardDescription}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-xl space-y-6">
        <div className="space-y-4 text-center lg:text-left">
          <Badge variant="outline">{eyebrow}</Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            <p className="text-base leading-8 text-muted-foreground">{description}</p>
          </div>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}

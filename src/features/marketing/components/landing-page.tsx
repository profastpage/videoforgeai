"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { LanguageToggle } from "@/components/language/language-toggle";
import { useLocale } from "@/components/providers/locale-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/branding/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketingNavigation } from "@/config/navigation";
import { planCatalog } from "@/config/plans";
import { getPlanDescription, getPlanFeatures, getPlanLabel } from "@/lib/i18n/dashboard-formatters";

const sectionMotion = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.45 },
};

const content = {
  en: {
    badge: "AI video platform for marketing, sales and creators",
    title: "Create AI videos in seconds that feel ready to sell.",
    description:
      "VideoForge AI turns ideas into ads, promos, testimonials and business videos with a premium, clear and fully responsive experience for desktop and mobile.",
    primaryCta: "Start free",
    secondaryCta: "View product",
    brands: [
      "Northstar Commerce",
      "Pulse Media",
      "Velocity CRM",
      "Apex Homes",
      "Modern DTC",
      "Studio Nova",
    ],
    benefits: [
      "Create product promos, launch ads, testimonials and sales videos from one prompt-driven workspace.",
      "Run a real SaaS flow with auth, plans, credits, generation history and admin visibility.",
      "Stay mobile-first with fixed navigation, responsive layouts and clean dashboard ergonomics.",
    ],
    cards: [
      {
        title: "Prompt-to-video in seconds",
        description:
          "Generate short-form ads, promos and business content with clean controls for format, style, duration and resolution.",
      },
      {
        title: "Credits, plans and history",
        description:
          "Manage consumption, pricing tiers, downloads, filters and performance from one commercial-grade dashboard.",
      },
      {
        title: "Provider-ready architecture",
        description:
          "Stay mock-safe today while keeping clean extension points for Supabase, Stripe, storage and real AI video providers.",
      },
    ],
    howBadge: "How it works",
    howTitle: "From brief to ready-to-share video.",
    howSteps: [
      "Write a prompt or select a commercial template.",
      "Choose aspect ratio, resolution, duration and style.",
      "Generate, monitor progress, preview and download from history.",
    ],
    useCasesBadge: "Use cases",
    useCasesTitle: "Built for teams that need output fast.",
    useCases: [
      "TikTok, Reels and Shorts for ecommerce and local businesses",
      "Sales enablement recaps and B2B product teasers",
      "Testimonials, founder stories and social proof assets",
      "Promotions for restaurants, beauty brands, real estate and agencies",
    ],
    pricingBadge: "Pricing",
    pricingTitle: "Simple plans priced by finished short videos.",
    pricingDescription:
      "Start with one test render, then grow through 5, 10 or 20 short AI videos per month with clear margins and no hidden complexity.",
    faqTitle: "Questions teams ask before switching.",
    faq: [
      {
        q: "Can I connect a real AI video provider later?",
        a: "Yes. The provider layer is abstracted, with a working mock adapter and clear hook points for a real API.",
      },
      {
        q: "Is billing prepared for Stripe?",
        a: "Yes. Plans, subscription concepts, env vars and a Stripe service are already in place for checkout and webhooks.",
      },
      {
        q: "Does it work well on mobile?",
        a: "Yes. The dashboard uses a fixed mobile header, compact controls and responsive layouts optimized from mobile to desktop.",
      },
    ],
    livePipeline: "Live creation pipeline",
    liveProject: "Launch teaser render",
    liveStatus: "Processing",
    livePrompt: "Prompt",
    liveOutput: "Output",
    liveProgress: "Render progress",
    liveEstimate: "Estimated completion in 22 seconds",
    liveSupport: "Optimized for Reels, Shorts and TikTok.",
    footer:
      "Premium AI video creation for marketing, sales, ecommerce and creators.",
    footerTech: "Supabase, Stripe, storage and provider integrations prepared.",
    pricingMeta: "credits/month",
    pricingLimit: "up to",
    pricingHistory: "days of history",
    pricingVideos: "videos / month",
    pricingDuration: "standard",
    popular: "Popular",
  },
  es: {
    badge: "Plataforma de video IA para marketing, ventas y creadores",
    title: "Crea videos con IA en segundos que se sienten listos para vender.",
    description:
      "VideoForge AI convierte ideas en anuncios, promos, testimonios y videos de negocio con una experiencia premium, clara y completamente responsive para desktop y movil.",
    primaryCta: "Empieza gratis",
    secondaryCta: "Ver producto",
    brands: [
      "Northstar Commerce",
      "Pulse Media",
      "Velocity CRM",
      "Apex Homes",
      "Modern DTC",
      "Studio Nova",
    ],
    benefits: [
      "Crea promos de producto, anuncios de lanzamiento, testimonios y videos de ventas desde un workspace guiado por prompts.",
      "Opera un flujo SaaS real con auth, planes, creditos, historial de generaciones y visibilidad admin.",
      "Mantiene una experiencia mobile-first con navegacion fija, layouts responsivos y ergonomia limpia de dashboard.",
    ],
    cards: [
      {
        title: "Prompt a video en segundos",
        description:
          "Genera ads, promos y contenido de negocio con controles limpios de formato, estilo, duracion y resolucion.",
      },
      {
        title: "Creditos, planes e historial",
        description:
          "Administra consumo, pricing, descargas, filtros y rendimiento desde un dashboard comercial.",
      },
      {
        title: "Arquitectura lista para providers",
        description:
          "Opera con mocks hoy sin perder puntos limpios de extension para Supabase, Stripe, storage y APIs reales.",
      },
    ],
    howBadge: "Como funciona",
    howTitle: "Del brief a un video listo para compartir.",
    howSteps: [
      "Escribe un prompt o elige un template comercial.",
      "Selecciona formato, resolucion, duracion y estilo.",
      "Genera, monitorea el progreso, previsualiza y descarga desde el historial.",
    ],
    useCasesBadge: "Casos de uso",
    useCasesTitle: "Pensado para equipos que necesitan producir rapido.",
    useCases: [
      "TikTok, Reels y Shorts para ecommerce y negocios locales",
      "Resumenes para ventas y teasers B2B de producto",
      "Testimonios, historias de fundador y piezas de prueba social",
      "Promociones para restaurantes, belleza, real estate y agencias",
    ],
    pricingBadge: "Planes",
    pricingTitle: "Planes simples cobrados por videos cortos terminados.",
    pricingDescription:
      "Empieza con un render de prueba y luego escala a 5, 10 o 20 videos IA cortos por mes con una oferta clara y sin complejidad innecesaria.",
    faqTitle: "Preguntas que hacen los equipos antes de cambiarse.",
    faq: [
      {
        q: "Puedo conectar luego un provider real de video IA?",
        a: "Si. La capa de providers esta abstraida, con un adapter mock funcional y puntos claros para una API real.",
      },
      {
        q: "La facturacion ya esta preparada para Stripe?",
        a: "Si. Los planes, conceptos de suscripcion, variables de entorno y el servicio de Stripe ya estan listos para checkout y webhooks.",
      },
      {
        q: "Funciona bien en movil?",
        a: "Si. El dashboard usa header movil fijo, controles compactos y layouts responsive optimizados de movil a desktop.",
      },
    ],
    livePipeline: "Pipeline de creacion en vivo",
    liveProject: "Render de teaser de lanzamiento",
    liveStatus: "Procesando",
    livePrompt: "Prompt",
    liveOutput: "Salida",
    liveProgress: "Progreso del render",
    liveEstimate: "Finalizacion estimada en 22 segundos",
    liveSupport: "Optimizado para Reels, Shorts y TikTok.",
    footer:
      "Creacion premium de videos con IA para marketing, ventas, ecommerce y creadores.",
    footerTech: "Integraciones con Supabase, Stripe, storage y providers preparadas.",
    pricingMeta: "creditos/mes",
    pricingLimit: "hasta",
    pricingHistory: "dias de historial",
    pricingVideos: "videos / mes",
    pricingDuration: "base",
    popular: "Popular",
  },
} as const;

export function LandingPage() {
  const { locale, copy } = useLocale();
  const text = content[locale];

  return (
    <div className="min-h-screen">
      <header className="page-shell pt-6">
        <div className="glass-card flex flex-col gap-4 rounded-[28px] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Logo />
          <nav className="hidden items-center gap-8 lg:flex">
            {marketingNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                {copy.navigation[item.labelKey]}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/login">{copy.navigation.signIn}</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">{copy.navigation.startFree}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="page-shell pb-24 pt-8">
        <motion.section
          {...sectionMotion}
          className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:pt-10"
        >
          <div className="space-y-6">
            <Badge variant="primary">{text.badge}</Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                {text.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {text.description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">
                  {text.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">
                  <PlayCircle className="h-4 w-4" />
                  {text.secondaryCta}
                </Link>
              </Button>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {text.benefits.map((feature) => (
                <div key={feature} className="flex gap-3 rounded-[22px] border border-border bg-card/80 p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden rounded-[36px]">
            <CardContent className="p-0">
              <div className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(124,176,255,0.28),transparent_34%),linear-gradient(135deg,#08111f_0%,#101b34_58%,#1c2552_100%)] p-6 text-white">
                <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/8 px-4 py-3 backdrop-blur">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-white/60">
                      {text.livePipeline}
                    </div>
                    <div className="mt-1 text-lg font-semibold">{text.liveProject}</div>
                  </div>
                  <Badge className="border-white/10 bg-white/12 text-white" variant="outline">
                    {text.liveStatus}
                  </Badge>
                </div>
                <div className="mt-5 rounded-[28px] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Sparkles className="h-4 w-4" />
                    AI storyboard orchestration
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/8 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                        {text.livePrompt}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-white/82">
                        Create a crisp 9:16 ecommerce ad for a new skincare launch with product
                        close-ups, founder quote and high-converting CTA.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-[24px] border border-white/8 bg-white/6 p-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                          {text.liveOutput}
                        </div>
                        <p className="mt-3 text-2xl font-semibold">9:16 - 720p - 10s</p>
                        <p className="mt-2 text-sm text-white/70">{text.liveSupport}</p>
                      </div>
                      <div className="rounded-[24px] border border-white/8 bg-white/6 p-4">
                        <div className="flex items-center justify-between text-sm text-white/70">
                          <span>{text.liveProgress}</span>
                          <span>78%</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-white/10">
                          <div className="h-2 w-[78%] rounded-full bg-white" />
                        </div>
                        <div className="mt-3 text-sm text-white/70">{text.liveEstimate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section {...sectionMotion} className="mt-10">
          <div className="glass-card rounded-[32px] p-5">
            <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-6">
              {text.brands.map((brand) => (
                <div key={brand} className="rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm font-medium text-muted-foreground">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section {...sectionMotion} id="features" className="mt-16 grid gap-6 lg:grid-cols-3">
          {text.cards.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <WandSparkles className="h-5 w-5" />
                </div>
                <CardTitle className="mt-4">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.section>

        <motion.section {...sectionMotion} id="use-cases" className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <Badge variant="outline">{text.howBadge}</Badge>
              <CardTitle className="mt-3 text-3xl">{text.howTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {text.howSteps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-[22px] border border-border bg-background/50 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="outline">{text.useCasesBadge}</Badge>
              <CardTitle className="mt-3 text-3xl">{text.useCasesTitle}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {text.useCases.map((item) => (
                <div key={item} className="rounded-[22px] border border-border bg-background/50 p-4 text-sm leading-6 text-muted-foreground">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.section>

        <motion.section {...sectionMotion} id="pricing" className="mt-16">
          <div className="mb-8 max-w-2xl space-y-3">
            <Badge variant="outline">{text.pricingBadge}</Badge>
            <h2 className="text-4xl font-semibold tracking-tight">{text.pricingTitle}</h2>
            <p className="text-base leading-8 text-muted-foreground">{text.pricingDescription}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {planCatalog.map((plan) => (
              <Card key={plan.id} className={plan.id === "pro" ? "ring-2 ring-primary" : undefined}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={plan.id === "business" ? "accent" : plan.id === "pro" ? "primary" : "default"}>
                      {getPlanLabel(copy, plan.id)}
                    </Badge>
                    {plan.id === "pro" ? (
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        {text.popular}
                      </div>
                    ) : null}
                  </div>
                  <CardTitle className="mt-3 text-3xl">${plan.monthlyPrice}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-6 text-muted-foreground">{getPlanDescription(copy, plan.id)}</p>
                  <div className="rounded-[22px] border border-border bg-background/50 p-4 text-sm leading-7 text-muted-foreground">
                    {plan.includedVideos} {text.pricingVideos} - {text.pricingDuration} {plan.standardDurationSeconds}s - {text.pricingLimit} {plan.maxDurationSeconds}s
                  </div>
                  <div className="space-y-2">
                    {getPlanFeatures(copy, plan.id).slice(0, 3).map((feature) => (
                      <div key={feature} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section {...sectionMotion} id="faq" className="mt-16 grid gap-4">
          <div className="max-w-2xl space-y-3">
            <Badge variant="outline">FAQ</Badge>
            <h2 className="text-4xl font-semibold tracking-tight">{text.faqTitle}</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {text.faq.map((item) => (
              <Card key={item.q}>
                <CardHeader>
                  <CardTitle className="text-xl">{item.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-muted-foreground">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-border/80 py-8">
        <div className="page-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Logo />
            <p className="text-sm text-muted-foreground">{text.footer}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {text.footerTech}
          </div>
        </div>
      </footer>
    </div>
  );
}

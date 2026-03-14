import type { Locale } from "@/lib/i18n/messages";
import type { PromptTemplate } from "@/lib/schemas/prompt";
import type { VideoGenerationView } from "@/services/video/video-service";

const spanishPromptTemplates: Record<
  string,
  Pick<PromptTemplate, "title" | "description" | "prompt">
> = {
  "ecommerce-flash-sale": {
    title: "Flash Sale Ecommerce",
    description: "Ad corto de alta conversion para una oferta ecommerce por tiempo limitado.",
    prompt:
      "Crea un ad ecommerce dinamico con close-ups premium del producto, overlays de oferta, prueba social y un CTA fuerte para comprar antes de que termine la promocion.",
  },
  "product-launch-teaser": {
    title: "Teaser de Lanzamiento",
    description: "Teaser orientado a beneficios para lanzamientos SaaS o de consumo.",
    prompt:
      "Construye un teaser de lanzamiento que revele primero el beneficio principal, siga con dos capacidades diferenciales y cierre con una revelacion pulida del producto y CTA.",
  },
  "customer-proof-reel": {
    title: "Reel de Prueba Social",
    description: "Edicion testimonial orientada a resultados para conversion y confianza.",
    prompt:
      "Convierte una historia de exito de cliente en un video de prueba conciso con estructura antes y despues, un resultado claro, overlays de cita y CTA para agendar demo.",
  },
  "property-highlight-tour": {
    title: "Tour Destacado de Propiedad",
    description: "Recorrido elegante de real estate para listados y promociones.",
    prompt:
      "Crea un video de propiedad premium con gancho exterior, transiciones elegantes de ambientes, highlights del vecindario y CTA para agendar una visita privada.",
  },
  "menu-special-promo": {
    title: "Promo de Plato Especial",
    description: "Promocion gastronómica para reels, stories y campanas locales.",
    prompt:
      "Produce un promo de restaurante apetitoso con platos hero, tomas de ambiente, prueba social y una oferta limitada que cierre con CTA de reserva.",
  },
  "beauty-before-after": {
    title: "Beauty Antes y Despues",
    description: "Video de transformacion para belleza y skincare orientado a paid social.",
    prompt:
      "Construye un video de beauty con texturas tactiles, secuencia antes y despues, highlights de ingredientes y CTA para probar el producto hoy.",
  },
  "coach-lead-capture": {
    title: "Captura de Leads para Coach",
    description: "Video de marca personal disenado para convertir atencion en llamadas.",
    prompt:
      "Crea un video corto para coach que abra con un pain point, establezca autoridad, muestre transformacion y cierre con CTA para una consultoria.",
  },
  "agency-results-recap": {
    title: "Resumen de Resultados de Agencia",
    description: "Muestra resultados y prueba de entrega para crecer como agencia.",
    prompt:
      "Crea un video de prueba para agencia con metricas de campana, logos de clientes, highlights del servicio y CTA para llamadas estrategicas con marcas en crecimiento.",
  },
  "startup-demo-sizzle": {
    title: "Sizzle Demo para Startup",
    description: "Historia de producto para lanzamientos y updates para inversionistas.",
    prompt:
      "Construye un sizzle de producto startup que presente el problema, demuestre el flujo del producto, destaque traccion y cierre con un CTA claro de siguiente paso.",
  },
  "local-offer-spotlight": {
    title: "Oferta Destacada Local",
    description: "Promo simple y efectiva para campanas y ofertas locales.",
    prompt:
      "Crea un promo de negocio local que destaque la oferta, el factor de confianza del vecindario, un gancho visual fuerte y CTA directo para visitar o reservar hoy.",
  },
};

const spanishSeedGenerations: Record<
  string,
  Partial<Pick<VideoGenerationView, "projectName" | "prompt" | "negativePrompt">>
> = {
  "Q2 Skincare Launch Reel": {
    projectName: "Reel Lanzamiento Skincare Q2",
    prompt:
      "Crea un ad ecommerce vertical para un nuevo lanzamiento de skincare con close-ups premium del producto, cita del fundador, prueba social y CTA de alta conversion.",
    negativePrompt: "Evita colores infantiles, camara inestable y escenas con bajo contraste.",
  },
  "Agency Results Recap": {
    projectName: "Resumen de Resultados de Agencia",
    prompt:
      "Crea un video horizontal de prueba para agencia mostrando metricas de campana, logos de clientes, highlights de servicio y CTA para una llamada estrategica.",
  },
  "Welcome Promo Reel": {
    projectName: "Reel Promo de Bienvenida",
    prompt:
      "Crea un promo de bienvenida que muestre que tan rapido VideoForge AI convierte un prompt en un video pulido listo para negocio con CTA fuerte.",
    negativePrompt: "Evita escenas saturadas y tipografia con bajo contraste.",
  },
};

export function localizePromptTemplates(templates: PromptTemplate[], locale: Locale) {
  if (locale !== "es") {
    return templates;
  }

  return templates.map((template) => ({
    ...template,
    ...spanishPromptTemplates[template.slug],
  }));
}

export function localizeGenerationViews(
  generations: VideoGenerationView[],
  locale: Locale,
) {
  if (locale !== "es") {
    return generations;
  }

  return generations.map((generation) => ({
    ...generation,
    ...spanishSeedGenerations[generation.projectName],
  }));
}

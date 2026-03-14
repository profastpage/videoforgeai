import { promptTemplateSchema, type PromptTemplate } from "@/lib/schemas/prompt";

export const seededPromptTemplates: PromptTemplate[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    category: "ecommerce-ads",
    slug: "ecommerce-flash-sale",
    title: "Ecommerce Flash Sale",
    description: "High-conversion short-form ad for a limited-time ecommerce offer.",
    prompt:
      "Create a fast-paced ecommerce ad with premium product close-ups, offer overlays, social proof snippets and a hard CTA to shop now before the sale ends.",
    recommendedAspectRatio: "9:16",
    recommendedStyle: "performance-ads",
    isFeatured: true,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    category: "product-promos",
    slug: "product-launch-teaser",
    title: "Product Launch Teaser",
    description: "Feature-first launch teaser for SaaS or consumer products.",
    prompt:
      "Build a launch teaser that reveals the biggest product benefit first, follows with two standout capabilities and closes with a polished product reveal and CTA.",
    recommendedAspectRatio: "16:9",
    recommendedStyle: "sleek-corporate",
    isFeatured: true,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    category: "testimonials",
    slug: "customer-proof-reel",
    title: "Customer Proof Reel",
    description: "Outcome-led testimonial edit for conversion and trust.",
    prompt:
      "Turn a customer success story into a concise proof video with before-and-after framing, one clear result metric, quote overlays and a CTA to book a demo.",
    recommendedAspectRatio: "1:1",
    recommendedStyle: "ugc-social",
    isFeatured: true,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    category: "real-estate",
    slug: "property-highlight-tour",
    title: "Property Highlight Tour",
    description: "Elegant real-estate walkthrough for listings and promotions.",
    prompt:
      "Create a luxury property highlight video with exterior hook, premium room transitions, neighborhood highlights and a CTA to schedule a private tour.",
    recommendedAspectRatio: "9:16",
    recommendedStyle: "luxury-editorial",
    isFeatured: false,
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    category: "restaurants",
    slug: "menu-special-promo",
    title: "Menu Special Promo",
    description: "Restaurant promotion for reels, stories and local campaigns.",
    prompt:
      "Produce a mouth-watering restaurant promo featuring hero dishes, ambiance shots, social proof and a timed offer that ends with a reservation CTA.",
    recommendedAspectRatio: "9:16",
    recommendedStyle: "cinematic-product",
    isFeatured: false,
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    category: "beauty",
    slug: "beauty-before-after",
    title: "Beauty Before & After",
    description: "Beauty and skincare transformation video for paid social.",
    prompt:
      "Build a beauty campaign video with tactile textures, before-and-after sequence, ingredient highlights and a confident CTA to try the product today.",
    recommendedAspectRatio: "9:16",
    recommendedStyle: "luxury-editorial",
    isFeatured: false,
  },
  {
    id: "77777777-7777-4777-8777-777777777777",
    category: "coaches",
    slug: "coach-lead-capture",
    title: "Coach Lead Capture",
    description: "Personal brand video designed to convert audience attention into calls.",
    prompt:
      "Create a short coach lead-capture video that opens with a pain point, establishes authority, shares a transformation and ends with a consultation CTA.",
    recommendedAspectRatio: "9:16",
    recommendedStyle: "ugc-social",
    isFeatured: false,
  },
  {
    id: "88888888-8888-4888-8888-888888888888",
    category: "agencies",
    slug: "agency-results-recap",
    title: "Agency Results Recap",
    description: "Showcase delivery outcomes and proof points for agency growth.",
    prompt:
      "Create an agency proof video with campaign metrics, client logos, service highlights and a CTA for strategy calls with growth-focused brands.",
    recommendedAspectRatio: "16:9",
    recommendedStyle: "sleek-corporate",
    isFeatured: true,
  },
  {
    id: "99999999-9999-4999-8999-999999999999",
    category: "startups",
    slug: "startup-demo-sizzle",
    title: "Startup Demo Sizzle",
    description: "Pitch-grade startup product story for launches and investor updates.",
    prompt:
      "Build a startup product sizzle video that introduces the market problem, demonstrates the product flow, highlights traction and ends with a clear next-step CTA.",
    recommendedAspectRatio: "16:9",
    recommendedStyle: "sleek-corporate",
    isFeatured: true,
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    category: "local-business",
    slug: "local-offer-spotlight",
    title: "Local Offer Spotlight",
    description: "Simple high-performing promo for local campaigns and offers.",
    prompt:
      "Create a local business promo that spotlights the offer, the neighborhood trust factor, one compelling visual hook and a direct CTA to visit or book today.",
    recommendedAspectRatio: "9:16",
    recommendedStyle: "performance-ads",
    isFeatured: false,
  },
].map((template) => promptTemplateSchema.parse(template));

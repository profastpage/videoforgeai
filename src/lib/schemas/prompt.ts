import { z } from "zod";

export const promptTemplateCategorySchema = z.enum([
  "ecommerce-ads",
  "product-promos",
  "testimonials",
  "real-estate",
  "restaurants",
  "beauty",
  "coaches",
  "agencies",
  "startups",
  "local-business",
]);

export const promptTemplateSchema = z.object({
  id: z.string().uuid(),
  category: promptTemplateCategorySchema,
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  prompt: z.string().min(20),
  recommendedAspectRatio: z.enum(["16:9", "9:16", "1:1"]),
  recommendedStyle: z.string().min(1),
  isFeatured: z.boolean(),
});

export type PromptTemplate = z.infer<typeof promptTemplateSchema>;

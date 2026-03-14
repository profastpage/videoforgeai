import { z } from "zod";

export const clientStatusSchema = z.enum(["lead", "active", "paused", "archived"]);
export const clientIndustrySchema = z.enum([
  "ecommerce",
  "saas",
  "realEstate",
  "beauty",
  "restaurant",
  "agency",
  "localBusiness",
]);

export const localClientSchema = z.object({
  id: z.string().uuid(),
  companyName: z.string().trim().min(2).max(100),
  contactName: z.string().trim().min(2).max(100),
  email: z.string().email(),
  website: z.union([z.literal(""), z.string().url()]).default(""),
  industry: clientIndustrySchema,
  status: clientStatusSchema,
  primaryGoal: z.string().trim().min(6).max(140),
  notes: z.string().trim().max(500).default(""),
  updatedAt: z.string().datetime(),
});

export const upsertLocalClientSchema = localClientSchema.omit({
  id: true,
  updatedAt: true,
});

export type LocalClient = z.output<typeof localClientSchema>;
export type UpsertLocalClientInput = z.output<typeof upsertLocalClientSchema>;
export type UpsertLocalClientFormInput = z.input<typeof upsertLocalClientSchema>;

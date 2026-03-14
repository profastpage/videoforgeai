import { planCatalog } from "@/config/plans";
import { planSchema, type Plan } from "@/lib/schemas/billing";

export const seededPlans: Plan[] = planCatalog.map((plan) =>
  planSchema.parse(plan),
);

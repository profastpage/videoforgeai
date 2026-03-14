import { seededPlans } from "@/server/seeds/plans";

export class PlansRepository {
  async list() {
    return seededPlans;
  }

  async findById(planId: string) {
    return seededPlans.find((plan) => plan.id === planId) ?? null;
  }
}

export const plansRepository = new PlansRepository();

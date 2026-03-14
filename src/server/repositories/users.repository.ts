import type { PlanId } from "@/config/plans";
import type { AuthSession } from "@/lib/schemas/auth";
import { seededSessions } from "@/server/mock-db/users";
import { createMockSession } from "@/server/mock-db/factories";
import { env } from "@/server/env";

const sessionStore = [...seededSessions];

function getRoleForEmail(email: string): AuthSession["user"]["role"] {
  return env.SUPERADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";
}

export class UsersRepository {
  async findSessionByEmail(email: string) {
    return (
      sessionStore.find(
        (session) => session.user.email.toLowerCase() === email.toLowerCase(),
      ) ?? null
    );
  }

  async findSessionByUserId(userId: string) {
    return sessionStore.find((session) => session.user.id === userId) ?? null;
  }

  async ensureSession(input: {
    userId: string;
    email: string;
    fullName?: string | null;
    companyName?: string | null;
  }) {
    const existing =
      (await this.findSessionByUserId(input.userId)) ??
      (await this.findSessionByEmail(input.email));

    if (existing) {
      existing.user.role = getRoleForEmail(existing.user.email);
      return existing;
    }

    const session = createMockSession({
      userId: input.userId,
      email: input.email,
      fullName: input.fullName ?? "New User",
      companyName: input.companyName ?? "VideoForge Workspace",
    });

    sessionStore.unshift(session);
    return session;
  }

  async updatePlan(userId: string, planId: PlanId) {
    const existing = await this.findSessionByUserId(userId);

    if (!existing) {
      return null;
    }

    existing.planId = planId;
    return existing;
  }

  async ensureRoleByEmail(email: string) {
    const existing = await this.findSessionByEmail(email);

    if (!existing) {
      return null;
    }

    existing.user.role = getRoleForEmail(email);
    return existing;
  }
}

export const usersRepository = new UsersRepository();

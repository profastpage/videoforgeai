import { authSessionSchema } from "@/lib/schemas/auth";
import { demoSession } from "@/server/seeds/demo-user";

export const seededSessions = [demoSession].map((session) =>
  authSessionSchema.parse(session),
);

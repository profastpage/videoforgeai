import { authSessionSchema, type AuthSession } from "@/lib/schemas/auth";

export const demoSession: AuthSession = authSessionSchema.parse({
  user: {
    id: "0ed7596f-f5e7-470e-9d3a-d9e1085ed267",
    email: "alex@northstarhq.com",
    role: "admin",
  },
  profile: {
    id: "0ed7596f-f5e7-470e-9d3a-d9e1085ed267",
    fullName: "Alex Morgan",
    avatarUrl: null,
    companyName: "Northstar Commerce",
    timezone: "America/Lima",
    themePreference: "system",
  },
  planId: "pro",
  isAuthenticated: true,
});

import { z } from "zod";
import { planIdSchema } from "@/lib/schemas/billing";

export const userRoleSchema = z.enum(["user", "admin"]);

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: userRoleSchema,
});

export const profileSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1),
  avatarUrl: z.string().url().nullable(),
  companyName: z.string().min(1).nullable(),
  timezone: z.string().min(1),
  themePreference: z.enum(["light", "dark", "system"]),
});

export const authSessionSchema = z.object({
  user: userSchema,
  profile: profileSchema,
  planId: planIdSchema,
  isAuthenticated: z.boolean(),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2).max(80),
  companyName: z.string().min(2).max(80),
});

export type AuthSession = z.infer<typeof authSessionSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

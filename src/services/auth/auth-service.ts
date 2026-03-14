import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { logger } from "@/server/logger";
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/server/firebase/admin";
import { usersRepository } from "@/server/repositories/users.repository";
import { AppServiceError } from "@/lib/errors";
import { authSessionSchema, type AuthSession } from "@/lib/schemas/auth";
import { toStableAppUserId } from "@/server/auth/identity";

const FIREBASE_SESSION_COOKIE_NAME = "vf_firebase_session";
const MOCK_SESSION_COOKIE_NAME = "vf_mock_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 5;

const fallbackSessionSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1).default("New User"),
  companyName: z.string().min(1).optional(),
});

function isSecureCookie() {
  return process.env.NODE_ENV === "production";
}

function encodeMockSession(session: AuthSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decodeMockSession(value: string) {
  try {
    return authSessionSchema.parse(
      JSON.parse(Buffer.from(value, "base64url").toString("utf8")),
    );
  } catch {
    return null;
  }
}

async function setCookie(name: string, value: string) {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

async function buildAppSession(input: {
  identity: string;
  email: string;
  fullName?: string | null;
  companyName?: string | null;
}) {
  return usersRepository.ensureSession({
    userId: toStableAppUserId(input.identity),
    email: input.email,
    fullName: input.fullName ?? "VideoForge User",
    companyName: input.companyName ?? "VideoForge Workspace",
  });
}

export function isFirebaseAuthEnabled() {
  return isFirebaseAdminConfigured();
}

export async function createSessionFromFirebaseIdToken(idToken: string) {
  const adminAuth = getFirebaseAdminAuth();

  if (!adminAuth) {
    throw new AppServiceError(
      "FIREBASE_NOT_CONFIGURED",
      "Firebase Admin credentials are not configured on the server.",
      500,
    );
  }

  const [decodedToken, sessionCookie] = await Promise.all([
    adminAuth.verifyIdToken(idToken),
    adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    }),
  ]);

  const email = decodedToken.email;

  if (!email) {
    throw new AppServiceError(
      "AUTH_FAILED",
      "Firebase token did not include an email address.",
      400,
    );
  }

  const session = await buildAppSession({
    identity: decodedToken.uid,
    email,
    fullName: decodedToken.name,
  });

  await setCookie(FIREBASE_SESSION_COOKIE_NAME, sessionCookie);
  logger.info("Firebase session created", { email });
  return session;
}

export async function createFallbackSession(input: {
  email: string;
  fullName?: string;
  companyName?: string;
}) {
  const parsed = fallbackSessionSchema.parse(input);
  const session = await buildAppSession({
    identity: parsed.email,
    email: parsed.email,
    fullName: parsed.fullName,
    companyName: parsed.companyName,
  });

  await setCookie(MOCK_SESSION_COOKIE_NAME, encodeMockSession(session));
  logger.info("Fallback auth session created", { email: parsed.email });
  return session;
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const firebaseSessionCookie = cookieStore.get(FIREBASE_SESSION_COOKIE_NAME)?.value;

  if (firebaseSessionCookie && isFirebaseAdminConfigured()) {
    const adminAuth = getFirebaseAdminAuth();

    if (adminAuth) {
      try {
        const decodedToken = await adminAuth.verifySessionCookie(
          firebaseSessionCookie,
          true,
        );

        if (!decodedToken.email) {
          return null;
        }

        return buildAppSession({
          identity: decodedToken.uid,
          email: decodedToken.email,
          fullName: decodedToken.name,
        });
      } catch (error) {
        logger.warn("Firebase session verification failed", error);
      }
    }
  }

  const fallbackCookie = cookieStore.get(MOCK_SESSION_COOKIE_NAME)?.value;

  if (!fallbackCookie) {
    return null;
  }

  const fallbackSession = decodeMockSession(fallbackCookie);

  if (!fallbackSession) {
    return null;
  }

  return (
    (await usersRepository.findSessionByUserId(fallbackSession.user.id)) ??
    fallbackSession
  );
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await requireSession();

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return session;
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(FIREBASE_SESSION_COOKIE_NAME);
  cookieStore.delete(MOCK_SESSION_COOKIE_NAME);
}

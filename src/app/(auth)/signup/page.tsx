"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export default function SignupPage() {
  const { locale } = useLocale();
  const copy =
    locale === "es"
      ? {
          eyebrow: "Empieza gratis",
          title: "Crea tu workspace en VideoForge AI.",
          description:
            "Lanza un workspace de video IA pulido para tu equipo en minutos con planes Free, Pro y Business.",
          footerPrefix: "Ya tienes cuenta?",
          footerAction: "Inicia sesion",
        }
      : {
          eyebrow: "Start free",
          title: "Create your VideoForge AI workspace.",
          description:
            "Launch a polished AI video workspace for your team in minutes with Free, Pro and Business plans.",
          footerPrefix: "Already have an account?",
          footerAction: "Sign in",
        };

  return (
    <AuthSplitLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      footer={
        <p className="text-sm text-muted-foreground">
          {copy.footerPrefix}{" "}
          <Link href="/login" className="font-semibold text-primary">
            {copy.footerAction}
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthSplitLayout>
  );
}

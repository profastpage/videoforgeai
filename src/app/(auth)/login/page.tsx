"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export default function LoginPage() {
  const { locale } = useLocale();
  const copy =
    locale === "es"
      ? {
          eyebrow: "Bienvenido de nuevo",
          title: "Inicia sesion para seguir generando videos IA listos para negocio.",
          description:
            "Usa email y contrasena hoy. Magic link y social auth quedan preparados en la capa de auth.",
          footerPrefix: "No tienes cuenta?",
          footerAction: "Crea una",
        }
      : {
          eyebrow: "Welcome back",
          title: "Sign in to continue generating commercial-ready AI videos.",
          description:
            "Use email and password today. Magic link and social auth are prepared in the auth service layer.",
          footerPrefix: "Don't have an account?",
          footerAction: "Create one",
        };

  return (
    <AuthSplitLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      footer={
        <p className="text-sm text-muted-foreground">
          {copy.footerPrefix}{" "}
          <Link href="/signup" className="font-semibold text-primary">
            {copy.footerAction}
          </Link>
        </p>
      }
    >
      <SignInForm />
    </AuthSplitLayout>
  );
}

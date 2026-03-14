"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getFirebaseClientAuth } from "@/lib/firebase/client";
import { getFirebaseClientConfig } from "@/lib/firebase/config";
import { signUpSchema, type SignUpInput } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function createServerSession(payload: {
  idToken?: string;
  email: string;
  fullName: string;
  companyName: string;
}) {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { isConfigured } = getFirebaseClientConfig();
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "Alex Morgan",
      companyName: "Northstar Commerce",
      email: "alex@northstarhq.com",
      password: "password123",
    },
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = form;

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      try {
        if (isConfigured) {
          const auth = getFirebaseClientAuth();

          if (!auth) {
            throw new Error("Firebase client configuration is incomplete.");
          }

          const credentials = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password,
          );
          await updateProfile(credentials.user, {
            displayName: values.fullName,
          });
          const idToken = await credentials.user.getIdToken(true);
          const result = await createServerSession({
            idToken,
            email: values.email,
            fullName: values.fullName,
            companyName: values.companyName,
          });

          if (result.error) {
            toast.error(result.error.message);
            return;
          }
        } else {
          const result = await createServerSession({
            email: values.email,
            fullName: values.fullName,
            companyName: values.companyName,
          });

          if (result.error) {
            toast.error(result.error.message);
            return;
          }
        }

        router.push("/dashboard");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not create the workspace.",
        );
      }
    });
  });

  return (
    <Card className="rounded-[32px]">
      <CardHeader>
        <CardTitle>Create workspace</CardTitle>
        <CardDescription>
          Firebase Auth creates the identity, then the server issues a secure app session for the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" placeholder="Alex Morgan" {...register("fullName")} />
              {errors.fullName ? (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company</Label>
              <Input id="companyName" placeholder="Northstar Commerce" {...register("companyName")} />
              {errors.companyName ? (
                <p className="text-sm text-destructive">{errors.companyName.message}</p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Choose a password" {...register("password")} />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : null}
          </div>
          <Button className="w-full justify-center" disabled={isPending} type="submit">
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Creating workspace
              </>
            ) : (
              <>
                Launch VideoForge AI
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

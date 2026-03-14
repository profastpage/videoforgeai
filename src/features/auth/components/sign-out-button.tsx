"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut as firebaseSignOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { getFirebaseClientAuth } from "@/lib/firebase/client";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { copy } = useLocale();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          try {
            const auth = getFirebaseClientAuth();

            if (auth) {
              await firebaseSignOut(auth);
            }

            await fetch("/api/auth/logout", {
              method: "POST",
            });

            router.push("/");
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : copy.auth.signOutError,
            );
          }
        });
      }}
    >
      <LogOut className="h-4 w-4" />
      {copy.auth.signOut}
    </Button>
  );
}

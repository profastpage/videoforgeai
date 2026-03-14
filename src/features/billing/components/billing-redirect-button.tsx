"use client";

import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type BillingRedirectButtonProps = {
  endpoint: "/api/billing/checkout" | "/api/billing/portal";
  payload?: Record<string, unknown>;
  idleLabel: string;
  pendingLabel: string;
  disabled?: boolean;
  variant?: "default" | "outline";
  className?: string;
};

type BillingResponse = {
  data: {
    url: string;
    mode: "checkout" | "portal";
  } | null;
  error: {
    code: string;
    message: string;
  } | null;
};

export function BillingRedirectButton({
  endpoint,
  payload,
  idleLabel,
  pendingLabel,
  disabled,
  variant = "default",
  className,
}: BillingRedirectButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: payload
            ? {
                "Content-Type": "application/json",
              }
            : undefined,
          body: payload ? JSON.stringify(payload) : undefined,
        });
        const result = (await response.json()) as BillingResponse;

        if (!response.ok || result.error || !result.data?.url) {
          toast.error(result.error?.message ?? "Billing redirect could not be created.");
          return;
        }

        window.location.assign(result.data.url);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Billing redirect failed.",
        );
      }
    });
  }

  return (
    <Button
      className={className}
      disabled={disabled || isPending}
      type="button"
      variant={variant}
      onClick={handleClick}
    >
      {isPending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        idleLabel
      )}
    </Button>
  );
}

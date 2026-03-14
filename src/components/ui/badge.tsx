import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        primary: "border-transparent bg-primary/12 text-primary dark:bg-primary/18",
        accent: "border-transparent bg-accent/12 text-accent dark:bg-accent/18",
        success: "border-transparent bg-success/12 text-success dark:bg-success/18",
        warning: "border-transparent bg-warning/12 text-warning dark:bg-warning/18",
        destructive:
          "border-transparent bg-destructive/12 text-destructive dark:bg-destructive/18",
        outline: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

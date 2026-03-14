import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  description: string;
};

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

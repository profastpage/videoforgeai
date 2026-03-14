import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ErrorStateProps = {
  title: string;
  description: string;
};

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <Card>
      <CardContent className="flex gap-4 p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/12 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

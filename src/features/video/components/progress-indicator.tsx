import { Progress } from "@/components/ui/progress";

type ProgressIndicatorProps = {
  value: number;
  label: string;
};

export function ProgressIndicator({ value, label }: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

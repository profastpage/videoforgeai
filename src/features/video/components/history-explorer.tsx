"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import {
  cancelGenerationAction,
  duplicateGenerationAction,
  refreshGenerationStatusAction,
} from "@/features/video/actions";
import type { VideoCardGeneration } from "@/features/video/components/video-card";
import { VideoCard } from "@/features/video/components/video-card";
import { EmptyState } from "@/features/shared/components/empty-state";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getGenerationStatusLabel } from "@/lib/i18n/dashboard-formatters";

type HistoryExplorerProps = {
  generations: VideoCardGeneration[];
};

export function HistoryExplorer({ generations }: HistoryExplorerProps) {
  const { copy } = useLocale();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isPending, startTransition] = useTransition();

  const filtered = generations.filter((generation) => {
    const matchesSearch =
      generation.projectName.toLowerCase().includes(search.toLowerCase()) ||
      generation.prompt.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || generation.status === status;

    return matchesSearch && matchesStatus;
  });

  async function handleAction(action: "refresh" | "duplicate" | "cancel", generationId: string) {
    startTransition(async () => {
      const result =
        action === "refresh"
          ? await refreshGenerationStatusAction(generationId)
          : action === "duplicate"
            ? await duplicateGenerationAction(generationId)
            : await cancelGenerationAction(generationId);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        action === "refresh"
          ? copy.video.history.refreshSuccess
          : action === "duplicate"
            ? copy.video.history.duplicateSuccess
            : copy.video.history.cancelSuccess,
      );
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={copy.video.history.searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={copy.video.history.statusPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{getGenerationStatusLabel(copy, "all")}</SelectItem>
              <SelectItem value="queued">{getGenerationStatusLabel(copy, "queued")}</SelectItem>
              <SelectItem value="processing">{getGenerationStatusLabel(copy, "processing")}</SelectItem>
              <SelectItem value="completed">{getGenerationStatusLabel(copy, "completed")}</SelectItem>
              <SelectItem value="failed">{getGenerationStatusLabel(copy, "failed")}</SelectItem>
              <SelectItem value="cancelled">{getGenerationStatusLabel(copy, "cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={copy.video.history.noGenerationsTitle}
          description={copy.video.history.noGenerationsDescription}
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {filtered.map((generation) => (
            <div key={generation.id} className="space-y-3">
              <VideoCard generation={generation} />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={() => handleAction("refresh", generation.id)}
                >
                  {copy.video.history.refreshStatus}
                </Button>
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={() => handleAction("duplicate", generation.id)}
                >
                  {copy.video.history.duplicate}
                </Button>
                {["queued", "processing"].includes(generation.status) ? (
                  <Button
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleAction("cancel", generation.id)}
                  >
                    {copy.video.history.cancel}
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

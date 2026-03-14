"use client";

import Link from "next/link";
import { Download, PlayCircle, RefreshCcw } from "lucide-react";
import type { VideoGenerationView } from "@/services/video/video-service";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressIndicator } from "@/features/video/components/progress-indicator";
import { getGenerationStatusLabel } from "@/lib/i18n/dashboard-formatters";

export type VideoCardGeneration = VideoGenerationView;

type VideoCardProps = {
  generation: VideoCardGeneration;
};

export function VideoCard({ generation }: VideoCardProps) {
  const { copy } = useLocale();
  const statusVariant =
    generation.status === "completed"
      ? "success"
      : generation.status === "failed"
        ? "destructive"
        : "outline";

  return (
    <Card className="min-w-0 overflow-hidden">
      <div className="aspect-video bg-slate-950">
        <video
          className="h-full w-full object-cover"
          src={generation.previewUrl ?? undefined}
          muted
          loop
          playsInline
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle>{generation.projectName}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusVariant}>{getGenerationStatusLabel(copy, generation.status)}</Badge>
              <Badge variant="outline">{generation.aspectRatio}</Badge>
              <Badge variant="outline">{generation.resolution}</Badge>
            </div>
          </div>
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {generation.durationSeconds}s
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {generation.prompt}
        </p>
        {generation.status !== "completed" ? (
          <ProgressIndicator label={copy.video.card.progress} value={generation.progress} />
        ) : null}
      </CardContent>
      <CardFooter className="gap-2">
        {generation.previewUrl ? (
          <Button asChild variant="outline" className="flex-1">
            <Link href={generation.previewUrl} target="_blank">
              <PlayCircle className="h-4 w-4" />
              {copy.video.card.preview}
            </Link>
          </Button>
        ) : null}
        {generation.downloadUrl ? (
          <Button asChild className="flex-1">
            <Link href={generation.downloadUrl} target="_blank">
              <Download className="h-4 w-4" />
              {copy.video.card.download}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="flex-1" disabled>
            <RefreshCcw className="h-4 w-4" />
            {copy.video.card.processing}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

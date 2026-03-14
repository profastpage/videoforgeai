"use client";

import { ImagePlus } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";

type UploadZoneProps = {
  onSelectMock: (url: string) => void;
  selectedUrl?: string;
};

export function UploadZone({ onSelectMock, selectedUrl }: UploadZoneProps) {
  const { copy } = useLocale();

  return (
    <div className="rounded-[24px] border border-dashed border-border bg-background/50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ImagePlus className="h-4 w-4 text-primary" />
            {copy.video.upload.title}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {copy.video.upload.description}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            onSelectMock(
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
            )
          }
        >
          {copy.video.upload.useMockImage}
        </Button>
      </div>
      {selectedUrl ? (
        <div className="mt-4 overflow-hidden rounded-[22px] border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selectedUrl} alt={copy.video.upload.mockImageAlt} className="h-48 w-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}

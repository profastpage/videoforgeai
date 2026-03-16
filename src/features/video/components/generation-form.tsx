"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Sparkles, Wand2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useLocale } from "@/components/providers/locale-provider";
import { videoAspectRatios, videoDurations, videoGenerationTypes, videoResolutions, videoStyles } from "@/config/video";
import { createVideoGenerationAction } from "@/features/video/actions";
import { CreditBadge } from "@/features/billing/components/credit-badge";
import { PromptTemplates } from "@/features/video/components/prompt-templates";
import { UploadZone } from "@/features/video/components/upload-zone";
import type { PromptTemplate } from "@/lib/schemas/prompt";
import type { EnhancedVideoBrief } from "@/lib/schemas/video-brief";
import {
  createVideoGenerationSchema,
  type CreateVideoGenerationInput,
} from "@/lib/schemas/video";
import { estimateGenerationCredits } from "@/services/billing/billing-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type GenerationFormProps = {
  templates: PromptTemplate[];
  availableCredits: number;
};

export function GenerationForm({
  templates,
  availableCredits,
}: GenerationFormProps) {
  const { copy, locale } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEnhancing, startEnhancing] = useTransition();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>();
  const [idea, setIdea] = useState("");
  const [enhancedBrief, setEnhancedBrief] = useState<EnhancedVideoBrief | null>(null);
  const form = useForm<CreateVideoGenerationInput>({
    resolver: zodResolver(createVideoGenerationSchema),
    defaultValues: {
      projectName: copy.video.form.defaultProjectName,
      prompt: copy.video.form.defaultPrompt,
      negativePrompt: copy.video.form.defaultNegativePrompt,
      generationType: "text-to-video",
      aspectRatio: "9:16",
      resolution: "720p",
      durationSeconds: 10,
      style: "performance-ads",
      templateSlug: templates[0]?.slug,
      sourceImageUrl: undefined,
    },
  });

  const values = useWatch({
    control: form.control,
  }) as CreateVideoGenerationInput;
  const estimatedCredits = estimateGenerationCredits(values);

  const onSubmit = form.handleSubmit((input) => {
    startTransition(async () => {
      const result = await createVideoGenerationAction(input);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success(copy.video.form.queuedSuccess);
      router.push("/dashboard/history");
      router.refresh();
    });
  });

  function applyTemplate(template: PromptTemplate) {
    form.setValue("templateSlug", template.slug);
    form.setValue("prompt", template.prompt);
    form.setValue("aspectRatio", template.recommendedAspectRatio);
    form.setValue("style", template.recommendedStyle as CreateVideoGenerationInput["style"]);
  }

  function applyEnhancedBrief(brief: EnhancedVideoBrief) {
    form.setValue("projectName", brief.projectName, { shouldDirty: true, shouldValidate: true });
    form.setValue("prompt", brief.prompt, { shouldDirty: true, shouldValidate: true });
    form.setValue("negativePrompt", brief.negativePrompt, { shouldDirty: true, shouldValidate: true });
    form.setValue("style", brief.style, { shouldDirty: true, shouldValidate: true });
    form.setValue("aspectRatio", brief.aspectRatio, { shouldDirty: true, shouldValidate: true });
    form.setValue("durationSeconds", brief.durationSeconds as CreateVideoGenerationInput["durationSeconds"], { shouldDirty: true, shouldValidate: true });
    setEnhancedBrief(brief);
  }

  function handleEnhanceIdea() {
    if (idea.trim().length < 10) {
      toast.error(copy.video.form.ideaRequired);
      return;
    }

    startEnhancing(async () => {
      try {
        const response = await fetch("/api/video-brief/enhance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea,
            locale,
            generationType: values.generationType,
            preferredAspectRatio: values.aspectRatio,
            preferredDurationSeconds: values.durationSeconds,
          }),
        });

        const payload = (await response.json()) as
          | { data: { brief: EnhancedVideoBrief }; error: null }
          | { data: null; error: { code: string; message: string } };

        if (!response.ok || payload.error || !payload.data?.brief) {
          toast.error(payload.error?.message ?? copy.video.form.improveFailed);
          return;
        }

        applyEnhancedBrief(payload.data.brief);
        toast.success(copy.video.form.briefReady);
      } catch {
        toast.error(copy.video.form.improveFailed);
      }
    });
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>{copy.video.form.title}</CardTitle>
              <CardDescription>
                {copy.video.form.description}
              </CardDescription>
            </div>
            <CreditBadge credits={availableCredits} />
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="rounded-[24px] border border-border bg-background/40 p-4 sm:p-5">
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Wand2 className="h-4 w-4 text-primary" />
                    {copy.video.form.aiAssistantTitle}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {copy.video.form.aiAssistantDescription}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coreIdea">{copy.video.form.idea}</Label>
                  <Textarea
                    id="coreIdea"
                    className="min-h-[108px]"
                    placeholder={copy.video.form.ideaPlaceholder}
                    value={idea}
                    onChange={(event) => setIdea(event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="button" variant="outline" onClick={handleEnhanceIdea} disabled={isEnhancing}>
                    {isEnhancing ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        {copy.video.form.improvingWithAi}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {copy.video.form.improveWithAi}
                      </>
                    )}
                  </Button>
                  {enhancedBrief ? (
                    <div className="text-sm text-muted-foreground">
                      {copy.video.form.aiOutputDescription}
                    </div>
                  ) : null}
                </div>
                {enhancedBrief ? (
                  <div className="space-y-3 rounded-[22px] border border-border bg-background/60 p-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {copy.video.form.aiOutputTitle}
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {copy.video.form.hook}
                        </div>
                        <p className="text-sm leading-6">{enhancedBrief.hook}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {copy.video.form.cta}
                        </div>
                        <p className="text-sm leading-6">{enhancedBrief.callToAction}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {copy.video.form.aiOutputDescription}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectName">{copy.video.form.projectName}</Label>
              <Input id="projectName" {...form.register("projectName")} />
              {form.formState.errors.projectName ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.projectName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt">{copy.video.form.prompt}</Label>
              <Textarea id="prompt" {...form.register("prompt")} />
              {form.formState.errors.prompt ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.prompt.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="negativePrompt">{copy.video.form.negativePrompt}</Label>
              <Textarea
                id="negativePrompt"
                className="min-h-[96px]"
                {...form.register("negativePrompt")}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-2">
                <Label>{copy.video.form.type}</Label>
                <Select
                  value={values.generationType}
                  onValueChange={(value) =>
                    form.setValue(
                      "generationType",
                      value as CreateVideoGenerationInput["generationType"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {videoGenerationTypes.map((item) => (
                      <SelectItem key={item} value={item}>
                        {copy.video.generationTypes[item]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{copy.video.form.aspectRatio}</Label>
                <Select
                  value={values.aspectRatio}
                  onValueChange={(value) =>
                    form.setValue("aspectRatio", value as CreateVideoGenerationInput["aspectRatio"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {videoAspectRatios.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{copy.video.form.resolution}</Label>
                <Select
                  value={values.resolution}
                  onValueChange={(value) =>
                    form.setValue("resolution", value as CreateVideoGenerationInput["resolution"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {videoResolutions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{copy.video.form.style}</Label>
                <Select
                  value={values.style}
                  onValueChange={(value) =>
                    form.setValue("style", value as CreateVideoGenerationInput["style"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {videoStyles.map((item) => (
                      <SelectItem key={item} value={item}>
                        {copy.video.styles[item]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationSeconds">{copy.video.form.duration}</Label>
                <Select
                  value={values.durationSeconds.toString()}
                  onValueChange={(value) =>
                    form.setValue("durationSeconds", Number(value) as CreateVideoGenerationInput["durationSeconds"])
                  }
                >
                  <SelectTrigger id="durationSeconds">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {videoDurations.map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration}s
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {values.generationType === "image-to-video" ? (
              <UploadZone
                selectedUrl={selectedImageUrl}
                onSelect={(url) => {
                  setSelectedImageUrl(url);
                  form.setValue("sourceImageUrl", url);
                }}
              />
            ) : null}
            <div className="flex flex-col gap-4 rounded-[24px] border border-border bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{copy.video.form.estimatedConsumption}</Badge>
                  <CreditBadge credits={estimatedCredits} />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {copy.video.form.creditsDescription}
                </p>
              </div>
              <Button disabled={isPending || estimatedCredits > availableCredits} type="submit">
                {isPending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    {copy.video.form.queueing}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {copy.video.form.generateVideo}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{copy.video.form.promptTemplatesTitle}</CardTitle>
            <CardDescription>
              {copy.video.form.promptTemplatesDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PromptTemplates templates={templates} onSelect={applyTemplate} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

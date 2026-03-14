import { videoTemplateSchema, type VideoTemplate } from "@/lib/contracts/video";

export const videoTemplates: VideoTemplate[] = [
  {
    id: "launch-spotlight",
    name: "Launch Spotlight",
    category: "Product launch",
    description:
      "Turn a release announcement into a crisp product teaser with UI reveals and measured motion.",
    hook: "Announce the launch with confident pacing and sharp feature framing.",
    durationSeconds: 18,
    aspectRatio: "9:16",
    provider: "mock",
    tags: ["Launch", "Mobile", "B2B"],
    gradientFrom: "#0f766e",
    gradientTo: "#123b51",
  },
  {
    id: "pipeline-recap",
    name: "Pipeline Recap",
    category: "Sales enablement",
    description:
      "Summarize pipeline movement and momentum for weekly sales leadership updates.",
    hook: "Show velocity, win themes, and next-step urgency in one executive-ready cut.",
    durationSeconds: 24,
    aspectRatio: "16:9",
    provider: "mock",
    tags: ["Sales", "Reporting", "Executive"],
    gradientFrom: "#c26d3c",
    gradientTo: "#7a2e1d",
  },
  {
    id: "case-study-cutdown",
    name: "Case Study Cutdown",
    category: "Customer proof",
    description:
      "Distill a customer story into a short social-ready proof asset with one strong CTA.",
    hook: "Lead with outcome metrics, then pivot into the before-and-after story.",
    durationSeconds: 22,
    aspectRatio: "1:1",
    provider: "mock",
    tags: ["Proof", "Social", "Demand gen"],
    gradientFrom: "#174b8a",
    gradientTo: "#0f1f3d",
  },
  {
    id: "event-follow-up",
    name: "Event Follow-up",
    category: "Event marketing",
    description:
      "Package booth highlights, executive clips, and key messages into a post-event recap.",
    hook: "Open with the crowd energy, then land on the most relevant next action.",
    durationSeconds: 20,
    aspectRatio: "16:9",
    provider: "mock",
    tags: ["Events", "Recap", "Field marketing"],
    gradientFrom: "#587146",
    gradientTo: "#172f23",
  },
].map((template) => videoTemplateSchema.parse(template));

export function findVideoTemplateById(templateId: string) {
  return videoTemplates.find((template) => template.id === templateId) ?? null;
}

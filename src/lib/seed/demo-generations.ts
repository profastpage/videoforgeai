import {
  videoGenerationSchema,
  type VideoGeneration,
} from "@/lib/contracts/video";

export const demoVideoGenerations: VideoGeneration[] = [
  {
    id: "gen_demo_001",
    userId: "demo-alex@northstarhq.com",
    templateId: "launch-spotlight",
    title: "Q2 Launch Spotlight",
    prompt:
      "Create a vertical teaser for revenue leaders announcing the Q2 release with clean UI motion, restrained typography, and confident pacing.",
    targetAudience: "Revenue leaders at mid-market SaaS teams",
    cta: "Book a strategy demo",
    aspectRatio: "9:16",
    provider: "mock",
    status: "ready",
    durationSeconds: 18,
    creditsUsed: 18,
    createdAt: "2026-03-11T04:10:00.000Z",
    updatedAt: "2026-03-11T04:12:00.000Z",
    summary:
      "Feature-first teaser that opens on the new workflow, then transitions into a CTA frame.",
    assetUrl: "demo://renders/q2-launch-spotlight-9x16.mp4",
  },
  {
    id: "gen_demo_002",
    userId: "demo-alex@northstarhq.com",
    templateId: "pipeline-recap",
    title: "Weekly Pipeline Recap",
    prompt:
      "Build a widescreen recap for the revenue leadership standup using strong callouts, deal momentum visuals, and one closing action.",
    targetAudience: "VPs of sales and revenue operations",
    cta: "Open the board review",
    aspectRatio: "16:9",
    provider: "mock",
    status: "ready",
    durationSeconds: 24,
    creditsUsed: 24,
    createdAt: "2026-03-10T16:25:00.000Z",
    updatedAt: "2026-03-10T16:29:00.000Z",
    summary:
      "Executive recap with pipeline gains, win themes, and an end card for the board review.",
    assetUrl: "demo://renders/weekly-pipeline-recap-16x9.mp4",
  },
  {
    id: "gen_demo_003",
    userId: "demo-alex@northstarhq.com",
    templateId: "case-study-cutdown",
    title: "Customer Proof Cutdown",
    prompt:
      "Turn the customer win story into a square social cut with the outcome metric first and the before-and-after narrative second.",
    targetAudience: "Performance marketers and account executives",
    cta: "Watch the full story",
    aspectRatio: "1:1",
    provider: "mock",
    status: "rendering",
    durationSeconds: 22,
    creditsUsed: 0,
    createdAt: "2026-03-11T06:30:00.000Z",
    updatedAt: "2026-03-11T06:31:00.000Z",
    summary:
      "Render queued for a square social proof asset with metric-led framing and tighter pacing.",
  },
].map((generation) => videoGenerationSchema.parse(generation));

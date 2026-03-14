import type { LocalClient } from "@/lib/schemas/client";

export const seededLocalClients: LocalClient[] = [
  {
    id: "c148b7e2-1ca9-4572-918d-0dcb7be91f13",
    companyName: "Northstar Commerce",
    contactName: "Alex Morgan",
    email: "alex@northstarhq.com",
    website: "https://northstar.example",
    industry: "ecommerce",
    status: "active",
    primaryGoal: "Launch weekly performance creatives for paid social and retention flows.",
    notes:
      "Prefers concise hooks, premium visuals and strong CTA framing for 9:16 campaigns.",
    updatedAt: "2026-03-11T06:00:00.000Z",
  },
  {
    id: "75d44f0f-f2fe-46e5-b160-3f0af12e944d",
    companyName: "Apex Homes",
    contactName: "Mia Carter",
    email: "mia@apexhomes.example",
    website: "https://apexhomes.example",
    industry: "realEstate",
    status: "lead",
    primaryGoal: "Create luxury property walk-through promos for reels and listing campaigns.",
    notes:
      "Wants elegant pacing and neighborhood proof points. Mobile-first previews are important.",
    updatedAt: "2026-03-10T15:30:00.000Z",
  },
];

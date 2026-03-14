const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000"
    : "https://videoforge.ai");

export const siteConfig = {
  name: "VideoForge AI",
  description:
    "Create premium AI videos in seconds for ads, sales, ecommerce, social media, and content teams.",
  url: appUrl,
  keywords: [
    "AI video generator",
    "marketing videos",
    "sales enablement",
    "social video creation",
    "ecommerce video ads",
    "SaaS video platform",
  ],
  links: {
    twitter: "https://x.com/videoforgeai",
    docs: `${appUrl}/docs`,
    support: "mailto:support@videoforge.ai",
  },
} as const;

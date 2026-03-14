import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/login",
    "/signup",
    "/dashboard",
    "/dashboard/create",
    "/dashboard/history",
    "/dashboard/billing",
    "/dashboard/templates",
    "/dashboard/settings",
    "/dashboard/admin",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));
}

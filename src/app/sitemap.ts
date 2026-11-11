import type { MetadataRoute } from "next";
import { resume } from "@/data/resume";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: resume.lastUpdated, changeFrequency: "monthly", priority: 1 }];
}

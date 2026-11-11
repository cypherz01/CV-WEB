import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Note: on a GitHub Pages project site this is served at /CV-WEB/robots.txt, not the domain root,
// so crawlers only honour it once the site moves to its own domain (M5).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}sitemap.xml`,
  };
}

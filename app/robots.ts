import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/blog";
import { robotsDisallowPaths } from "@/lib/seo-config";

export default function robots(): MetadataRoute.Robots {
  return {
    // The wildcard intentionally covers every search and AI crawler, including future bots.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...robotsDisallowPaths],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

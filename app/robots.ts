import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/blog";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/"]
      },
      {
        userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "GPTBot", "PerplexityBot", "ClaudeBot"],
        allow: "/",
        disallow: ["/api/", "/dashboard/"]
      }
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/sitemap-listings-1.xml`,
      `${siteUrl}/sitemap-blog.xml`,
      `${siteUrl}/sitemap-categories.xml`,
    ],
    host: siteUrl
  };
}

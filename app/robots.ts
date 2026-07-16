import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/blog";
import { robotsDisallowPaths } from "@/lib/seo-config";

/**
 * Search + AI-citation crawlers get an explicit, auditable Allow rule on top of the wildcard
 * below (which already permits them) — this documents that access is a deliberate decision, not
 * an accident of an open wildcard, and leaves a place to later differentiate citation crawlers
 * from training-only scrapers (CCBot, anthropic-ai, cohere-ai) if that becomes a requirement.
 */
const explicitlyAllowedBots = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...explicitlyAllowedBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: [...robotsDisallowPaths],
      })),
      // The wildcard intentionally covers every other search and AI crawler, including future bots.
      {
        userAgent: "*",
        allow: "/",
        disallow: [...robotsDisallowPaths],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

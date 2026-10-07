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
  // Search engines
  "Googlebot",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  "YandexBot",
  // AI search, citation and user-initiated fetchers
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "DuckAssistBot",
  "MistralAI-User",
  "Amazonbot",
  // AI model crawlers and opt-in tokens
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
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

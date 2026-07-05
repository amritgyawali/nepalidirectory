/**
 * Seed trend sources (prompt §8.1). Real feed paths drift over time — verify at build time per
 * the source's own hard rule (prompt §20.11); fetchers are tolerant to failure regardless.
 */
import type { NewTrendSource } from "../types";

export const SEED_TREND_SOURCES: NewTrendSource[] = [
  { name: "OnlineKhabar English", kind: "rss", url: "https://english.onlinekhabar.com/feed", region: "NP", active: true },
  { name: "OnlineKhabar Nepali", kind: "rss", url: "https://www.onlinekhabar.com/feed", region: "NP", active: true },
  { name: "Kathmandu Post", kind: "rss", url: "https://kathmandupost.com/rss", region: "NP", active: true },
  { name: "Setopati", kind: "rss", url: "https://en.setopati.com/feed", region: "NP", active: true },
  { name: "Ratopati", kind: "rss", url: "https://ratopati.com/feed", region: "NP", active: true },
  { name: "My Republica", kind: "rss", url: "https://myrepublica.nagariknetwork.com/rss", region: "NP", active: true },
  { name: "The Himalayan Times", kind: "rss", url: "https://thehimalayantimes.com/feed", region: "NP", active: true },
  { name: "Reddit r/Nepal", kind: "reddit", url: "https://www.reddit.com/r/Nepal/hot.json?limit=50", region: "NP", active: true },
  { name: "YouTube Trending NP", kind: "youtube", url: "https://www.googleapis.com/youtube/v3/videos?chart=mostPopular&regionCode=NP", region: "NP", active: true },
  { name: "Google Trends NP", kind: "gtrends", url: "https://trends.google.com/trending/rss?geo=NP", region: "NP", active: false },
];

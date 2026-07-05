/**
 * Trend source fetchers (prompt §8.1). Every fetcher is tolerant to failure — a broken feed or
 * missing API key returns an empty list rather than throwing, so one bad source never blocks the
 * `TREND_SCAN` sweep. `fetchFn` is injectable so this is testable with zero network.
 */
import type { FetchFn } from "../../ai-core";
import type { TrendSource } from "../types";

export type FetchedItem = { title: string; url: string; summary?: string; publishedAt?: Date };

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function tag(block: string, name: string): string | undefined {
  const m = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i").exec(block);
  return m ? decodeEntities(m[1]) : undefined;
}

/** Minimal RSS/Atom `<item>`/`<entry>` parser — enough for headline + link + summary + date. */
export function parseRss(xml: string): FetchedItem[] {
  const items: FetchedItem[] = [];
  const blocks = xml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) ?? xml.match(/<entry[^>]*>[\s\S]*?<\/entry>/gi) ?? [];
  for (const block of blocks) {
    const title = tag(block, "title");
    let url = tag(block, "link");
    if (!url) {
      const href = /<link[^>]*href=["']([^"']+)["']/i.exec(block);
      url = href?.[1];
    }
    if (!title || !url) continue;
    const summary = tag(block, "description") ?? tag(block, "summary");
    const pub = tag(block, "pubDate") ?? tag(block, "published") ?? tag(block, "updated");
    const publishedAt = pub ? new Date(pub) : undefined;
    items.push({ title, url, summary, publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : undefined });
  }
  return items;
}

async function fetchRss(url: string, fetchFn: FetchFn): Promise<FetchedItem[]> {
  const res = await fetchFn(url, { headers: { "user-agent": "NepaliDirectoryBot/1.0" } });
  if (!res.ok) throw new Error(`rss fetch ${res.status}`);
  return parseRss(await res.text());
}

type RedditListing = {
  data?: { children?: { data?: { title?: string; permalink?: string; url?: string; created_utc?: number; selftext?: string } }[] };
};

async function fetchReddit(url: string, fetchFn: FetchFn): Promise<FetchedItem[]> {
  const res = await fetchFn(url, { headers: { "user-agent": "NepaliDirectoryBot/1.0 (by /u/nepalidirectory)" } });
  if (!res.ok) throw new Error(`reddit fetch ${res.status}`);
  const json = (await res.json()) as RedditListing;
  const children = json.data?.children ?? [];
  return children
    .map((c) => c.data)
    .filter((d): d is NonNullable<typeof d> => Boolean(d?.title && (d.permalink || d.url)))
    .map((d) => ({
      title: d.title as string,
      url: d.permalink ? `https://www.reddit.com${d.permalink}` : (d.url as string),
      summary: d.selftext?.slice(0, 500),
      publishedAt: d.created_utc ? new Date(d.created_utc * 1000) : undefined,
    }));
}

type YouTubeList = {
  items?: { id?: string; snippet?: { title?: string; description?: string; publishedAt?: string } }[];
};

async function fetchYoutube(url: string, fetchFn: FetchFn, apiKey?: string): Promise<FetchedItem[]> {
  if (!apiKey) return []; // optional key (prompt §8.1) — skip silently, not a failure
  const withKey = `${url}${url.includes("?") ? "&" : "?"}key=${apiKey}`;
  const res = await fetchFn(withKey);
  if (!res.ok) throw new Error(`youtube fetch ${res.status}`);
  const json = (await res.json()) as YouTubeList;
  return (json.items ?? [])
    .filter((it) => it.id && it.snippet?.title)
    .map((it) => ({
      title: it.snippet!.title as string,
      url: `https://www.youtube.com/watch?v=${it.id}`,
      summary: it.snippet?.description?.slice(0, 500),
      publishedAt: it.snippet?.publishedAt ? new Date(it.snippet.publishedAt) : undefined,
    }));
}

export type FetcherDeps = { fetchFn: FetchFn; youtubeApiKey?: string };

/** Fetch one source; NEVER throws — returns [] on any failure (network, parse, missing key). */
export async function fetchTrendSource(source: TrendSource, deps: FetcherDeps): Promise<FetchedItem[]> {
  try {
    switch (source.kind) {
      case "rss":
      case "gtrends":
        return await fetchRss(source.url, deps.fetchFn);
      case "reddit":
        return await fetchReddit(source.url, deps.fetchFn);
      case "youtube":
        return await fetchYoutube(source.url, deps.fetchFn, deps.youtubeApiKey);
      default:
        return [];
    }
  } catch {
    return [];
  }
}

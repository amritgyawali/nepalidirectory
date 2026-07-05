/**
 * Polite enrichment crawler (prompt sec. 6.4, Tier 4). Respects robots.txt, identifies as
 * NepaliDirectoryBot, throttles to 1 request / 2s per host, and caches raw HTML ~30 days. Only
 * ever fetches a URL already attached to a listing — it never discovers/crawls the open web.
 *
 * fetch, clock, and sleep are injectable so the whole flow is testable with zero network.
 */
import type { FetchFn } from "../../ai-core";
import type { CrawlCacheRepository } from "../stores/crawl-cache";
import { isAllowed, parseRobots, type RobotsGroup } from "./robots";
import { extractJsonLd, extractMainText } from "./extract";

export type CrawlResult = {
  url: string;
  allowedByRobots: boolean;
  fromCache: boolean;
  html: string;
  text: string;
  jsonLd: unknown[];
};

export type CrawlerDeps = {
  cache: CrawlCacheRepository;
  fetchFn?: FetchFn;
  userAgent?: string;
  minIntervalMs?: number;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
};

export class Crawler {
  private readonly cache: CrawlCacheRepository;
  private readonly fetchFn: FetchFn;
  private readonly userAgent: string;
  private readonly minIntervalMs: number;
  private readonly now: () => number;
  private readonly sleep: (ms: number) => Promise<void>;
  private readonly robotsByHost = new Map<string, RobotsGroup[]>();
  private readonly lastFetchByHost = new Map<string, number>();

  constructor(deps: CrawlerDeps) {
    this.cache = deps.cache;
    this.fetchFn = deps.fetchFn ?? fetch;
    this.userAgent = deps.userAgent ?? "NepaliDirectoryBot/1.0 (+https://www.nepalidirectory.com/bot)";
    this.minIntervalMs = deps.minIntervalMs ?? 2000;
    this.now = deps.now ?? (() => Date.now());
    this.sleep = deps.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  }

  private async robotsFor(origin: string): Promise<RobotsGroup[]> {
    const cached = this.robotsByHost.get(origin);
    if (cached) return cached;
    let groups: RobotsGroup[] = [];
    try {
      const res = await this.fetchFn(`${origin}/robots.txt`, {
        headers: { "user-agent": this.userAgent },
      });
      if (res.ok) groups = parseRobots(await res.text());
    } catch {
      groups = []; // no robots.txt reachable -> allow
    }
    this.robotsByHost.set(origin, groups);
    return groups;
  }

  private async throttle(host: string): Promise<void> {
    const last = this.lastFetchByHost.get(host);
    if (last !== undefined) {
      const wait = this.minIntervalMs - (this.now() - last);
      if (wait > 0) await this.sleep(wait);
    }
    this.lastFetchByHost.set(host, this.now());
  }

  /** Fetch a listing-attached URL, honoring cache + robots + throttle. */
  async fetchListingUrl(url: string): Promise<CrawlResult> {
    const cached = await this.cache.get(url);
    if (cached) {
      return {
        url,
        allowedByRobots: true,
        fromCache: true,
        html: cached.html,
        text: extractMainText(cached.html),
        jsonLd: extractJsonLd(cached.html),
      };
    }

    const parsed = new URL(url);
    const robots = await this.robotsFor(parsed.origin);
    if (!isAllowed(robots, this.userAgent, parsed.pathname)) {
      return { url, allowedByRobots: false, fromCache: false, html: "", text: "", jsonLd: [] };
    }

    await this.throttle(parsed.host);
    const res = await this.fetchFn(url, { headers: { "user-agent": this.userAgent } });
    if (!res.ok) throw new Error(`crawler HTTP ${res.status} for ${url}`);
    const html = await res.text();
    await this.cache.set(url, html);

    return {
      url,
      allowedByRobots: true,
      fromCache: false,
      html,
      text: extractMainText(html),
      jsonLd: extractJsonLd(html),
    };
  }
}

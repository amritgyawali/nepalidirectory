/**
 * crawl_cache store (prompt sec. 6.4): raw HTML cached ~30 days, keyed by url hash, so we never
 * re-hit a business site unnecessarily. In-memory default; Postgres contract in the migration.
 */
import { sha256 } from "../../ai-core";

export type CrawlCacheEntry = { url: string; html: string; fetchedAt: Date };

export interface CrawlCacheRepository {
  get(url: string): Promise<CrawlCacheEntry | null>;
  set(url: string, html: string): Promise<void>;
}

export class InMemoryCrawlCacheRepository implements CrawlCacheRepository {
  private readonly map = new Map<string, CrawlCacheEntry>();
  private readonly ttlMs: number;

  constructor(ttlDays = 30) {
    this.ttlMs = ttlDays * 24 * 60 * 60_000;
  }

  async get(url: string): Promise<CrawlCacheEntry | null> {
    const hit = this.map.get(sha256(url));
    if (!hit) return null;
    if (Date.now() - hit.fetchedAt.getTime() > this.ttlMs) {
      this.map.delete(sha256(url));
      return null;
    }
    return { ...hit };
  }

  async set(url: string, html: string): Promise<void> {
    this.map.set(sha256(url), { url, html, fetchedAt: new Date() });
  }
}

/**
 * AI response cache (prompt §5.2, table `ai_cache`). Cache-first on enrichment cuts token spend
 * 40–60% on re-runs (§5.2 / §19). In-memory default; a Postgres impl lands with the DB (Phase 1+).
 */

export type CacheEntry = {
  response: string;
  provider: string | null;
  model: string | null;
};

export interface AiCacheRepository {
  /** Returns a live (non-expired) entry, or null. */
  get(key: string): Promise<CacheEntry | null>;
  set(key: string, entry: CacheEntry, ttlDays: number): Promise<void>;
  /** Test/inspection: number of live entries. */
  size(): number;
}

type StoredEntry = CacheEntry & { expiresAt: number };

export class InMemoryCacheRepository implements AiCacheRepository {
  private readonly map = new Map<string, StoredEntry>();

  async get(key: string): Promise<CacheEntry | null> {
    const hit = this.map.get(key);
    if (!hit) return null;
    if (hit.expiresAt <= Date.now()) {
      this.map.delete(key);
      return null;
    }
    return { response: hit.response, provider: hit.provider, model: hit.model };
  }

  async set(key: string, entry: CacheEntry, ttlDays: number): Promise<void> {
    this.map.set(key, {
      ...entry,
      expiresAt: Date.now() + ttlDays * 24 * 60 * 60_000,
    });
  }

  size(): number {
    return this.map.size;
  }
}

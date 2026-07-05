/**
 * trend_sources store (prompt §8.1). In-memory default; Postgres contract in the migration.
 */
import type { NewTrendSource, TrendSource, TrendSourceRepository } from "../types";

export class InMemoryTrendSourceRepository implements TrendSourceRepository {
  private seq = 0;
  private readonly map = new Map<number, TrendSource>();

  constructor(seed: NewTrendSource[] = []) {
    for (const s of seed) void this.create(s);
  }

  async create(input: NewTrendSource): Promise<TrendSource> {
    const source: TrendSource = { id: ++this.seq, failCount: input.failCount ?? 0, ...input };
    this.map.set(source.id, source);
    return { ...source };
  }

  async list(filter?: { active?: boolean }): Promise<TrendSource[]> {
    return [...this.map.values()]
      .filter((s) => (filter?.active === undefined ? true : s.active === filter.active))
      .sort((a, b) => a.id - b.id)
      .map((s) => ({ ...s }));
  }

  async recordFetch(id: number, ok: boolean): Promise<void> {
    const s = this.map.get(id);
    if (!s) return;
    this.map.set(id, {
      ...s,
      lastFetchedAt: new Date(),
      failCount: ok ? 0 : s.failCount + 1,
    });
  }
}

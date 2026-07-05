/**
 * trend_items store (prompt §8.1): normalized trend headlines, deduped by URL hash. In-memory
 * default; Postgres contract in the migration.
 */
import { sha256 } from "../../ai-core";
import type { NewTrendItem, TrendItem, TrendItemRepository } from "../types";

export class InMemoryTrendItemRepository implements TrendItemRepository {
  private seq = 0;
  private readonly map = new Map<number, TrendItem>();
  private readonly byUrlHash = new Map<string, number>();

  async create(input: NewTrendItem): Promise<TrendItem | null> {
    const urlHash = sha256(input.url);
    if (this.byUrlHash.has(urlHash)) return null;
    const item: TrendItem = { id: ++this.seq, urlHash, createdAt: new Date(), ...input };
    this.map.set(item.id, item);
    this.byUrlHash.set(urlHash, item.id);
    return { ...item };
  }

  async listSince(since: Date): Promise<TrendItem[]> {
    return [...this.map.values()]
      .filter((i) => (i.publishedAt ?? i.createdAt).getTime() >= since.getTime())
      .sort((a, b) => a.id - b.id)
      .map((i) => ({ ...i }));
  }

  async setCluster(ids: number[], clusterId: number): Promise<void> {
    for (const id of ids) {
      const item = this.map.get(id);
      if (item) this.map.set(id, { ...item, clusterId });
    }
  }

  async listByCluster(clusterId: number): Promise<TrendItem[]> {
    return [...this.map.values()]
      .filter((i) => i.clusterId === clusterId)
      .sort((a, b) => a.id - b.id)
      .map((i) => ({ ...i }));
  }
}

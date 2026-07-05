/**
 * trend_clusters store (prompt §8.2). In-memory default; Postgres contract in the migration.
 */
import type { NewTrendCluster, TrendCluster, TrendClusterRepository, TrendClusterStatus } from "../types";

export class InMemoryTrendClusterRepository implements TrendClusterRepository {
  private seq = 0;
  private readonly map = new Map<number, TrendCluster>();

  async create(input: NewTrendCluster): Promise<TrendCluster> {
    const cluster: TrendCluster = { id: ++this.seq, status: "new", createdAt: new Date(), ...input };
    this.map.set(cluster.id, cluster);
    return { ...cluster };
  }

  async update(id: number, patch: Partial<TrendCluster>): Promise<void> {
    const c = this.map.get(id);
    if (!c) throw new Error(`trend_clusters: no cluster ${id}`);
    this.map.set(id, { ...c, ...patch, id });
  }

  async list(filter?: { status?: TrendClusterStatus }): Promise<TrendCluster[]> {
    return [...this.map.values()]
      .filter((c) => (filter?.status ? c.status === filter.status : true))
      .sort((a, b) => b.score - a.score)
      .map((c) => ({ ...c }));
  }

  async get(id: number): Promise<TrendCluster | null> {
    const c = this.map.get(id);
    return c ? { ...c } : null;
  }
}

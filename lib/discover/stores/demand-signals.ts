/**
 * demand_signals store (prompt §9.3): zero-result / unmet-need queries — feeds the admin
 * "businesses to recruit" queue and the blog topic queue. In-memory default; Postgres contract in
 * the migration.
 */
import type { DemandSignal, DemandSignalRepository, NewDemandSignal } from "../types";

export class InMemoryDemandSignalRepository implements DemandSignalRepository {
  private seq = 0;
  private readonly map = new Map<number, DemandSignal>();

  async create(input: NewDemandSignal): Promise<DemandSignal> {
    const signal: DemandSignal = { id: ++this.seq, createdAt: new Date(), ...input };
    this.map.set(signal.id, signal);
    return { ...signal };
  }

  async list(): Promise<DemandSignal[]> {
    return [...this.map.values()].sort((a, b) => a.id - b.id).map((s) => ({ ...s }));
  }
}

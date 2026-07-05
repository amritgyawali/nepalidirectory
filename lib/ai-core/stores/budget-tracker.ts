/**
 * Per-provider daily token accounting for the BudgetGuard (prompt §5.2). Self-contained so it
 * does not depend on the usage log's write timing. In-memory (single process) for Phase 1; a
 * DB-backed counter can replace it for multi-node deployments later.
 */

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10); // UTC day bucket
}

export interface BudgetTracker {
  /** Tokens consumed by `provider` on the given day (default today). */
  consumed(provider: string, now?: Date): number;
  /** Add tokens to `provider`'s tally for the given day. */
  add(provider: string, tokens: number, now?: Date): void;
}

export class InMemoryBudgetTracker implements BudgetTracker {
  private readonly tallies = new Map<string, number>(); // `${provider}:${day}` → tokens

  consumed(provider: string, now: Date = new Date()): number {
    return this.tallies.get(`${provider}:${dayKey(now)}`) ?? 0;
  }

  add(provider: string, tokens: number, now: Date = new Date()): void {
    const key = `${provider}:${dayKey(now)}`;
    this.tallies.set(key, (this.tallies.get(key) ?? 0) + tokens);
  }
}

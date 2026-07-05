/**
 * AI usage log (prompt §5.2, table `ai_usage_log`). Every call is recorded — including cache
 * hits — feeding the admin Spend page (§12) and budget accounting.
 */

export type UsageEntry = {
  provider: string;
  model: string;
  taskKey: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  cacheHit: boolean;
  status: string; // "ok" | "error"
  createdAt: Date;
};

export interface UsageLogRepository {
  record(entry: Omit<UsageEntry, "createdAt">): Promise<void>;
  /** All entries (admin/spend, tests). */
  all(): Promise<UsageEntry[]>;
}

export class InMemoryUsageLogRepository implements UsageLogRepository {
  private readonly entries: UsageEntry[] = [];

  async record(entry: Omit<UsageEntry, "createdAt">): Promise<void> {
    this.entries.push({ ...entry, createdAt: new Date() });
  }

  async all(): Promise<UsageEntry[]> {
    return [...this.entries];
  }
}

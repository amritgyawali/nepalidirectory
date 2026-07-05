/**
 * search_queries_log store (prompt §9.2): every parsed query + result count, for QA and the NL
 * parser's cache. In-memory default; Postgres contract in the migration.
 */
import type { NewSearchQueryLogEntry, SearchQueryLogEntry, SearchQueryLogRepository } from "../types";

export class InMemorySearchQueryLogRepository implements SearchQueryLogRepository {
  private seq = 0;
  private readonly map = new Map<number, SearchQueryLogEntry>();

  async create(input: NewSearchQueryLogEntry): Promise<SearchQueryLogEntry> {
    const entry: SearchQueryLogEntry = { id: ++this.seq, createdAt: new Date(), ...input };
    this.map.set(entry.id, entry);
    return { ...entry };
  }

  async list(): Promise<SearchQueryLogEntry[]> {
    return [...this.map.values()].sort((a, b) => a.id - b.id).map((e) => ({ ...e }));
  }
}

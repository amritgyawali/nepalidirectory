/**
 * Postgres-backed discover stores (prompt sec. 13 `category_synonyms`/`demand_signals`/
 * `search_queries_log`). Run against an injected `SqlExecutor`; selected by `./factory.ts` when
 * `DATABASE_URL` is set. Conversation transcripts stay in-memory only — the prompt doesn't name a
 * persisted table for them (§9.3), only a 30-day retention expectation.
 */
import type { SqlExecutor } from "../../ai-core/queue/pg-repo";
import type {
  CategorySynonym,
  CategorySynonymRepository,
  DemandSignal,
  DemandSignalRepository,
  NewDemandSignal,
  NewSearchQueryLogEntry,
  ParsedQuery,
  SearchQueryLogEntry,
  SearchQueryLogRepository,
} from "../types";

export class PostgresCategorySynonymRepository implements CategorySynonymRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async all(): Promise<CategorySynonym[]> {
    const rows = await this.sql<{ category_slug: string; synonym: string; lang: string }>(
      `SELECT category_slug, synonym, lang FROM category_synonyms`,
    );
    return rows.map((r) => ({
      categorySlug: r.category_slug,
      synonym: r.synonym,
      lang: r.lang as CategorySynonym["lang"],
    }));
  }
}

function mapDemandSignal(r: {
  id: number; query: string; category_guess: string | null; location: string | null;
  source: string; created_at: string | Date;
}): DemandSignal {
  return {
    id: Number(r.id), query: r.query, categoryGuess: r.category_guess ?? undefined,
    location: r.location ?? undefined, source: r.source, createdAt: new Date(r.created_at),
  };
}

export class PostgresDemandSignalRepository implements DemandSignalRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async create(input: NewDemandSignal): Promise<DemandSignal> {
    const rows = await this.sql<Parameters<typeof mapDemandSignal>[0]>(
      `INSERT INTO demand_signals (query, category_guess, location, source)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [input.query, input.categoryGuess ?? null, input.location ?? null, input.source],
    );
    return mapDemandSignal(rows[0]);
  }

  async list(): Promise<DemandSignal[]> {
    const rows = await this.sql<Parameters<typeof mapDemandSignal>[0]>(
      `SELECT * FROM demand_signals ORDER BY id`,
    );
    return rows.map(mapDemandSignal);
  }
}

export class PostgresSearchQueryLogRepository implements SearchQueryLogRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async create(input: NewSearchQueryLogEntry): Promise<SearchQueryLogEntry> {
    const rows = await this.sql<{
      id: number; query: string; parsed: ParsedQuery | string; results_count: number;
      created_at: string | Date;
    }>(
      `INSERT INTO search_queries_log (query, parsed, results_count)
       VALUES ($1, $2::jsonb, $3) RETURNING *`,
      [input.query, JSON.stringify(input.parsed), input.resultsCount],
    );
    const r = rows[0];
    return {
      id: Number(r.id),
      query: r.query,
      parsed: typeof r.parsed === "string" ? (JSON.parse(r.parsed) as ParsedQuery) : r.parsed,
      resultsCount: r.results_count,
      createdAt: new Date(r.created_at),
    };
  }

  async list(): Promise<SearchQueryLogEntry[]> {
    const rows = await this.sql<{
      id: number; query: string; parsed: ParsedQuery | string; results_count: number;
      created_at: string | Date;
    }>(`SELECT * FROM search_queries_log ORDER BY id`);
    return rows.map((r) => ({
      id: Number(r.id),
      query: r.query,
      parsed: typeof r.parsed === "string" ? (JSON.parse(r.parsed) as ParsedQuery) : r.parsed,
      resultsCount: r.results_count,
      createdAt: new Date(r.created_at),
    }));
  }
}

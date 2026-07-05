/**
 * Postgres-backed acquisition stores (prompt sec. 13 `V5__acquisition.sql`). Run against an
 * injected `SqlExecutor`; selected by `./factory.ts` when `DATABASE_URL` is set.
 */
import type { SqlExecutor } from "../../ai-core/queue/pg-repo";
import type { MergeCandidate, MergeCandidateRepository, NewMergeCandidate } from "./merge-candidates";
import type { IngestBatch, IngestBatchRepository } from "./ingest-batches";
import type { CrawlCacheEntry, CrawlCacheRepository } from "./crawl-cache";
import type { Claim, ClaimMethod, ClaimRepository, ClaimStatus, NewClaim } from "./claims";
import { sha256 } from "../../ai-core";

function mapMergeCandidate(r: {
  id: number; a_id: number; b_id: number; score: number; features: Record<string, unknown>;
  ai_verdict: string | null; ai_confidence: number | null; decision: string;
  decided_by: string | null; created_at: string | Date;
}): MergeCandidate {
  return {
    id: Number(r.id), aId: Number(r.a_id), bId: Number(r.b_id), score: Number(r.score),
    features: r.features, aiVerdict: r.ai_verdict ?? undefined,
    aiConfidence: r.ai_confidence != null ? Number(r.ai_confidence) : undefined,
    decision: r.decision, decidedBy: r.decided_by ?? undefined, createdAt: new Date(r.created_at),
  };
}

export class PostgresMergeCandidateRepository implements MergeCandidateRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async create(input: NewMergeCandidate): Promise<MergeCandidate> {
    const rows = await this.sql<Parameters<typeof mapMergeCandidate>[0]>(
      `INSERT INTO merge_candidates (a_id, b_id, score, features)
       VALUES ($1, $2, $3, $4::jsonb) RETURNING *`,
      [input.aId, input.bId, input.score, JSON.stringify(input.features)],
    );
    return mapMergeCandidate(rows[0]);
  }

  async get(id: number): Promise<MergeCandidate | null> {
    const rows = await this.sql<Parameters<typeof mapMergeCandidate>[0]>(
      `SELECT * FROM merge_candidates WHERE id=$1`,
      [id],
    );
    return rows.length ? mapMergeCandidate(rows[0]) : null;
  }

  async update(id: number, patch: Partial<MergeCandidate>): Promise<void> {
    await this.sql(
      `UPDATE merge_candidates SET
         ai_verdict=COALESCE($2, ai_verdict), ai_confidence=COALESCE($3, ai_confidence),
         decision=COALESCE($4, decision), decided_by=COALESCE($5, decided_by)
       WHERE id=$1`,
      [id, patch.aiVerdict ?? null, patch.aiConfidence ?? null, patch.decision ?? null, patch.decidedBy ?? null],
    );
  }

  async list(filter?: { decision?: string }): Promise<MergeCandidate[]> {
    const rows = filter?.decision
      ? await this.sql<Parameters<typeof mapMergeCandidate>[0]>(
          `SELECT * FROM merge_candidates WHERE decision=$1 ORDER BY id`,
          [filter.decision],
        )
      : await this.sql<Parameters<typeof mapMergeCandidate>[0]>(`SELECT * FROM merge_candidates ORDER BY id`);
    return rows.map(mapMergeCandidate);
  }
}

export class PostgresIngestBatchRepository implements IngestBatchRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async start(source: string): Promise<IngestBatch> {
    const rows = await this.sql<{ id: number; source: string; stats: Record<string, number> | null; started_at: string; finished_at: string | null }>(
      `INSERT INTO ingest_batches (source, stats, started_at) VALUES ($1, '{}'::jsonb, now()) RETURNING *`,
      [source],
    );
    const r = rows[0];
    return { id: Number(r.id), source: r.source, stats: r.stats ?? {}, startedAt: new Date(r.started_at) };
  }

  async finish(id: number, stats: Record<string, number>): Promise<IngestBatch> {
    const rows = await this.sql<{ id: number; source: string; stats: Record<string, number>; started_at: string; finished_at: string }>(
      `UPDATE ingest_batches SET stats=$2::jsonb, finished_at=now() WHERE id=$1 RETURNING *`,
      [id, JSON.stringify(stats)],
    );
    const r = rows[0];
    return { id: Number(r.id), source: r.source, stats: r.stats, startedAt: new Date(r.started_at), finishedAt: new Date(r.finished_at) };
  }

  async list(): Promise<IngestBatch[]> {
    const rows = await this.sql<{ id: number; source: string; stats: Record<string, number> | null; started_at: string; finished_at: string | null }>(
      `SELECT * FROM ingest_batches ORDER BY id`,
    );
    return rows.map((r) => ({
      id: Number(r.id), source: r.source, stats: r.stats ?? {}, startedAt: new Date(r.started_at),
      finishedAt: r.finished_at ? new Date(r.finished_at) : undefined,
    }));
  }
}

export class PostgresCrawlCacheRepository implements CrawlCacheRepository {
  constructor(private readonly sql: SqlExecutor, private readonly ttlDays = 30) {}

  async get(url: string): Promise<CrawlCacheEntry | null> {
    const rows = await this.sql<{ url: string; html: string; fetched_at: string }>(
      `SELECT url, html, fetched_at FROM crawl_cache WHERE url_hash=$1`,
      [sha256(url)],
    );
    if (!rows.length) return null;
    const fetchedAt = new Date(rows[0].fetched_at);
    if (Date.now() - fetchedAt.getTime() > this.ttlDays * 24 * 60 * 60_000) return null;
    return { url: rows[0].url, html: rows[0].html, fetchedAt };
  }

  async set(url: string, html: string): Promise<void> {
    await this.sql(
      `INSERT INTO crawl_cache (url_hash, url, html, fetched_at) VALUES ($1, $2, $3, now())
       ON CONFLICT (url_hash) DO UPDATE SET html=$3, fetched_at=now()`,
      [sha256(url), url, html],
    );
  }
}

function mapClaim(r: {
  id: number; listing_id: number; method: string; contact: string; otp: string | null;
  document_url: string | null; status: string; created_at: string | Date;
}): Claim {
  return {
    id: Number(r.id), listingId: Number(r.listing_id), method: r.method as ClaimMethod,
    contact: r.contact, otp: r.otp ?? undefined, documentUrl: r.document_url ?? undefined,
    status: r.status as ClaimStatus, createdAt: new Date(r.created_at),
  };
}

export class PostgresClaimRepository implements ClaimRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async create(input: NewClaim): Promise<Claim> {
    const rows = await this.sql<Parameters<typeof mapClaim>[0]>(
      `INSERT INTO claims (listing_id, method, contact, otp, document_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [input.listingId, input.method, input.contact, input.otp ?? null, input.documentUrl ?? null],
    );
    return mapClaim(rows[0]);
  }

  async get(id: number): Promise<Claim | null> {
    const rows = await this.sql<Parameters<typeof mapClaim>[0]>(`SELECT * FROM claims WHERE id=$1`, [id]);
    return rows.length ? mapClaim(rows[0]) : null;
  }

  async update(id: number, patch: Partial<Claim>): Promise<void> {
    await this.sql(
      `UPDATE claims SET status=COALESCE($2, status) WHERE id=$1`,
      [id, patch.status ?? null],
    );
  }

  async list(filter?: { status?: ClaimStatus; method?: ClaimMethod }): Promise<Claim[]> {
    const clauses: string[] = [];
    const params: unknown[] = [];
    if (filter?.status) { params.push(filter.status); clauses.push(`status=$${params.length}`); }
    if (filter?.method) { params.push(filter.method); clauses.push(`method=$${params.length}`); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = await this.sql<Parameters<typeof mapClaim>[0]>(`SELECT * FROM claims ${where} ORDER BY id`, params);
    return rows.map(mapClaim);
  }
}

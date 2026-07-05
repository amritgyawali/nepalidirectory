/**
 * Postgres JobRepository (prompt §5.4 — `FOR UPDATE SKIP LOCKED`).
 *
 * Phase 0 ships the SQL contract but adds NO `pg` dependency: the repo runs against an injected
 * `SqlExecutor`, so Phase 1 can plug in `pg`/`postgres`/drizzle without changing this class.
 * NOTE: unverified until a live DB exists (Phase 1) — the in-memory repo is what Phase 0 tests.
 */
import type {
  AiJob,
  EnqueueInput,
  FailOptions,
  JobRepository,
  JobStatus,
  JobType,
  JsonObject,
} from "./types";

/** Minimal parametrized-query executor. Phase 1 wraps a real Postgres client. */
export type SqlExecutor = <Row = Record<string, unknown>>(
  text: string,
  params?: unknown[],
) => Promise<Row[]>;

type JobRow = {
  id: number | string;
  type: string;
  payload: JsonObject | string;
  status: string;
  priority: number;
  attempts: number;
  run_after: Date | string;
  locked_by: string | null;
  result: JsonObject | string | null;
  error: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

function asObject(v: JsonObject | string | null): JsonObject | null {
  if (v === null) return null;
  return typeof v === "string" ? (JSON.parse(v) as JsonObject) : v;
}

function mapRow(r: JobRow): AiJob {
  return {
    id: Number(r.id),
    type: r.type as JobType,
    payload: (asObject(r.payload) ?? {}) as JsonObject,
    status: r.status as JobStatus,
    priority: r.priority,
    attempts: r.attempts,
    runAfter: new Date(r.run_after),
    lockedBy: r.locked_by,
    result: asObject(r.result),
    error: r.error,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  };
}

export class PostgresJobRepository implements JobRepository {
  private readonly sql: SqlExecutor;

  constructor(sql: SqlExecutor) {
    this.sql = sql;
  }

  async enqueue(input: EnqueueInput): Promise<AiJob> {
    const rows = await this.sql<JobRow>(
      `INSERT INTO ai_jobs (type, payload, priority, run_after)
       VALUES ($1, $2::jsonb, $3, COALESCE($4, now()))
       RETURNING *`,
      [
        input.type,
        JSON.stringify(input.payload ?? {}),
        input.priority ?? 5,
        input.runAfter ?? null,
      ],
    );
    return mapRow(rows[0]);
  }

  async claimNext(node: string): Promise<AiJob | null> {
    const rows = await this.sql<JobRow>(
      `UPDATE ai_jobs
          SET status='RUNNING', locked_by=$1, attempts=attempts+1, updated_at=now()
        WHERE id = (
          SELECT id FROM ai_jobs
           WHERE status='PENDING' AND run_after <= now()
           ORDER BY priority DESC, id
           LIMIT 1
           FOR UPDATE SKIP LOCKED
        )
        RETURNING *`,
      [node],
    );
    return rows.length ? mapRow(rows[0]) : null;
  }

  async complete(id: number, result: JsonObject): Promise<void> {
    await this.sql(
      `UPDATE ai_jobs
          SET status='DONE', result=$2::jsonb, error=NULL, locked_by=NULL, updated_at=now()
        WHERE id=$1`,
      [id, JSON.stringify(result)],
    );
  }

  async fail(id: number, error: string, opts: FailOptions): Promise<void> {
    if (opts.retry) {
      await this.sql(
        `UPDATE ai_jobs
            SET status='PENDING', error=$2, locked_by=NULL,
                run_after=COALESCE($3, now()), updated_at=now()
          WHERE id=$1`,
        [id, error, opts.runAfter ?? null],
      );
    } else {
      await this.sql(
        `UPDATE ai_jobs
            SET status='DEAD', error=$2, locked_by=NULL, updated_at=now()
          WHERE id=$1`,
        [id, error],
      );
    }
  }

  async get(id: number): Promise<AiJob | null> {
    const rows = await this.sql<JobRow>(`SELECT * FROM ai_jobs WHERE id=$1`, [id]);
    return rows.length ? mapRow(rows[0]) : null;
  }

  async list(filter?: { status?: JobStatus; type?: JobType }): Promise<AiJob[]> {
    const clauses: string[] = [];
    const params: unknown[] = [];
    if (filter?.status) {
      params.push(filter.status);
      clauses.push(`status=$${params.length}`);
    }
    if (filter?.type) {
      params.push(filter.type);
      clauses.push(`type=$${params.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = await this.sql<JobRow>(`SELECT * FROM ai_jobs ${where} ORDER BY id`, params);
    return rows.map(mapRow);
  }
}

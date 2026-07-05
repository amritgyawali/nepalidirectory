/**
 * DB-backed job queue contracts (prompt §5.4, table `ai_jobs` in §13).
 *
 * The queue is written against `JobRepository` so it runs on either the in-memory repo
 * (default; dev + CI, zero infra) or the Postgres repo (when DATABASE_URL is set, Phase 1)
 * which uses `FOR UPDATE SKIP LOCKED`. Job semantics are identical across both.
 */

export type JobStatus = "PENDING" | "RUNNING" | "DONE" | "FAILED" | "DEAD";

/**
 * Job types (prompt §5.4). `NOOP` is the Phase 0 end-to-end proof job; the rest gain handlers
 * in later phases.
 */
export type JobType =
  | "NOOP"
  | "ENRICH_LISTING"
  | "EMBED_LISTING"
  | "TREND_SCAN"
  | "TREND_CLUSTER"
  | "BLOG_GENERATE"
  | "BLOG_FACTCHECK"
  | "REVIEW_SUMMARY"
  | "MERGE_ADJUDICATE"
  | "TRANSLATE_NE"
  | "EVERGREEN_PAGE";

export type JsonObject = Record<string, unknown>;

/** A row of `ai_jobs` (camelCase in TS; snake_case in SQL). */
export type AiJob = {
  id: number;
  type: JobType;
  payload: JsonObject;
  status: JobStatus;
  priority: number;
  attempts: number;
  runAfter: Date;
  lockedBy: string | null;
  result: JsonObject | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type EnqueueInput = {
  type: JobType;
  payload?: JsonObject;
  /** Higher runs first (prompt: ORDER BY priority DESC). Default 5. */
  priority?: number;
  /** Earliest time the job may run. Default now. */
  runAfter?: Date;
};

export type FailOptions = {
  /** true → re-queue as PENDING at `runAfter`; false → terminal DEAD. */
  retry: boolean;
  runAfter?: Date;
};

/**
 * Persistence + atomic claim for the queue. `claimNext` MUST atomically transition exactly one
 * runnable job to RUNNING (incrementing attempts, stamping locked_by) so concurrent workers
 * never double-claim — the Postgres impl does this with SKIP LOCKED.
 */
export interface JobRepository {
  enqueue(input: EnqueueInput): Promise<AiJob>;
  /** Claim the highest-priority PENDING job with run_after<=now, or null if none. */
  claimNext(node: string): Promise<AiJob | null>;
  /** Mark a claimed job DONE with its result. */
  complete(id: number, result: JsonObject): Promise<void>;
  /** Record a failure: re-queue (PENDING) or finalize (DEAD) per FailOptions. */
  fail(id: number, error: string, opts: FailOptions): Promise<void>;
  get(id: number): Promise<AiJob | null>;
  /** Inspection helper (admin console / tests). */
  list(filter?: { status?: JobStatus; type?: JobType }): Promise<AiJob[]>;
}

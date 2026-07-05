/**
 * In-memory JobRepository — the Phase 0 default (dev + CI, zero infra).
 *
 * Mirrors the Postgres claim semantics: `claimNext` picks the highest-priority runnable job
 * (priority DESC, then id ASC), flips it to RUNNING, increments attempts, and stamps locked_by.
 * JS is single-threaded so the claim is naturally atomic within one tick — no double-claims.
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

export class InMemoryJobRepository implements JobRepository {
  private seq = 0;
  private readonly jobs = new Map<number, AiJob>();

  async enqueue(input: EnqueueInput): Promise<AiJob> {
    const now = new Date();
    const job: AiJob = {
      id: ++this.seq,
      type: input.type,
      payload: input.payload ?? {},
      status: "PENDING",
      priority: input.priority ?? 5,
      attempts: 0,
      runAfter: input.runAfter ?? now,
      lockedBy: null,
      result: null,
      error: null,
      createdAt: now,
      updatedAt: now,
    };
    this.jobs.set(job.id, job);
    return { ...job };
  }

  async claimNext(node: string): Promise<AiJob | null> {
    const now = Date.now();
    const candidates = [...this.jobs.values()]
      .filter((j) => j.status === "PENDING" && j.runAfter.getTime() <= now)
      .sort((a, b) => b.priority - a.priority || a.id - b.id);

    const next = candidates[0];
    if (!next) return null;

    next.status = "RUNNING";
    next.attempts += 1;
    next.lockedBy = node;
    next.updatedAt = new Date();
    return { ...next };
  }

  async complete(id: number, result: JsonObject): Promise<void> {
    const job = this.require(id);
    job.status = "DONE";
    job.result = result;
    job.error = null;
    job.lockedBy = null;
    job.updatedAt = new Date();
  }

  async fail(id: number, error: string, opts: FailOptions): Promise<void> {
    const job = this.require(id);
    job.error = error;
    job.lockedBy = null;
    job.updatedAt = new Date();
    if (opts.retry) {
      job.status = "PENDING";
      job.runAfter = opts.runAfter ?? new Date();
    } else {
      job.status = "DEAD";
    }
  }

  async get(id: number): Promise<AiJob | null> {
    const job = this.jobs.get(id);
    return job ? { ...job } : null;
  }

  async list(filter?: { status?: JobStatus; type?: JobType }): Promise<AiJob[]> {
    return [...this.jobs.values()]
      .filter((j) => (filter?.status ? j.status === filter.status : true))
      .filter((j) => (filter?.type ? j.type === filter.type : true))
      .sort((a, b) => a.id - b.id)
      .map((j) => ({ ...j }));
  }

  private require(id: number): AiJob {
    const job = this.jobs.get(id);
    if (!job) throw new Error(`ai_jobs: no job with id ${id}`);
    return job;
  }
}

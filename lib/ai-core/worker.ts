/**
 * AI job worker (prompt §5.4).
 *
 * Polls the JobRepository, claims one runnable job at a time, dispatches to a registered
 * handler, and records the outcome. On failure it retries with exponential backoff up to
 * `maxAttempts` (default 4), then finalizes the job as DEAD (replayable in the admin console,
 * Phase 5). Runtime uses `start()` (fixed-delay loop, default 2s, matching @Scheduled); tests
 * drive `runOnce()` deterministically.
 */
import type { ProviderRegistry } from "./types";
import type { AiJob, EnqueueInput, JobRepository, JobType } from "./queue/types";
import { RetryableAtError } from "./errors";

export type HandlerContext = {
  job: AiJob;
  providers: ProviderRegistry;
  log: (msg: string) => void;
  /** Enqueue a follow-up job (e.g. ENRICH_LISTING → EMBED_LISTING). */
  enqueue: (input: EnqueueInput) => Promise<AiJob>;
};

/** A handler processes one job and returns its result JSON (persisted to ai_jobs.result). */
export type JobHandler = (ctx: HandlerContext) => Promise<Record<string, unknown>>;

export type WorkerOptions = {
  /** Identifier stamped into locked_by. Default "worker-1". */
  node?: string;
  /** Attempts before a job is marked DEAD (prompt §5.4: max 4). */
  maxAttempts?: number;
  /** Backoff schedule; returns the next run time given the attempt count. */
  backoff?: (attempts: number) => Date;
  /** Logger; defaults to console.debug. */
  logger?: (msg: string) => void;
};

/** Default backoff: 1s, 4s, 15s (prompt §5.2), then hold at 15s. */
function defaultBackoff(attempts: number): Date {
  const schedule = [1000, 4000, 15000];
  const ms = schedule[attempts - 1] ?? 15000;
  return new Date(Date.now() + ms);
}

export class Worker {
  private readonly repo: JobRepository;
  private readonly providers: ProviderRegistry;
  private readonly handlers = new Map<JobType, JobHandler>();
  private readonly node: string;
  private readonly maxAttempts: number;
  private readonly backoff: (attempts: number) => Date;
  private readonly logger: (msg: string) => void;
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  constructor(repo: JobRepository, providers: ProviderRegistry, opts: WorkerOptions = {}) {
    this.repo = repo;
    this.providers = providers;
    this.node = opts.node ?? "worker-1";
    this.maxAttempts = opts.maxAttempts ?? 4;
    this.backoff = opts.backoff ?? defaultBackoff;
    this.logger = opts.logger ?? ((m) => console.debug(m));
  }

  register(type: JobType, handler: JobHandler): this {
    this.handlers.set(type, handler);
    return this;
  }

  /**
   * Claim and process at most one job. Returns the job in its post-run state, or null if the
   * queue had nothing runnable.
   */
  async runOnce(): Promise<AiJob | null> {
    const claimed = await this.repo.claimNext(this.node);
    if (!claimed) return null;

    const handler = this.handlers.get(claimed.type);
    if (!handler) {
      // No handler → terminal; a misconfigured type should not spin retries.
      await this.repo.fail(claimed.id, `no handler registered for type ${claimed.type}`, {
        retry: false,
      });
      return this.repo.get(claimed.id);
    }

    try {
      const result = await handler({
        job: claimed,
        providers: this.providers,
        log: this.logger,
        enqueue: (input) => this.repo.enqueue(input),
      });
      await this.repo.complete(claimed.id, result);
    } catch (err) {
      // Budget-exhaustion / explicit reschedule: re-queue at a fixed time without counting the
      // attempt toward the DEAD threshold (prompt §5.2: re-run next day 00:15 NPT).
      if (err instanceof RetryableAtError) {
        await this.repo.fail(claimed.id, err.message, { retry: true, runAfter: err.runAfter });
        return this.repo.get(claimed.id);
      }
      const message = err instanceof Error ? err.message : String(err);
      const retry = claimed.attempts < this.maxAttempts;
      await this.repo.fail(claimed.id, message, {
        retry,
        runAfter: retry ? this.backoff(claimed.attempts) : undefined,
      });
    }
    return this.repo.get(claimed.id);
  }

  /** Start the fixed-delay polling loop. Safe to call once; no-op if already started. */
  start(intervalMs = 2000): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      if (this.running) return; // don't overlap ticks
      this.running = true;
      void this.runOnce().finally(() => {
        this.running = false;
      });
    }, intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

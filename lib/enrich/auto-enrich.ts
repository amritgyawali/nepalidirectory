/**
 * Autonomous listing-enrichment cycle (prompt §7 nightly sweep, made serverless-friendly).
 *
 * One `runAutoEnrichCycle()` == the whole nightly pass, driven by the `/api/cron/enrich` route:
 * enqueue ENRICH_LISTING for up to `ENRICH_DAILY_CAP` un-enriched listings, then drain the queue
 * in-process (each ENRICH_LISTING enqueues a follow-up EMBED_LISTING, so both run). This is the
 * serverless analogue of the in-process interval worker — a Vercel function can't keep a polling
 * loop alive between invocations, so the cron does exactly one bounded, dedup-safe drain per hit.
 *
 * Enrichment is idempotent per listing: `needingEnrichment()` only returns rows with
 * `aiEnrichedAt == null` and a non-owner description source, so already-enriched and owner-authored
 * listings are never touched or overwritten.
 */
import { loadAiConfig } from "../ai-core";
import { enqueueEnrichmentSweep } from "./sweep";
import { getDefaultEnrichmentRuntime } from "./singleton";

export type AutoEnrichResult = {
  ran: boolean;
  reason?: string;
  /** Listings enqueued for enrichment this cycle. */
  enqueued: number;
  /** Jobs pulled off the queue and executed (ENRICH + EMBED). */
  processed: number;
  /** ENRICH_LISTING jobs that produced fresh AI content. */
  enriched: number;
  /** EMBED_LISTING jobs that stored a vector. */
  embedded: number;
  /** ENRICH_LISTING jobs skipped (owner-authored). */
  skipped: number;
  /** Jobs that failed terminally (DEAD) this cycle. */
  failed: number;
  /** Jobs re-queued for a later retry (e.g. provider over budget). */
  rescheduled: number;
};

const globalForAutoEnrich = globalThis as typeof globalThis & {
  __nepaliDirectoryAutoEnrichInFlight?: boolean;
};

function empty(): Omit<AutoEnrichResult, "ran" | "reason"> {
  return { enqueued: 0, processed: 0, enriched: 0, embedded: 0, skipped: 0, failed: 0, rescheduled: 0 };
}

export async function runAutoEnrichCycle(opts: { cap?: number; maxJobs?: number } = {}): Promise<AutoEnrichResult> {
  const config = loadAiConfig();
  if (!config.enabled) return { ran: false, reason: "AI_ENABLED is off.", ...empty() };
  if (!config.enrichEnabled) return { ran: false, reason: "ENRICH_ENABLED is off.", ...empty() };

  const g = globalForAutoEnrich;
  if (g.__nepaliDirectoryAutoEnrichInFlight) {
    return { ran: false, reason: "An enrichment cycle is already running.", ...empty() };
  }
  g.__nepaliDirectoryAutoEnrichInFlight = true;

  try {
    const runtime = getDefaultEnrichmentRuntime();
    const cap = opts.cap ?? config.enrichDailyCap;
    const enqueued = await enqueueEnrichmentSweep(runtime.repo, runtime.listings, cap);

    // Each ENRICH_LISTING enqueues one EMBED_LISTING; bound the drain generously but finitely so a
    // serverless invocation can never loop forever (retried jobs get a future run_after and are not
    // re-claimed this pass, so the loop also terminates naturally when nothing is runnable).
    const maxJobs = opts.maxJobs ?? enqueued * 3 + 20;
    const totals = empty();
    totals.enqueued = enqueued;

    for (let i = 0; i < maxJobs; i++) {
      const job = await runtime.worker.runOnce();
      if (!job) break;
      totals.processed += 1;
      if (job.status === "DONE") {
        if (job.type === "EMBED_LISTING") totals.embedded += 1;
        else if (job.result && "skipped" in job.result) totals.skipped += 1;
        else totals.enriched += 1;
      } else if (job.status === "DEAD") {
        totals.failed += 1;
      } else if (job.status === "PENDING") {
        totals.rescheduled += 1; // re-queued for a later retry
      }
    }

    return { ran: true, ...totals };
  } finally {
    g.__nepaliDirectoryAutoEnrichInFlight = false;
  }
}

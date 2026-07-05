/**
 * NOOP handler — the Phase 0 end-to-end proof (prompt §17: "one no-op job type end-to-end").
 *
 * Exercises the full path: enqueue → claimNext → handler runs → complete → DONE. It touches the
 * provider registry (mock) to prove that wiring too, but performs no external work.
 */
import type { JobHandler } from "../worker";

export const noopHandler: JobHandler = async ({ job, providers, log }) => {
  log(`[noop] processing job ${job.id}`);
  return {
    ok: true,
    echo: job.payload,
    provider: providers.primary().id(),
    processedAt: new Date().toISOString(),
  };
};

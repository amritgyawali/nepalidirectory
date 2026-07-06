/**
 * One enrichment runtime per process — same rationale as `lib/blog-engine/singleton.ts` and
 * `lib/discover/singleton.ts`: the nightly enrich cron, admin actions, and any request handler must
 * share the same in-memory listings/embeddings/job queue (a fresh `createEnrichmentRuntime()` per
 * caller would each get an empty queue and never see the others' work). Postgres-backed once
 * `DATABASE_URL` is set, so this is purely a dev/demo convenience otherwise.
 */
import { createEnrichmentRuntime, type EnrichmentRuntime } from "./runtime";

const globalForEnrichment = globalThis as typeof globalThis & {
  __nepaliDirectoryEnrichment?: EnrichmentRuntime;
};

export function getDefaultEnrichmentRuntime(): EnrichmentRuntime {
  if (!globalForEnrichment.__nepaliDirectoryEnrichment) {
    globalForEnrichment.__nepaliDirectoryEnrichment = createEnrichmentRuntime();
  }
  return globalForEnrichment.__nepaliDirectoryEnrichment;
}

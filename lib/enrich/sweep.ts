/**
 * Nightly enrichment sweep (prompt §7): enqueue ENRICH_LISTING for listings never enriched,
 * capped at ENRICH_DAILY_CAP so we stay inside free-tier quotas (§19). Trigger points also
 * include post-import / post-claim / post-edit (wired in later phases).
 */
import type { JobRepository } from "../ai-core";
import type { ListingRepository } from "./types";

export async function enqueueEnrichmentSweep(
  jobs: JobRepository,
  listings: ListingRepository,
  cap: number,
): Promise<number> {
  const due = await listings.needingEnrichment(cap);
  for (const l of due) {
    await jobs.enqueue({ type: "ENRICH_LISTING", payload: { listingId: l.id }, priority: 5 });
  }
  return due.length;
}

/**
 * AcquisitionService — the single ingest path all tiers funnel through (prompt sec. 6.6:
 * "entity resolution runs on EVERY insert from any tier"). Applies OSM natural-key idempotency,
 * optional geography resolution, then dedup thresholds:
 *   score >= 0.90 -> auto-merge (union into richest, reversible snapshot)
 *   0.65–0.90     -> insert + merge_candidates row + MERGE_ADJUDICATE job + admin queue
 *   < 0.65        -> distinct insert
 */
import type { EnqueueInput } from "../ai-core";
import type { Listing, ListingRepository, NewListing } from "../enrich/types";
import { computeQualityScore } from "../enrich/quality";
import type { MergeCandidateRepository } from "./stores/merge-candidates";
import type { EntityResolver } from "./dedup/resolver";
import type { GeographyResolver } from "./geo/resolver";

export type IngestAction = "inserted" | "merged" | "candidate" | "updated";
export type IngestResult = {
  action: IngestAction;
  listingId: number;
  score: number;
  candidateId?: number;
};

export type AcquisitionDeps = {
  listings: ListingRepository;
  mergeCandidates: MergeCandidateRepository;
  resolver: EntityResolver;
  geo?: GeographyResolver;
  enqueue?: (input: EnqueueInput) => Promise<unknown>;
  autoMergeThreshold?: number;
  candidateThreshold?: number;
};

/** Union `incoming` into `keep`, filling gaps (keep the richer value) + snapshot for reversal. */
function mergeListings(keep: Listing, incoming: NewListing): Listing {
  const merged: Listing = { ...keep };
  const fill = <K extends keyof NewListing>(k: K) => {
    if ((merged[k] === undefined || merged[k] === "" || merged[k] === null) && incoming[k] != null) {
      merged[k] = incoming[k] as Listing[K];
    }
  };
  (["phone", "website", "hoursToday", "neighborhood", "description", "coordinates",
    "province", "district", "municipality", "ward", "googlePlaceId", "osmType", "osmId",
    "sourceRef", "licenseNote"] as (keyof NewListing)[]).forEach(fill);
  merged.photosCount = Math.max(keep.photosCount, incoming.photosCount);
  merged.amenities = Array.from(new Set([...keep.amenities, ...incoming.amenities]));
  merged.tags = Array.from(new Set([...keep.tags, ...incoming.tags]));
  merged.mergedFrom = [...(keep.mergedFrom ?? []), incoming];
  merged.qualityScore = computeQualityScore(merged);
  return merged;
}

export class AcquisitionService {
  private readonly d: AcquisitionDeps;
  private readonly autoMerge: number;
  private readonly candidate: number;

  constructor(deps: AcquisitionDeps) {
    this.d = deps;
    this.autoMerge = deps.autoMergeThreshold ?? 0.9;
    this.candidate = deps.candidateThreshold ?? 0.65;
  }

  async ingest(input: NewListing, opts: { osm?: boolean } = {}): Promise<IngestResult> {
    let candidate = input;
    const all = await this.d.listings.all();

    // OSM idempotency: same natural key -> update in place, skip dedup (prompt sec. 6.1).
    if (opts.osm && candidate.osmType && candidate.osmId != null) {
      const existing = all.find(
        (l) => l.osmType === candidate.osmType && l.osmId === candidate.osmId,
      );
      if (existing) {
        const updated: Listing = { ...existing, ...candidate, id: existing.id };
        updated.qualityScore = computeQualityScore(updated);
        await this.d.listings.update(updated);
        return { action: "updated", listingId: existing.id, score: 1 };
      }
    }

    // Geography resolution (prompt sec. 6.1).
    if (this.d.geo && candidate.coordinates) {
      const g = this.d.geo.resolve(candidate.coordinates);
      if (g) candidate = { ...candidate, ...g };
    }

    const best = await this.d.resolver.bestMatch(candidate, all);

    if (best && best.score >= this.autoMerge) {
      const merged = mergeListings(best.listing, candidate);
      await this.d.listings.update(merged);
      return { action: "merged", listingId: best.listing.id, score: best.score };
    }

    const inserted = await this.d.listings.insert(candidate);

    if (best && best.score >= this.candidate) {
      const mc = await this.d.mergeCandidates.create({
        aId: best.listing.id,
        bId: inserted.id,
        score: best.score,
        features: { ...best.features },
      });
      await this.d.enqueue?.({ type: "MERGE_ADJUDICATE", payload: { candidateId: mc.id }, priority: 4 });
      return { action: "candidate", listingId: inserted.id, candidateId: mc.id, score: best.score };
    }

    return { action: "inserted", listingId: inserted.id, score: best?.score ?? 0 };
  }
}

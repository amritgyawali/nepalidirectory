/**
 * Entity resolution (prompt sec. 6.6): blocking → feature scoring → best match. Thresholds
 * (>=0.90 auto-merge, 0.65–0.90 candidate, <0.65 distinct) are applied by the AcquisitionService.
 *
 *   score = 0.4*trgm(name) + 0.3*phone_exact + 0.2*geo_proximity(<=150m) + 0.1*emb_cosine
 */
import type { Listing } from "../../enrich/types";
import { normalizeName, normalizePhone } from "./normalize";
import { cosineSimilarity, geohash, haversineMeters, trigramSimilarity } from "./similarity";

export type MergeFeatures = {
  nameTrgm: number;
  phoneExact: number;
  geoProximity: number;
  embeddingCosine: number;
};

export function scoreFeatures(f: MergeFeatures): number {
  return 0.4 * f.nameTrgm + 0.3 * f.phoneExact + 0.2 * f.geoProximity + 0.1 * f.embeddingCosine;
}

/** The subset of listing fields the resolver reads (works for Listing and NewListing). */
export type ResolvableListing = Pick<Listing, "name" | "phone" | "coordinates" | "categories">;

export type EmbedFn = (text: string) => Promise<number[]>;

export type MatchResult = { listing: Listing; score: number; features: MergeFeatures } | null;

function embedText(l: ResolvableListing): string {
  return `${normalizeName(l.name)} ${l.categories[0] ?? ""}`.trim();
}

export class EntityResolver {
  private readonly embed: EmbedFn;
  /** Trigram gate for geohash blocking (prompt sec. 6.6). */
  private readonly nameBlockThreshold: number;

  constructor(embed: EmbedFn, nameBlockThreshold = 0.35) {
    this.embed = embed;
    this.nameBlockThreshold = nameBlockThreshold;
  }

  /** Highest-scoring existing listing that blocks with `candidate`, or null. */
  async bestMatch(candidate: ResolvableListing, existing: Listing[]): Promise<MatchResult> {
    const candPhone = normalizePhone(candidate.phone);
    const candGeohash = candidate.coordinates
      ? geohash(candidate.coordinates.lat, candidate.coordinates.lng)
      : null;
    let candEmbed: number[] | null = null;
    let best: MatchResult = null;

    for (const ex of existing) {
      const phoneBlock = candPhone !== "" && candPhone === normalizePhone(ex.phone);
      let geoBlock = false;
      if (candGeohash && ex.coordinates) {
        geoBlock =
          geohash(ex.coordinates.lat, ex.coordinates.lng) === candGeohash &&
          trigramSimilarity(candidate.name, ex.name) > this.nameBlockThreshold;
      }
      if (!phoneBlock && !geoBlock) continue;

      const nameTrgm = trigramSimilarity(candidate.name, ex.name);
      const phoneExact = phoneBlock ? 1 : 0;
      const geoProximity =
        candidate.coordinates &&
        ex.coordinates &&
        haversineMeters(candidate.coordinates, ex.coordinates) <= 150
          ? 1
          : 0;

      if (candEmbed === null) candEmbed = await this.embed(embedText(candidate));
      const embeddingCosine = cosineSimilarity(candEmbed, await this.embed(embedText(ex)));

      const features: MergeFeatures = { nameTrgm, phoneExact, geoProximity, embeddingCosine };
      const score = scoreFeatures(features);
      if (!best || score > best.score) best = { listing: ex, score, features };
    }
    return best;
  }
}

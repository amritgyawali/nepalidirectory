import type { Listing } from "@/lib/enrich";
import { cityDirectoryPages } from "@/lib/city-pages";
import { summarizeDescriptionTemplates, type TemplateGroup } from "@/lib/description-uniqueness";
import { getAllDirectoryListings, evaluateListingIndexEligibility, listingMatchesCity } from "@/lib/public-listings";
import { summarizeDirectoryCounts, type DirectoryCounts } from "@/lib/directory-counts";

/**
 * Turns the publication gate into an operating instrument (audit sec. 5.4).
 *
 * `evaluateListingIndexEligibility` already returns every reason a record cannot be published, but
 * nothing persisted or aggregated those reasons, so the team could see that a category page was
 * empty without being able to see why or how expensive the repair would be. This module answers:
 * which check fails, how often, in which city/category/source, and how many records are a single
 * fix away from qualifying.
 */
export type DimensionCount = { key: string; records: number };

export type EligibilityFailureRow = {
  reason: string;
  records: number;
  /** Share of all discovered records blocked by this reason (0-1). */
  share: number;
  categories: DimensionCount[];
  cities: DimensionCount[];
  sources: DimensionCount[];
  /** Records blocked only by this reason: fixing it publishes them immediately. */
  soleBlockerFor: number;
};

export type NearMissRecord = {
  slug: string;
  name: string;
  area: string;
  reason: string;
  dataSource: string;
  daysSinceAcquisition: number | null;
};

export type EligibilityReport = {
  generatedAt: Date;
  counts: DirectoryCounts;
  /** qualified / discovered, 0-1. */
  qualificationRate: number;
  failures: EligibilityFailureRow[];
  /** Records failing exactly one check, ordered by the cheapest reason first. */
  nearMisses: NearMissRecord[];
  /** Repeated description templates among already-qualified records. */
  templateGroups: TemplateGroup[];
};

function daysSince(date: Date | null | undefined, now: Date): number | null {
  if (!date) return null;
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return null;
  return Math.max(0, Math.floor((now.getTime() - value.getTime()) / 86_400_000));
}

function topDimensions(counter: Map<string, number>, limit = 6): DimensionCount[] {
  return [...counter.entries()]
    .map(([key, records]) => ({ key, records }))
    .sort((a, b) => b.records - a.records || a.key.localeCompare(b.key))
    .slice(0, limit);
}

function increment(counter: Map<string, number>, key: string): void {
  counter.set(key, (counter.get(key) ?? 0) + 1);
}

function cityKeyFor(listing: Listing): string {
  const page = cityDirectoryPages.find((city) => listingMatchesCity(listing, city.slug));
  return page?.slug ?? (listing.area.trim().toLowerCase() || "unknown");
}

export function buildEligibilityReport(
  listings: readonly Listing[],
  now: Date = new Date(),
): EligibilityReport {
  const qualified: Listing[] = [];
  const byReason = new Map<
    string,
    {
      records: number;
      soleBlockerFor: number;
      categories: Map<string, number>;
      cities: Map<string, number>;
      sources: Map<string, number>;
    }
  >();
  const nearMisses: NearMissRecord[] = [];

  for (const listing of listings) {
    const { eligible, reasons } = evaluateListingIndexEligibility(listing);
    if (eligible) {
      qualified.push(listing);
      continue;
    }

    const cityKey = cityKeyFor(listing);
    const categoryKey = listing.categories.find((category) => category && category !== "uncategorized")
      ?? "uncategorized";
    const sourceKey = listing.dataSource || "unknown";

    for (const reason of reasons) {
      const bucket = byReason.get(reason) ?? {
        records: 0,
        soleBlockerFor: 0,
        categories: new Map<string, number>(),
        cities: new Map<string, number>(),
        sources: new Map<string, number>(),
      };
      bucket.records += 1;
      if (reasons.length === 1) bucket.soleBlockerFor += 1;
      increment(bucket.categories, categoryKey);
      increment(bucket.cities, cityKey);
      increment(bucket.sources, sourceKey);
      byReason.set(reason, bucket);
    }

    if (reasons.length === 1) {
      nearMisses.push({
        slug: listing.slug,
        name: listing.name,
        area: listing.area,
        reason: reasons[0],
        dataSource: listing.dataSource || "unknown",
        daysSinceAcquisition: daysSince(listing.createdAt, now),
      });
    }
  }

  const discovered = listings.length;
  const failures: EligibilityFailureRow[] = [...byReason.entries()]
    .map(([reason, bucket]) => ({
      reason,
      records: bucket.records,
      share: discovered ? bucket.records / discovered : 0,
      categories: topDimensions(bucket.categories),
      cities: topDimensions(bucket.cities),
      sources: topDimensions(bucket.sources),
      soleBlockerFor: bucket.soleBlockerFor,
    }))
    .sort((a, b) => b.records - a.records || a.reason.localeCompare(b.reason));

  nearMisses.sort(
    (a, b) => a.reason.localeCompare(b.reason) || a.name.localeCompare(b.name, "en"),
  );

  return {
    generatedAt: now,
    counts: summarizeDirectoryCounts(listings, qualified),
    qualificationRate: discovered ? qualified.length / discovered : 0,
    failures,
    nearMisses,
    templateGroups: summarizeDescriptionTemplates(qualified),
  };
}

export async function getEligibilityReport(): Promise<EligibilityReport> {
  return buildEligibilityReport(await getAllDirectoryListings());
}

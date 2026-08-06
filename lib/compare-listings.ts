import { cache } from "react";
import type { ComparedBusiness } from "./compare";
import type { Listing } from "./enrich";
import { getDirectoryCategory, listingMatchesDirectoryCategory } from "./directory-categories";
import { getIndexableListings, listingDescription } from "./public-listings";

/** How many providers a populated comparison page shows. */
export const COMPARE_LIST_SIZE = 10;

/**
 * Comparison pages are only meaningful with enough providers to actually compare. Below this,
 * the page keeps its "comparison pending" state rather than presenting two or three businesses
 * as though they were a considered shortlist.
 */
export const MIN_COMPARABLE_PROVIDERS = 10;

/**
 * Maps a comparison guide to the directory category that supplies its providers. Only categories
 * with real reviewed inventory are listed; the remaining comparison guides stay unpopulated by
 * design rather than being filled with invented businesses.
 */
const compareCategorySources: Record<string, string> = {
  "dental-clinics": "dentists",
  contractors: "construction",
  "hardware-stores": "hardware-stores",
  "clothing-stores": "clothing-stores",
  "it-companies": "it-companies",
  tailors: "tailors",
  "footwear-shops": "footwear",
  photography: "photography",
};

/**
 * The ordering criterion, stated in one place so the page can describe it accurately to readers.
 *
 * This is deliberately NOT a review ranking. No listing in this directory carries a
 * `google_place_id`, so the legacy `rating`/`reviews` columns have no verifiable provenance and
 * are never surfaced (see `listingToBusiness`, which pins both to zero). Ordering here uses the
 * directory's own `qualityScore` — how complete and how well-sourced the published record is —
 * which is a claim the site can actually stand behind.
 */
export const COMPARE_RANKING_BASIS =
  "Ordered by directory record completeness and source verification, not by star ratings. NepaliDirectory does not collect or republish Google or social media review scores, so no ranking here should be read as a quality verdict. Contact each provider and compare them yourself using the criteria above.";

function strengthsFor(listing: Listing): string[] {
  const strengths: string[] = [];
  if (listing.phone?.trim()) strengths.push("Published phone contact");
  if (listing.website?.trim()) strengths.push("Published website");
  if (listing.address?.trim()) strengths.push("Verified street address");
  if (listing.verificationStatus === "owner_verified") strengths.push("Ownership verified");
  else if (listing.verificationStatus === "source_verified") strengths.push("Source checked");
  if (listing.hoursToday?.trim()) strengths.push("Opening hours published");
  if (listing.services?.length) strengths.push(`Lists ${listing.services.length} services`);
  if (listing.coordinates) strengths.push("Mapped location");
  return strengths.slice(0, 4);
}

function verdictFor(listing: Listing, categoryName: string): string {
  const where = listing.neighborhood?.trim() || listing.area?.trim();
  const locality = where ? ` in ${where}` : "";
  const reach = listing.phone?.trim() && listing.website?.trim()
    ? "Reachable by phone and website"
    : listing.phone?.trim()
      ? "Reachable by phone"
      : "Contactable via its published details";
  return `A published ${categoryName.toLowerCase()} record${locality}. ${reach}. Confirm current services, availability and pricing directly before deciding.`;
}

/**
 * Builds the provider list for a comparison guide from real reviewed listings.
 * Returns an empty array when the category has no mapped source or too few providers to compare.
 */
export const getComparedBusinesses = cache(async function getComparedBusinesses(
  compareSlug: string,
): Promise<ComparedBusiness[]> {
  const directorySlug = compareCategorySources[compareSlug];
  if (!directorySlug) return [];

  const category = getDirectoryCategory(directorySlug);
  if (!category) return [];

  const matching = (await getIndexableListings()).filter((listing) =>
    listingMatchesDirectoryCategory(listing, category),
  );
  if (matching.length < MIN_COMPARABLE_PROVIDERS) return [];

  return [...matching]
    .sort(
      (a, b) =>
        (b.qualityScore ?? 0) - (a.qualityScore ?? 0) ||
        a.name.localeCompare(b.name, "en"),
    )
    .slice(0, COMPARE_LIST_SIZE)
    .map((listing, index) => ({
      rank: index + 1,
      name: listing.name,
      area: listing.neighborhood?.trim() || listing.area || "Nepal",
      bestFor: category.name,
      phone: listing.phone ?? "",
      // Listing images are only published when independently verified as depicting the business,
      // so the comparison table uses the category illustration rather than an unverified photo.
      image: "",
      imageAlt: "",
      strengths: strengthsFor(listing),
      verdict: verdictFor(listing, category.name),
      slug: listing.slug,
      address: listing.address,
      website: listing.website,
      summary: listingDescription(listing),
    }));
});

/** Comparison slugs that currently resolve to a populated provider list. */
export async function getPopulatedCompareSlugs(): Promise<Set<string>> {
  const entries = await Promise.all(
    Object.keys(compareCategorySources).map(
      async (slug) => [slug, (await getComparedBusinesses(slug)).length > 0] as const,
    ),
  );
  return new Set(entries.filter(([, populated]) => populated).map(([slug]) => slug));
}

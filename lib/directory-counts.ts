import { cityDirectoryPages, type CityDirectoryPage } from "@/lib/city-pages";
import {
  directoryCategories,
  listingMatchesDirectoryCategory,
  type DirectoryCategory,
} from "@/lib/directory-categories";
import { MIN_INDEXABLE_DIRECTORY_RESULTS } from "@/lib/directory-pagination";
import type { Listing } from "@/lib/enrich";
import {
  getAllDirectoryListings,
  getIndexableListings,
  isIndexableListing,
  isVerifiedListingImage,
  listingMatchesCity,
} from "@/lib/public-listings";

/**
 * The single count service (audit sec. 6). Homepage, city pages, category pages, llms.txt,
 * sitemaps and the admin dashboard all read counts from here, so a number rendered as
 * "qualified public profiles" is provably the same population the sitemap publishes.
 *
 * Every field maps to exactly one key in `lib/trust-vocabulary.ts`. Do not add a count whose
 * predicate is not expressible in that vocabulary.
 */
export type DirectoryCounts = {
  /** Every previewable record, reviewed or not. Never labelled "verified" in public UI. */
  discovered: number;
  /** Records with an auditable source reference and a recorded check date. */
  sourceChecked: number;
  /** Records that pass the full publication gate — the only number a public page may headline. */
  qualified: number;
  ownershipVerified: number;
  withVerifiedImage: number;
  /** City and category hubs that currently clear the minimum-qualified threshold. */
  qualifiedCities: number;
  qualifiedCategories: number;
};

export function countQualifiedInCity(listings: readonly Listing[], citySlug: string): number {
  return listings.filter((listing) => listingMatchesCity(listing, citySlug)).length;
}

export function countQualifiedInCategory(
  listings: readonly Listing[],
  category: DirectoryCategory,
): number {
  return listings.filter((listing) => listingMatchesDirectoryCategory(listing, category)).length;
}

export function countQualifiedInCityCategory(
  listings: readonly Listing[],
  citySlug: string,
  category: DirectoryCategory,
): number {
  return listings.filter(
    (listing) =>
      listingMatchesCity(listing, citySlug) && listingMatchesDirectoryCategory(listing, category),
  ).length;
}

export function meetsPublicationThreshold(count: number): boolean {
  return count >= MIN_INDEXABLE_DIRECTORY_RESULTS;
}

/**
 * Hubs are published only when enough qualified profiles back them. These two helpers are the
 * shared definition behind the homepage strips, the sitemap filters and the llms.txt resource
 * list, so those three surfaces can never disagree about what exists.
 */
export function selectQualifiedCities(
  qualifiedListings: readonly Listing[],
): CityDirectoryPage[] {
  return cityDirectoryPages.filter((city) =>
    meetsPublicationThreshold(countQualifiedInCity(qualifiedListings, city.slug)),
  );
}

export function selectQualifiedCategories(
  qualifiedListings: readonly Listing[],
): DirectoryCategory[] {
  return directoryCategories.filter((category) =>
    meetsPublicationThreshold(countQualifiedInCategory(qualifiedListings, category)),
  );
}

export function summarizeDirectoryCounts(
  allListings: readonly Listing[],
  qualifiedListings: readonly Listing[] = allListings.filter(isIndexableListing),
): DirectoryCounts {
  return {
    discovered: allListings.length,
    sourceChecked: allListings.filter(
      (listing) => Boolean(listing.sourceRef?.trim()) && Boolean(listing.sourceCheckedAt),
    ).length,
    qualified: qualifiedListings.length,
    ownershipVerified: qualifiedListings.filter(
      (listing) => listing.verificationStatus === "owner_verified" && listing.claimed,
    ).length,
    withVerifiedImage: qualifiedListings.filter(isVerifiedListingImage).length,
    qualifiedCities: selectQualifiedCities(qualifiedListings).length,
    qualifiedCategories: selectQualifiedCategories(qualifiedListings).length,
  };
}

export async function getDirectoryCounts(): Promise<DirectoryCounts> {
  const allListings = await getAllDirectoryListings();
  return summarizeDirectoryCounts(allListings);
}

/** Convenience readers for pages that only need one number. */
export async function getQualifiedCityCount(citySlug: string): Promise<number> {
  return countQualifiedInCity(await getIndexableListings(), citySlug);
}

export async function getQualifiedCategoryCount(category: DirectoryCategory): Promise<number> {
  return countQualifiedInCategory(await getIndexableListings(), category);
}

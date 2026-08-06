import { getCityDirectoryPage } from "@/lib/city-pages";
import { selectDistinctlyDescribed } from "@/lib/description-uniqueness";
import {
  getDirectoryCategory,
  listingMatchesDirectoryCategory,
  type DirectoryCategory,
} from "@/lib/directory-categories";
import type { Listing } from "@/lib/enrich";
import { getIndexableListings, isVerifiedListingImage, listingMatchesCity } from "@/lib/public-listings";
import { getCityCategoryHref } from "@/lib/routes";

/**
 * Cluster-first repair queue (audit sec. 5.4 and sec. 22).
 *
 * Reviewing records in acquisition order spreads effort across pages that all stay below the
 * publication threshold. Reviewing whole city+category clusters converts the same effort into
 * complete, publishable hubs. These are the first ten clusters, with the extra evidence each one
 * needs beyond a bare qualified count.
 */
export type PriorityCluster = {
  citySlug: string;
  categorySlug: string;
  /** Qualified profiles required before this hub is worth promoting. */
  minQualified: number;
  /** The cluster-specific evidence a reviewer must capture, not just a count. */
  extraRequirement: string;
};

export const priorityClusters: readonly PriorityCluster[] = [
  { citySlug: "kathmandu", categorySlug: "dentists", minQualified: 15, extraRequirement: "Credentials and source clarity" },
  { citySlug: "kathmandu", categorySlug: "it-companies", minQualified: 20, extraRequirement: "Unique services and technologies" },
  { citySlug: "pokhara", categorySlug: "hotels", minQualified: 20, extraRequirement: "Real images and booking details" },
  { citySlug: "kathmandu", categorySlug: "restaurants", minQualified: 25, extraRequirement: "Menu, cuisine and locality facts" },
  { citySlug: "butwal", categorySlug: "photography", minQualified: 15, extraRequirement: "Portfolio and coverage facts" },
  { citySlug: "kathmandu", categorySlug: "hospitals", minQualified: 15, extraRequirement: "Department and intake verification" },
  { citySlug: "kathmandu", categorySlug: "schools", minQualified: 20, extraRequirement: "Curriculum and grade facts" },
  { citySlug: "kathmandu", categorySlug: "hardware-stores", minQualified: 15, extraRequirement: "Product and service detail" },
  { citySlug: "kathmandu", categorySlug: "tailors", minQualified: 15, extraRequirement: "Specialisms and locality" },
  { citySlug: "kathmandu", categorySlug: "construction", minQualified: 15, extraRequirement: "Services and credentials" },
];

/**
 * A hub is only useful when several of its profiles carry evidence a phone book cannot: a real
 * photo of the business, and facts that are not the category template with the name swapped.
 */
export const CLUSTER_MIN_VERIFIED_IMAGES = 5;
export const CLUSTER_MIN_DISTINCT_DESCRIPTIONS = 5;

export type ClusterReadiness = {
  cluster: PriorityCluster;
  label: string;
  href: string;
  qualified: number;
  withVerifiedImage: number;
  distinctlyDescribed: number;
  ready: boolean;
  /** Human-readable gaps, empty when the cluster is publishable. */
  blockers: string[];
};

export function evaluateClusterReadiness(
  cluster: PriorityCluster,
  qualifiedListings: readonly Listing[],
): ClusterReadiness {
  const category = getDirectoryCategory(cluster.categorySlug);
  const city = getCityDirectoryPage(cluster.citySlug);
  const members = category
    ? qualifiedListings.filter(
        (listing) =>
          listingMatchesCity(listing, cluster.citySlug) &&
          listingMatchesDirectoryCategory(listing, category as DirectoryCategory),
      )
    : [];

  const withVerifiedImage = members.filter(isVerifiedListingImage).length;
  const distinctlyDescribed = selectDistinctlyDescribed(members).length;
  const blockers: string[] = [];

  if (!category) blockers.push(`Unknown category "${cluster.categorySlug}"`);
  if (members.length < cluster.minQualified) {
    blockers.push(
      `${cluster.minQualified - members.length} more qualified profiles needed (${members.length}/${cluster.minQualified})`,
    );
  }
  if (withVerifiedImage < CLUSTER_MIN_VERIFIED_IMAGES) {
    blockers.push(
      `${CLUSTER_MIN_VERIFIED_IMAGES - withVerifiedImage} more profiles need a verified image`,
    );
  }
  if (distinctlyDescribed < CLUSTER_MIN_DISTINCT_DESCRIPTIONS) {
    blockers.push(
      `${CLUSTER_MIN_DISTINCT_DESCRIPTIONS - distinctlyDescribed} more profiles need facts beyond the category template`,
    );
  }

  return {
    cluster,
    label: `${category?.name ?? cluster.categorySlug} in ${city?.name ?? cluster.citySlug}`,
    href: getCityCategoryHref(cluster.citySlug, cluster.categorySlug),
    qualified: members.length,
    withVerifiedImage,
    distinctlyDescribed,
    ready: blockers.length === 0,
    blockers,
  };
}

export function evaluatePriorityClusters(
  qualifiedListings: readonly Listing[],
): ClusterReadiness[] {
  return priorityClusters
    .map((cluster) => evaluateClusterReadiness(cluster, qualifiedListings))
    .sort((a, b) => a.blockers.length - b.blockers.length || b.qualified - a.qualified);
}

export async function getPriorityClusterReadiness(): Promise<ClusterReadiness[]> {
  return evaluatePriorityClusters(await getIndexableListings());
}

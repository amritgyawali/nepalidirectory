import type { CityDirectoryPage } from "@/lib/city-pages";
import { listingMatchesDirectoryCategory, type DirectoryCategory } from "@/lib/directory-categories";
import type { Listing } from "@/lib/enrich";
import { listingMatchesCity } from "@/lib/public-listings";

export const RELATED_LISTINGS_LIMIT = 6;

/**
 * Sibling profiles to link from a business page. Hubs paginate 24 profiles per page, so most
 * listings were reachable from a single deep link and Google left them "Discovered – currently
 * not indexed". Taking the next profiles in a fixed slug order (wrapping round) gives every
 * listing in a group the same number of inbound links, and the links stay stable between renders.
 *
 * Groups are tried from most to least specific: same category in the same city, the same
 * category anywhere, then anything in the same city.
 */
export function selectRelatedListings(
  listing: Listing,
  pool: readonly Listing[],
  context: { category?: DirectoryCategory; city?: CityDirectoryPage },
  limit = RELATED_LISTINGS_LIMIT,
): Listing[] {
  const { category, city } = context;
  const inCategory = (candidate: Listing) =>
    Boolean(category && listingMatchesDirectoryCategory(candidate, category));
  const inCity = (candidate: Listing) => Boolean(city && listingMatchesCity(candidate, city.slug));
  const groups: Array<(candidate: Listing) => boolean> = [
    (candidate) => inCategory(candidate) && inCity(candidate),
    inCategory,
    inCity,
  ];

  const ordered = [...pool].sort((a, b) => a.slug.localeCompare(b.slug));
  const selected = new Map<string, Listing>();

  for (const matches of groups) {
    const group = ordered.filter(matches);
    const start = group.findIndex((candidate) => candidate.slug > listing.slug);
    const offset = start === -1 ? 0 : start;
    for (let step = 0; step < group.length && selected.size < limit; step += 1) {
      const candidate = group[(offset + step) % group.length];
      if (candidate.slug !== listing.slug) selected.set(candidate.slug, candidate);
    }
    if (selected.size >= limit) break;
  }

  return [...selected.values()];
}

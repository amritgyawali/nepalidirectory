import { businesses, type Business } from "@/lib/data";
import { createListingRepository, type Listing } from "@/lib/enrich";

const PLACEHOLDER_HOSTS = new Set(["example.com", "www.example.com"]);

function hasPlaceholderContact(listing: Listing): boolean {
  if (listing.email?.toLowerCase().endsWith(".example")) return true;
  if (!listing.website) return false;
  try {
    return PLACEHOLDER_HOSTS.has(new URL(listing.website).hostname.toLowerCase());
  } catch {
    return true;
  }
}

export function isDemoListing(listing: Listing): boolean {
  return listing.dataSource === "demo" || hasPlaceholderContact(listing);
}

/**
 * One gate for every index-producing surface. A listing must be active, complete, reviewed and
 * supported by meaningful provenance. Demo/placeholder rows are always excluded.
 */
export function isIndexableListing(listing: Listing): boolean {
  const trustedSource = ["owner", "osm", "import", "google_ondemand_reviewed"].includes(listing.dataSource);
  return Boolean(
    listing.active !== false &&
      !isDemoListing(listing) &&
      !listing.needsCategoryReview &&
      listing.qualityScore >= 55 &&
      listing.name.trim() &&
      listing.address.trim() &&
      listing.categories.some((category) => category && category !== "uncategorized") &&
      (listing.claimed || listing.verified || trustedSource),
  );
}

export function canPreviewListing(listing: Listing): boolean {
  return listing.active !== false && Boolean(listing.name.trim() && listing.slug.trim());
}

export async function getDirectoryListing(slug: string): Promise<Listing | null> {
  return createListingRepository().getBySlug(slug);
}

export async function getAllDirectoryListings(): Promise<Listing[]> {
  return (await createListingRepository().all()).filter(canPreviewListing);
}

export async function getIndexableListings(): Promise<Listing[]> {
  return (await getAllDirectoryListings()).filter(isIndexableListing);
}

export function getSeedBusiness(slug: string): Business | undefined {
  return businesses.find((business) => business.slug === slug);
}

export function listingDescription(listing: Listing): string {
  if (listing.description?.trim()) return listing.description.trim();
  const seed = isDemoListing(listing) ? getSeedBusiness(listing.slug) : undefined;
  if (seed?.quote) return seed.quote;
  const services = listing.services?.slice(0, 4).join(", ");
  return services
    ? `${listing.name} lists ${services} in ${listing.area}. Confirm current availability, pricing and service details directly.`
    : `${listing.name} is a local directory profile for ${listing.area}. Confirm current contact details, hours, pricing and availability directly.`;
}

export function listingFactsCheckedAt(listing: Listing): string | undefined {
  const date = listing.updatedAt ?? listing.aiEnrichedAt ?? listing.createdAt;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined;
}

const kathmanduLocalities = new Set([
  "kathmandu", "thamel", "boudha", "dilli bazar", "lazimpat", "putalisadak",
  "new baneshwor", "tripureshwor", "baluwatar", "naxal", "durbar marg",
]);

export function listingMatchesCity(listing: Listing, citySlug: string): boolean {
  const values = [listing.area, listing.neighborhood, listing.municipality, listing.district]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.toLowerCase());
  if (values.some((value) => value === citySlug || value.includes(citySlug))) return true;
  return citySlug === "kathmandu" && values.some((value) => kathmanduLocalities.has(value));
}

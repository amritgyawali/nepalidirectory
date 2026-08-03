import type { Business } from "@/lib/data";
import { createListingRepository, type Listing } from "@/lib/enrich";

const PLACEHOLDER_HOSTS = new Set(["example.com", "www.example.com"]);
const STOCK_IMAGE_HOSTS = new Set(["images.unsplash.com", "unsplash.com", "www.unsplash.com"]);

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

function hasAuditableSource(listing: Listing): boolean {
  if (!listing.sourceRef?.trim() || !listing.sourceCheckedAt) return false;

  if (listing.verificationStatus === "owner_verified") {
    return Boolean(listing.claimed && listing.verified);
  }

  return Boolean(
    listing.verificationStatus === "source_verified" &&
      listing.verified &&
      ["osm", "import", "google_ondemand_reviewed", "official", "owner"].includes(
        listing.dataSource,
      ),
  );
}

/**
 * One gate for every index-producing surface. A listing must be active, complete, reviewed and
 * supported by meaningful provenance. Demo/placeholder rows are always excluded.
 */
export function evaluateListingIndexEligibility(listing: Listing): {
  eligible: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  if (listing.active === false) reasons.push("INACTIVE");
  if (isDemoListing(listing)) reasons.push("DEMO_OR_PLACEHOLDER");
  if (listing.verificationStatus === "rejected") reasons.push("REJECTED");
  if (listing.needsCategoryReview) reasons.push("CATEGORY_REVIEW_REQUIRED");
  if (listing.qualityScore < 55) reasons.push("LOW_QUALITY_SCORE");
  if (!listing.name.trim()) reasons.push("MISSING_NAME");
  if (!listing.address.trim()) reasons.push("MISSING_ADDRESS");
  if (!listing.description?.trim() || listing.description.trim().length < 80) {
    reasons.push("INSUFFICIENT_REVIEWED_DESCRIPTION");
  }
  if (!listing.categories.some((category) => category && category !== "uncategorized")) {
    reasons.push("MISSING_CATEGORY");
  }
  if (!listing.phone?.trim() && !listing.website?.trim()) reasons.push("MISSING_CONTACT");
  if (!listing.contentReviewedAt) reasons.push("CONTENT_NOT_REVIEWED");
  if (!hasAuditableSource(listing)) reasons.push("SOURCE_NOT_AUDITABLE");
  return { eligible: reasons.length === 0, reasons };
}

export function isIndexableListing(listing: Listing): boolean {
  return evaluateListingIndexEligibility(listing).eligible;
}

export function listingVerificationLabel(listing: Listing): string {
  if (listing.verificationStatus === "owner_verified") return "Ownership verified";
  if (listing.verificationStatus === "source_verified") return "Source checked";
  if (listing.verificationStatus === "community_submitted") return "Community submitted";
  if (listing.verificationStatus === "rejected") return "Rejected record";
  return "Verification pending";
}

export function isVerifiedListingImage(listing: Listing): boolean {
  if (!listing.image || !listing.imageVerified) return false;
  if (listing.image.startsWith("/")) return !listing.image.endsWith("/icon.svg");
  try {
    return !STOCK_IMAGE_HOSTS.has(new URL(listing.image).hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function publicListingImage(listing: Listing): string | undefined {
  return isVerifiedListingImage(listing) ? listing.image : undefined;
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

function titleCaseSlug(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

/**
 * Convert the persisted listing shape into the card/search shape used by the public directory.
 * Optional marketing-only values are read from `attributes` when an importer supplied them.
 */
export function listingToBusiness(listing: Listing): Business {
  const attributes = listing.attributes ?? {};
  const stringArray = (key: string): string[] => {
    const value = attributes[key];
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  };
  const years = typeof attributes.years === "number" ? attributes.years : undefined;
  const delivery = typeof attributes.delivery === "boolean" ? attributes.delivery : undefined;

  return {
    rank: listing.id,
    name: listing.name,
    slug: listing.slug,
    categories: listing.categories.map(titleCaseSlug),
    area: listing.area,
    neighborhood: listing.neighborhood,
    address: listing.address,
    phone: listing.phone ?? "",
    website: listing.website,
    email: listing.email,
    // Legacy aggregate columns are deliberately not exposed. A future review repository must
    // compute these values from approved, visible, first-party reviews.
    rating: 0,
    reviews: 0,
    price: 0,
    status: listing.status ?? "closed",
    hoursToday: listing.hoursToday ?? "Hours not provided",
    image: publicListingImage(listing) ?? "/icon.svg",
    quote: listingDescription(listing),
    amenities: listing.amenities,
    years,
    delivery,
    verified: listing.verified,
    claimed: listing.claimed,
    coordinates: listing.coordinates,
    serviceAreas: stringArray("serviceAreas"),
    services: listing.services,
    specialties: stringArray("specialties"),
    paymentMethods: stringArray("paymentMethods"),
    languages: stringArray("languages"),
    credentials: stringArray("credentials"),
  };
}

export function listingDescription(listing: Listing): string {
  if (listing.description?.trim()) return listing.description.trim();
  const services = listing.services?.slice(0, 4).join(", ");
  return services
    ? `${listing.name} lists ${services} in ${listing.area}. Confirm current availability, pricing and service details directly.`
    : `${listing.name} is a local directory profile for ${listing.area}. Confirm current contact details, hours, pricing and availability directly.`;
}

export function listingFactsCheckedAt(listing: Listing): string | undefined {
  const date = listing.sourceCheckedAt;
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

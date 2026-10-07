import type { Listing } from "@/lib/enrich";
import { siteUrl } from "@/lib/blog";
import { publicListingImage } from "@/lib/public-listings";
import { getBusinessHref } from "@/lib/routes";
import { getEvergreenUrl, type EvergreenPage } from "./evergreen";

/**
 * Ordered most-specific first: `.find()` returns the first hit, so a broader needle placed above a
 * narrower one would shadow it. `dental-clinic` must reach `Dentist` before `clinic` maps it to the
 * vaguer `MedicalClinic`, and `shoe-store`/`hardware-store` must resolve before the bare `shop`
 * catch-all. Every value is a real schema.org LocalBusiness subtype.
 */
const subtypeByCategory: Array<[string, string]> = [
  ["dentist", "Dentist"],
  ["dental", "Dentist"],
  ["restaurant", "Restaurant"],
  ["cafe", "CafeOrCoffeeShop"],
  ["hotel", "Hotel"],
  ["hospital", "Hospital"],
  ["clinic", "MedicalClinic"],
  ["doctor", "MedicalClinic"],
  ["plumber", "Plumber"],
  ["electrician", "Electrician"],
  ["lawyer", "LegalService"],
  ["legal", "LegalService"],
  ["school", "School"],
  ["it-compan", "ProfessionalService"],
  ["it-services", "ProfessionalService"],
  ["software", "ProfessionalService"],
  ["computer-services", "ProfessionalService"],
  ["engineering", "ProfessionalService"],
  ["photograph", "ProfessionalService"],
  ["videograph", "ProfessionalService"],
  ["contractor", "GeneralContractor"],
  ["construction", "GeneralContractor"],
  ["hardware", "HardwareStore"],
  ["building-supplies", "HardwareStore"],
  ["shoe", "ShoeStore"],
  ["footwear", "ShoeStore"],
  ["clothing", "ClothingStore"],
  ["fashion", "ClothingStore"],
  ["boutique", "ClothingStore"],
  ["tailor", "ClothingStore"],
  ["furniture", "FurnitureStore"],
  ["home-furnishing", "FurnitureStore"],
  ["shop", "Store"],
  ["store", "Store"],
];

export function localBusinessSubtype(categories: string[]): string {
  const text = categories.join(" ").toLowerCase();
  return subtypeByCategory.find(([needle]) => text.includes(needle))?.[1] ?? "LocalBusiness";
}

const schemaDays = new Set(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
const clockTime = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Maps `attributes.weeklyHours` (as supplied by owners or importers) to
 * OpeningHoursSpecification. Malformed rows are dropped rather than guessed, and closed days are
 * omitted, which schema.org reads as "not open".
 */
export function buildOpeningHoursSpecification(attributes: Record<string, unknown> | undefined) {
  const rows = attributes?.weeklyHours;
  if (!Array.isArray(rows)) return undefined;
  const specs = rows.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const { dayOfWeek, opens, closes, closed } = row as Record<string, unknown>;
    if (closed === true) return [];
    if (typeof dayOfWeek !== "string" || !schemaDays.has(dayOfWeek)) return [];
    if (typeof opens !== "string" || typeof closes !== "string") return [];
    if (!clockTime.test(opens) || !clockTime.test(closes)) return [];
    return [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${dayOfWeek}`,
      opens,
      closes,
    }];
  });
  return specs.length ? specs : undefined;
}

function safeHttpsUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Schema for the normalized production listing model used by /business/[slug]. */
export function buildListingLocalBusinessJsonLd(listing: Listing, url: string) {
  const verifiedImage = publicListingImage(listing);
  const website = safeHttpsUrl(listing.website);
  const locality = listing.municipality ?? listing.area;
  const services = (listing.services ?? []).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": localBusinessSubtype(listing.categories),
    "@id": `${url}#localbusiness`,
    name: listing.name,
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    image: verifiedImage,
    description: listing.description,
    telephone: listing.phone,
    email: listing.email,
    // The business's own site identifies the same entity, which helps engines merge references.
    sameAs: website ? [website] : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: locality,
      addressRegion: listing.province,
      addressCountry: "NP",
    },
    areaServed: locality ? { "@type": "City", name: locality } : undefined,
    geo: listing.coordinates
      ? {
          "@type": "GeoCoordinates",
          latitude: listing.coordinates.lat,
          longitude: listing.coordinates.lng,
        }
      : undefined,
    hasMap: listing.coordinates
      ? `https://www.openstreetmap.org/?mlat=${listing.coordinates.lat}&mlon=${listing.coordinates.lng}#map=18/${listing.coordinates.lat}/${listing.coordinates.lng}`
      : undefined,
    openingHoursSpecification: buildOpeningHoursSpecification(listing.attributes),
    hasOfferCatalog: services.length
      ? {
          "@type": "OfferCatalog",
          name: `${listing.name} services`,
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: service },
          })),
        }
      : undefined,
    // Review markup is intentionally absent until approved reviewer-level records exist and are
    // rendered visibly on this same public profile.
    amenityFeature: listing.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
  };
}

/** `pageUrl` anchors the list as `<pageUrl>#breadcrumb`, the id the WebPage node references. */
export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>, pageUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(pageUrl ? { "@id": `${pageUrl}#breadcrumb` } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildEvergreenItemListJsonLd(page: EvergreenPage) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.title,
    url: getEvergreenUrl(page),
    numberOfItems: page.listings.length,
    itemListElement: page.listings.map((business, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: business.name,
      url: `${siteUrl}${getBusinessHref(business.slug)}`,
    })),
  };
}

/** Compact result-page schema: detailed LocalBusiness facts belong on the canonical profile. */
export function buildListingItemListJsonLd(
  name: string,
  url: string,
  listings: readonly Listing[],
  positionOffset = 0,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#itemlist`,
    name,
    url,
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: positionOffset + index + 1,
      name: listing.name,
      url: `${siteUrl}${getBusinessHref(listing.slug)}`,
    })),
  };
}

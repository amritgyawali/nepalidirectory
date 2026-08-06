import type { Listing } from "@/lib/enrich";
import { siteUrl } from "@/lib/blog";
import { publicListingImage } from "@/lib/public-listings";
import { getBusinessHref } from "@/lib/routes";
import { publisher } from "@/lib/seo";
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

/** Schema for the normalized production listing model used by /business/[slug]. */
export function buildListingLocalBusinessJsonLd(listing: Listing, url: string) {
  const verifiedImage = publicListingImage(listing);
  return {
    "@context": "https://schema.org",
    "@type": localBusinessSubtype(listing.categories),
    "@id": `${url}#localbusiness`,
    name: listing.name,
    url,
    image: verifiedImage,
    description: listing.description,
    telephone: listing.phone,
    email: listing.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.municipality ?? listing.area,
      addressRegion: listing.province,
      addressCountry: "NP",
    },
    geo: listing.coordinates
      ? {
          "@type": "GeoCoordinates",
          latitude: listing.coordinates.lat,
          longitude: listing.coordinates.lng,
        }
      : undefined,
    // Review markup is intentionally absent until approved reviewer-level records exist and are
    // rendered visibly on this same public profile.
    amenityFeature: listing.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
    publisher,
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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

import type { Business } from "@/lib/data";
import type { Listing } from "@/lib/enrich";
import { siteUrl } from "@/lib/blog";
import { getBusinessHref } from "@/lib/routes";
import { publisher } from "@/lib/seo";
import { getEvergreenUrl, type EvergreenPage } from "./evergreen";

const subtypeByCategory: Array<[string, string]> = [
  ["restaurant", "Restaurant"],
  ["cafe", "CafeOrCoffeeShop"],
  ["hotel", "Hotel"],
  ["hospital", "Hospital"],
  ["clinic", "MedicalClinic"],
  ["doctor", "MedicalClinic"],
  ["dentist", "Dentist"],
  ["plumber", "Plumber"],
  ["electrician", "Electrician"],
  ["lawyer", "LegalService"],
  ["legal", "LegalService"],
  ["school", "School"],
  ["it-compan", "ProfessionalService"],
  ["software", "ProfessionalService"],
  ["shop", "Store"],
];

export function localBusinessSubtype(categories: string[]): string {
  const text = categories.join(" ").toLowerCase();
  return subtypeByCategory.find(([needle]) => text.includes(needle))?.[1] ?? "LocalBusiness";
}

export function priceTierLabel(tier?: number): string | undefined {
  if (!tier || tier < 1) return undefined;
  return "₨".repeat(Math.min(4, Math.max(1, Math.round(tier))));
}

export function buildLocalBusinessJsonLd(business: Business, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": localBusinessSubtype(business.categories),
    "@id": `${url}#localbusiness`,
    name: business.name,
    url,
    image: business.image,
    description: business.quote,
    telephone: business.phone,
    priceRange: priceTierLabel(business.price),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.area,
      addressCountry: "NP",
    },
    geo: business.coordinates
      ? {
          "@type": "GeoCoordinates",
          latitude: business.coordinates.lat,
          longitude: business.coordinates.lng,
        }
      : undefined,
    aggregateRating:
      business.reviews > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: business.rating,
            reviewCount: business.reviews,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    openingHoursSpecification: business.weeklyHours?.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })),
    amenityFeature: business.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
    publisher,
  };
}

type WeeklyHoursValue = { dayOfWeek: string; opens: string; closes: string };

function listingWeeklyHours(listing: Listing): WeeklyHoursValue[] | undefined {
  const value = listing.attributes.weeklyHours;
  if (!Array.isArray(value)) return undefined;
  const hours = value.filter((item): item is WeeklyHoursValue => {
    if (!item || typeof item !== "object") return false;
    const record = item as Record<string, unknown>;
    return [record.dayOfWeek, record.opens, record.closes].every((field) => typeof field === "string");
  });
  return hours.length ? hours : undefined;
}

/** Schema for the normalized production listing model used by /business/[slug]. */
export function buildListingLocalBusinessJsonLd(listing: Listing, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": localBusinessSubtype(listing.categories),
    "@id": `${url}#localbusiness`,
    name: listing.name,
    url,
    image: listing.image,
    description: listing.description,
    telephone: listing.phone,
    email: listing.email,
    priceRange: priceTierLabel(listing.price),
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
    aggregateRating:
      listing.rating != null && listing.reviews != null && listing.reviews > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: listing.rating,
            reviewCount: listing.reviews,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    openingHoursSpecification: listingWeeklyHours(listing)?.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      ...hours,
    })),
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
      item: buildLocalBusinessJsonLd(business, `${siteUrl}${getBusinessHref(business.slug)}`),
    })),
  };
}

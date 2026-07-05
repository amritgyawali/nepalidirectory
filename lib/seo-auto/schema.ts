import type { Business } from "@/lib/data";
import { publisher } from "@/lib/seo";
import { getEvergreenUrl, type EvergreenPage } from "./evergreen";

const subtypeByCategory: Array<[string, string]> = [
  ["restaurant", "Restaurant"],
  ["cafe", "Restaurant"],
  ["hotel", "Hotel"],
  ["doctor", "MedicalClinic"],
  ["dentist", "Dentist"],
  ["plumber", "Plumber"],
  ["electrician", "Electrician"],
  ["lawyer", "LegalService"],
];

export function localBusinessSubtype(categories: string[]): string {
  const text = categories.join(" ").toLowerCase();
  return subtypeByCategory.find(([needle]) => text.includes(needle))?.[1] ?? "LocalBusiness";
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
    priceRange: Array.from({ length: business.price }, () => "Rs").join(" "),
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
    amenityFeature: business.amenities.map((amenity) => ({
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
      item: buildLocalBusinessJsonLd(business, getEvergreenUrl(page)),
    })),
  };
}

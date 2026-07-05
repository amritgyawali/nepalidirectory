import { cityDirectoryPages } from "@/lib/city-pages";
import { businesses, categories, type Business } from "@/lib/data";
import { siteUrl } from "@/lib/blog";
import { slugify, titleCaseFromSlug } from "./slug";

const kathmanduAreas = new Set([
  "kathmandu",
  "dilli bazar",
  "boudha",
  "thamel",
  "lazimpat",
  "putalisadak",
  "new baneshwor",
  "tripureshwor",
  "durbar marg",
  "baluwatar",
  "naxal",
  "chabahil",
  "jorpati",
  "koteshwor",
  "mid baneshwor",
]);

const categoryAliases: Record<string, string[]> = {
  restaurants: [
    "restaurant",
    "restaurants",
    "newari",
    "newari fine dining",
    "multicuisine nepali",
    "cultural show",
    "tibetan",
    "sherpa",
    "momos",
    "italian",
    "pizza",
    "continental",
    "bars",
    "cafe",
    "coffee",
    "breakfast",
    "bakery",
    "thakali",
    "nepali thali",
  ],
  doctors: ["doctors", "dentists", "healthcare", "clinic", "medical"],
  plumbers: ["plumbers", "plumbing", "home services", "emergency repair"],
  electricians: ["electricians", "solar installers", "home services", "electric", "solar"],
  hotels: ["hotels", "travel", "lakeside", "resorts", "guest house"],
  lawyers: ["lawyers", "professional services", "business registration", "legal"],
};

export type EvergreenPage = {
  categorySlug: string;
  categoryName: string;
  citySlug: string;
  cityName: string;
  href: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  listings: Business[];
  listingCount: number;
  averageRating: number;
  notableLocalities: string[];
  updatedLabel: string;
  qualityAverage: number;
};

function cityNameForSlug(citySlug: string): string {
  return cityDirectoryPages.find((city) => city.slug === citySlug)?.name ?? titleCaseFromSlug(citySlug);
}

function categoryNameForSlug(categorySlug: string): string {
  return categories.find((category) => slugify(category.name) === categorySlug)?.name ?? titleCaseFromSlug(categorySlug);
}

function businessQualityScore(business: Business): number {
  const completeness = [
    business.phone,
    business.address,
    business.website,
    business.quote,
    business.services?.length,
    business.specialties?.length,
    business.paymentMethods?.length,
    business.coordinates,
  ].filter(Boolean).length;
  const reviewScore = Math.min(20, Math.round(business.reviews / 50));
  const ratingScore = Math.round((business.rating / 5) * 30);
  const trustScore = (business.verified ? 18 : 0) + (business.claimed ? 12 : 0);
  return Math.min(100, 20 + completeness * 3 + reviewScore + ratingScore + trustScore);
}

function matchesCity(business: Business, citySlug: string): boolean {
  const city = cityNameForSlug(citySlug).toLowerCase();
  const area = business.area.toLowerCase();
  const neighborhood = business.neighborhood?.toLowerCase();
  const serviceAreas = business.serviceAreas?.map((item) => item.toLowerCase()) ?? [];

  if (area === city || neighborhood === city || serviceAreas.includes(city)) return true;
  if (citySlug === "kathmandu") {
    return kathmanduAreas.has(area) || (neighborhood ? kathmanduAreas.has(neighborhood) : false);
  }
  return false;
}

function matchesCategory(business: Business, categorySlug: string): boolean {
  const aliases = new Set([categorySlug, categoryNameForSlug(categorySlug).toLowerCase(), ...(categoryAliases[categorySlug] ?? [])]);
  return business.categories.some((category) => {
    const normalized = category.toLowerCase();
    const slug = slugify(category);
    return aliases.has(normalized) || aliases.has(slug) || [...aliases].some((alias) => normalized.includes(alias));
  });
}

function getNotableLocalities(listings: Business[]): string[] {
  const seen = new Set<string>();
  for (const business of listings) {
    const value = business.neighborhood ?? business.area;
    if (value) seen.add(value);
  }
  return [...seen].slice(0, 6);
}

function buildIntro({
  categoryName,
  cityName,
  listings,
  notableLocalities,
  averageRating,
}: {
  categoryName: string;
  cityName: string;
  listings: Business[];
  notableLocalities: string[];
  averageRating: number;
}): string {
  const localities = notableLocalities.length ? notableLocalities.join(", ") : cityName;
  const claimed = listings.filter((listing) => listing.claimed).length;
  const openOr24h = listings.filter((listing) => listing.status === "open" || listing.status === "24h").length;
  return `${cityName} has ${listings.length} data-backed ${categoryName.toLowerCase()} listings in this directory sample, with an average rating of ${averageRating.toFixed(1)} from raw customer-review counts. Use this page to compare providers around ${localities} by rating, review volume, verified status, service notes and contact completeness. For a practical shortlist, start with businesses that publish a phone number, service area, payment methods and recent operating notes, then confirm hours, availability and exact pricing directly before visiting or booking. ${claimed} listings are marked owner-managed and ${openOr24h} are currently shown as open or 24-hour in the structured data. The ranking below is based on real listing fields in Nepali Directory, not invented descriptions or paid claims.`;
}

export function getEvergreenPages(options: { minListings?: number; minAverageQuality?: number } = {}): EvergreenPage[] {
  const minListings = options.minListings ?? 5;
  const minAverageQuality = options.minAverageQuality ?? 60;
  const now = new Date();
  const updatedLabel = now.toLocaleString("en", { month: "long", year: "numeric", timeZone: "Asia/Kathmandu" });
  const categorySlugs = categories.map((category) => slugify(category.name));
  const citySlugs = cityDirectoryPages.map((city) => city.slug);
  const pages: EvergreenPage[] = [];

  for (const categorySlug of categorySlugs) {
    for (const citySlug of citySlugs) {
      const matched = businesses
        .filter((business) => matchesCategory(business, categorySlug) && matchesCity(business, citySlug))
        .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews || a.rank - b.rank);
      if (matched.length < minListings) continue;

      const qualityAverage = matched.reduce((sum, business) => sum + businessQualityScore(business), 0) / matched.length;
      if (qualityAverage < minAverageQuality) continue;

      const categoryName = categoryNameForSlug(categorySlug);
      const cityName = cityNameForSlug(citySlug);
      const averageRating = matched.reduce((sum, business) => sum + business.rating, 0) / matched.length;
      const notableLocalities = getNotableLocalities(matched);
      const title = `Best ${categoryName} in ${cityName}`;
      const href = `/best/${categorySlug}/${citySlug}`;
      pages.push({
        categorySlug,
        categoryName,
        citySlug,
        cityName,
        href,
        title,
        metaTitle: `${title}: Top ${matched.length} Local Options`,
        metaDescription: `Compare ${matched.length} ${categoryName.toLowerCase()} in ${cityName} by rating, reviews, locality, services and contact details.`,
        intro: buildIntro({ categoryName, cityName, listings: matched, notableLocalities, averageRating }),
        listings: matched,
        listingCount: matched.length,
        averageRating,
        notableLocalities,
        updatedLabel,
        qualityAverage,
      });
    }
  }

  return pages.slice(0, 50);
}

export function getEvergreenPage(categorySlug: string, citySlug: string): EvergreenPage | null {
  return getEvergreenPages().find((page) => page.categorySlug === categorySlug && page.citySlug === citySlug) ?? null;
}

export function getEvergreenUrl(page: EvergreenPage): string {
  return `${siteUrl}${page.href}`;
}

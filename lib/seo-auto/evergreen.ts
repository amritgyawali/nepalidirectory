import type { Business } from "@/lib/data";
import { siteUrl } from "@/lib/blog";

/**
 * Legacy `/best/[category]/[city]` output is retired. The type remains temporarily for queue and
 * schema compatibility, but no fixture-backed ranking page can be generated or enter a sitemap.
 * The canonical replacement is the inventory-gated `/city/[city]/[category]` route.
 */
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

export function getEvergreenPages(
  options: { minListings?: number; minAverageQuality?: number; includePreview?: boolean } = {},
): EvergreenPage[] {
  void options;
  return [];
}

export function getEvergreenPage(
  categorySlug: string,
  citySlug: string,
  options: { includePreview?: boolean } = {},
): EvergreenPage | null {
  void categorySlug;
  void citySlug;
  void options;
  return null;
}

export function getEvergreenUrl(page: EvergreenPage): string {
  return `${siteUrl}${page.href}`;
}

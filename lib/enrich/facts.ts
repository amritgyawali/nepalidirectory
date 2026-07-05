/**
 * FACTS assembly + output validation for LISTING_ENRICH_V1 (prompt §7, §15).
 *
 * The prompt input is ONLY the listing's structured fields (+ optional crawl snippet). We do a
 * pragmatic per-task structural validation rather than pulling a JSON Schema library — see
 * docs/DECISIONS.md.
 */
import type { Listing } from "./types";

export type EnrichmentOutput = {
  description_en: string;
  meta_title: string;
  meta_description: string;
  faqs: { q: string; a: string }[];
  tags: string[];
  category_slug: string;
  category_confidence: number;
  attributes: Record<string, unknown>;
};

/** Only structured, verifiable facts — never derived/marketing text (grounding, §7). */
export function buildFactsJson(listing: Listing): string {
  return JSON.stringify(
    {
      name: listing.name,
      categories: listing.categories,
      area: listing.area,
      neighborhood: listing.neighborhood,
      address: listing.address,
      phone: listing.phone,
      website: listing.website,
      opening_hours: listing.hoursToday,
      amenities: listing.amenities,
      services: listing.services,
      has_coordinates: Boolean(listing.coordinates),
    },
    null,
    0,
  );
}

export function buildTaxonomyJson(slugs: string[]): string {
  return JSON.stringify(slugs);
}

function isFaq(v: unknown): v is { q: string; a: string } {
  return (
    typeof v === "object" &&
    v !== null &&
    typeof (v as { q?: unknown }).q === "string" &&
    typeof (v as { a?: unknown }).a === "string"
  );
}

export function validateEnrichment(
  obj: unknown,
): { ok: true; value: EnrichmentOutput } | { ok: false; issues: string[] } {
  const issues: string[] = [];
  const o = (obj ?? {}) as Record<string, unknown>;

  if (typeof o.description_en !== "string" || o.description_en.trim() === "")
    issues.push("description_en must be a non-empty string");
  if (typeof o.meta_title !== "string") issues.push("meta_title must be a string");
  if (typeof o.meta_description !== "string") issues.push("meta_description must be a string");
  if (!Array.isArray(o.faqs) || !o.faqs.every(isFaq))
    issues.push("faqs must be an array of {q,a} strings");
  if (!Array.isArray(o.tags) || !o.tags.every((t) => typeof t === "string"))
    issues.push("tags must be an array of strings");
  if (typeof o.category_slug !== "string") issues.push("category_slug must be a string");
  if (
    typeof o.category_confidence !== "number" ||
    o.category_confidence < 0 ||
    o.category_confidence > 1
  )
    issues.push("category_confidence must be a number in [0,1]");
  if (typeof o.attributes !== "object" || o.attributes === null || Array.isArray(o.attributes))
    issues.push("attributes must be an object");

  if (issues.length > 0) return { ok: false, issues };
  return { ok: true, value: obj as EnrichmentOutput };
}

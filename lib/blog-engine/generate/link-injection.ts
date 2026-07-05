/**
 * Generation pass 5 — link injection (prompt §8.4.5): deterministic code, NOT the AI. Resolves
 * `{{category:slug}}` / `{{listing:id}}` placeholders against real category pages / real listings
 * (quality_score >= 60); unresolved placeholders (unknown slug/id, low-quality listing) are
 * stripped rather than left in the published text.
 */
import type { Listing } from "../../enrich";

export type LinkInjectionResult = {
  bodyMarkdown: string;
  linksInjected: number;
  categoriesLinked: string[];
};

const PLACEHOLDER = /\{\{(category|listing):([\w-]+)\}\}/g;

export type LinkInjectionOptions = {
  minQualityScore?: number;
  /**
   * Deterministic floor on internal links (prompt §8.4.5 wants 3–8). If the writer's body did not
   * emit enough resolvable `{{...}}` placeholders, a "Related on NepaliDirectory" block is appended
   * linking the article's target categories (then quality listings) until this floor is met, so a
   * published post is never left with too few internal links regardless of what the model returned.
   */
  ensureMinLinks?: number;
  /** Categories to prefer when topping up (usually the cluster's target category slugs). */
  preferredCategorySlugs?: string[];
};

function categoryLink(slug: string): string {
  return `[${slug.replace(/-/g, " ")}](/search?category=${slug})`;
}

export function injectLinks(
  bodyMarkdown: string,
  taxonomy: string[],
  listings: Listing[],
  options: LinkInjectionOptions = {},
): LinkInjectionResult {
  const minQualityScore = options.minQualityScore ?? 60;
  let linksInjected = 0;
  const categoriesLinked = new Set<string>();
  const taxonomySet = new Set(taxonomy);
  const qualityListings = listings.filter((l) => l.qualityScore >= minQualityScore);
  const listingById = new Map(qualityListings.map((l) => [l.id, l]));
  const linkedListingIds = new Set<number>();

  let body = bodyMarkdown.replace(PLACEHOLDER, (_match, kind: string, ref: string) => {
    if (kind === "category") {
      if (!taxonomySet.has(ref)) return "";
      linksInjected++;
      categoriesLinked.add(ref);
      return categoryLink(ref);
    }
    const listing = listingById.get(Number(ref));
    if (!listing) return "";
    linksInjected++;
    linkedListingIds.add(listing.id);
    return `[${listing.name}](/business/${listing.slug})`;
  });

  const floor = options.ensureMinLinks ?? 0;
  if (floor > 0 && linksInjected < floor) {
    // Build the top-up candidates: preferred categories first, then the rest of the taxonomy,
    // then quality listings — skipping anything already linked above.
    const preferred = (options.preferredCategorySlugs ?? []).filter((s) => taxonomySet.has(s));
    const categoryCandidates = [...preferred, ...taxonomy].filter(
      (slug) => slug !== "uncategorized" && !categoriesLinked.has(slug),
    );
    const parts: string[] = [];
    for (const slug of categoryCandidates) {
      if (linksInjected >= floor) break;
      categoriesLinked.add(slug);
      linksInjected++;
      parts.push(categoryLink(slug));
    }
    for (const listing of qualityListings) {
      if (linksInjected >= floor) break;
      if (linkedListingIds.has(listing.id)) continue;
      linkedListingIds.add(listing.id);
      linksInjected++;
      parts.push(`[${listing.name}](/business/${listing.slug})`);
    }
    if (parts.length) {
      body = `${body.trimEnd()}\n\n## Related on NepaliDirectory\nCompare more local options: ${parts.join(", ")}.`;
    }
  }

  return { bodyMarkdown: body, linksInjected, categoriesLinked: [...categoriesLinked] };
}

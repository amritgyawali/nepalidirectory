import type { Listing } from "@/lib/enrich";

/**
 * Detects category-template prose across profiles (audit sec. 7).
 *
 * A description that only differs from its neighbours by business name, locality and numbers is
 * unique at the page level but commodity at the information level: it cannot make the profile
 * worth citing, and it gives search and AI systems nothing to distinguish one record from the
 * next. Collapsing those variables to placeholders makes the shared template visible.
 */
export function descriptionTemplateFingerprint(listing: Listing): string {
  const raw = listing.description?.trim();
  if (!raw) return "";

  let normalized = raw
    .toLowerCase()
    .replace(/https?:\/\/\S+|\b[\w.+-]+@[\w.-]+\.\w+|\+?\d[\d\s()-]{6,}\d/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const variable of [listing.name, listing.area, listing.neighborhood, listing.municipality]) {
    const token = String(variable ?? "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (token.length >= 3) normalized = normalized.replaceAll(token, " {variable} ");
  }

  return normalized.replace(/\b\d+\b/g, " {number} ").replace(/\s+/g, " ").trim();
}

/**
 * A description carries its own facts when, after removing the template variables, it still says
 * something the shared template does not. Groups of one are distinctive; anything repeated across
 * profiles is treated as template copy.
 */
export function selectDistinctlyDescribed(listings: readonly Listing[]): Listing[] {
  const counts = new Map<string, number>();
  for (const listing of listings) {
    const fingerprint = descriptionTemplateFingerprint(listing);
    if (!fingerprint) continue;
    counts.set(fingerprint, (counts.get(fingerprint) ?? 0) + 1);
  }
  return listings.filter((listing) => {
    const fingerprint = descriptionTemplateFingerprint(listing);
    return Boolean(fingerprint) && counts.get(fingerprint) === 1;
  });
}

export type TemplateGroup = {
  fingerprint: string;
  records: number;
  sampleSlugs: string[];
};

/** Ranked repeated templates, largest first — the rewrite queue for the content team. */
export function summarizeDescriptionTemplates(
  listings: readonly Listing[],
  sampleSize = 5,
): TemplateGroup[] {
  const groups = new Map<string, Listing[]>();
  for (const listing of listings) {
    const fingerprint = descriptionTemplateFingerprint(listing);
    if (!fingerprint) continue;
    const group = groups.get(fingerprint);
    if (group) group.push(listing);
    else groups.set(fingerprint, [listing]);
  }
  return [...groups.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([fingerprint, group]) => ({
      fingerprint,
      records: group.length,
      sampleSlugs: group.slice(0, sampleSize).map((listing) => listing.slug),
    }))
    .sort((a, b) => b.records - a.records);
}

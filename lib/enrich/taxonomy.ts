/**
 * Category taxonomy (slugs) derived from the demo dataset. The enrichment prompt asks the model
 * to choose one of these slugs (prompt §7 / LISTING_ENRICH_V1). Phase 2's `osm_tag_map` +
 * category tables will supersede this.
 */
import { categories, categoryGroups } from "../data";
import { slugify } from "./listing-repo";

export function buildTaxonomy(): string[] {
  const slugs = new Set<string>(["uncategorized"]);
  for (const c of categories) slugs.add(slugify(c.name));
  for (const g of categoryGroups) for (const item of g.items) slugs.add(slugify(item));
  return [...slugs];
}

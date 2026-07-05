/**
 * Seed category synonyms (prompt §9.1) — mirrors db/seeds/category_synonyms.sql. A real
 * deployment generates these once per category with AI; this is the starter set covering the
 * demo taxonomy's most common EN/romanized-Nepali local-search terms.
 */
import type { CategorySynonym } from "../types";

export const SEED_CATEGORY_SYNONYMS: CategorySynonym[] = [
  { categorySlug: "restaurants", synonym: "khana pasal", lang: "romanized_ne" },
  { categorySlug: "restaurants", synonym: "momo pasal", lang: "romanized_ne" },
  { categorySlug: "cafes-bistros", synonym: "chiya pasal", lang: "romanized_ne" },
  { categorySlug: "cafes-bistros", synonym: "chiya thoi", lang: "romanized_ne" },
  { categorySlug: "plumbers", synonym: "paip mistri", lang: "romanized_ne" },
  { categorySlug: "electricians", synonym: "bijuli mistri", lang: "romanized_ne" },
  { categorySlug: "doctors", synonym: "daktar", lang: "romanized_ne" },
  { categorySlug: "hotels", synonym: "lodge", lang: "en" },
  { categorySlug: "auto-repair", synonym: "gadi mistri", lang: "romanized_ne" },
  { categorySlug: "beauty-salons", synonym: "parlor", lang: "en" },
];

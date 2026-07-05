import { cosineSimilarity } from "../../acquire";
import { slugify } from "../../enrich";

export type SeoResult = {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function trimAtWord(value: string, max: number): string {
  const clean = cleanText(value);
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max + 1);
  const boundary = cut.lastIndexOf(" ");
  return `${cut.slice(0, boundary > 40 ? boundary : max).replace(/[,:;-]\s*$/, "")}...`;
}

/**
 * The un-de-duplicated slug a draft maps to. Kept as a named export so the generate handler can
 * check "does a post with this exact base slug already exist?" and discard a duplicate BEFORE
 * `buildSeo` de-collides it into `-2`/`-3` — an embedding-independent dedup guard that holds even
 * when no embedding provider is configured (prompt §8.4.5 duplicate suppression).
 */
export function baseSlug(draft: { slug?: string; title: string }): string {
  return (draft.slug || slugify(draft.title)).slice(0, 80) || "post";
}

export function buildSeo(
  draft: {
    title: string;
    slug: string;
    excerpt: string;
    seoTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  },
  existingSlugs: ReadonlySet<string>,
): SeoResult {
  const title = trimAtWord(draft.title || draft.seoTitle || "Nepal Local Service Guide", 96);
  const metaTitle = trimAtWord(draft.seoTitle || title, 70);
  const metaDescription = trimAtWord(draft.metaDescription || draft.excerpt, 155);
  const base = baseSlug(draft);
  const keywords = [...new Set((draft.keywords ?? []).map(cleanText).filter(Boolean))].slice(0, 12);

  let candidate = base;
  let n = 2;
  while (existingSlugs.has(candidate)) {
    candidate = `${base}-${n++}`;
  }

  return { title, slug: candidate, metaTitle, metaDescription, keywords };
}

export function isDuplicateEmbedding(
  embedding: number[],
  existingEmbeddings: number[][],
  threshold = 0.9,
): boolean {
  return existingEmbeddings.some((e) => cosineSimilarity(e, embedding) >= threshold);
}

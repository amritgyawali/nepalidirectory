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
  const raw = draft.slug || slugify(draft.title);
  if (raw.length <= 80) return raw || "post";
  // Cut at a word (hyphen) boundary so long titles don't produce slugs like `…-comprehensive-g`.
  const cut = raw.slice(0, 80);
  const lastHyphen = cut.lastIndexOf("-");
  return (lastHyphen > 40 ? cut.slice(0, lastHyphen) : cut) || "post";
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
  threshold = 0.84,
): boolean {
  return existingEmbeddings.some((e) => cosineSimilarity(e, embedding) >= threshold);
}

const TOPIC_STOP_WORDS = new Set([
  "a", "an", "and", "before", "best", "choosing", "compare", "comprehensive", "for",
  "guide", "how", "in", "nepal", "of", "or", "practical", "right", "the", "to", "your",
]);

function normalizedWords(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (word.endsWith("s") && word.length > 4 ? word.slice(0, -1) : word));
}

export function topicFingerprint(title: string): string {
  return [...new Set(normalizedWords(title).filter((word) => !TOPIC_STOP_WORDS.has(word)))]
    .sort()
    .join("|");
}

function tokenJaccard(a: string, b: string): number {
  const left = new Set(topicFingerprint(a).split("|").filter(Boolean));
  const right = new Set(topicFingerprint(b).split("|").filter(Boolean));
  if (!left.size || !right.size) return 0;
  const intersection = [...left].filter((token) => right.has(token)).length;
  return intersection / new Set([...left, ...right]).size;
}

export function isDuplicateTopic(title: string, existingTitles: string[], threshold = 0.72): boolean {
  const fingerprint = topicFingerprint(title);
  return existingTitles.some((existing) =>
    topicFingerprint(existing) === fingerprint || tokenJaccard(title, existing) >= threshold,
  );
}

function shingles(value: string, size = 5): Set<string> {
  const words = normalizedWords(value);
  const result = new Set<string>();
  for (let index = 0; index <= words.length - size; index += 1) {
    result.add(words.slice(index, index + size).join(" "));
  }
  return result;
}

export function isNearDuplicateContent(
  content: string,
  existingContent: string[],
  threshold = 0.55,
): boolean {
  const candidate = shingles(content);
  if (candidate.size < 20) return false;
  return existingContent.some((value) => {
    const existing = shingles(value);
    if (existing.size < 20) return false;
    const intersection = [...candidate].filter((part) => existing.has(part)).length;
    const union = new Set([...candidate, ...existing]).size;
    return union > 0 && intersection / union >= threshold;
  });
}

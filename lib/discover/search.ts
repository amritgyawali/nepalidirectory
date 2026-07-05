/**
 * Hybrid retrieval (prompt §9.1): reciprocal-rank fusion over a lightweight full-text match and
 * cosine similarity over embeddings, re-ranked by quality_score. This is the in-memory contract;
 * the SQL equivalent (search_tsv `websearch_to_tsquery` + `listing_embeddings <=>` cosine + the
 * same RRF/re-rank formula) is documented in the prompt and applies once Postgres is live —
 * `search_tsv` itself is already maintained by the V11 trigger for that path.
 */
import { cosineSimilarity } from "../acquire";
import type { EmbeddingRepository, Listing, ListingRepository } from "../enrich";
import type { ParsedQuery } from "./types";

export type SearchResult = { listing: Listing; score: number };

export type HybridSearchDeps = {
  listings: ListingRepository;
  embeddings: EmbeddingRepository;
  embed: (text: string) => Promise<number[]>;
};

const STOPWORDS = new Set(["in", "near", "me", "the", "a", "an", "for", "of", "and", "best", "find", "show"]);

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).filter((t) => !STOPWORDS.has(t));
}

function listingHaystack(l: Listing): Set<string> {
  return new Set(tokenize([l.name, ...l.categories, ...l.tags, l.area, l.neighborhood ?? ""].join(" ")));
}

function textScore(l: Listing, terms: string[]): number {
  const haystack = listingHaystack(l);
  return terms.reduce((score, t) => score + (haystack.has(t) ? 1 : 0), 0);
}

function matchesFilters(l: Listing, parsed: ParsedQuery): boolean {
  if (parsed.categoryHint && !l.categories.includes(parsed.categoryHint)) return false;
  const loc = (parsed.location.area ?? parsed.location.city)?.toLowerCase();
  if (loc) {
    const hay = `${l.area} ${l.neighborhood ?? ""}`.toLowerCase();
    if (!hay.includes(loc)) return false;
  }
  // `open_now`/`price_level` aren't modeled on the AI `Listing` (only the marketing `Business`
  // type carries status/price) — accepted gap, documented in docs/DECISIONS.md.
  return true;
}

/** RRF over FTS-ish term match + embedding cosine, then `rrf * (0.7 + 0.3*quality_score/100)`. */
export async function hybridSearch(
  query: string,
  parsed: ParsedQuery,
  deps: HybridSearchDeps,
  limit = 20,
): Promise<SearchResult[]> {
  const all = await deps.listings.all();
  const filtered = all.filter((l) => matchesFilters(l, parsed));
  if (filtered.length === 0) return [];

  const terms = [...tokenize(query), ...parsed.keywords];
  const ftsRanked = filtered
    .map((l) => ({ l, score: textScore(l, terms) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const ftsRank = new Map(ftsRanked.map((x, i) => [x.l.id, i + 1]));

  const queryEmbedding = await deps.embed(query);
  const vecScored: { l: Listing; score: number }[] = [];
  for (const l of filtered) {
    const stored = await deps.embeddings.get(l.id);
    if (stored) vecScored.push({ l, score: cosineSimilarity(stored.embedding, queryEmbedding) });
  }
  vecScored.sort((a, b) => b.score - a.score);
  const vecRank = new Map(vecScored.map((x, i) => [x.l.id, i + 1]));

  const results: SearchResult[] = [];
  for (const l of filtered) {
    const fr = ftsRank.get(l.id);
    const vr = vecRank.get(l.id);
    if (!fr && !vr) continue;
    const rrf = (fr ? 1 / (60 + fr) : 0) + (vr ? 1 / (60 + vr) : 0);
    results.push({ listing: l, score: rrf * (0.7 + (0.3 * l.qualityScore) / 100) });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

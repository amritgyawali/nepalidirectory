/**
 * NL query parser (prompt §9.2). Fast path: if the query matches a known category (taxonomy slug
 * or a synonym — including romanized Nepali) AND a known place, skip the AI call entirely. Else
 * fall back to `NL_QUERY_PARSER_V1`.
 */
import type { ProviderRegistry } from "../ai-core/types";
import type { PromptRegistry } from "../ai-core/prompts/registry";
import { parseJsonResponse } from "../ai-core/json";
import type { CategorySynonym, ParsedQuery, QueryIntent, QueryLanguage } from "./types";

const STOPWORDS = new Set([
  "in", "near", "me", "the", "a", "an", "for", "of", "and", "best", "find", "show", "places",
  "around", "is", "are", "please", "some", "good",
]);
const DEVANAGARI_RE = /[ऀ-ॿ]/;
const INTENTS: QueryIntent[] = ["find_business", "question", "other"];
const LANGUAGES: QueryLanguage[] = ["en", "ne", "romanized_ne"];

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function findCategoryHint(queryLower: string, taxonomy: string[], synonyms: CategorySynonym[]): string | undefined {
  const sortedSynonyms = [...synonyms].sort((a, b) => b.synonym.length - a.synonym.length);
  for (const syn of sortedSynonyms) {
    if (queryLower.includes(syn.synonym.toLowerCase())) return syn.categorySlug;
  }
  const sortedTaxonomy = [...taxonomy].sort((a, b) => b.length - a.length);
  for (const slug of sortedTaxonomy) {
    if (queryLower.includes(slug.replace(/-/g, " "))) return slug;
  }
  return undefined;
}

function findLocation(queryLower: string, knownPlaces: string[]): { city?: string; area?: string } {
  const sorted = [...knownPlaces].sort((a, b) => b.length - a.length);
  for (const place of sorted) {
    if (place && queryLower.includes(place.toLowerCase())) return { area: place };
  }
  return {};
}

function detectLanguage(query: string, romanizedTerms: Set<string>): QueryLanguage {
  if (DEVANAGARI_RE.test(query)) return "ne";
  if (tokenize(query).some((w) => romanizedTerms.has(w))) return "romanized_ne";
  return "en";
}

export type NlQueryContext = {
  taxonomy: string[];
  synonyms: CategorySynonym[];
  knownPlaces: string[];
};

/** Regex/lookup fast path (prompt §9.2: "[category-ish] in [known place]"). Null = needs AI. */
export function parseQueryFastPath(query: string, ctx: NlQueryContext): ParsedQuery | null {
  const queryLower = query.toLowerCase().trim();
  const categoryHint = findCategoryHint(queryLower, ctx.taxonomy, ctx.synonyms);
  const location = findLocation(queryLower, ctx.knownPlaces);
  if (!categoryHint || (!location.city && !location.area)) return null;

  const romanizedTerms = new Set(
    ctx.synonyms.filter((s) => s.lang === "romanized_ne").flatMap((s) => tokenize(s.synonym)),
  );
  const locationWords = new Set(location.area ? tokenize(location.area) : []);
  const openNow = /\bopen now\b/.test(queryLower) || /\bopen\b/.test(queryLower) ? true : null;
  const keywords = tokenize(queryLower).filter((w) => !STOPWORDS.has(w) && !locationWords.has(w));

  return {
    intent: "find_business",
    categoryHint,
    location,
    filters: { openNow, priceLevel: null },
    keywords,
    language: detectLanguage(query, romanizedTerms),
    fastPath: true,
  };
}

export type NlQueryDeps = NlQueryContext & {
  prompts: PromptRegistry;
  providers: ProviderRegistry;
};

/** Full parse: fast path first, `NL_QUERY_PARSER_V1` otherwise. Never throws. */
export async function parseQuery(query: string, deps: NlQueryDeps): Promise<ParsedQuery> {
  const fast = parseQueryFastPath(query, deps);
  if (fast) return fast;

  const template = deps.prompts.get("NL_QUERY_PARSER_V1");
  const rendered = deps.prompts.render("NL_QUERY_PARSER_V1", {
    q: query,
    category_slugs: JSON.stringify(deps.taxonomy),
    places_sample: JSON.stringify(deps.knownPlaces.slice(0, 20)),
  });

  let parsed: {
    intent?: string;
    category_hint?: string;
    location?: { city?: string; area?: string };
    filters?: { open_now?: boolean | null; price_level?: number | null };
    keywords?: string[];
    language?: string;
  } = {};

  try {
    const text = (
      await deps.providers.chain().completeJson(
        {
          taskKey: template.key,
          system: rendered.system,
          user: rendered.user,
          temperature: template.temperature,
          maxTokens: 300,
        },
        template.jsonSchema ?? "{}",
      )
    ).text;
    parsed = parseJsonResponse(text) as typeof parsed;
  } catch {
    // Fall through to the safe defaults below — a parser failure should degrade, not crash search.
  }

  return {
    intent: INTENTS.includes(parsed.intent as QueryIntent) ? (parsed.intent as QueryIntent) : "find_business",
    categoryHint: parsed.category_hint,
    location: parsed.location ?? {},
    filters: {
      openNow: parsed.filters?.open_now ?? null,
      priceLevel: parsed.filters?.price_level ?? null,
    },
    keywords: parsed.keywords ?? [],
    language: LANGUAGES.includes(parsed.language as QueryLanguage) ? (parsed.language as QueryLanguage) : "en",
    fastPath: false,
  };
}

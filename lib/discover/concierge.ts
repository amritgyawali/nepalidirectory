/**
 * AI concierge (prompt §9.3, CONCIERGE_V1). Grounding is enforced structurally, not by prompting
 * alone: `search_listings` (our `hybridSearch`) is ALWAYS called first in code, and the
 * `listings` returned to the caller are exactly — and only ever — that result set. The AI's free
 * text is supplementary framing; it is never parsed for business names, so it is structurally
 * impossible for the concierge to "recommend" something absent from tool output. On zero results
 * the honest fallback is returned directly, without even calling the AI, and a `demand_signals`
 * row is written (prompt: "feeds admin... and the blog topic queue").
 */
import type { EmbeddingRepository, Listing, ListingRepository } from "../enrich";
import type { ProviderRegistry } from "../ai-core/types";
import type { PromptRegistry } from "../ai-core/prompts/registry";
import { hybridSearch } from "./search";
import { parseQuery } from "./nl-query";
import type {
  CategorySynonym,
  DemandSignalRepository,
  ParsedQuery,
  SearchQueryLogRepository,
} from "./types";

export type ConciergeListing = {
  id: number;
  slug: string;
  name: string;
  area: string;
  neighborhood?: string;
  categories: string[];
  phone?: string;
  website?: string;
  qualityScore: number;
};

export type ConciergeReply = {
  message: string;
  listings: ConciergeListing[];
  demandSignalRecorded: boolean;
  parsed: ParsedQuery;
};

export type ConciergeDeps = {
  listings: ListingRepository;
  embeddings: EmbeddingRepository;
  embed: (text: string) => Promise<number[]>;
  taxonomy: string[];
  synonyms: CategorySynonym[];
  knownPlaces: string[];
  prompts: PromptRegistry;
  providers: ProviderRegistry;
  demandSignals: DemandSignalRepository;
  searchLog: SearchQueryLogRepository;
  siteName: string;
};

export const ZERO_RESULT_MESSAGE =
  "I couldn't find a business matching that in our directory yet. Want me to widen the area or " +
  "category, or should I record this request so we can look into adding one?";

function toConciergeListing(l: Listing): ConciergeListing {
  return {
    id: l.id,
    slug: l.slug,
    name: l.name,
    area: l.area,
    neighborhood: l.neighborhood,
    categories: l.categories,
    phone: l.phone,
    website: l.website,
    qualityScore: l.qualityScore,
  };
}

export async function handleConciergeMessage(userMessage: string, deps: ConciergeDeps): Promise<ConciergeReply> {
  const parsed = await parseQuery(userMessage, {
    taxonomy: deps.taxonomy,
    synonyms: deps.synonyms,
    knownPlaces: deps.knownPlaces,
    prompts: deps.prompts,
    providers: deps.providers,
  });

  const results = await hybridSearch(
    userMessage,
    parsed,
    { listings: deps.listings, embeddings: deps.embeddings, embed: deps.embed },
    5,
  );

  await deps.searchLog.create({ query: userMessage, parsed, resultsCount: results.length });

  if (results.length === 0) {
    await deps.demandSignals.create({
      query: userMessage,
      categoryGuess: parsed.categoryHint,
      location: parsed.location.area ?? parsed.location.city,
      source: "concierge",
    });
    return { message: ZERO_RESULT_MESSAGE, listings: [], demandSignalRecorded: true, parsed };
  }

  const listings = results.map((r) => toConciergeListing(r.listing));
  const template = deps.prompts.get("CONCIERGE_V1");
  const rendered = deps.prompts.render("CONCIERGE_V1", {
    site_name: deps.siteName,
    user_message: userMessage,
    results_json: JSON.stringify(listings),
  });

  const text = (
    await deps.providers.chain().complete({
      taskKey: template.key,
      system: rendered.system,
      user: rendered.user,
      temperature: template.temperature,
      maxTokens: 400,
    })
  ).text;

  return { message: text, listings, demandSignalRecorded: false, parsed };
}

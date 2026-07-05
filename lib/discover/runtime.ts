/**
 * Discover runtime (prompt Module E, §9): the blog-engine runtime plus synonyms/demand-signal/
 * search-log/conversation stores, and the two request-response entrypoints (`search`,
 * `concierge`) the Next.js API routes call. No new queued job types — search/concierge are
 * synchronous request/response, not background jobs.
 */
import { createBlogEngineRuntime, type BlogEngineRuntime, type BlogEngineRuntimeOverrides } from "../blog-engine";
import { InMemoryConversationRepository } from "./stores/conversations";
import {
  createCategorySynonymRepository,
  createDemandSignalRepository,
  createSearchQueryLogRepository,
} from "./stores/factory";
import { SessionRateLimiter } from "./rate-limit";
import { hybridSearch, type SearchResult } from "./search";
import { parseQuery } from "./nl-query";
import { handleConciergeMessage, type ConciergeReply } from "./concierge";
import type {
  CategorySynonymRepository,
  ConversationRepository,
  DemandSignalRepository,
  ParsedQuery,
  SearchQueryLogRepository,
} from "./types";

export type DiscoverRuntime = BlogEngineRuntime & {
  categorySynonyms: CategorySynonymRepository;
  demandSignals: DemandSignalRepository;
  searchQueriesLog: SearchQueryLogRepository;
  conversations: ConversationRepository;
  rateLimiter: SessionRateLimiter;
  knownPlaces: () => Promise<string[]>;
  search: (
    query: string,
    limit?: number,
    filterOverrides?: SearchFilterOverrides,
  ) => Promise<{ parsed: ParsedQuery; results: SearchResult[] }>;
  concierge: (sessionId: string, message: string) => Promise<ConciergeReply>;
};

/** Structured filters a search UI supplies directly (`/api/search?category=&city=&open_now=`),
 * layered on top of whatever the NL parser derived from free-text `q`. */
export type SearchFilterOverrides = { category?: string; city?: string; openNow?: boolean };

export type DiscoverRuntimeOverrides = BlogEngineRuntimeOverrides & {
  categorySynonyms?: CategorySynonymRepository;
  demandSignals?: DemandSignalRepository;
  searchQueriesLog?: SearchQueryLogRepository;
  conversations?: ConversationRepository;
};

export function createDiscoverRuntime(overrides: DiscoverRuntimeOverrides = {}): DiscoverRuntime {
  const engine = createBlogEngineRuntime(overrides);

  const categorySynonyms = overrides.categorySynonyms ?? createCategorySynonymRepository();
  const demandSignals = overrides.demandSignals ?? createDemandSignalRepository();
  const searchQueriesLog = overrides.searchQueriesLog ?? createSearchQueryLogRepository();
  const conversations = overrides.conversations ?? new InMemoryConversationRepository();
  const rateLimiter = new SessionRateLimiter();
  const embed = (text: string) => engine.providers.embedder().embed(text);

  async function knownPlaces(): Promise<string[]> {
    const all = await engine.listings.all();
    const places = new Set<string>();
    for (const l of all) {
      if (l.area) places.add(l.area);
      if (l.neighborhood) places.add(l.neighborhood);
    }
    return [...places];
  }

  async function search(query: string, limit = 20, filterOverrides?: SearchFilterOverrides) {
    const [synonyms, places] = await Promise.all([categorySynonyms.all(), knownPlaces()]);
    const parsed = await parseQuery(query, {
      taxonomy: engine.taxonomy,
      synonyms,
      knownPlaces: places,
      prompts: engine.prompts,
      providers: engine.providers,
    });
    if (filterOverrides?.category) parsed.categoryHint = filterOverrides.category;
    if (filterOverrides?.city) parsed.location = { ...parsed.location, city: filterOverrides.city };
    if (filterOverrides?.openNow !== undefined) parsed.filters.openNow = filterOverrides.openNow;

    const results = await hybridSearch(query, parsed, { listings: engine.listings, embeddings: engine.embeddings, embed }, limit);
    await searchQueriesLog.create({ query, parsed, resultsCount: results.length });
    if (results.length === 0) {
      await demandSignals.create({
        query,
        categoryGuess: parsed.categoryHint,
        location: parsed.location.area ?? parsed.location.city,
        source: "search",
      });
    }
    return { parsed, results };
  }

  async function concierge(sessionId: string, message: string): Promise<ConciergeReply> {
    await conversations.append({ sessionId, role: "user", message });
    const [synonyms, places] = await Promise.all([categorySynonyms.all(), knownPlaces()]);
    const reply = await handleConciergeMessage(message, {
      listings: engine.listings,
      embeddings: engine.embeddings,
      embed,
      taxonomy: engine.taxonomy,
      synonyms,
      knownPlaces: places,
      prompts: engine.prompts,
      providers: engine.providers,
      demandSignals,
      searchLog: searchQueriesLog,
      siteName: engine.config.siteName,
    });
    await conversations.append({ sessionId, role: "assistant", message: reply.message });
    return reply;
  }

  return {
    ...engine,
    categorySynonyms,
    demandSignals,
    searchQueriesLog,
    conversations,
    rateLimiter,
    knownPlaces,
    search,
    concierge,
  };
}

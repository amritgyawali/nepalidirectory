/**
 * discover module public surface (prompt Module E, §9).
 */
export type {
  CategorySynonym,
  CategorySynonymRepository,
  ConversationRepository,
  ConversationTurn,
  DemandSignal,
  DemandSignalRepository,
  NewConversationTurn,
  NewDemandSignal,
  NewSearchQueryLogEntry,
  ParsedQuery,
  QueryIntent,
  QueryLanguage,
  SearchQueryLogEntry,
  SearchQueryLogRepository,
} from "./types";

export { InMemoryCategorySynonymRepository } from "./stores/category-synonyms";
export { InMemoryDemandSignalRepository } from "./stores/demand-signals";
export { InMemorySearchQueryLogRepository } from "./stores/search-queries-log";
export { InMemoryConversationRepository } from "./stores/conversations";
export {
  PostgresCategorySynonymRepository,
  PostgresDemandSignalRepository,
  PostgresSearchQueryLogRepository,
} from "./stores/postgres";
export {
  createCategorySynonymRepository,
  createDemandSignalRepository,
  createSearchQueryLogRepository,
} from "./stores/factory";

export { SEED_CATEGORY_SYNONYMS } from "./synonyms/seed";

export { parseQuery, parseQueryFastPath } from "./nl-query";
export type { NlQueryContext, NlQueryDeps } from "./nl-query";

export { hybridSearch } from "./search";
export type { HybridSearchDeps, SearchResult } from "./search";

export { handleConciergeMessage, ZERO_RESULT_MESSAGE } from "./concierge";
export type { ConciergeDeps, ConciergeListing, ConciergeReply } from "./concierge";

export { SessionRateLimiter } from "./rate-limit";

export { createDiscoverRuntime } from "./runtime";
export type { DiscoverRuntime, DiscoverRuntimeOverrides, SearchFilterOverrides } from "./runtime";
export { getDefaultDiscoverRuntime } from "./singleton";

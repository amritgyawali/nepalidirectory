/**
 * Semantic search + AI concierge domain (prompt Module E, §9).
 */

export type QueryLanguage = "en" | "ne" | "romanized_ne";
export type QueryIntent = "find_business" | "question" | "other";

export type ParsedQuery = {
  intent: QueryIntent;
  categoryHint?: string;
  location: { city?: string; area?: string };
  filters: { openNow: boolean | null; priceLevel: number | null };
  keywords: string[];
  language: QueryLanguage;
  /** true when resolved by the regex fast path (prompt §9.2) rather than an AI call. */
  fastPath: boolean;
};

export type CategorySynonym = { categorySlug: string; synonym: string; lang: QueryLanguage };

export interface CategorySynonymRepository {
  all(): Promise<CategorySynonym[]>;
}

export type DemandSignal = {
  id: number;
  query: string;
  categoryGuess?: string;
  location?: string;
  source: string;
  createdAt: Date;
};

export type NewDemandSignal = Omit<DemandSignal, "id" | "createdAt">;

export interface DemandSignalRepository {
  create(input: NewDemandSignal): Promise<DemandSignal>;
  list(): Promise<DemandSignal[]>;
}

export type SearchQueryLogEntry = {
  id: number;
  query: string;
  parsed: ParsedQuery;
  resultsCount: number;
  createdAt: Date;
};

export type NewSearchQueryLogEntry = Omit<SearchQueryLogEntry, "id" | "createdAt">;

export interface SearchQueryLogRepository {
  create(input: NewSearchQueryLogEntry): Promise<SearchQueryLogEntry>;
  list(): Promise<SearchQueryLogEntry[]>;
}

export type ConversationTurn = {
  id: number;
  sessionId: string;
  role: "user" | "assistant";
  message: string;
  createdAt: Date;
};

export type NewConversationTurn = Omit<ConversationTurn, "id" | "createdAt">;

export interface ConversationRepository {
  append(input: NewConversationTurn): Promise<ConversationTurn>;
  listBySession(sessionId: string): Promise<ConversationTurn[]>;
  /** Drops turns older than `days` (prompt §9.3: transcripts kept ~30 days for QA). */
  pruneOlderThan(days: number): Promise<number>;
}

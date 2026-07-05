/**
 * Enrichment runtime: ai-core + the enrich module wired together (prompt §7 / §17 Phase 1).
 * Everything is gated by AI_ENABLED at the caller; the runtime itself just assembles pieces.
 */
import { createAiCore, type AiCore, type FetchFn } from "../ai-core";
import type { EmbeddingRepository, ListingRepository } from "./types";
import { InMemoryEmbeddingRepository, InMemoryListingRepository } from "./listing-repo";
import { makeEnrichListingHandler } from "./enrich-listing";
import { makeEmbedListingHandler } from "./embed-listing";
import { buildTaxonomy } from "./taxonomy";

export type EnrichmentRuntime = AiCore & {
  listings: ListingRepository;
  embeddings: EmbeddingRepository;
  taxonomy: string[];
};

export type EnrichmentRuntimeOverrides = {
  listings?: ListingRepository;
  embeddings?: EmbeddingRepository;
  fetchFn?: FetchFn;
};

export function createEnrichmentRuntime(overrides: EnrichmentRuntimeOverrides = {}): EnrichmentRuntime {
  const core = createAiCore({ fetchFn: overrides.fetchFn });
  const listings = overrides.listings ?? new InMemoryListingRepository();
  const embeddings = overrides.embeddings ?? new InMemoryEmbeddingRepository();
  const taxonomy = buildTaxonomy();

  core.worker
    .register(
      "ENRICH_LISTING",
      makeEnrichListingHandler({
        listings,
        prompts: core.prompts,
        siteName: core.config.siteName,
        taxonomy,
      }),
    )
    .register("EMBED_LISTING", makeEmbedListingHandler({ listings, embeddings }));

  return { ...core, listings, embeddings, taxonomy };
}

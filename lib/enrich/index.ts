/**
 * enrich module public surface (prompt Module C, §7).
 */
export type {
  EmbeddingRepository,
  Listing,
  ListingFaq,
  ListingRepository,
  NewListing,
} from "./types";
export type { EnrichmentOutput } from "./facts";
export type { EnrichDeps } from "./enrich-listing";
export type { EmbedDeps } from "./embed-listing";
export type { EnrichmentRuntime, EnrichmentRuntimeOverrides } from "./runtime";

export { computeQualityScore } from "./quality";
export {
  InMemoryEmbeddingRepository,
  InMemoryListingRepository,
  businessToListing,
  makeNewListing,
  seedListingsFromData,
  slugify,
} from "./listing-repo";
export { PostgresEmbeddingRepository, PostgresListingRepository } from "./postgres-repo";
export { createEmbeddingRepository, createListingRepository } from "./factory";
export { buildFactsJson, buildTaxonomyJson, validateEnrichment } from "./facts";
export { buildTaxonomy } from "./taxonomy";
export { makeEnrichListingHandler } from "./enrich-listing";
export { buildEmbeddingText, makeEmbedListingHandler } from "./embed-listing";
export { enqueueEnrichmentSweep } from "./sweep";
export { createEnrichmentRuntime } from "./runtime";
export { getDefaultEnrichmentRuntime } from "./singleton";
export { runAutoEnrichCycle } from "./auto-enrich";
export type { AutoEnrichResult } from "./auto-enrich";

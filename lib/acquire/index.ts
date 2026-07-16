/**
 * acquire module public surface (prompt Module B, sec. 6).
 */
export type { IngestAction, IngestResult, AcquisitionDeps } from "./service";
export { AcquisitionService } from "./service";

export { normalizePhone, normalizeName } from "./dedup/normalize";
export {
  trigrams,
  trigramSimilarity,
  haversineMeters,
  geohash,
  cosineSimilarity,
} from "./dedup/similarity";
export { EntityResolver, scoreFeatures } from "./dedup/resolver";
export type { MergeFeatures, MatchResult, EmbedFn } from "./dedup/resolver";

export { GeographyResolver, pointInRing } from "./geo/resolver";
export type { Geography } from "./geo/resolver";
export { SAMPLE_BOUNDARIES } from "./geo/boundaries";
export type { AdminArea } from "./geo/boundaries";

export { OSM_TAG_MAP, isCommercial, mapTagsToCategory } from "./osm/tag-map";
export type { OsmTagMapRow } from "./osm/tag-map";
export { OsmImporter } from "./osm/importer";
export type { OsmElement, OsmImportResult, OsmImportStats } from "./osm/importer";
export { SAMPLE_OSM_ELEMENTS } from "./osm/sample";
export { fetchOsmElements, CITY_BOUNDING_BOXES } from "./osm/overpass";
export type { BoundingBox, FetchOsmElementsOptions } from "./osm/overpass";

export { PlacesClient } from "./places/client";
export type { PlaceMatch, PlaceSpotCheck, PlacesConfig } from "./places/client";

export { Crawler } from "./crawler/crawler";
export type { CrawlResult, CrawlerDeps } from "./crawler/crawler";
export { parseRobots, isAllowed } from "./crawler/robots";
export type { RobotsGroup } from "./crawler/robots";
export { extractJsonLd, extractMainText } from "./crawler/extract";

export { onboardingFromUrl } from "./onboarding/from-url";
export type { OnboardingDraft, OnboardingDeps } from "./onboarding/from-url";

export {
  parseCsv,
  buildCandidates,
  importCsvDryRun,
  importCsvCommit,
} from "./csv/import";
export type { CsvColumnMapping, CsvDryRun, ParsedCsv } from "./csv/import";

export { ClaimService } from "./claims/service";
export type { ClaimServiceDeps } from "./claims/service";

export { InMemoryMergeCandidateRepository } from "./stores/merge-candidates";
export type { MergeCandidate, MergeCandidateRepository } from "./stores/merge-candidates";
export { InMemoryIngestBatchRepository } from "./stores/ingest-batches";
export type { IngestBatch, IngestBatchRepository } from "./stores/ingest-batches";
export { InMemoryCrawlCacheRepository } from "./stores/crawl-cache";
export type { CrawlCacheRepository, CrawlCacheEntry } from "./stores/crawl-cache";
export { InMemoryClaimRepository } from "./stores/claims";
export type { Claim, ClaimRepository, ClaimMethod, ClaimStatus } from "./stores/claims";
export {
  PostgresClaimRepository,
  PostgresCrawlCacheRepository,
  PostgresIngestBatchRepository,
  PostgresMergeCandidateRepository,
} from "./stores/postgres";
export {
  createClaimRepository,
  createCrawlCacheRepository,
  createIngestBatchRepository,
  createMergeCandidateRepository,
} from "./stores/factory";

export { makeMergeAdjudicateHandler } from "./handlers/merge-adjudicate";
export type { MergeAdjudicateDeps } from "./handlers/merge-adjudicate";

export { createAcquisitionRuntime } from "./runtime";
export type { AcquisitionRuntime, AcquisitionRuntimeOverrides } from "./runtime";

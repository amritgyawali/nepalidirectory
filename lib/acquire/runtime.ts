/**
 * Acquisition runtime (prompt sec. 6): the enrichment runtime plus the acquisition engine —
 * OSM importer, dedup + merge queue, crawler, claims, CSV, and (optionally) the on-demand Places
 * client. Registers the MERGE_ADJUDICATE handler on the shared worker.
 */
import { createEnrichmentRuntime, type EnrichmentRuntime, type EnrichmentRuntimeOverrides } from "../enrich";
import { InMemoryMergeCandidateRepository, type MergeCandidateRepository } from "./stores/merge-candidates";
import { InMemoryIngestBatchRepository, type IngestBatchRepository } from "./stores/ingest-batches";
import { InMemoryCrawlCacheRepository, type CrawlCacheRepository } from "./stores/crawl-cache";
import { InMemoryClaimRepository, type ClaimRepository } from "./stores/claims";
import { EntityResolver } from "./dedup/resolver";
import { GeographyResolver } from "./geo/resolver";
import { AcquisitionService } from "./service";
import { OsmImporter } from "./osm/importer";
import { Crawler } from "./crawler/crawler";
import { ClaimService } from "./claims/service";
import { PlacesClient } from "./places/client";
import { makeMergeAdjudicateHandler } from "./handlers/merge-adjudicate";

export type AcquisitionRuntime = EnrichmentRuntime & {
  mergeCandidates: MergeCandidateRepository;
  ingestBatches: IngestBatchRepository;
  crawlCache: CrawlCacheRepository;
  claimsRepo: ClaimRepository;
  resolver: EntityResolver;
  geo: GeographyResolver;
  service: AcquisitionService;
  osmImporter: OsmImporter;
  crawler: Crawler;
  claims: ClaimService;
  places?: PlacesClient;
};

export type AcquisitionRuntimeOverrides = EnrichmentRuntimeOverrides;

export function createAcquisitionRuntime(
  overrides: AcquisitionRuntimeOverrides = {},
): AcquisitionRuntime {
  const enrich = createEnrichmentRuntime(overrides);

  const mergeCandidates = new InMemoryMergeCandidateRepository();
  const ingestBatches = new InMemoryIngestBatchRepository();
  const crawlCache = new InMemoryCrawlCacheRepository();
  const claimsRepo = new InMemoryClaimRepository();

  const resolver = new EntityResolver((text) => enrich.providers.embedder().embed(text));
  const geo = new GeographyResolver();
  const service = new AcquisitionService({
    listings: enrich.listings,
    mergeCandidates,
    resolver,
    geo,
    enqueue: (input) => enrich.repo.enqueue(input),
  });
  const osmImporter = new OsmImporter(service, ingestBatches);
  const crawler = new Crawler({ cache: crawlCache, fetchFn: overrides.fetchFn });
  const claims = new ClaimService({ claims: claimsRepo, listings: enrich.listings });

  const placesKey = process.env.GOOGLE_PLACES_API_KEY;
  const places = placesKey
    ? new PlacesClient({ apiKey: placesKey, fetchFn: overrides.fetchFn })
    : undefined;

  enrich.worker.register(
    "MERGE_ADJUDICATE",
    makeMergeAdjudicateHandler({
      listings: enrich.listings,
      mergeCandidates,
      prompts: enrich.prompts,
      siteName: enrich.config.siteName,
    }),
  );

  return {
    ...enrich,
    mergeCandidates,
    ingestBatches,
    crawlCache,
    claimsRepo,
    resolver,
    geo,
    service,
    osmImporter,
    crawler,
    claims,
    places,
  };
}

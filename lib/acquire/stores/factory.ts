/**
 * Chooses acquisition store implementations: Postgres-backed when `DATABASE_URL` is set, else the
 * in-memory stores (Phase 2 default, still used by all tests).
 */
import { loadAiConfig } from "../../ai-core/config";
import { createPgSqlExecutor } from "../../ai-core/queue/pg-client";
import type { MergeCandidateRepository } from "./merge-candidates";
import type { IngestBatchRepository } from "./ingest-batches";
import type { CrawlCacheRepository } from "./crawl-cache";
import type { ClaimRepository } from "./claims";
import { InMemoryMergeCandidateRepository } from "./merge-candidates";
import { InMemoryIngestBatchRepository } from "./ingest-batches";
import { InMemoryCrawlCacheRepository } from "./crawl-cache";
import { InMemoryClaimRepository } from "./claims";
import {
  PostgresClaimRepository,
  PostgresCrawlCacheRepository,
  PostgresIngestBatchRepository,
  PostgresMergeCandidateRepository,
} from "./postgres";

export function createMergeCandidateRepository(): MergeCandidateRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresMergeCandidateRepository(createPgSqlExecutor(databaseUrl))
    : new InMemoryMergeCandidateRepository();
}

export function createIngestBatchRepository(): IngestBatchRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresIngestBatchRepository(createPgSqlExecutor(databaseUrl))
    : new InMemoryIngestBatchRepository();
}

export function createCrawlCacheRepository(): CrawlCacheRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresCrawlCacheRepository(createPgSqlExecutor(databaseUrl))
    : new InMemoryCrawlCacheRepository();
}

export function createClaimRepository(): ClaimRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresClaimRepository(createPgSqlExecutor(databaseUrl))
    : new InMemoryClaimRepository();
}

/**
 * Chooses ListingRepository / EmbeddingRepository implementations: Postgres-backed when
 * `DATABASE_URL` is set, else the in-memory repos seeded from `lib/data.ts` (Phase 0/1 default,
 * still used by all tests).
 */
import { loadAiConfig } from "../ai-core/config";
import { createPgSqlExecutor } from "../ai-core/queue/pg-client";
import type { EmbeddingRepository, ListingRepository } from "./types";
import { InMemoryEmbeddingRepository, InMemoryListingRepository } from "./listing-repo";
import { PostgresEmbeddingRepository, PostgresListingRepository } from "./postgres-repo";

export function createListingRepository(): ListingRepository {
  const { databaseUrl } = loadAiConfig();
  if (databaseUrl) {
    return new PostgresListingRepository(createPgSqlExecutor(databaseUrl));
  }
  return new InMemoryListingRepository();
}

export function createEmbeddingRepository(): EmbeddingRepository {
  const { databaseUrl } = loadAiConfig();
  if (databaseUrl) {
    return new PostgresEmbeddingRepository(createPgSqlExecutor(databaseUrl));
  }
  return new InMemoryEmbeddingRepository();
}

/**
 * Chooses discover store implementations: Postgres-backed when `DATABASE_URL` is set, else the
 * in-memory stores (default, used by all tests).
 */
import { loadAiConfig } from "../../ai-core/config";
import { createPgSqlExecutor } from "../../ai-core/queue/pg-client";
import type { CategorySynonymRepository, DemandSignalRepository, SearchQueryLogRepository } from "../types";
import { InMemoryCategorySynonymRepository } from "./category-synonyms";
import { InMemoryDemandSignalRepository } from "./demand-signals";
import { InMemorySearchQueryLogRepository } from "./search-queries-log";
import {
  PostgresCategorySynonymRepository,
  PostgresDemandSignalRepository,
  PostgresSearchQueryLogRepository,
} from "./postgres";
import { SEED_CATEGORY_SYNONYMS } from "../synonyms/seed";

export function createCategorySynonymRepository(): CategorySynonymRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresCategorySynonymRepository(createPgSqlExecutor(databaseUrl))
    : new InMemoryCategorySynonymRepository(SEED_CATEGORY_SYNONYMS);
}

export function createDemandSignalRepository(): DemandSignalRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresDemandSignalRepository(createPgSqlExecutor(databaseUrl))
    : new InMemoryDemandSignalRepository();
}

export function createSearchQueryLogRepository(): SearchQueryLogRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresSearchQueryLogRepository(createPgSqlExecutor(databaseUrl))
    : new InMemorySearchQueryLogRepository();
}

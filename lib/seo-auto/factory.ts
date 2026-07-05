import { loadAiConfig } from "@/lib/ai-core/config";
import { createPgSqlExecutor } from "@/lib/ai-core/queue/pg-client";
import type { InternalLinkSuggestionRepository, SeoPageIntroRepository } from "./stores";
import {
  InMemoryInternalLinkSuggestionRepository,
  InMemorySeoPageIntroRepository,
  PostgresInternalLinkSuggestionRepository,
  PostgresSeoPageIntroRepository,
} from "./stores";

export function createSeoPageIntroRepository(): SeoPageIntroRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresSeoPageIntroRepository(createPgSqlExecutor(databaseUrl))
    : new InMemorySeoPageIntroRepository();
}

export function createInternalLinkSuggestionRepository(): InternalLinkSuggestionRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresInternalLinkSuggestionRepository(createPgSqlExecutor(databaseUrl))
    : new InMemoryInternalLinkSuggestionRepository();
}

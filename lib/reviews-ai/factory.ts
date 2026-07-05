import { loadAiConfig } from "@/lib/ai-core/config";
import { createPgSqlExecutor } from "@/lib/ai-core/queue/pg-client";
import type { ModerationQueueRepository, OwnerReplyDraftRepository, ReviewSummaryRepository } from "./types";
import {
  InMemoryModerationQueueRepository,
  InMemoryOwnerReplyDraftRepository,
  InMemoryReviewSummaryRepository,
  PostgresModerationQueueRepository,
  PostgresOwnerReplyDraftRepository,
  PostgresReviewSummaryRepository,
} from "./stores";

export function createReviewSummaryRepository(): ReviewSummaryRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresReviewSummaryRepository(createPgSqlExecutor(databaseUrl))
    : new InMemoryReviewSummaryRepository();
}

export function createModerationQueueRepository(): ModerationQueueRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresModerationQueueRepository(createPgSqlExecutor(databaseUrl))
    : new InMemoryModerationQueueRepository();
}

export function createOwnerReplyDraftRepository(): OwnerReplyDraftRepository {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl
    ? new PostgresOwnerReplyDraftRepository(createPgSqlExecutor(databaseUrl))
    : new InMemoryOwnerReplyDraftRepository();
}

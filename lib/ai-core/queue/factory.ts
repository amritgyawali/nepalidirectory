/**
 * Chooses the JobRepository implementation: Postgres-backed (`ai_jobs`, `FOR UPDATE SKIP LOCKED`)
 * when `DATABASE_URL` is set, else the in-memory repository (Phase 0 default, still used by all
 * tests).
 */
import type { JobRepository } from "./types";
import { InMemoryJobRepository } from "./memory-repo";
import { PostgresJobRepository } from "./pg-repo";
import { createPgSqlExecutor } from "./pg-client";
import { loadAiConfig } from "../config";

export function createJobRepository(): JobRepository {
  const { databaseUrl } = loadAiConfig();
  if (databaseUrl) {
    return new PostgresJobRepository(createPgSqlExecutor(databaseUrl));
  }
  return new InMemoryJobRepository();
}

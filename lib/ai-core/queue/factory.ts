/**
 * Chooses the JobRepository implementation.
 *
 * Phase 0: always in-memory (no DB provisioned). When DATABASE_URL is set but no SQL executor
 * has been wired yet, we still return in-memory and warn once — Phase 1 replaces this with a
 * real Postgres client feeding `PostgresJobRepository`.
 */
import type { JobRepository } from "./types";
import { InMemoryJobRepository } from "./memory-repo";
import { loadAiConfig } from "../config";

let warned = false;

export function createJobRepository(): JobRepository {
  const { databaseUrl } = loadAiConfig();
  if (databaseUrl && !warned) {
    warned = true;
    console.warn(
      "[ai-core] DATABASE_URL is set but the Postgres queue client is wired in Phase 1; " +
        "using the in-memory JobRepository for now.",
    );
  }
  return new InMemoryJobRepository();
}

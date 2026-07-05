/**
 * Chooses the BlogPostRepository implementation: Postgres-backed when `DATABASE_URL` is set (so
 * published posts persist and are visible across serverless invocations), else the in-memory repo
 * used by all tests and local dev. Same pattern as lib/enrich/factory.ts.
 *
 * Only `blog_posts` is persisted: trend sources/items/clusters are regenerated fresh inside each
 * generation cycle (scan -> cluster -> select -> generate all run in one process), so they have no
 * cross-invocation persistence need and stay in-memory.
 */
import { loadAiConfig } from "../../ai-core/config";
import { createPgSqlExecutor } from "../../ai-core/queue/pg-client";
import type { BlogPostRepository } from "../types";
import { InMemoryBlogPostRepository } from "./blog-posts";
import { PostgresBlogPostRepository } from "./postgres";

export function createBlogPostRepository(): BlogPostRepository {
  const { databaseUrl } = loadAiConfig();
  if (databaseUrl) {
    return new PostgresBlogPostRepository(createPgSqlExecutor(databaseUrl));
  }
  return new InMemoryBlogPostRepository();
}

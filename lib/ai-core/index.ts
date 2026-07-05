/**
 * ai-core public surface.
 *
 * `createAiCore()` assembles the queue repository, the provider chain (cache → budget →
 * rate-limit → fallback → adapter, with usage logging), the prompt registry, and a worker with
 * the NOOP handler registered. Enrichment (`lib/enrich`) builds on this and registers its own
 * ENRICH_LISTING / EMBED_LISTING handlers.
 */
export type { AiProvider, AiRequest, AiResult, ProviderRegistry } from "./types";
export type {
  AiJob,
  EnqueueInput,
  FailOptions,
  JobRepository,
  JobStatus,
  JobType,
  JsonObject,
} from "./queue/types";
export type { HandlerContext, JobHandler, WorkerOptions } from "./worker";
export type { AiConfig } from "./config";
export type { PromptTemplate } from "./prompts/types";
export type { RenderedPrompt } from "./prompts/registry";
export type { AiCacheRepository, CacheEntry } from "./stores/cache-repo";
export type { UsageLogRepository, UsageEntry } from "./stores/usage-repo";
export type { BudgetTracker } from "./stores/budget-tracker";
export type { SqlExecutor } from "./queue/pg-repo";
export type { FetchFn } from "./providers/http";

export { loadAiConfig } from "./config";
export { MockAiProvider } from "./providers/mock";
export { GeminiAdapter } from "./providers/gemini";
export { OpenAiCompatibleAdapter } from "./providers/openai-compatible";
export { OllamaAdapter } from "./providers/ollama";
export { createProviderRegistry } from "./providers/registry";
export { CachingProvider } from "./providers/decorators/caching";
export { BudgetGuard } from "./providers/decorators/budget";
export { RateLimiter } from "./providers/decorators/rate-limit";
export { FallbackChain } from "./providers/decorators/fallback";
export { LoggingProvider } from "./providers/decorators/logging";
export { InMemoryCacheRepository } from "./stores/cache-repo";
export { InMemoryUsageLogRepository } from "./stores/usage-repo";
export { InMemoryBudgetTracker } from "./stores/budget-tracker";
export { PromptRegistry } from "./prompts/registry";
export {
  SEED_TEMPLATES,
  LISTING_ENRICH_V1,
  MERGE_ADJUDICATE_V1,
  ATTRIBUTE_EXTRACT_V1,
  TREND_SELECTOR_V1,
  BLOG_WRITER_V1,
  BLOG_FACTCHECK_V1,
  NL_QUERY_PARSER_V1,
  CONCIERGE_V1,
  REVIEW_SUMMARIZER_V1,
  REVIEW_REPLY_DRAFTER_V1,
  CATEGORY_INTRO_V1,
  TRANSLATE_NE_V1,
} from "./prompts/seed";
export {
  AllProvidersExhaustedError,
  JsonValidationError,
  ProviderUnavailableError,
  RetryableAtError,
} from "./errors";
export { nextMidnight0015NPT } from "./time";
export { parseJsonResponse, stripCodeFences } from "./json";
export { sha256 } from "./hash";
export { InMemoryJobRepository } from "./queue/memory-repo";
export { PostgresJobRepository } from "./queue/pg-repo";
export { createJobRepository } from "./queue/factory";
export { createPgSqlExecutor } from "./queue/pg-client";
export { Worker } from "./worker";
export { noopHandler } from "./handlers/noop";

import type { AiConfig } from "./config";
import type { JobRepository } from "./queue/types";
import type { ProviderRegistry } from "./types";
import type { AiCacheRepository } from "./stores/cache-repo";
import type { UsageLogRepository } from "./stores/usage-repo";
import type { BudgetTracker } from "./stores/budget-tracker";
import type { FetchFn } from "./providers/http";
import { loadAiConfig } from "./config";
import { InMemoryCacheRepository } from "./stores/cache-repo";
import { InMemoryUsageLogRepository } from "./stores/usage-repo";
import { InMemoryBudgetTracker } from "./stores/budget-tracker";
import { PromptRegistry } from "./prompts/registry";
import { createJobRepository } from "./queue/factory";
import { createProviderRegistry } from "./providers/registry";
import { Worker } from "./worker";
import { noopHandler } from "./handlers/noop";

export type AiCore = {
  config: AiConfig;
  repo: JobRepository;
  providers: ProviderRegistry;
  worker: Worker;
  cache: AiCacheRepository;
  usage: UsageLogRepository;
  budget: BudgetTracker;
  prompts: PromptRegistry;
};

export type AiCoreOverrides = {
  config?: AiConfig;
  cache?: AiCacheRepository;
  usage?: UsageLogRepository;
  budget?: BudgetTracker;
  fetchFn?: FetchFn;
};

/** Assemble a ready-to-run ai-core with the provider chain wired and NOOP registered. */
export function createAiCore(overrides: AiCoreOverrides = {}): AiCore {
  const config = overrides.config ?? loadAiConfig();
  const cache = overrides.cache ?? new InMemoryCacheRepository();
  const usage = overrides.usage ?? new InMemoryUsageLogRepository();
  const budget = overrides.budget ?? new InMemoryBudgetTracker();
  const prompts = new PromptRegistry();
  const providers = createProviderRegistry({ config, cache, usage, budget, fetchFn: overrides.fetchFn });
  const repo = createJobRepository();
  const worker = new Worker(repo, providers).register("NOOP", noopHandler);
  return { config, repo, providers, worker, cache, usage, budget, prompts };
}

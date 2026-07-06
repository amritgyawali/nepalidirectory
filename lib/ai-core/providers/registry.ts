/**
 * Provider registry (prompt §5.2/§5.3): assembles the decorator chain from env.
 *
 * Completion pipeline (outer→inner):
 *   Logging → Caching → FallbackChain([ RateLimiter(BudgetGuard(adapter)) , … ])
 * Embedding pipeline: Logging → FallbackChain([ Ollama, Gemini, … ]) (Ollama-first, §5.3).
 *
 * With NO provider keys configured (dev/CI) it falls back to a mock-only chain so nothing hits
 * the network (prompt §20.9). Model IDs/caps/limits come from env, never hardcoded (§20.11).
 */
import type { AiProvider, ProviderRegistry } from "../types";
import type { AiCacheRepository } from "../stores/cache-repo";
import { InMemoryCacheRepository } from "../stores/cache-repo";
import type { UsageLogRepository } from "../stores/usage-repo";
import { InMemoryUsageLogRepository } from "../stores/usage-repo";
import type { BudgetTracker } from "../stores/budget-tracker";
import { InMemoryBudgetTracker } from "../stores/budget-tracker";
import type { FetchFn } from "./http";
import { loadAiConfig, type AiConfig } from "../config";
import { MockAiProvider } from "./mock";
import { GeminiAdapter } from "./gemini";
import { OpenAiCompatibleAdapter } from "./openai-compatible";
import { OllamaAdapter } from "./ollama";
import { BudgetGuard } from "./decorators/budget";
import { RateLimiter } from "./decorators/rate-limit";
import { FallbackChain } from "./decorators/fallback";
import { CachingProvider } from "./decorators/caching";
import { LoggingProvider } from "./decorators/logging";

export type RegistryDeps = {
  config: AiConfig;
  cache: AiCacheRepository;
  usage: UsageLogRepository;
  budget: BudgetTracker;
  fetchFn?: FetchFn;
};

/**
 * Current free-tier Gemini defaults (verified July 2026): the older `gemini-2.0-flash` and
 * `text-embedding-004` were retired in 2026. These let the owner upgrade to real Gemini by setting
 * ONLY `GEMINI_API_KEY` (no `GEMINI_MODEL`/`GEMINI_EMBED_MODEL` needed) — override via env anytime.
 */
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_GEMINI_EMBED_MODEL = "gemini-embedding-001";

function envNum(name: string, fallback: number): number {
  const v = process.env[name];
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function capFor(id: string): number {
  return envNum(`${id.toUpperCase()}_DAILY_TOKEN_CAP`, 0); // 0 = unlimited
}

function rpmFor(id: string): number {
  return envNum(`${id.toUpperCase()}_RPM`, 0); // 0 = unlimited
}

/** Build a raw completion/embed adapter for a provider id if its env keys are present. */
function buildAdapter(id: string, cfg: AiConfig, fetchFn?: FetchFn): AiProvider | null {
  const env = process.env;
  switch (id) {
    case "gemini":
      // Only the API key is required; model IDs default to the current free-tier models so the
      // owner can "just add GEMINI_API_KEY" in Vercel and get real answers with no other config.
      return env.GEMINI_API_KEY
        ? new GeminiAdapter({
            apiKey: env.GEMINI_API_KEY,
            model: env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL,
            embedModel: env.GEMINI_EMBED_MODEL ?? DEFAULT_GEMINI_EMBED_MODEL,
            embeddingDim: cfg.embeddingDim,
            fetchFn,
          })
        : null;
    case "groq":
      return env.GROQ_API_KEY && env.GROQ_MODEL
        ? new OpenAiCompatibleAdapter({
            id: "groq",
            apiKey: env.GROQ_API_KEY,
            model: env.GROQ_MODEL,
            baseUrl: env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
            fetchFn,
          })
        : null;
    case "openrouter":
      return env.OPENROUTER_API_KEY && env.OPENROUTER_MODEL
        ? new OpenAiCompatibleAdapter({
            id: "openrouter",
            apiKey: env.OPENROUTER_API_KEY,
            model: env.OPENROUTER_MODEL,
            baseUrl: env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
            fetchFn,
          })
        : null;
    case "ollama":
      return env.OLLAMA_BASE_URL && env.OLLAMA_MODEL
        ? new OllamaAdapter({
            baseUrl: env.OLLAMA_BASE_URL,
            model: env.OLLAMA_MODEL,
            embedModel: env.OLLAMA_EMBED_MODEL ?? "bge-m3",
            fetchFn,
          })
        : null;
    default:
      // Mark cfg as intentionally referenced; provider-specific config lives in env.
      void cfg;
      return null;
  }
}

function buildEmbedAdapter(cfg: AiConfig, fetchFn?: FetchFn): AiProvider | null {
  const env = process.env;
  if (env.OLLAMA_BASE_URL) {
    return new OllamaAdapter({
      baseUrl: env.OLLAMA_BASE_URL,
      embedModel: env.OLLAMA_EMBED_MODEL ?? "bge-m3",
      fetchFn,
    });
  }
  if (env.GEMINI_API_KEY) {
    return new GeminiAdapter({
      apiKey: env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL,
      embedModel: env.GEMINI_EMBED_MODEL ?? DEFAULT_GEMINI_EMBED_MODEL,
      embeddingDim: cfg.embeddingDim,
      fetchFn,
    });
  }
  void cfg;
  return null;
}

class AssembledRegistry implements ProviderRegistry {
  private readonly raw: AiProvider[];
  private readonly completionChain: AiProvider;
  private readonly embedChain: AiProvider;

  constructor(raw: AiProvider[], completionChain: AiProvider, embedChain: AiProvider) {
    this.raw = raw;
    this.completionChain = completionChain;
    this.embedChain = embedChain;
  }

  chain(): AiProvider {
    return this.completionChain;
  }
  embedder(): AiProvider {
    return this.embedChain;
  }
  adapters(): AiProvider[] {
    return [...this.raw];
  }
  primary(): AiProvider {
    return this.raw[0];
  }
  get(id: string): AiProvider | null {
    return this.raw.find((p) => p.id() === id) ?? null;
  }
}

export function createProviderRegistry(deps: Partial<RegistryDeps> = {}): ProviderRegistry {
  const config = deps.config ?? loadAiConfig();
  const cache = deps.cache ?? new InMemoryCacheRepository();
  const usage = deps.usage ?? new InMemoryUsageLogRepository();
  const budget = deps.budget ?? new InMemoryBudgetTracker();
  const { fetchFn } = deps;

  // Ordered, de-duplicated provider ids: primary first, then fallbacks.
  const ids = [config.primary, ...config.fallbacks].filter((v, i, a) => a.indexOf(v) === i);

  const raw: AiProvider[] = [];
  for (const id of ids) {
    const adapter = buildAdapter(id, config, fetchFn);
    if (adapter) raw.push(adapter);
  }

  // No real keys → mock-only (dev/CI). Guarantees zero external calls.
  if (raw.length === 0) raw.push(new MockAiProvider());

  const wrapped = raw.map(
    (a) => new RateLimiter(new BudgetGuard(a, budget, capFor(a.id())), rpmFor(a.id())),
  );
  const completionChain = new LoggingProvider(
    new CachingProvider(new FallbackChain(wrapped), cache, config.cacheTtlDays),
    usage,
  );

  const embedAdapter = buildEmbedAdapter(config, fetchFn);
  const embedProviders = embedAdapter ? [embedAdapter] : [raw[0]];
  const embedChain = new LoggingProvider(new FallbackChain(embedProviders), usage);

  return new AssembledRegistry(raw, completionChain, embedChain);
}

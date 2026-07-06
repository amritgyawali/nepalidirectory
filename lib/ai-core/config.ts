/**
 * ai-core runtime config (subset of prompt §18 needed in Phase 0).
 *
 * Server-only: reads process.env. Do NOT import from client components. All AI feature flags
 * default to OFF (prompt §0.4 / §20.8) so nothing activates until the owner opts in.
 */

function bool(name: string, fallback = false): boolean {
  const v = process.env[name];
  if (v === undefined || v === "") return fallback;
  return v === "true" || v === "1" || v.toLowerCase() === "yes";
}

function num(name: string, fallback: number): number {
  const v = process.env[name];
  if (v === undefined || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function str(name: string, fallback: string): string {
  const v = process.env[name];
  return v === undefined || v === "" ? fallback : v;
}

function list(name: string): string[] {
  const v = process.env[name];
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export type AiConfig = {
  /** Master switch (prompt AI_ENABLED). */
  enabled: boolean;
  /** Free, no-provider public fallback for search/concierge when real AI is not configured. */
  publicAiFallback: boolean;
  blogEngineEnabled: boolean;
  blogAutopublish: boolean;
  conciergeEnabled: boolean;
  crawlerEnabled: boolean;
  /** Autonomous listing enrichment (descriptions/FAQs/tags) via the nightly cron sweep. */
  enrichEnabled: boolean;
  /** Provider selection (Phase 1 wires real adapters; Phase 0 always resolves to mock). */
  primary: string;
  fallbacks: string[];
  /** Embedding dimension — MUST match the migration's vector(N). */
  embeddingDim: number;
  cacheTtlDays: number;
  enrichDailyCap: number;
  /** Postgres connection; when empty the queue uses the in-memory repository. */
  databaseUrl: string;
  siteName: string;
  siteUrl: string;
};

/** Snapshot env into a typed config object. Re-read (not cached) so tests can mutate env. */
export function loadAiConfig(): AiConfig {
  return {
    enabled: bool("AI_ENABLED"),
    publicAiFallback: bool("PUBLIC_AI_FALLBACK", true),
    blogEngineEnabled: bool("BLOG_ENGINE_ENABLED"),
    blogAutopublish: bool("BLOG_AUTOPUBLISH"),
    conciergeEnabled: bool("CONCIERGE_ENABLED"),
    crawlerEnabled: bool("CRAWLER_ENABLED"),
    enrichEnabled: bool("ENRICH_ENABLED"),
    primary: str("AI_PRIMARY", "gemini"),
    fallbacks: list("AI_FALLBACKS"),
    embeddingDim: num("EMBEDDING_DIM", 768),
    cacheTtlDays: num("AI_CACHE_TTL_DAYS", 30),
    enrichDailyCap: num("ENRICH_DAILY_CAP", 300),
    databaseUrl: str("DATABASE_URL", ""),
    siteName: str("SITE_NAME", "NepaliDirectory"),
    siteUrl: str("SITE_URL", "https://www.nepalidirectory.com"),
  };
}

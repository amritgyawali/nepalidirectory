import { loadAiConfig } from "@/lib/ai-core/config";
import { createPgSqlExecutor } from "@/lib/ai-core/queue/pg-client";
import type { SqlExecutor } from "@/lib/ai-core/queue/pg-repo";

export type AiFeatureFlagKey =
  | "AI_ENABLED"
  | "ENRICH_LISTING"
  | "CRAWLER_ENABLED"
  | "BLOG_ENGINE_ENABLED"
  | "BLOG_AUTOPUBLISH"
  | "CONCIERGE_ENABLED"
  | "REVIEW_SUMMARY"
  | "REVIEW_REPLY_DRAFTS"
  | "TRANSLATE_NE"
  | "EVERGREEN_PAGE"
  | "INTERNAL_LINK_SUGGESTER";

export type AiFeatureFlag = {
  key: AiFeatureFlagKey;
  label: string;
  enabled: boolean;
  note: string;
};

const defaults: AiFeatureFlag[] = [
  { key: "AI_ENABLED", label: "AI master switch", enabled: process.env.AI_ENABLED === "true", note: "Global kill switch for all AI calls." },
  { key: "ENRICH_LISTING", label: "Listing enrichment", enabled: process.env.AI_ENABLED === "true", note: "Descriptions, FAQs, meta and tags." },
  { key: "CRAWLER_ENABLED", label: "Crawler", enabled: process.env.CRAWLER_ENABLED === "true", note: "Robots-respecting listing URL fetches." },
  { key: "BLOG_ENGINE_ENABLED", label: "Trend blog engine", enabled: process.env.BLOG_ENGINE_ENABLED === "true", note: "Trend scan, selection and draft generation." },
  { key: "BLOG_AUTOPUBLISH", label: "Blog autopublish", enabled: process.env.BLOG_AUTOPUBLISH === "true", note: "Must stay off until human-review threshold is met." },
  { key: "CONCIERGE_ENABLED", label: "AI concierge", enabled: process.env.CONCIERGE_ENABLED === "true", note: "Grounded chat over search results." },
  { key: "REVIEW_SUMMARY", label: "Review summaries", enabled: false, note: "AI summaries from raw published reviews." },
  { key: "REVIEW_REPLY_DRAFTS", label: "Owner reply drafts", enabled: false, note: "Drafts only; owners edit before posting." },
  { key: "TRANSLATE_NE", label: "Nepali translation", enabled: false, note: "description_ne and Nepali FAQ generation." },
  { key: "EVERGREEN_PAGE", label: "Evergreen pages", enabled: false, note: "Category-city intro generation and refresh jobs." },
  { key: "INTERNAL_LINK_SUGGESTER", label: "Internal-link suggester", enabled: false, note: "Nightly suggestions for editor approval." },
];

const globalForFlags = globalThis as typeof globalThis & {
  __aiFeatureFlags?: Map<AiFeatureFlagKey, AiFeatureFlag>;
};

function store(): Map<AiFeatureFlagKey, AiFeatureFlag> {
  if (!globalForFlags.__aiFeatureFlags) {
    globalForFlags.__aiFeatureFlags = new Map(defaults.map((flag) => [flag.key, { ...flag }]));
  }
  return globalForFlags.__aiFeatureFlags;
}

function getSql(): SqlExecutor | null {
  const { databaseUrl } = loadAiConfig();
  return databaseUrl ? createPgSqlExecutor(databaseUrl) : null;
}

function mergeDbRows(rows: Array<{ key: string; enabled: boolean; note: string | null }>): AiFeatureFlag[] {
  const byKey = new Map(defaults.map((flag) => [flag.key, { ...flag }]));
  for (const row of rows) {
    if (!isKnownAiFeatureFlag(row.key)) continue;
    const base = byKey.get(row.key)!;
    byKey.set(row.key, {
      ...base,
      enabled: row.enabled,
      note: row.note ?? base.note,
    });
  }
  return [...byKey.values()];
}

export async function listAiFeatureFlags(): Promise<AiFeatureFlag[]> {
  const sql = getSql();
  if (!sql) return [...store().values()];
  const rows = await sql<{ key: string; enabled: boolean; note: string | null }>(
    `SELECT key, enabled, note FROM feature_flags WHERE key = ANY($1::text[]) ORDER BY key`,
    [defaults.map((flag) => flag.key)],
  );
  return mergeDbRows(rows);
}

export async function setAiFeatureFlag(key: AiFeatureFlagKey, enabled: boolean): Promise<AiFeatureFlag> {
  const sql = getSql();
  if (sql) {
    const base = defaults.find((flag) => flag.key === key)!;
    const rows = await sql<{ key: string; enabled: boolean; note: string | null }>(
      `INSERT INTO feature_flags (key, enabled, note)
       VALUES ($1, $2, $3)
       ON CONFLICT (key) DO UPDATE SET enabled = EXCLUDED.enabled
       RETURNING key, enabled, note`,
      [key, enabled, base.note],
    );
    const merged = mergeDbRows(rows).find((flag) => flag.key === key);
    if (!merged) throw new Error(`unknown feature flag: ${key}`);
    return merged;
  }

  const flags = store();
  const current = flags.get(key);
  if (!current) throw new Error(`unknown feature flag: ${key}`);
  const next = { ...current, enabled };
  flags.set(key, next);
  return next;
}

export function isKnownAiFeatureFlag(value: string): value is AiFeatureFlagKey {
  return defaults.some((flag) => flag.key === value);
}

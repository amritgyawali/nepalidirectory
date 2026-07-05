# NepaliDirectory (Pahelo)

Nepal business directory — a Next.js 15 (App Router) + React 19 + TypeScript app. This repo is
being transformed into an AI-native local discovery platform per
[`NEPALIDIRECTORY_AI_BUILD_PROMPT.md`](./NEPALIDIRECTORY_AI_BUILD_PROMPT.md), phase by phase.

Repo: [github.com/amritgyawali/nepalidirectory](https://github.com/amritgyawali/nepalidirectory)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + any AI keys
npm run dev                  # http://localhost:3000
```

## Database — Supabase

The database is **Supabase (Postgres)**. Client helpers follow the Supabase SSR pattern:

- `utils/supabase/server.ts` — server client (Server Components / Route Handlers / Actions).
- `utils/supabase/client.ts` — browser client for Client Components.
- `utils/supabase/middleware.ts` + root `middleware.ts` — refresh the auth session per request.

Env (`.env.local`, gitignored):

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # anon, browser-safe (RLS-protected)
SUPABASE_SERVICE_ROLE_KEY=...     # server-only; background jobs/imports (bypasses RLS)
DATABASE_URL=postgres://...       # Postgres conn string; migrations + queue + pgvector
```

Usage:

```ts
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient(await cookies());
const { data } = await supabase.from("listings").select();
```

Applying the SQL schema: run `db/migrations/*.sql` (V1…V6) against Supabase — via the SQL
Editor, `supabase db push`, or `psql "$DATABASE_URL" -f db/migrations/V1__ai_core.sql`. The
in-memory stores (queue, listings, embeddings, …) remain the default until `DATABASE_URL` is set,
so the app and tests run with zero DB today.

Scripts:

| Script | Purpose |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint (zero-warning gate) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest (ai-core + enrich; zero external calls) |

## AI features (build in progress)

The AI capabilities are added in phases (see the build prompt §17). **Everything AI ships
behind an env feature flag and is OFF by default** — nothing activates or calls an external API
until you opt in.

### Enabling

1. Copy the template: `cp .env.example .env.local`.
2. Flip the master switches you want on (`AI_ENABLED`, `BLOG_ENGINE_ENABLED`,
   `CONCIERGE_ENABLED`, `CRAWLER_ENABLED`, `BLOG_AUTOPUBLISH`). All default `false`.
3. Supply provider keys (`GEMINI_API_KEY` + `GEMINI_MODEL`, `GROQ_API_KEY` + `GROQ_MODEL`, …).
   **Verify current free-tier model IDs/limits at setup time** — the placeholders in
   `.env.example` are intentionally blank. With NO keys set, the provider chain uses the
   deterministic mock (zero network), so dev/CI never call out.
4. For persistence-backed features (queue, embeddings, search), set `DATABASE_URL` to a
   Postgres 16 + pgvector instance and run the SQL in [`db/migrations/`](./db/migrations/).

Without `DATABASE_URL`, the job queue and listing/embedding stores use **in-memory**
implementations — enough for local dev, tests, and CI.

### Status by phase

| Phase | Scope | Status |
|---|---|---|
| **0** | Audit + `ai-core` scaffold (provider layer, MockAiProvider, job queue + worker + NOOP) | done |
| **1** | Provider chain (cache/budget/rate-limit/fallback/usage-log) + enrichment (`ENRICH_LISTING`, `EMBED_LISTING`, quality score) | done |
| **2** | Acquisition + dedup (OSM import + geography, entity resolution + merge queue, Places on-demand, crawler, CSV, claims, `/attribution`) | done |
| 3 | Trending blog engine (trends -> cluster -> select -> 5-pass generate -> fact-check -> publish) | pending |
| 4 | Semantic search + AI concierge | pending |
| 5 | SEO/AEO + review intelligence + Nepali/hreflang + polish | pending |

Live progress log: [`ai-build-progress/PROGRESS.md`](./ai-build-progress/PROGRESS.md).
Audit + decisions: [`docs/PHASE0_AUDIT.md`](./docs/PHASE0_AUDIT.md),
[`docs/DECISIONS.md`](./docs/DECISIONS.md).

## `ai-core` module

`lib/ai-core/` is the provider-agnostic AI foundation:

- **Providers** (`providers/`) — `AiProvider` interface + `MockAiProvider` (deterministic
  output for tests) + real adapters: `GeminiAdapter`, `OpenAiCompatibleAdapter` (Groq /
  OpenRouter / any OpenAI-style key), `OllamaAdapter` (local, free embeddings).
- **Decorator chain** (`providers/decorators/`) — `Logging( Caching( FallbackChain([
  RateLimiter( BudgetGuard( adapter ) ) … ]) ) )`: response cache, per-provider daily token
  budget, token-bucket rate limiting, provider fallback, and a full usage log.
- **Queue** (`queue/`) — `ai_jobs` job queue behind a `JobRepository` interface (in-memory
  default; Postgres impl uses `FOR UPDATE SKIP LOCKED`).
- **Worker** (`worker.ts`) — claims jobs, dispatches to handlers, retries with backoff, marks
  exhausted jobs `DEAD`, and re-queues budget-blocked jobs to next-day 00:15 NPT.
- **Prompts** (`prompts/`) — versioned `prompt_templates` registry, seeded with
  `LISTING_ENRICH_V1` (prompt §15).

## `enrich` module (Phase 1)

`lib/enrich/` runs listing enrichment (prompt §7) on top of `ai-core`:

- **`ENRICH_LISTING`** — one AI call fills description / meta / FAQ / tags / category /
  attributes from ONLY the listing's structured facts (never invents facts), writes provenance
  (`description_source='ai_v1'`), recomputes `quality_score`, and enqueues an embed job. Owner
  descriptions are never overwritten; low category confidence keeps the old category and flags
  for review.
- **`EMBED_LISTING`** — embeds `name + category + description + tags + locality` (Ollama-first).
- **quality score** (`quality.ts`) — weighted 0–100 completeness (prompt §6.7).

```ts
import { createEnrichmentRuntime, enqueueEnrichmentSweep } from "@/lib/enrich";

const rt = createEnrichmentRuntime();                 // seeded from lib/data.ts (no DB yet)
await enqueueEnrichmentSweep(rt.repo, rt.listings, 300); // ENRICH_DAILY_CAP
while (await rt.worker.runOnce()) { /* drains ENRICH -> EMBED */ }
```

## `acquire` module (Phase 2)

`lib/acquire/` is the compliant data-acquisition engine (prompt sec. 2 + sec. 6):

- **OSM importer** (`osm/`) — imports named commercial POIs, maps ~120 OSM tags to categories,
  resolves province/district/municipality by point-in-polygon (`geo/`), tags rows
  `data_source="osm"` + `licenseNote="ODbL"`, and is idempotent on the OSM natural key.
- **Entity resolution** (`dedup/`) — phone/trigram/geo/embedding scoring with three bands:
  auto-merge (>=0.90, reversible), a `merge_candidates` queue + `MERGE_ADJUDICATE` AI verdict for
  0.65–0.90 (human confirms), and distinct below.
- **Google Places** (`places/`) — **on-demand only**: exactly two methods
  (`findPlaceForClaim`, `adminSpotCheck`); no batch/bulk-store (HARD RULE 1).
- **Crawler** (`crawler/`) — robots.txt-respecting, throttled (1 req / 2s / host), HTML cached
  ~30 days; feeds `onboarding/` (URL -> draft listing) and attribute extraction.
- **CSV import** (`csv/`) — column mapping -> dry-run -> commit through the same dedup pipeline.
- **Claims** (`claims/`) — OTP-to-phone or document -> admin queue -> listing marked claimed.
- **`/attribution`** page + footer credit satisfy the ODbL requirement.

```ts
import { createAcquisitionRuntime, SAMPLE_OSM_ELEMENTS } from "@/lib/acquire";

const rt = createAcquisitionRuntime();
await rt.osmImporter.import(SAMPLE_OSM_ELEMENTS); // dedup + geography applied per row
```

> The full national OSM extract, live provider keys, and Postgres are runtime concerns — the
> importer/dedup/crawler are exercised in tests via fixtures + stub fetch, zero network.

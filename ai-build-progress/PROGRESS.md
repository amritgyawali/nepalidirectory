# AI Build — Progress Tracker

> Purpose: resumable status log. If a session is interrupted (token limit, error, or a
> stop), read this file first to know exactly what is done and what to do next.
> Source of truth for the plan: [`NEPALIDIRECTORY_AI_BUILD_PROMPT.md`](../NEPALIDIRECTORY_AI_BUILD_PROMPT.md).

**Last updated:** 2026-07-06
**Current phase:** Phase 8 - automatic serverless auto-blog publishing
**Phase 0 status:** DONE  ·  **Phase 1 status:** DONE  ·  **Phase 2 status:** DONE  ·
**Phase 3 status:** DONE  ·  **Phase 4 status:** DONE  ·
**Phase 5 status:** DONE - verified (lint + typecheck + 63 tests green + `next build` succeeds,
incl. `/admin/ai`, `/api/listings/[id]/ai-summary`, `/best/restaurants/kathmandu`, split sitemaps)
**Phase 6 status:** DONE - post-Phase-5 persistence hardening verified (lint + typecheck + 63 tests
green + `next build` succeeds)
**Phase 7 status:** DONE - generated-artifact persistence verified (lint + typecheck + 64 tests
green + `next build` succeeds)
**Next:** run V16 in Supabase (`owner_reply_drafts.review_ref` follow-up), then run the external
SEO audit commands against a staging URL.

---

## Critical context for whoever resumes

- **Actual stack != assumed stack.** Real repo is **Next.js 15 (App Router) + React 19 + TS**,
  **no database** — data lives in static TS files under `lib/`. Per prompt sec. 0.1 we map modules
  onto the real stack but keep the **contracts** (SQL tables, endpoints, prompts, env vars)
  identical. Full write-up: [`docs/PHASE0_AUDIT.md`](../docs/PHASE0_AUDIT.md). Decisions:
  [`docs/DECISIONS.md`](../docs/DECISIONS.md).
- **Git: RESOLVED (2026-07-05).** Repo is now git-initialized with remote
  `github.com/amritgyawali/nepalidirectory` (commits: "first"/"second commit"). Commits can proceed.
- **Database: RESOLVED (2026-07-05) — Supabase (Postgres), project `frxszqimsvgraoldwrvn`.**
  Client helpers in `utils/supabase/` + root `middleware.ts`; creds in `.env.local` (gitignored).
  Full schema applied (V0–V12 + seeds, 20 tables, ALL with RLS) and the 11 demo businesses migrated
  into `listings`. Postgres-backed repos are wired (`lib/ai-core/queue/pg-client.ts` + factories in
  `lib/{ai-core/queue,enrich,acquire/stores,discover/stores}/factory.ts`) — used automatically once
  `DATABASE_URL` is set (still empty in `.env.local`; needs the DB password). Until then everything
  runs on the same in-memory stores tests use. `SUPABASE_ACCESS_TOKEN` (account-wide Management API
  token) is in `.env.local`; the Supabase CLI is logged in + linked to this project
  (`npx supabase ...`). See docs/DECISIONS.md "Infrastructure" + "Phase 3"/"Phase 4".
  Phase 5 V13/V14 and Phase 6 V15 were applied in Supabase by the owner after Phase 6.
  Verification found Phase 5 tables, prompt seeds, feature flags, and `moderation_queue.entity_ref`
  live. V16 remains needed because Phase 7 added `owner_reply_drafts.review_ref`.

---

## Phase 0 + 1 — DONE (see git-less tree)

- P0: audit, DECISIONS, `.env.example`, `V1__ai_core.sql`, `lib/ai-core` scaffold, MockAiProvider,
  `ai_jobs` queue + worker + NOOP, tests.
- P1: provider chain (Gemini/OpenAI-compatible/Ollama/Mock) + cache/budget/rate-limit/fallback/
  usage-log; `prompt_templates` (LISTING_ENRICH_V1); `ENRICH_LISTING` + `EMBED_LISTING`;
  `quality_score`; sweep; budget re-queue. Migrations V2–V4. `lib/enrich`.

## Phase 2 checklist (prompt sec. 6 / sec. 17)

| # | Deliverable | Status |
|---|---|---|
| 1 | OSM importer + ~120-row tag map + geography (point-in-polygon) + ingest_batches | DONE |
| 2 | Entity resolution (phone/trgm/geo/embedding) + 3 bands + merge_candidates + MERGE_ADJUDICATE | DONE |
| 3 | Google Places on-demand client (2 methods only, policy comment) — HARD RULE 1 | DONE |
| 4 | Robots-respecting crawler + crawl_cache + text/JSON-LD extraction | DONE |
| 5 | AI onboarding-from-URL (crawler -> ATTRIBUTE_EXTRACT -> draft) | DONE |
| 6 | CSV import (parse + column map + dry-run + commit through dedup) | DONE |
| 7 | Business claims (OTP / document -> admin queue -> listing claimed) | DONE |
| 8 | Prompts MERGE_ADJUDICATE_V1 + ATTRIBUTE_EXTRACT_V1 (seed + mock canned + SQL) | DONE |
| 9 | Migrations V5 (acquisition) + V6 (phase-2 prompt seeds) | DONE |
| 10 | `/attribution` page + footer "© OpenStreetMap contributors" (ODbL) | DONE |
| 11 | Tests (44) + typecheck + lint green | DONE |
| 12 | Commit | BLOCKED — repo not git-initialized (see open items) |

**Acceptance met:** OSM sample imports across 4 districts (>=3) with ODbL provenance + idempotent
re-run; dedup demonstrated on planted duplicates (auto-merge / candidate+AI verdict / distinct);
attribution page + footer credit live.

## Files added in Phase 2

`lib/acquire/`: `service.ts`, `runtime.ts`, `index.ts`;
`dedup/{normalize,similarity,resolver}.ts`;
`geo/{boundaries,resolver}.ts`;
`osm/{tag-map,sample,importer}.ts`;
`places/client.ts`; `crawler/{robots,extract,crawler}.ts`;
`onboarding/from-url.ts`; `csv/import.ts`; `claims/service.ts`;
`stores/{merge-candidates,ingest-batches,crawl-cache,claims}.ts`;
`handlers/merge-adjudicate.ts`; `__tests__/{dedup,tiers}.test.ts`.
`db/migrations/{V5__acquisition,V6__seed_prompts_phase2}.sql`.
`app/attribution/page.tsx`.
**Changed:** `lib/enrich/types.ts` + `listing-repo.ts` (acquisition fields, insert/upsert/remove,
`makeNewListing`), `lib/enrich/index.ts`, `lib/ai-core/prompts/seed.ts`,
`lib/ai-core/providers/mock.ts` (canned merge/attribute JSON), `components/layout/Footer.tsx`,
`lib/routes.ts` (attribution route).

## Phase 3 checklist (prompt sec. 8 / sec. 17)

| # | Deliverable | Status |
|---|---|---|
| 1 | Trend sources seed (rss/reddit/youtube/gtrends) + tolerant fetchers + TREND_SCAN | DONE |
| 2 | Clustering (cosine >=0.82 agglomerative, score formula) + top-20 `trend_clusters` | DONE |
| 3 | Brand-safety hard filter (code) + TREND_SELECTOR_V1 + commercial-bridge rule + daily cap | DONE |
| 4 | 5-pass generation: source pack, draft (BLOG_WRITER_V1), fact-check (BLOG_FACTCHECK_V1) + 1 auto-revision, SEO/uniqueness, deterministic link injection | DONE |
| 5 | Editorial workflow DRAFT→REVIEW→PUBLISHED\|REJECTED (`EditorialService`) + autopublish gate (off) | DONE |
| 6 | Migrations V8 (blog schema) + V9 (phase-3 prompt seeds) + V10 (RLS fix for V8's tables) | DONE |
| 7 | `/blog`, `/blog/[slug]` merge in PUBLISHED engine posts (ISR 300s) + `/blog/rss.xml` + deterministic OG image route + `/editorial-policy` transparency note | DONE |
| 8 | Tests (3 new: brand-safety, link injection, end-to-end scan→cluster→select→generate→publish) | DONE |
| 9 | Data migration: 11 `lib/data.ts` businesses → Supabase `listings`; Postgres-backed repos wired (selected via `DATABASE_URL`) | DONE |
| 10 | Commit | not yet requested |

**Acceptance met:** seeded 3 trend items (2 sharing a headline → 1 merged cluster + 1 singleton) →
`runDailySweep()` clusters → selects (brand-safety + commercial-bridge) → generates ≥2 posts,
all landing in `REVIEW` with `sources.length > 0`, `factcheck` attached, and 3 injected internal
links each; `EditorialService.publish()` moves one to `PUBLISHED`. `next build` renders it through
the existing curated-post page/JSON-LD. Auto-publish stays OFF throughout.

## Files added in Phase 3

`lib/blog-engine/`: `types.ts`, `safety.ts`, `selector.ts`, `editorial.ts`, `adapter.ts`,
`singleton.ts`, `runtime.ts`, `index.ts`; `stores/{trend-sources,trend-items,trend-clusters,
blog-posts}.ts`; `sources/{seed,fetchers}.ts`; `generate/{source-pack,writer,factcheck,seo,
link-injection}.ts`; `handlers/{trend-scan,trend-cluster,blog-generate}.ts`;
`__tests__/blog-engine.test.ts`.
`app/blog/rss.xml/route.ts`; `app/blog/engine-og/[slug]/route.tsx`.
`db/migrations/{V8__blog,V9__seed_prompts_phase3}.sql`.
Postgres wiring: `lib/ai-core/queue/pg-client.ts`; `lib/enrich/{postgres-repo,factory}.ts`;
`lib/acquire/stores/{postgres,factory}.ts`; `scripts/gen-listings-seed.mts` +
`db/seeds/listings_demo.sql`.
**Changed:** `lib/ai-core/prompts/seed.ts` + `providers/mock.ts` (3 new templates; mock writer
varies per-request so the uniqueness check doesn't collide different topics), `lib/ai-core/index.ts`
/ `lib/enrich/index.ts` / `lib/acquire/index.ts` (new exports), `lib/ai-core/queue/factory.ts`
(Postgres selection), `lib/enrich/runtime.ts` / `lib/acquire/runtime.ts` (use the new factories),
`lib/authors.ts` (added "NepaliDirectory Team"), `app/blog/page.tsx` + `app/blog/[slug]/page.tsx`
(merge in published engine posts, ISR, editorial-policy byline link), `app/editorial-policy/page.tsx`
(AI-assisted transparency note), `package.json` (`pg` + `@types/pg`), `db/README.md`.

## Phase 4 checklist (prompt sec. 9 / sec. 17)

| # | Deliverable | Status |
|---|---|---|
| 1 | Hybrid retrieval: RRF over term-match + embedding cosine, re-ranked by quality_score | DONE |
| 2 | `category_synonyms` (10 EN/romanized-Nepali rows) folded into search + NL parser | DONE |
| 3 | NL query parser: regex fast path ("[category] in [place]") + `NL_QUERY_PARSER_V1` fallback | DONE |
| 4 | AI concierge (`CONCIERGE_V1`): structurally-grounded (code always calls search first), rate-limited per session, transcripts kept | DONE |
| 5 | `demand_signals` + `search_queries_log` (zero-result / unmet-need logging) | DONE |
| 6 | Migrations V11 (discover tables + `search_tsv` trigger, +RLS) + V12 (phase-4 prompt seeds) | DONE |
| 7 | `GET /api/search`, `POST /api/concierge` (SSE) | DONE |
| 8 | Tests (5 new: NL fast path incl. romanized Nepali, hybrid ranking, concierge grounding on match + zero-result) | DONE |
| 9 | Postgres-backed discover stores wired (selected via `DATABASE_URL`, same pattern as Phases 2–3) | DONE |
| 10 | Commit | not yet requested |

**Acceptance met:** `"chiya pasal thamel"` (romanized Nepali) resolves via the fast path with zero
AI calls to the right category+place; `hybridSearch` correctly excludes wrong-category listings and
ranks the closer embedding match first; the concierge recommends only the listing `hybridSearch`
actually returned for a matching query, and for a query with no supply returns the honest fallback
message with zero listings and a logged `demand_signals` row — proven as a structural invariant
(code always calls search first), not prompt-engineering hope.

## Files added in Phase 4

`lib/discover/`: `types.ts`, `nl-query.ts`, `search.ts`, `concierge.ts`, `rate-limit.ts`,
`runtime.ts`, `singleton.ts`, `index.ts`; `stores/{category-synonyms,demand-signals,
search-queries-log,conversations,postgres,factory}.ts`; `synonyms/seed.ts`;
`__tests__/discover.test.ts`.
`app/api/search/route.ts`; `app/api/concierge/route.ts`.
`db/migrations/{V11__discover,V12__seed_prompts_phase4}.sql`; `db/seeds/category_synonyms.sql`.
**Changed:** `lib/ai-core/prompts/seed.ts` + `providers/mock.ts` (2 new templates:
`NL_QUERY_PARSER_V1`, `CONCIERGE_V1`), `lib/ai-core/index.ts` (new exports).

## Phase 5 checklist (prompt sec. 10 / sec. 11 / sec. 12 / sec. 17)

| # | Deliverable | Status |
|---|---|---|
| 1 | Schema map helpers (`LocalBusiness` subtype, `ItemList`, `BreadcrumbList`, no `HowTo`) | DONE |
| 2 | Category-city evergreen pages with quality gates and data-driven answer blocks | DONE |
| 3 | `/llms.txt` refreshed with data-driven local answer pages and freshness guidance | DONE |
| 4 | Internal-link suggester (deterministic overlap scorer for editor approval) | DONE |
| 5 | Split sitemap XML routes: listings, blog, categories/cities/evergreen | DONE |
| 6 | Review summaries (`REVIEW_SUMMARIZER_V1`), spam heuristics, owner reply drafter | DONE |
| 7 | Hard rule: no AI-generated review bodies / no AI provenance on user review records | DONE |
| 8 | `TRANSLATE_NE` handler + hreflang helper | DONE |
| 9 | `/admin/ai` console with per-pipeline kill switches via `feature_flags` contract | DONE |
| 10 | Migrations V13 (reviews/SEO/admin flags) + V14 (phase-5 prompt seeds, RLS inline) | DONE |
| 11 | Tests (9 new: SEO gates/schema/sitemap/linking/jobs + reviews/spam/replies/jobs) | DONE |
| 12 | External `/seo audit` + `/seo geo` against staging URL | NOT RUN - no staging URL/tool invocation available in this session |

**Acceptance met locally:** `next build` renders `/admin/ai`, `/api/listings/[id]/ai-summary`,
`/best/restaurants/kathmandu`, `/sitemap-listings-1.xml`, `/sitemap-blog.xml`, and
`/sitemap-categories.xml`. Unit tests prove evergreen quality gates, valid schema shape with no
`HowTo`, working split sitemap XML, internal-link suggestions, review summaries, spam moderation,
owner reply drafts, `EVERGREEN_PAGE`, `REVIEW_SUMMARY`, and `TRANSLATE_NE` jobs against
`MockAiProvider`. Every named AI pipeline appears as a kill switch in `/admin/ai`.

## Files added in Phase 5

`lib/seo-auto/`: `slug.ts`, `evergreen.ts`, `schema.ts`, `internal-links.ts`, `sitemaps.ts`,
`hreflang.ts`, `handlers.ts`, `index.ts`, `__tests__/seo-auto.test.ts`.
`lib/reviews-ai/`: `types.ts`, `sample-reviews.ts`, `stores.ts`, `service.ts`, `handlers.ts`,
`runtime.ts`, `singleton.ts`, `index.ts`, `__tests__/reviews-ai.test.ts`.
`lib/admin-ai/`: `feature-flags.ts`, `index.ts`.
`app/best/[category]/[city]/page.tsx`; `app/api/listings/[id]/ai-summary/route.ts`;
`app/admin/layout.tsx`; `app/admin/ai/page.tsx`; `app/admin/ai/{feature-flags,jobs}/route.ts`;
`app/sitemap-{listings-1,blog,categories}.xml/route.ts`.
`db/migrations/{V13__reviews_seo_admin_ai,V14__seed_prompts_phase5}.sql`.
**Changed:** `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`,
`app/business/newa-lahana/page.tsx`, `app/globals.css`, `components/superadmin/SuperAdminShell.tsx`,
`lib/routes.ts`, `lib/ai-core/{index.ts,prompts/seed.ts,providers/mock.ts}`.

## Phase 6 checklist (post-Phase-5 stabilization)

| # | Deliverable | Status |
|---|---|---|
| 1 | Confirm source prompt has no official Phase 6; define this as stabilization | DONE |
| 2 | Check DB readiness without exposing secrets (`DATABASE_URL` still empty) | DONE |
| 3 | Persist `/admin/ai` feature flags to Postgres when `DATABASE_URL` exists | DONE |
| 4 | Add Postgres-backed review summary and moderation queue stores | DONE |
| 5 | Align V13 moderation queue with string review refs via `entity_ref` | DONE locally; V15 pending live |
| 6 | Update DB README apply order for V13/V14 | DONE |
| 7 | Re-run tests/typecheck after persistence changes | DONE |
| 8 | Full lint/build after Phase 6 changes | DONE |

## Phase 7 checklist (generated-artifact persistence)

| # | Deliverable | Status |
|---|---|---|
| 1 | Verify V15 live in Supabase | DONE |
| 2 | Persist owner reply drafts through runtime store | DONE |
| 3 | Add `owner_reply_drafts.review_ref` compatibility migration V16 | DONE locally; pending live |
| 4 | Persist `EVERGREEN_PAGE` generated intros to `seo_page_intros` | DONE |
| 5 | Persist internal-link suggestion sweeps to `internal_link_suggestions` | DONE |
| 6 | Add tests for stored intros, stored link suggestions, stored reply drafts | DONE |
| 7 | Full verification after Phase 7 changes | DONE |

## Phase 8 checklist (automatic serverless auto-blog publishing) — 2026-07-06

Goal: the blog engine posts automatically on a schedule, on Vercel (serverless), without ever
publishing the same thing twice.

| # | Deliverable | Status |
|---|---|---|
| 1 | Postgres-backed blog store so published posts persist + are visible across serverless invocations (there was NONE — only in-memory, so posts never reached the public page on Vercel) | DONE — `lib/blog-engine/stores/postgres.ts` + `stores/factory.ts`, wired in `runtime.ts` |
| 2 | Migration V17 adds `blog_posts.{categories,faq,links_injected}` (V8 lacked them; needed to round-trip a post) | DONE — applied live to Supabase `frxszqimsvgraoldwrvn` |
| 3 | Secured serverless cron route: one dedup-guarded publish cycle per hit | DONE — `app/api/cron/blog/route.ts` (GET+POST, `CRON_SECRET` Bearer or `x-blog-auto-secret`) |
| 4 | `vercel.json` cron every 6h (slower-and-safer cadence; ~4 posts/day, SEO-safe) | DONE |
| 5 | Fix pre-existing bug: posts published with 0 internal links when the writer emitted no resolvable `{{category}}` placeholders (prompt §8.4.5 wants 3–8) | DONE — `link-injection.ts` now deterministically tops up to a floor of 3 |
| 6 | Env: `BLOG_MAX_PER_DAY=4`, `CRON_SECRET` set, interval 300000; `.env.example` documented | DONE |
| 7 | Verify: 64 tests + typecheck + lint + `next build` green; live smoke test published a real Groq post that renders on `/blog` with internal links; 2nd run correctly deduped (no duplicate) | DONE |

**DATABASE_URL — DONE locally (2026-07-06).** Set to the Supabase **transaction pooler** in
`.env.local`: `postgresql://postgres.frxszqimsvgraoldwrvn:<pwd %23-encoded>@aws-1-ap-south-1.pooler.supabase.com:6543/postgres`.
The direct `db.<ref>:5432` host is IPv6-only and times out; the pooler is IPv4 + serverless-safe.
Verified end-to-end against live Supabase: a real Groq post persisted to `blog_posts` as PUBLISHED
(3 links, 3 FAQs, 4 categories) and rendered on `/blog`; a repeat run was correctly discarded
(total stayed 1/1). The job queue's `claimNext` is a single-statement `UPDATE … (SELECT … FOR UPDATE
SKIP LOCKED) RETURNING *`, so it is transaction-pooler-safe (no session state / no named prepared
statements).

**Owner action still required:** set the SAME `DATABASE_URL` **and** `CRON_SECRET` in the **Vercel
project env** (they're only in local `.env.local` now). Vercel Cron sub-daily schedules need the Pro
plan; on Hobby the cron runs daily (edit `vercel.json` or use an external scheduler hitting
`/api/cron/blog` with the `x-blog-auto-secret` header for finer cadence).

**Embeddings not working — `GEMINI_API_KEY` looks wrong.** The embed chain falls to Gemini
(`text-embedding-004`) but the configured key (`AQ.Ab8RN6…`) is not the standard `AIza…` Gemini API
key format, so `embed()` throws and posts save with a NULL `embedding`. Completions are unaffected
(they use Groq). Because embeddings power semantic dedup + search + concierge + enrich, the owner
should set a valid `GEMINI_API_KEY` (or an Ollama embed endpoint). Dedup no longer depends on it: an
embedding-independent **base-slug guard** in `handlers/blog-generate.ts` discards a post whose base
slug already exists, so duplicates are suppressed even with NULL embeddings.

**Note on cadence vs dedup:** the embedding dedup (cosine ≥0.9) is strict, so near-identical
evergreen fallbacks are discarded — the engine publishes when there is genuinely new trend material,
not on every tick. This is intended (quality over volume); it will not robotically emit N distinct
posts/day once the ~5 fallback evergreen angles are exhausted.

## Verification (re-run any time)

```bash
npm run test        # -> Test Files 10 passed, Tests 64 passed
npm run typecheck   # -> clean (exit 0)
npm run lint        # -> clean (exit 0)
npm run build       # -> succeeds; 128 static pages generated, dynamic API/admin routes valid
```

---

## Open items / decisions for the owner

1. **Git — DONE.** Repo linked to `github.com/amritgyawali/nepalidirectory`. (`claude-seo/` still
   carries its own nested `.git`; decide submodule/ignore if it causes trouble.)
2. **Database — Supabase schema fully applied through V12, demo data migrated, Postgres repos wired
   (2026-07-05).** `DATABASE_URL` is still empty in `.env.local` — set it (Supabase → Settings →
   Database → Connection string, needs the DB password) to actually switch stores from in-memory to
   Postgres; nothing else needs to change. Secret key is in `.env.local` — ROTATE it (it was pasted
   in chat + repo is public); same applies to the newer `SUPABASE_ACCESS_TOKEN` (account-wide) —
   rotate from Supabase → Account → Access Tokens if ever re-exposed.
3. **Verify at build time** (prompt sec. 20.11): free-tier model IDs/limits, `EMBEDDING_DIM` vs the
   embed model, OSM/feed URLs, actual RSS feed paths for the 7 news sources, and Google Places
   caching policy — done per phase that uses each; real trend-source URLs are unverified (feeds
   drift; fetchers are tolerant so a dead feed just yields 0 items, not an error).
4. **Phase 5/6 migrations applied live.** Owner ran V13/V14/V15 in Supabase. Follow-up V16 still
   needs to be run because Phase 7 added `owner_reply_drafts.review_ref`.
5. **Real AI provider keys are still unset** (`GEMINI_API_KEY` etc.) — every phase so far, including
   Phase 5, has only ever run against `MockAiProvider`. Nothing has been tested against a live model.
6. **`AI_ENABLED`/`CONCIERGE_ENABLED` are false by default** — `/api/search` and `/api/concierge`
   both return 503 until those flags are turned on in `.env.local`.

## How to resume after Phase 6

1. Read this file, then `docs/PHASE0_AUDIT.md` and `docs/DECISIONS.md`.
2. Confirm green: `npm run test && npm run typecheck && npm run lint && npm run build`.
3. Apply V16 to Supabase, then run `/seo audit https://STAGING_URL`
   and `/seo geo https://STAGING_URL` from the SEO tooling against the deployed staging build.

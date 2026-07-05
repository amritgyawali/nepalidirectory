# DECISIONS

One line per non-obvious decision: **decision — alternative rejected — why.**
Newest at the bottom. Referenced by `NEPALIDIRECTORY_AI_BUILD_PROMPT.md` §0.2 / §20.11.

## Phase 0

- **Map all modules onto Next.js 15 + TypeScript, not Java/Spring** — rejected: build a
  separate Spring Boot service as the prompt assumed — because the real repo is a Next.js app
  with no JVM; prompt §0.1 says keep the *contracts* and map to the actual stack. Contracts
  (tables §13, endpoints §14, prompts §15, env §18) are preserved verbatim.
- **`ai-core` lives at `lib/ai-core/` as a TS module** — rejected: a separate npm workspace/
  package — because the repo is a single Next.js app with no monorepo tooling; a `lib/`
  submodule is the idiomatic, zero-config home and is reachable from Route Handlers.
- **Job queue built against a `JobRepository` interface with in-memory + Postgres impls** —
  rejected: require a live Postgres for Phase 0 — because no DB exists yet and Phase 0's
  acceptance ("`ai_jobs` + worker + one no-op job end-to-end with a test") must run with zero
  infra. The in-memory repo mirrors `FOR UPDATE SKIP LOCKED` claim semantics; the Postgres
  repo (Phase 1) uses the exact SQL from prompt §5.4. Default repo = in-memory unless
  `DATABASE_URL` is set.
- **SQL migrations kept as plain `db/migrations/V#__*.sql` files (Flyway naming)** — rejected:
  adopt an ORM's migration DSL (Drizzle/Prisma schema) now — because Phase 0 needs the schema
  as a committed *contract*, not a running DB; plain SQL matches prompt §13 verbatim and stays
  portable to psql / node-pg-migrate / drizzle-kit when the client is chosen in Phase 1.
- **Vitest as the test runner** — rejected: Jest (heavier ESM/TS config) and Node's built-in
  `node --test` (awkward with the `@/` path alias and TS extension resolution) — because
  Vitest is the modern default for Next.js + TS, supports the `@/` alias and ESM/TS out of the
  box, and runs fast with zero external calls (satisfies §0.6, §20.9).
- **Did NOT run `git init` or make commits** — rejected: auto-initialize git and commit —
  because (a) the repo is not under version control and starting it is a structural choice the
  owner should own, (b) `claude-seo/` contains a nested `.git` that would need a submodule/
  ignore decision, and (c) global policy is to commit only when explicitly asked. Phase 0 is
  fully committable as `feat(ai-core): phase 0 scaffold` once the owner initializes git.
- **No AI provider SDKs / `pg` / `postgres` deps added in Phase 0** — rejected: install them
  now — because Phase 0 only needs the Mock provider and in-memory repo; real HTTP adapters and
  the Postgres client land in Phase 1 (keeps the dependency surface and lockfile churn minimal,
  and honors "all AI off until enabled").

## Phase 1

- **No AI SDKs — adapters call REST via `fetch`, no `@google/*`/`openai`/`groq-sdk` deps** —
  rejected: vendor SDKs — because raw REST with an injectable `fetchFn` keeps deps at zero, lets
  ONE `OpenAiCompatibleAdapter` serve Groq/OpenRouter/any future key (prompt §5.3), and makes
  every adapter unit-testable with a stub fetch (no network in CI).
- **Provider chain order = Logging(Caching(Fallback([RateLimiter(BudgetGuard(adapter))…])))** —
  rejected: the literal linear order in §5.2 (Caching→Budget→RateLimiter→Fallback→adapter) —
  because budget/rate-limit are inherently *per-provider* and must trigger fallback, so they
  belong inside the fallback chain; caching sits outside (provider-independent) and logging is
  outermost so cache hits and failures are both recorded. Same components, correct composition.
- **Cache key is semantic (task+system+user+schema+temperature), not provider+model** —
  rejected: §5.2's `sha256(provider+model+…)` verbatim — because caching sits above the fallback
  chain and cannot know which provider will serve a miss; the produced provider/model are stored
  in the entry so hits still report accurate provenance.
- **Per-call 429/5xx backoff (1s/4s/15s) applied at the JOB level (Worker), not inside each
  provider call** — rejected: sleeping inside the fallback loop — because the worker already
  retries with that exact schedule, and in-call timers make tests slow/flaky. Fallback moves to
  the next provider immediately; transient errors get the backoff via job requeue.
- **Budget exhaustion re-queues via a typed `RetryableAtError` the Worker special-cases** —
  rejected: reuse the normal fail/backoff path — because an over-budget wait must NOT count
  toward the DEAD threshold; the error carries `runAfter = next 00:15 NPT` (§5.2) and the worker
  re-queues without incrementing attempts.
- **Lightweight per-task output validators, not a JSON Schema library (ajv)** — rejected: add
  ajv — because Phase 1 has one JSON task (LISTING_ENRICH_V1); a hand-written structural
  validator keeps deps at zero and is easy to read. `json_schema` is still stored for docs and
  can drive ajv later.
- **`Listing` domain + in-memory `ListingRepository` seeded from `lib/data.ts`** — rejected:
  mutate the static `lib/data.ts` arrays or require a DB — because there is no DB yet and the
  static files are the only "existing listings"; enrichment writes to the in-memory store (same
  interface a Postgres repo will implement), satisfying the Phase 1 acceptance testably.
- **Budget tracked in-memory per process** — rejected: DB-summed usage — fine for single-node
  dev/CI; multi-node prod should back `BudgetTracker`/usage with Postgres (deferred).
- **Added `enqueue` to the worker `HandlerContext`** — rejected: pass the whole `JobRepository`
  to handlers — because handlers only need to enqueue follow-ups (ENRICH→EMBED); exposing a
  single bound `enqueue` keeps them decoupled from the repository surface.
- **Vitest `@/` alias via `vitest.config.ts` (excluded from tsconfig)** — needed because the
  enrichment test transitively imports `lib/data.ts`, which uses `@/lib/*`; the alias regex only
  rewrites `@/…` so scoped npm packages are untouched.

## Phase 2

- **OSM importer reads an injectable element stream, not the PBF directly** — rejected: bundle an
  osmium/osm4j binding and download the full nepal-latest.osm.pbf at build/test time — because
  that needs a native binary + a ~100MB download and cannot run in CI. The importer consumes an
  `Iterable<OsmElement>`; production adapts `osmium export --output-format=geojsonseq` into that
  stream, tests use a committed `SAMPLE_OSM_ELEMENTS` fixture spanning 4 districts.
- **Simplified sample admin boundaries (rectangles), not full ward GeoJSON** — rejected: commit
  the national ward GeoJSON now — too large and unnecessary for Phase 2; `GeographyResolver` uses
  generic ray-casting point-in-polygon, so swapping in real Nepal admin polygons later is a data
  change, not a code change. Boxes are intentionally non-overlapping so each POI resolves to one
  district.
- **No native deps for crawling/parsing (no crawler-commons, jsoup, cheerio)** — rejected: pull
  those in — because a small TS robots.txt matcher + regex/DOM-free text & JSON-LD extraction keep
  the dependency surface at zero and are fully testable. Good enough to feed ATTRIBUTE_EXTRACT.
- **Entity resolution runs on ONE ingest path (`AcquisitionService.ingest`)** — every tier (OSM,
  CSV, onboarding) funnels through it, honoring "dedup on EVERY insert" (sec. 6.6). Blocking scans
  `listings.all()` in memory — fine for the sample; production uses the trgm/geohash SQL indexes in
  V5.
- **Lightweight structural validation for merge/attribute JSON too** — same rationale as Phase 1
  (no ajv); handlers coerce unknown verdicts to the safe `distinct`.
- **`PlacesClient` exposes ONLY `findPlaceForClaim` + `adminSpotCheck`** — HARD RULE 1 enforced in
  code (a test asserts the prototype has exactly those two methods) with the policy quoted in a
  header comment; no method iterates or bulk-fetches, and only `place_id` + our flags are stored.
- **Base `listings` table + static-data→DB migration deferred to when Postgres is provisioned** —
  the acquisition SQL (V5) uses idempotent `ADD COLUMN IF NOT EXISTS`; Phase 2 logic runs on the
  in-memory repo seeded from `lib/data.ts`, so the demo/tests need no DB.
- **`/attribution` is a real SSR page + footer credit** — the ODbL acceptance ("attribution
  live") is user-facing, so it ships as an actual Next.js route with "© OpenStreetMap
  contributors" in the footer, not just a library note.

## Infrastructure (2026-07-05)

- **The database is Supabase (Postgres), project `frxszqimsvgraoldwrvn`** — resolves the earlier
  "no DB" blocker. Client helpers live in `utils/supabase/` (`server.ts`, `client.ts`,
  `middleware.ts`) per the Supabase SSR pattern; a root `middleware.ts` refreshes sessions. The
  publishable/anon key is in `NEXT_PUBLIC_*` (browser-safe, RLS-protected); `.env.local` (gitignored)
  holds it plus empty slots for the service-role key + `DATABASE_URL`.
- **Two Supabase access paths, by design** — (1) `@supabase/ssr` (PostgREST + RLS) for app/user
  data; (2) the Postgres connection string (`DATABASE_URL`) for `db/migrations/*.sql`, pgvector,
  and the `FOR UPDATE SKIP LOCKED` job queue — supabase-js cannot run arbitrary SQL, and the queue
  + embeddings need raw Postgres. Background jobs/imports use the service-role key or `DATABASE_URL`
  (bypass RLS), never the anon key.
- **In-memory repos remain the default until `DATABASE_URL` is set** — the Phase 0–2 stores keep
  working with zero infra; wiring the Postgres-backed repos (`PostgresJobRepository` already takes
  an injected SQL executor) is the next integration step, not done yet.
- **Repo is now git-initialized with remote `github.com/amritgyawali/nepalidirectory`** — the
  earlier "not a git repo" blocker is resolved; commits can proceed there.
- **Supabase schema applied + demo data migrated (2026-07-05, via Supabase MCP)** — all 14 Phase
  0–2 tables live with RLS; `prompt_templates` and `osm_tag_map` seeded; the 11 `lib/data.ts`
  businesses inserted into `listings` (generator: `scripts/gen-listings-seed.mts` — duplicates the
  read-only fields rather than importing `lib/data.ts`, because that file re-exports from the
  `@/lib/blog` tsconfig path alias, which plain `node` can't resolve outside the Next bundler).
- **Postgres-backed repos are wired, selected by `DATABASE_URL`** — `lib/ai-core/queue/pg-client.ts`
  adds one pooled `pg.Pool` → `SqlExecutor` per connection string; `createJobRepository`,
  `lib/enrich/factory.ts` (`PostgresListingRepository`/`PostgresEmbeddingRepository`), and
  `lib/acquire/stores/factory.ts` (merge candidates, ingest batches, crawl cache, claims) all
  return the Postgres implementation when `DATABASE_URL` is set, else the existing in-memory one —
  same pattern as `PostgresJobRepository` already used. `DATABASE_URL` is still empty in
  `.env.local` (needs the DB password from Supabase → Settings → Database), so this path is wired
  but unexercised; all tests still run in-memory.
- **`EmbeddingRepository.size()` is synchronous in the existing interface** — the Postgres impl
  can't do an authoritative sync count over the network, so it tracks a best-effort local
  `Set<listingId>` size instead (documented in code; nothing in the codebase actually calls
  `.size()` today).

## Phase 3 — Trending blog engine (2026-07-05)

- **New module is `lib/blog-engine/`, not `lib/blog/`** — the repo already has a hand-curated,
  fully static `lib/blog.ts` (15 real posts) powering the existing `/blog`, `/blog/[slug]`,
  `/blog/category/[slug]` pages. A directory literally named `lib/blog/` would collide with that
  file. The engine is a separate module; published engine posts are converted to the curated
  page's `BlogPost` shape via `lib/blog-engine/adapter.ts` and merged into the existing pages
  rather than shipping parallel routes/JSON-LD code.
- **Existing curated blog pages are extended, not replaced** — `app/blog/page.tsx` and
  `app/blog/[slug]/page.tsx` now also look up `PUBLISHED` engine posts (via
  `lib/blog-engine` `getPublishedEnginePost(s)`) and merge them into the index/related-posts/
  JSON-LD/RSS, sorted by `publishedAt`. This reuses the already-correct `Article`/`BreadcrumbList`/
  `FAQPage` JSON-LD and satisfies the §8.6 acceptance bar without new schema code. Both pages gained
  `export const revalidate = 300` (ISR) since engine content changes without a redeploy.
  `generateStaticParams` still lists only the curated slugs; unlisted (engine) slugs render on
  demand (`dynamicParams` defaults to true).
  - Byline: engine posts are authored as `"NepaliDirectory Team"`, added as a real entry in
    `lib/authors.ts` (so `getAuthorByName` doesn't silently mis-attribute to the Travel Desk), and
    its byline link + fact panel point at `/editorial-policy` instead of `/authors/team` — the
    existing editorial-policy page gained one more standard explaining the AI-assisted, human-
    reviewed process (prompt §8.5's transparency requirement).
- **Selector runs one cluster at a time, not batched** — the prompt's `TREND_SELECTOR_V1` user
  template reads "CLUSTERS" (plural), but `code/selector.ts` calls it once per cluster, mirroring
  how `MERGE_ADJUDICATE_V1` already processes one candidate at a time. Simpler code, same contract.
- **Fact-check is inline in `BLOG_GENERATE`, not its own queued job** — `ai_jobs.type` already
  reserves `BLOG_FACTCHECK` for a future dedicated job, but running it as pass 3 inside the same
  handler that just produced the draft is simpler and avoids an extra round trip through the queue;
  nothing currently needs to schedule a fact-check independently of generation.
- **OG images: a dedicated route, not the `opengraph-image.tsx` file convention** —
  `app/blog/engine-og/[slug]/route.tsx` renders a deterministic brand template with `next/og`
  (satori), used only as engine posts' `heroImageUrl`. Adding a route-level `opengraph-image.tsx`
  under `app/blog/[slug]/` would apply to (and risk overriding) the curated posts' existing
  photo-based OG images too.
- **`MockAiProvider.completeJson` special-cases `BLOG_WRITER_V1`** — every other canned response is
  static (same for all inputs), which is fine for single-shot tasks. The blog writer can't be
  static: the uniqueness-check pass (§8.4.4, cosine < 0.90 vs existing posts) embeds
  `body_markdown`, so two identical mock drafts would always collide as "duplicates." The mock now
  derives a deterministic-but-input-varying draft (hash of the rendered user prompt), so distinct
  clusters still produce distinct, testable articles — same input still gives the same output.
- **`runDailySweep()` enqueues its own jobs** (`TREND_SCAN` → `TREND_CLUSTER` → `selectClusters` →
  `BLOG_GENERATE` per selection) rather than assuming a cron already queued them — makes it a
  single directly-testable entrypoint, and is what a real `TREND_SCAN_CRON` (06:00 & 16:00 NPT)
  would call.
- **`BLOG_AUTOPUBLISH` gate exists (`canAutoPublish`) but nothing calls it yet** — it stays false by
  default (prompt §0.4/§20.8); every generated post lands in `REVIEW` and only a human
  `EditorialService.publish`/`.reject` call changes that, matching "auto-publish OFF" in the phase's
  acceptance criteria.
- **V8 shipped without RLS on its 4 new tables — caught by the Supabase advisor after applying,
  fixed same day by V10** — `V7__rls.sql` (which enables RLS on everything) predates `V8__blog.sql`,
  so the new `trend_sources`/`trend_items`/`trend_clusters`/`blog_posts` tables were briefly fully
  exposed to the anon/publishable key via PostgREST. `V10__rls_blog.sql` enables RLS (no policy) on
  all four, matching every other internal/AI table (service-role only). Lesson for future phases:
  any migration adding tables must also enable RLS in the same migration, not rely on a prior
  blanket RLS migration.
- **Supabase CLI is now linked** (`supabase login`/`supabase link --project-ref
  frxszqimsvgraoldwrvn`, using an account-wide `SUPABASE_ACCESS_TOKEN` in `.env.local`) — enables
  `npx supabase db push`/`functions deploy`/`db diff` going forward. `supabase/.temp/` (link-cache
  metadata, no secrets) is gitignored.

## Phase 4 — Semantic search + AI concierge (2026-07-05)

- **V11's initial `apply_migration` call still missed RLS on its 2 new tables** (`demand_signals`,
  `search_queries_log`) — applied before the `ENABLE ROW LEVEL SECURITY` lines were added to the
  file, repeating the V8 mistake within the same session. Caught immediately via `list_tables`,
  fixed live with a follow-up `v11b_rls_discover` migration, and the `V11__discover.sql` source
  file was edited afterward to include the RLS statements directly (so a fresh apply from scratch
  is correct without needing the patch). All 20 tables now RLS enabled, zero advisor warnings.
- **Concierge grounding is enforced structurally, not by prompt compliance** — `search_listings`
  (our `hybridSearch`) always runs in code before any AI call; the `listings` array returned to the
  caller is exactly that result set, and the AI's free-text reply is never parsed for business
  names to decide what gets "recommended." A zero-result query returns a hard-coded honest fallback
  and skips the AI call entirely. This makes "concierge never recommends a business absent from
  tool output" a structural invariant, not a hope, and is directly testable (see
  `lib/discover/__tests__/discover.test.ts`).
- **No true multi-turn function-calling loop** — none of the three provider adapters
  (Gemini/OpenAI-compatible/Ollama) implement tool-calling; a real per-provider tool loop was out
  of scope. Instead: code calls `search_listings` unconditionally, then asks the AI to phrase a
  reply constrained to those results (`get_listing(id)` is implicit — full listing details are
  already in that same result set, so the AI never needs a second round-trip). Documented
  simplification, same spirit as Phase 3's "selector processes one cluster at a time."
- **`/api/concierge` fakes SSE token streaming** — no adapter streams tokens yet (all `complete()`
  calls are single-shot), so the route chunks the completed reply into `token` SSE events, ending
  with a `done` event carrying the grounded `listings` array. Real token streaming later would only
  change how the text is produced, not this wire contract.
- **`Listing` still has no structured `open_now`/`price_level`** — those exist only on the
  marketing `Business` type (`status`, `price`), not the AI `Listing` model. `open_now`/`category`/
  `city` filters from `/api/search` are accepted and layered onto the NL-parsed query, but
  `open_now` is a passthrough with no actual effect yet (same documented gap as everywhere else
  this mismatch has come up since Phase 1).
- **NL parser fast path skips the AI only when BOTH a category (taxonomy slug or synonym,
  including romanized Nepali) AND a known place resolve** — matches the prompt's literal
  "[category-ish] in [known place]" fast-path condition; anything else (bare category, bare place,
  vague phrasing) calls `NL_QUERY_PARSER_V1`.
- **Conversation transcripts are in-memory only** — the prompt asks for ~30-day retention for QA
  but doesn't name a persisted table in the §13 data model; `InMemoryConversationRepository` has no
  Postgres counterpart yet (documented gap, not wired into the Postgres store factory).

## Phase 5 — SEO/AEO + reviews + polish (2026-07-05)

- **Evergreen pages are generated only from real listing rows and quality gates** — rejected:
  creating placeholder "best category in city" pages for every category/city pair — because the
  repo currently has 11 demo listings and mass empty pages would violate the prompt's thin-content
  gate. The static build currently publishes `/best/restaurants/kathmandu`; production can expand as
  listings grow, still capped at 50 without explicit approval.
- **Category-city intro copy has a deterministic fallback in code, with `EVERGREEN_PAGE` reserved
  for AI refreshes** — rejected: requiring a live AI call before a page can render — because all
  phases must run with `MockAiProvider` in CI and no provider keys are configured. The queued job
  exercises `CATEGORY_INTRO_V1` and returns generated metadata; the public page never blocks on AI.
- **Split XML sitemaps are plain route handlers alongside the existing Next metadata sitemap** —
  rejected: replacing `app/sitemap.ts` entirely with a custom sitemap index — because the existing
  `/sitemap.xml` route already works and Next can statically render the split routes too.
- **Review intelligence stores AI output outside user reviews** — rejected: adding AI provenance or
  generated text columns to a reviews table — because hard rule #2 says AI never writes reviews.
  `Review` has no AI fields; summaries, moderation opinions and owner reply drafts live in separate
  `review_summaries`, `moderation_queue` and `owner_reply_drafts` contracts.
- **Spam moderation is heuristics-first and queues humans by default** — rejected: hiding anything
  after a single AI classifier call — because the prompt requires human-in-the-loop moderation except
  extreme confidence. The code queues threshold hits and only labels `auto_hidden` at very high
  heuristic confidence.
- **`/admin/ai` reuses the existing super-admin session shell, not a new auth system** — rejected:
  building a separate admin framework — because the repo already has a client-side super-admin gate
  and visual system. The new route adds per-pipeline switches via a small feature-flag API and keeps
  the SQL `feature_flags` table as the persistence contract.
- **Phase 5 SQL was added locally but not pushed to Supabase** — rejected: applying V13/V14 without
  a usable `DATABASE_URL` in this session — because `.env.local` still lacks the DB password. The SQL
  enables RLS in the same migration that creates new internal tables to avoid repeating the V8/V11
  RLS misses.

## Phase 6 — Post-Phase-5 stabilization (2026-07-05)

- **Phase 6 is stabilization, not a new prompt module** — the source prompt ends at Phase 5 and only
  names post-Phase-5 grading (`/seo audit`, `/seo geo`). Since there is no staging URL and
  `DATABASE_URL` is empty, this phase focuses on making Phase 5 production-ready rather than
  inventing new product scope.
- **Phase 5 stores now follow the existing Postgres-when-configured pattern** — rejected:
  leaving admin AI flags, review summaries and moderation queues as memory-only — because earlier
  phases already use factories selected by `DATABASE_URL`. Feature flags, review summaries and
  moderation queues now persist to Postgres automatically when the connection string is present.
- **Moderation queue has `entity_ref` as well as the prompt's `entity_id`** — rejected: forcing all
  review identifiers through a numeric ID while no real reviews table exists in this repo — because
  the current sample/domain review IDs are strings. `entity_id BIGINT` stays for the future real
  table; `entity_ref TEXT` keeps the current implementation honest and migration-safe.
- **V13/V14 are live, V15 is the compatibility patch** — after the owner applied V13/V14 in
  Supabase, live verification confirmed Phase 5 tables, prompt seeds and feature flags exist, but
  `moderation_queue.entity_ref` is missing because it was added during Phase 6 after V13 was run.
  `V15__phase6_moderation_entity_ref.sql` is the idempotent live follow-up.

## Phase 7 — Generated-artifact persistence (2026-07-05)

- **Phase 7 persists artifacts created by Phase 5 jobs** — rejected: leaving `EVERGREEN_PAGE`,
  internal-link suggestions and owner reply drafts as transient outputs — because V13 already
  created tables for them. The runtime now writes generated intros to `seo_page_intros`, stores
  link suggestions in `internal_link_suggestions`, and saves owner reply drafts.
- **Owner reply drafts use `review_ref` as a compatibility column** — rejected: overloading
  `review_id BIGINT` with string sample IDs — because no real numeric reviews table exists yet.
  `V16__phase7_owner_reply_review_ref.sql` is the idempotent live follow-up for databases where V13
  has already run.

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

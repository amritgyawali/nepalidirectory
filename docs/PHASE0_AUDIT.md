# PHASE 0 — Repository Audit

**Project:** nepalidirectory (Pahelo) — Nepal business directory
**Date:** 2026-07-05
**Author:** Claude Code (Phase 0 of `NEPALIDIRECTORY_AI_BUILD_PROMPT.md`)

This document records the **actual** state of the repo, how it differs from the stack the
build prompt assumed, and the mapping strategy that keeps the prompt's contracts intact while
targeting the real stack (prompt §0.1).

---

## 1. Stack: assumed vs. actual

| Concern | Build prompt assumed | **Actual (audited)** |
|---|---|---|
| Backend | Spring Boot 3.x / Java 21 | **None.** No JVM, no server app. |
| Frontend | Next.js (App Router, TS) | **Next.js 15.1 (App Router) + React 19 + TypeScript 5.7** ✅ matches |
| Database | PostgreSQL 16 + pgvector + pg_trgm | **None.** No DB, no ORM, no connection. |
| Migrations | Flyway | **None.** |
| Data store | Relational tables | **Static TypeScript arrays** in `lib/*.ts` |
| Queue | Redis optional / Postgres SKIP LOCKED | **None.** |
| Icons/UI | — | `lucide-react`, custom components under `components/` |
| Package manager | — | npm (`package-lock.json`), Node **v24.13.0** |

**Bottom line:** this is a **frontend-only Next.js marketing/directory site backed by
hardcoded demo data**. There is no persistence layer, no API backend, and no AI of any kind
yet. Half of the assumed stack (Java, Postgres, Flyway, job queue) does not exist.

Per prompt §0.1, we therefore **map every module onto Next.js + TypeScript** and keep the
**contracts identical**: the SQL table definitions in §13, the REST/SSE endpoints in §14, the
prompt templates in §15, and the env vars in §18 are preserved verbatim as the target
contract; only the runtime that implements them changes (TypeScript modules + Next.js Route
Handlers + a real Postgres provisioned in Phase 1, instead of Java + Spring).

---

## 2. Repository layout (top level)

```
app/                 Next.js App Router pages (~60 route folders — see §3)
components/          React components: compare/ content/ dashboard/ directory/
                     layout/ search/ superadmin/ ui/
lib/                 Data + domain logic (all static, no DB) — see §4
public/              Static assets
claude-seo/          Vendored SEO plugin (has its OWN nested .git) — ignored by eslint
design-archive/      Original HTML/PNG design mockups (22k+ files) — ignored by eslint & tsc
mobile ui-ux/        Design references
.claude/             Claude Code settings (settings.json currently `{}`)
NEPALIDIRECTORY_AI_BUILD_PROMPT.md   The brief driving this work
```

Config: `next.config.ts` (legacy `.dc.html` → clean-URL redirects, Unsplash remote images),
`tsconfig.json` (`strict`, `@/*` path alias → repo root, excludes `design-archive`),
`eslint.config.mjs` (`next/core-web-vitals` + `next/typescript`; ignores `claude-seo`,
`design-archive`, `.next`).

**No git:** the repo root is not a git repository. `claude-seo/` contains its own `.git`.
No commits exist. (See `docs/DECISIONS.md` for how this affects the "commit per module" rule.)

---

## 3. Routing / pages (App Router)

~60 route segments already exist under `app/`. Notable for the AI work:

- **Public directory:** `/`, `/search`, `/categories`, `/business/[...]`, `/city/[slug]`,
  `/near-me`, `/top-rated`, `/best-businesses`, `/compare-business/[slug]`, `/deals`,
  `/events`, `/map`, `/gallery`.
- **Blog (already scaffolded, static):** `/blog`, `/blog/[slug]`, `/blog/category`,
  `/authors/[slug]`, `/editorial-policy`. ← prompt §8/§8.6 target already has a home.
- **Q&A:** `/qa`, `/qa/community`, `/questions/[...]`, `/ask-question`, `/restaurant-qa`.
- **Accounts:** `/login`, `/register`, `/forgot-password`, `/profile`, `/account`,
  `/dashboard` (+ `/listings`, `/reviews`, `/analytics`), `/claim-listing`.
- **Admin surface (exists!):** `/super-admin` with `approvals/ audit/ businesses/ controls/
  referrals/ settings/ users/`. ← the `/admin/ai` console (prompt §12) will slot in alongside
  this, reusing the superadmin components/layout.
- **AEO/SEO already present:** `app/llms.txt/`, `app/[indexNowKey].txt/`, `app/sitemap/`,
  plus an IndexNow key file at repo/app root. ← prompt §11 (`/llms.txt`, IndexNow) has a base.
- **No `app/api/` directory yet** → the §14 endpoints (`/api/search`, `/api/concierge`,
  `/api/claims`, `/admin/ai/*`, …) are all greenfield Route Handlers.

---

## 4. Existing "entities" (all static, in `lib/`)

| File | Lines | Exports / role |
|---|---|---|
| `lib/data.ts` | 716 | `Business` type + `businesses: Business[]`, `categories`, `categoryGroups`, `cities`, `cityLinks`, `questions`, `plans`; re-exports `blogPosts`. **The directory dataset.** |
| `lib/blog.ts` | 851 | `BlogPost`/`BlogSection`/`BlogFaq` types + `blogPosts` array + `siteUrl`. |
| `lib/compare.ts` | 1132 | Business comparison data/logic. |
| `lib/search.ts` | 214 | `SearchRecord` + client-side search index (business/category/city/guide/question/page). |
| `lib/city-pages.ts` | 180 | City landing page data. |
| `lib/authors.ts` | 92 | Blog author profiles. |
| `lib/landing.ts`, `lib/content.ts`, `lib/routes.ts`, `lib/seo.ts`, `lib/seo-config.ts`, `lib/noindex.ts` | — | Routing map, SEO/meta helpers, misc content. |

**`Business` shape (maps to the prompt's `listings` table):** `rank, name, slug,
categories[], area, neighborhood?, address, phone, website?, email?, rating, reviews, price,
status(open|closed|24h), hoursToday, image, quote, amenities[], years?, delivery?, verified?,
claimed?, sponsored?, distanceKm?, serviceAreas?, services?, specialties?, paymentMethods?,
languages?, credentials?, coupons?, faqs?, owner?, coordinates?{lat,lng}`.

This is a rich, listing-like record — it already carries `verified`, `claimed`, `coordinates`,
`faqs`, `categories`. When Postgres arrives (Phase 1/2), it maps cleanly to `listings` + the
§13 `ALTER TABLE listings ADD COLUMN …` additions (`data_source`, `quality_score`,
`description_source`, `search_tsv`, embeddings side table, etc.).

---

## 5. Mapping the prompt's modules onto Next.js + TypeScript

Contracts (tables §13, endpoints §14, prompts §15, env §18) are kept **identical**. Only the
implementation host changes:

| Prompt concept (Java/Spring) | Actual-stack implementation |
|---|---|
| `ai-core` Maven/Gradle module | `lib/ai-core/` TypeScript module |
| `AiProvider` interface + records (§5.1) | `lib/ai-core/types.ts` TS interfaces/types |
| Decorator chain Caching→Budget→RateLimiter→Fallback (§5.2) | Composable TS provider wrappers (Phase 1) |
| Adapters Gemini/Groq/OpenRouter/Ollama/Mock (§5.3) | TS adapters under `lib/ai-core/providers/`; `MockAiProvider` built in Phase 0 |
| `@Scheduled` DB poller with `FOR UPDATE SKIP LOCKED` (§5.4) | TS `Worker` polling a `JobRepository`; **Postgres repo** uses the exact SKIP LOCKED SQL, **in-memory repo** mirrors its semantics for tests/dev |
| Flyway migrations (§13) | Plain SQL files under `db/migrations/` (`V#__*.sql`, Flyway-compatible naming) — canonical schema, runnable by `psql`/drizzle-kit/node-pg-migrate when a DB exists |
| Spring REST/SSE controllers (§14) | Next.js Route Handlers under `app/api/**` and `app/admin/ai/**` (Phase 1+) |
| `prompt_templates` in DB (§15) | Same table; seeded via a migration/seed script (Phase 1) |
| Admin console `/admin/ai` (§12) | Next.js server components under `app/(admin)/admin/ai/**`, reusing `components/superadmin` (Phase 5-ish, incrementally) |
| Redis (optional) | Not used — DB-backed queue, per prompt |

**Key Phase-0 decision:** the job queue is written against a `JobRepository` interface with
two implementations — an **in-memory repo** (default; used by tests and local dev with zero
infra) and a **Postgres repo** (used when `DATABASE_URL` is set; Phase 1 wires the live
client). This lets the "`ai_jobs` + worker + one no-op job end-to-end **with a test**"
acceptance run **today with zero external infra**, while the SKIP-LOCKED SQL contract is
committed and ready for real Postgres. Recorded in `docs/DECISIONS.md`.

---

## 6. What Phase 0 delivers (this pass)

- `docs/PHASE0_AUDIT.md` (this file) + `docs/DECISIONS.md`.
- `.env.example` (prompt §18 verbatim, with `SITE`→real placeholders).
- `db/migrations/V1__ai_core.sql` — the §13 `ai-core` tables + `vector`/`pg_trgm` extensions
  (canonical contract; not auto-applied because no DB exists yet).
- `lib/ai-core/` skeleton: provider types, `MockAiProvider`, provider registry, `JobRepository`
  interface + in-memory implementation, `Worker`, a `NOOP` job handler end-to-end, and env/
  feature-flag config.
- A **passing** Vitest test that enqueues a `NOOP` job, runs the worker, and asserts the job
  reaches `DONE` (plus attempts→`DEAD` and `MockAiProvider` determinism). **Zero external
  calls** (prompt §0.6, §20.9).
- README "AI features" section (how to enable, all flags default OFF).

## 7. Constraints & risks noted for later phases

- **DB is a hard prerequisite** for Phases 1–5 (pgvector embeddings, hybrid search, SKIP
  LOCKED queue, `prompt_templates`). The owner must provision Postgres 16 + pgvector. Until
  then AI features stay behind flags (default OFF) and the in-memory repo covers dev/CI.
- **Existing data is demo data** in `lib/`. Phase 2 (OSM import) introduces real rows; a
  migration from static arrays → DB rows will be needed and is out of scope for Phase 0.
- **`claude-seo/` nested git** complicates a root `git init`; flagged in DECISIONS.
- Prompt §20.11: model names, free-tier limits, feed URLs, and Google Places caching policy
  must be **re-verified at build time** — deferred to the phase that first uses each (Phase 1
  providers, Phase 2 Places, Phase 3 feeds). `.env.example` keeps model IDs as placeholders.

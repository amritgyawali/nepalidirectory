# AI Build — Progress Tracker

> Purpose: resumable status log. If a session is interrupted (token limit, error, or a
> stop), read this file first to know exactly what is done and what to do next.
> Source of truth for the plan: [`NEPALIDIRECTORY_AI_BUILD_PROMPT.md`](../NEPALIDIRECTORY_AI_BUILD_PROMPT.md).

**Last updated:** 2026-07-05
**Current phase:** Phase 2 — Acquisition + dedup
**Phase 0 status:** DONE  ·  **Phase 1 status:** DONE  ·  **Phase 2 status:** DONE — verified (lint + typecheck + 44 tests green)
**Next:** wait for the owner to say "start Phase 3" (do NOT start it unprompted).

---

## Critical context for whoever resumes

- **Actual stack != assumed stack.** Real repo is **Next.js 15 (App Router) + React 19 + TS**,
  **no database** — data lives in static TS files under `lib/`. Per prompt sec. 0.1 we map modules
  onto the real stack but keep the **contracts** (SQL tables, endpoints, prompts, env vars)
  identical. Full write-up: [`docs/PHASE0_AUDIT.md`](../docs/PHASE0_AUDIT.md). Decisions:
  [`docs/DECISIONS.md`](../docs/DECISIONS.md).
- **Repo is NOT a git repository yet** (and `claude-seo/` has its own nested `.git`). No commits
  made — see "Open items" below.
- **No DB yet.** Queue + all stores (listings, embeddings, cache, usage, merge_candidates,
  ingest_batches, crawl_cache, claims) are in-memory; SQL migrations under `db/migrations/` are the
  forward contract for when Postgres is provisioned.

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

## Verification (re-run any time)

```bash
npm run test        # -> Test Files 6 passed, Tests 44 passed
npm run typecheck   # -> clean (exit 0)
npx eslint "lib/**/*.ts" "app/**/*.tsx" vitest.config.ts --max-warnings=0   # -> clean
```

---

## Open items / decisions for the owner

1. **Git init + commits.** Not a git repo; `claude-seo/` has its own `.git`. No auto-init. To
   enable commits: `git init`, decide `claude-seo/` handling, then commit Phases 0–2.
2. **Database.** Phase 2 logic runs on in-memory repos seeded from `lib/data.ts`. When Postgres 16
   + pgvector is provisioned: run `db/migrations/`, add the base `listings` table + migrate static
   `lib/data.ts` into it, and back the repos/queue with the SQL implementations.
3. **Verify at build time** (prompt sec. 20.11): free-tier model IDs/limits, `EMBEDDING_DIM` vs the
   embed model, OSM/feed URLs, and Google Places caching policy — done per phase that uses each.

## How to resume / start Phase 3

1. Read this file, then `docs/PHASE0_AUDIT.md` and `docs/DECISIONS.md`.
2. Confirm green: `npm run test && npm run typecheck`.
3. Phase 3 (prompt sec. 8 / sec. 17): trending blog engine — trend sources + fetchers + clustering
   + selector (brand-safety filter) + 5-pass generation + fact-check + link injection + editorial
   queue + Next.js `/blog` with ISR/schema/RSS/OG. Auto-publish stays OFF. Acceptance: >=2 grounded
   drafts in REVIEW with sources + fact-check; manual publish renders valid Article JSON-LD + >=3
   internal links.
4. **Do not start Phase 3 until the owner asks.**

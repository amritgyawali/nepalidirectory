# AI Build — Progress Tracker

> Purpose: resumable status log. If a session is interrupted (token limit, error, or a
> stop), read this file first to know exactly what is done and what to do next.
> Source of truth for the plan: [`NEPALIDIRECTORY_AI_BUILD_PROMPT.md`](../NEPALIDIRECTORY_AI_BUILD_PROMPT.md).

**Last updated:** 2026-07-05
**Current phase:** Phase 0 — Audit & scaffold
**Phase 0 status:** 🟡 IN PROGRESS

---

## Critical context for whoever resumes

- **Actual stack ≠ assumed stack.** The build prompt assumes Spring Boot / Java 21 + Postgres.
  The real repo is **Next.js 15 (App Router) + React 19 + TypeScript**, and **there is no
  database** — all "data" lives in static TS files under `lib/` (`lib/data.ts`,
  `lib/blog.ts`, ...). Per prompt §0.1 we map every module onto the real stack but keep the
  **contracts** (SQL tables, endpoints, prompt templates, env vars) identical.
- **Repo is NOT a git repository yet** (and `claude-seo/` contains its own nested `.git`).
  No commits have been made. See "Open items / decisions for the owner" below.
- The user runs **Phase 0 only** for now, then will message to start Phase 1.

---

## Phase 0 checklist (from prompt §17)

| # | Deliverable | Status |
|---|---|---|
| 1 | Repo audit → `docs/PHASE0_AUDIT.md` | ⏳ pending |
| 2 | Decisions log → `docs/DECISIONS.md` | ⏳ pending |
| 3 | `.env.example` (prompt §18) | ⏳ pending |
| 4 | SQL migration contract for `ai-core` (`db/migrations/V1__ai_core.sql`) | ⏳ pending |
| 5 | `ai-core` module skeleton (`lib/ai-core/`) | ⏳ pending |
| 6 | `MockAiProvider` (deterministic canned JSON per taskKey) | ⏳ pending |
| 7 | `ai_jobs` queue + worker + one **no-op** job type, end-to-end | ⏳ pending |
| 8 | A passing test for the above (zero external calls) | ⏳ pending |
| 9 | README note (how to enable AI features) | ⏳ pending |
| 10 | Commit (blocked — repo not git-initialized; see open items) | 🚫 blocked |

Legend: ⏳ pending · 🟡 in progress · ✅ done · 🚫 blocked

---

## What is DONE

- Read the full build prompt and `.claude/settings.json` (empty `{}`).
- Audited the repo (stack, entities, routing, admin surface) — findings captured below and
  going into `docs/PHASE0_AUDIT.md`.

## What is REMAINING (Phase 0)

- Everything in the checklist above still marked pending.

---

## Open items / decisions for the owner

1. **Git init + commits.** The prompt asks for a conventional commit per module, but this
   folder is not a git repo and `claude-seo/` has its own `.git`. I did **not** auto-init git
   (initializing version control + handling the nested repo is the owner's call). To enable
   commits: run `git init` at the repo root and decide whether `claude-seo/` should be a
   submodule, ignored, or removed from tracking. Once initialized, Phase 0 can be committed as
   `feat(ai-core): phase 0 scaffold`.
2. **Database.** No Postgres exists. Phase 0 keeps the queue DB-agnostic (in-memory default)
   with the canonical SQL committed as the forward contract. Phase 1 needs a real Postgres +
   pgvector instance and a chosen client/migrator (see `docs/DECISIONS.md`).

---

## How to resume

1. Read this file, then `docs/PHASE0_AUDIT.md` and `docs/DECISIONS.md`.
2. Continue from the first ⏳/🟡 row in the checklist.
3. Run the Phase 0 test: `npm run test` (should be green, zero external calls).
4. Do not start Phase 1 until the owner asks.

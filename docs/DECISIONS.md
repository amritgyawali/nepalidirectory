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

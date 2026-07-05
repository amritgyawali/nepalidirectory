-- V1__ai_core.sql  (prompt §13, "V__ai_core.sql")
-- Phase 0 canonical schema contract for the ai-core module.
--
-- NOT auto-applied: this repo has no Postgres yet (see docs/PHASE0_AUDIT.md). Phase 1
-- provisions Postgres 16 + pgvector and runs these files (Flyway-compatible V#__ naming,
-- also runnable via psql / node-pg-migrate / drizzle-kit). Until then the job queue uses the
-- in-memory JobRepository (lib/ai-core/queue). Later phases add:
--   V2__acquisition.sql  V3__embeddings.sql  V4__blog.sql  V5__reviews_ai.sql

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Job queue. Worker claims with:
--   UPDATE ai_jobs SET status='RUNNING', locked_by=:node
--   WHERE id = (SELECT id FROM ai_jobs
--               WHERE status='PENDING' AND run_after <= now()
--               ORDER BY priority DESC, id LIMIT 1
--               FOR UPDATE SKIP LOCKED)
--   RETURNING *;
CREATE TABLE IF NOT EXISTS ai_jobs (
  id          BIGSERIAL PRIMARY KEY,
  type        TEXT NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'PENDING',   -- PENDING|RUNNING|DONE|FAILED|DEAD
  priority    INT  NOT NULL DEFAULT 5,
  attempts    INT  NOT NULL DEFAULT 0,
  run_after   TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_by   TEXT,
  result      JSONB,
  error       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_claim ON ai_jobs(status, run_after, priority);

CREATE TABLE IF NOT EXISTS ai_usage_log (
  id            BIGSERIAL PRIMARY KEY,
  provider      TEXT,
  model         TEXT,
  task_key      TEXT,
  input_tokens  INT,
  output_tokens INT,
  latency_ms    INT,
  cache_hit     BOOL DEFAULT false,
  status        TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_cache (
  cache_key   TEXT PRIMARY KEY,
  response    TEXT NOT NULL,
  provider    TEXT,
  model       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  expires_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS prompt_templates (
  id            BIGSERIAL PRIMARY KEY,
  key           TEXT NOT NULL,
  version       INT  NOT NULL,
  system_text   TEXT NOT NULL,
  user_template TEXT NOT NULL,
  json_schema   TEXT,
  model_hint    TEXT,
  temperature   NUMERIC DEFAULT 0.4,
  active        BOOL DEFAULT true,
  UNIQUE (key, version)
);

CREATE TABLE IF NOT EXISTS feature_flags (
  key      TEXT PRIMARY KEY,
  enabled  BOOL NOT NULL DEFAULT false,
  note     TEXT
);

-- V3__listing_enrichment.sql  (subset of prompt §13 acquisition/reviews_ai blocks used by the
-- enrichment pipeline, §7). Idempotent ADD COLUMN IF NOT EXISTS — safe once a `listings` table
-- exists (the base table + static-data migration land in Phase 2, see docs/DECISIONS.md).

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS data_source        TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS description_en      TEXT,
  ADD COLUMN IF NOT EXISTS description_ne      TEXT,
  ADD COLUMN IF NOT EXISTS description_source  TEXT,           -- 'owner' is never overwritten
  ADD COLUMN IF NOT EXISTS meta_title          TEXT,
  ADD COLUMN IF NOT EXISTS meta_description    TEXT,
  ADD COLUMN IF NOT EXISTS tags                JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS attributes          JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category_confidence NUMERIC,
  ADD COLUMN IF NOT EXISTS needs_category_review BOOL DEFAULT false,
  ADD COLUMN IF NOT EXISTS quality_score       INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_enriched_at      TIMESTAMPTZ;

-- Per-listing AI FAQs (prompt §13 reviews_ai block).
CREATE TABLE IF NOT EXISTS listing_faqs (
  id         BIGSERIAL PRIMARY KEY,
  listing_id BIGINT REFERENCES listings(id) ON DELETE CASCADE,
  question   TEXT,
  answer     TEXT,
  source     TEXT DEFAULT 'ai_v1'
);
CREATE INDEX IF NOT EXISTS idx_listing_faqs_listing ON listing_faqs(listing_id);

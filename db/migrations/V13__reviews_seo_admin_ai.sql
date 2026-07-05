-- V13__reviews_seo_admin_ai.sql  (prompt sec. 10/11/12, Phase 5).
-- Adds review-intelligence, SEO automation and admin AI console persistence contracts.
-- Hard rule: no AI provenance columns are added to user reviews. AI output is stored only in
-- review_summaries / owner_reply_drafts / moderation_queue.

CREATE TABLE IF NOT EXISTS review_summaries (
  listing_id    BIGINT PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  summary       TEXT,
  pros          JSONB NOT NULL DEFAULT '[]',
  cons          JSONB NOT NULL DEFAULT '[]',
  sentiment     NUMERIC,
  themes        JSONB NOT NULL DEFAULT '[]',
  review_count  INT NOT NULL DEFAULT 0,
  generated_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS moderation_queue (
  id          BIGSERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id   BIGINT,
  entity_ref  TEXT,
  reason      TEXT,
  score       NUMERIC,
  ai_opinion  JSONB,
  status      TEXT NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON moderation_queue(status, created_at);

CREATE TABLE IF NOT EXISTS owner_reply_drafts (
  id          BIGSERIAL PRIMARY KEY,
  review_id   BIGINT,
  review_ref  TEXT,
  listing_id  BIGINT REFERENCES listings(id) ON DELETE CASCADE,
  drafts      JSONB NOT NULL DEFAULT '{}',
  ai_draft    BOOL NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  edited_at   TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_owner_reply_drafts_listing ON owner_reply_drafts(listing_id);

CREATE TABLE IF NOT EXISTS seo_page_intros (
  id                 BIGSERIAL PRIMARY KEY,
  category_slug      TEXT NOT NULL,
  city_slug          TEXT NOT NULL,
  intro_md           TEXT NOT NULL,
  meta_title         TEXT,
  meta_description   TEXT,
  listing_count      INT NOT NULL,
  avg_quality_score  NUMERIC,
  generated_at       TIMESTAMPTZ DEFAULT now(),
  refreshed_at       TIMESTAMPTZ,
  UNIQUE(category_slug, city_slug)
);

CREATE TABLE IF NOT EXISTS internal_link_suggestions (
  id             BIGSERIAL PRIMARY KEY,
  source_type    TEXT NOT NULL,
  source_ref     TEXT NOT NULL,
  target_type    TEXT NOT NULL,
  target_ref      TEXT NOT NULL,
  score          NUMERIC,
  reason         TEXT,
  status         TEXT NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMPTZ DEFAULT now(),
  decided_at     TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_internal_link_suggestions_status ON internal_link_suggestions(status, score DESC);

ALTER TABLE review_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_reply_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_page_intros ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_link_suggestions ENABLE ROW LEVEL SECURITY;

INSERT INTO feature_flags (key, enabled, note) VALUES
  ('AI_ENABLED', false, 'Global kill switch for all AI calls.'),
  ('ENRICH_LISTING', false, 'Listing descriptions, FAQs, meta and tags.'),
  ('CRAWLER_ENABLED', false, 'Robots-respecting listing URL fetches.'),
  ('BLOG_ENGINE_ENABLED', false, 'Trend scan, selection and draft generation.'),
  ('BLOG_AUTOPUBLISH', false, 'Must remain off until human-review threshold is met.'),
  ('CONCIERGE_ENABLED', false, 'Grounded AI concierge over search results.'),
  ('REVIEW_SUMMARY', false, 'AI summaries from raw published reviews.'),
  ('REVIEW_REPLY_DRAFTS', false, 'Owner reply drafts; owners edit before posting.'),
  ('TRANSLATE_NE', false, 'Nepali listing description and FAQ translation.'),
  ('EVERGREEN_PAGE', false, 'Category-city intro generation and refresh jobs.'),
  ('INTERNAL_LINK_SUGGESTER', false, 'Nightly internal-link suggestions for approval.')
ON CONFLICT (key) DO NOTHING;

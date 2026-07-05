-- V8__blog.sql  (prompt sec. 8 / sec. 13 "V__blog.sql" subset used by Module D — the trending
-- blog engine). Idempotent; requires V1 (vector extension) + V2 (EMBEDDING_DIM=768 convention).

CREATE TABLE IF NOT EXISTS trend_sources (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  kind            TEXT NOT NULL,        -- rss|reddit|youtube|gtrends
  url             TEXT NOT NULL,
  region          TEXT DEFAULT 'NP',
  active          BOOL DEFAULT true,
  last_fetched_at TIMESTAMPTZ,
  fail_count      INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS trend_items (
  id           BIGSERIAL PRIMARY KEY,
  source_id    BIGINT REFERENCES trend_sources(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  url          TEXT NOT NULL,
  url_hash     TEXT UNIQUE NOT NULL,
  summary      TEXT,
  published_at TIMESTAMPTZ,
  embedding    vector(768),
  cluster_id   BIGINT,
  created_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_trend_items_published ON trend_items(published_at);
CREATE INDEX IF NOT EXISTS idx_trend_items_cluster ON trend_items(cluster_id);

CREATE TABLE IF NOT EXISTS trend_clusters (
  id              BIGSERIAL PRIMARY KEY,
  label           TEXT,
  score           NUMERIC,
  item_count      INT,
  status          TEXT DEFAULT 'new',   -- new|selected|skipped|generated
  selector_output JSONB,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id             BIGSERIAL PRIMARY KEY,
  slug           TEXT UNIQUE NOT NULL,
  title          TEXT NOT NULL,
  excerpt        TEXT,
  body_md        TEXT,
  lang           TEXT DEFAULT 'en',
  status         TEXT DEFAULT 'DRAFT',   -- DRAFT|REVIEW|PUBLISHED|REJECTED
  hero_image_url TEXT,
  seo            JSONB,
  sources        JSONB,
  cluster_id     BIGINT REFERENCES trend_clusters(id),
  article_type   TEXT,                   -- news_explainer|guide|listicle
  author_type    TEXT DEFAULT 'ai_assisted',
  factcheck      JSONB,
  confidence     NUMERIC,
  reviewed_by    TEXT,
  published_at   TIMESTAMPTZ,
  embedding      vector(768),
  created_at     TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- V5__acquisition.sql  (prompt sec. 13 "V__acquisition.sql" + Tier-3 claims).
-- Idempotent; safe once a `listings` table exists (base table lands with the Phase 2 static-data
-- migration, see docs/DECISIONS.md). Contract only until Postgres is provisioned.

-- Provenance + geography + Places columns on listings (some already added in V3).
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS source_ref     TEXT,
  ADD COLUMN IF NOT EXISTS license_note   TEXT,                 -- 'ODbL' for OSM rows
  ADD COLUMN IF NOT EXISTS google_place_id TEXT,
  ADD COLUMN IF NOT EXISTS claim_status   TEXT DEFAULT 'unclaimed',  -- unclaimed|pending|claimed
  ADD COLUMN IF NOT EXISTS osm_type       TEXT,
  ADD COLUMN IF NOT EXISTS osm_id         BIGINT,
  ADD COLUMN IF NOT EXISTS province       TEXT,
  ADD COLUMN IF NOT EXISTS district       TEXT,
  ADD COLUMN IF NOT EXISTS municipality   TEXT,
  ADD COLUMN IF NOT EXISTS ward           TEXT,
  ADD COLUMN IF NOT EXISTS merged_from    JSONB,
  ADD COLUMN IF NOT EXISTS search_tsv     tsvector;
CREATE UNIQUE INDEX IF NOT EXISTS idx_listings_osm ON listings(osm_type, osm_id) WHERE osm_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_tsv ON listings USING gin(search_tsv);
CREATE INDEX IF NOT EXISTS idx_listings_name_trgm ON listings USING gin (lower(name) gin_trgm_ops);

CREATE TABLE IF NOT EXISTS osm_tag_map (
  osm_key       TEXT,
  osm_value     TEXT,
  category_slug TEXT,
  PRIMARY KEY (osm_key, osm_value)
);

CREATE TABLE IF NOT EXISTS ingest_batches (
  id          BIGSERIAL PRIMARY KEY,
  source      TEXT,
  stats       JSONB,
  started_at  TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS crawl_cache (
  url_hash   TEXT PRIMARY KEY,
  url        TEXT,
  html       TEXT,
  fetched_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS merge_candidates (
  id            BIGSERIAL PRIMARY KEY,
  a_id          BIGINT,
  b_id          BIGINT,
  score         NUMERIC,
  features      JSONB,
  ai_verdict    TEXT,        -- same|distinct|branch
  ai_confidence NUMERIC,
  decision      TEXT DEFAULT 'pending',  -- pending|confirmed|rejected
  decided_by    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Tier 3 business claims (prompt sec. 6.3).
CREATE TABLE IF NOT EXISTS claims (
  id           BIGSERIAL PRIMARY KEY,
  listing_id   BIGINT REFERENCES listings(id) ON DELETE CASCADE,
  method       TEXT,        -- otp|document
  contact      TEXT,
  otp          TEXT,
  document_url TEXT,
  status       TEXT DEFAULT 'pending',  -- pending|verified|rejected
  created_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

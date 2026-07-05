-- V11__discover.sql  (prompt sec. 9, Module E — semantic search + AI concierge).
-- `category_synonyms` and `listing_embeddings` already exist (V2); `search_tsv` column and its
-- trgm/gin indexes already exist (V5). This migration adds the two logging tables (§9.2/§9.3) and
-- the trigger that actually maintains `search_tsv` (contract only until now).

CREATE TABLE IF NOT EXISTS demand_signals (
  id            BIGSERIAL PRIMARY KEY,
  query         TEXT,
  category_guess TEXT,
  location      TEXT,
  source        TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_demand_signals_created ON demand_signals(created_at);

CREATE TABLE IF NOT EXISTS search_queries_log (
  id            BIGSERIAL PRIMARY KEY,
  query         TEXT,
  parsed        JSONB,
  results_count INT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- RLS: internal/logging tables, service-role only (same pattern as ai_jobs/claims/blog_posts/...).
-- New tables default to RLS OFF, unlike ALTER TABLE on an existing one — always enable it here,
-- in the SAME migration that creates the table (V8 missed this for its 4 tables; V10 fixed it).
ALTER TABLE demand_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries_log ENABLE ROW LEVEL SECURITY;

-- Maintain search_tsv over name + categories + tags + locality (prompt §9.1) on every write.
CREATE OR REPLACE FUNCTION listings_search_tsv_update() RETURNS trigger AS $$
BEGIN
  NEW.search_tsv :=
    setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', array_to_string(coalesce(NEW.categories, '{}'), ' ')), 'B') ||
    setweight(
      to_tsvector(
        'simple',
        array_to_string(ARRAY(SELECT jsonb_array_elements_text(coalesce(NEW.tags, '[]'::jsonb))), ' ')
      ),
      'C'
    ) ||
    setweight(
      to_tsvector('simple', coalesce(NEW.area, '') || ' ' || coalesce(NEW.neighborhood, '')),
      'B'
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_listings_search_tsv ON listings;
CREATE TRIGGER trg_listings_search_tsv
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION listings_search_tsv_update();

-- Backfill search_tsv for rows written before this trigger existed (the 11 demo listings).
UPDATE listings SET updated_at = updated_at;

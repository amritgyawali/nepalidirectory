-- V7__rls.sql  Row Level Security (runs LAST). The publishable/anon key is public (shipped to
-- browsers), so every table must have RLS. Policy: public-content tables allow anon SELECT of
-- visible rows; internal/AI tables get RLS enabled with NO policy, so only the service_role key
-- (which bypasses RLS) — used by background jobs/imports — can touch them.
-- Idempotent: policies are dropped-if-exists then recreated.

-- Public content: anon may read.
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS listings_public_read ON listings;
CREATE POLICY listings_public_read ON listings FOR SELECT TO anon, authenticated USING (active = true);

ALTER TABLE listing_faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS listing_faqs_public_read ON listing_faqs;
CREATE POLICY listing_faqs_public_read ON listing_faqs FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE category_synonyms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS category_synonyms_public_read ON category_synonyms;
CREATE POLICY category_synonyms_public_read ON category_synonyms FOR SELECT TO anon, authenticated USING (true);

-- Internal / AI tables: RLS on, NO policy -> only service_role (bypasses RLS) may access.
ALTER TABLE ai_jobs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_log      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cache          ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags     ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE osm_tag_map       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingest_batches    ENABLE ROW LEVEL SECURITY;
ALTER TABLE crawl_cache       ENABLE ROW LEVEL SECURITY;
ALTER TABLE merge_candidates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims            ENABLE ROW LEVEL SECURITY;

-- V10__rls_blog.sql  RLS for the Phase 3 blog-engine tables (missed when V8 was written; V7 only
-- covered the tables that existed at the time). Same pattern as every other internal/AI table
-- (ai_jobs, merge_candidates, claims, ...): RLS ON, no policy -> service-role only, no anon access.

ALTER TABLE trend_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

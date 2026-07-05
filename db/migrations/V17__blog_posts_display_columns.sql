-- V17__blog_posts_display_columns.sql
-- The `BlogPost` domain type (lib/blog-engine/types.ts) carries three fields the public blog page
-- renders (category chip, on-page FAQ) or reports (link count) that V8's `blog_posts` table never
-- had a column for: `categories`, `faq`, `links_injected`. Without these the Postgres-backed blog
-- store (lib/blog-engine/stores/postgres.ts) could not round-trip a published engine post, so the
-- category and FAQ would render empty. Additive + idempotent; safe to re-run.

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS categories     JSONB DEFAULT '[]'::jsonb;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS faq            JSONB DEFAULT '[]'::jsonb;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS links_injected INT   DEFAULT 0;

-- SEO trust/publication controls.
--
-- Existing verified, rating and reviews columns predate a real review/provenance workflow.
-- Keep those legacy values for investigation, but do not let them alone make a record indexable
-- or eligible for review structured data.

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS source_checked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS content_reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS content_reviewed_by TEXT,
  ADD COLUMN IF NOT EXISTS last_meaningful_update_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS image_verified BOOL NOT NULL DEFAULT false;

COMMENT ON COLUMN listings.verification_status IS
  'unverified|source_verified|owner_verified|community_submitted|rejected';
COMMENT ON COLUMN listings.source_checked_at IS
  'When a human or approved source workflow last checked the real-world source.';
COMMENT ON COLUMN listings.content_reviewed_at IS
  'When a human reviewed the public profile content for publication.';
COMMENT ON COLUMN listings.last_meaningful_update_at IS
  'A user-visible factual/content change; sitemap lastmod must use this rather than build time.';
COMMENT ON COLUMN listings.image_verified IS
  'True only when the image is known to depict this business and may be published as such.';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'listings_verification_status_check'
      AND conrelid = 'listings'::regclass
  ) THEN
    ALTER TABLE listings
      ADD CONSTRAINT listings_verification_status_check
      CHECK (verification_status IN (
        'unverified',
        'source_verified',
        'owner_verified',
        'community_submitted',
        'rejected'
      ));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_listings_publication_gate
  ON listings (active, verification_status, content_reviewed_at)
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_listings_public_categories
  ON listings USING GIN (categories)
  WHERE active = true AND content_reviewed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_public_area_name
  ON listings (lower(area), lower(name), id)
  WHERE active = true AND content_reviewed_at IS NOT NULL;

-- Intentionally no automatic trust backfill. Legacy `verified`/`claimed` flags do not document
-- who checked the source or public content, so every existing row remains conservatively
-- `unverified` until it passes the new admin workflow.

-- V0__listings.sql  Base listings table (runs FIRST — before V1 extensions and the V3/V5 ALTERs).
-- Columns mirror the app's Business/Listing shape (lib/data.ts + lib/enrich/types.ts). The
-- enrichment/acquisition columns (data_source, quality_score, description_*, osm_*, geography,
-- search_tsv, ...) are added by V3 and V5.

CREATE TABLE IF NOT EXISTS listings (
  id           BIGSERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  categories   TEXT[] NOT NULL DEFAULT '{}',
  area         TEXT,
  neighborhood TEXT,
  address      TEXT,
  phone        TEXT,
  website      TEXT,
  email        TEXT,
  rating       NUMERIC,
  reviews      INT DEFAULT 0,
  price        INT,
  status       TEXT DEFAULT 'open',        -- operational: open|closed|24h
  hours_today  TEXT,
  image        TEXT,
  photos_count INT DEFAULT 0,
  lat          DOUBLE PRECISION,
  lng          DOUBLE PRECISION,
  amenities    TEXT[] DEFAULT '{}',
  services     TEXT[] DEFAULT '{}',
  claimed      BOOL DEFAULT false,
  verified     BOOL DEFAULT false,
  active       BOOL DEFAULT true,          -- visibility flag for public read (see V7 RLS)
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

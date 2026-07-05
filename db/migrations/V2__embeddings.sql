-- V2__embeddings.sql  (prompt §13, "V__embeddings.sql")
-- Set the vector dimension to EMBEDDING_DIM before running (default 768; bge-m3 is 1024).
-- Contract only until Postgres exists (Phase 1 uses the in-memory EmbeddingRepository).

CREATE TABLE IF NOT EXISTS listing_embeddings (
  listing_id BIGINT PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  embedding  vector(768),
  model      TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_listing_embeddings_hnsw
  ON listing_embeddings USING hnsw (embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS category_synonyms (
  category_slug TEXT,
  synonym       TEXT,
  lang          TEXT,
  PRIMARY KEY (category_slug, synonym)
);

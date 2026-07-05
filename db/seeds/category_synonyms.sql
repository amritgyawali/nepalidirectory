-- Seed rows for category_synonyms (prompt §9.1), mirrors lib/discover/synonyms/seed.ts.
-- EN / romanized-NE synonyms folded into the search tsvector / NL query parser fast path.
INSERT INTO category_synonyms (category_slug, synonym, lang) VALUES
  ('restaurants', 'khana pasal', 'romanized_ne'),
  ('restaurants', 'momo pasal', 'romanized_ne'),
  ('cafes-bistros', 'chiya pasal', 'romanized_ne'),
  ('cafes-bistros', 'chiya thoi', 'romanized_ne'),
  ('plumbers', 'paip mistri', 'romanized_ne'),
  ('electricians', 'bijuli mistri', 'romanized_ne'),
  ('doctors', 'daktar', 'romanized_ne'),
  ('hotels', 'lodge', 'en'),
  ('auto-repair', 'gadi mistri', 'romanized_ne'),
  ('beauty-salons', 'parlor', 'en')
ON CONFLICT (category_slug, synonym) DO NOTHING;

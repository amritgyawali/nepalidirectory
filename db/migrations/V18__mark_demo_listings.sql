-- The bundled seed rows are product-preview fixtures, not approved public directory records.
-- Mark them explicitly so public listing, sitemap and schema gates cannot mistake them for live data.
UPDATE listings
SET data_source = 'demo', updated_at = now()
WHERE slug IN (
  'newa-lahana',
  'bhojan-griha',
  'yangling-tibetan',
  'roadhouse-cafe',
  'himalayan-java-lazimpat',
  'annapurna-thakali',
  'kathmandu-plumbing-services',
  'patan-electric-solar',
  'citycare-dental-clinic',
  'lakefront-inn-pokhara',
  'legal-line-nepal'
)
AND (
  website LIKE 'https://example.com/%'
  OR email LIKE '%.example'
  OR source_ref IS NULL
);

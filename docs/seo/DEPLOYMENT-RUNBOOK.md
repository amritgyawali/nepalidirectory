# SEO trust release deployment and rollback runbook

## Preconditions

Do not deploy until all of the following are recorded outside this repository:

- production database backup identifier and restore test;
- current application release/commit identifier;
- current listing export containing IDs, slugs, legacy rating/review/price values and current sitemap eligibility;
- an authenticated admin capable of reviewing pending listings;
- Search Console access for post-deployment checks.

Never paste credentials or database URLs into issues, logs or reports.

## Deployment order

1. Put automatic bulk publication and unattended SEO-page generation on hold.
2. Back up the database using the production provider's supported process.
3. Apply migrations in order:

   ```bash
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V19__seo_trust_verification.sql
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V20__category_intro_without_ratings.sql
   ```

4. Run the read-only listing audit before any approval:

   ```bash
   mkdir -p reports/seo
   npm run seo:audit-listings -- --format json --output reports/seo/listing-audit-2026-08-03.json
   ```

5. Deploy the application commit only after migrations succeed.
6. Do not bulk-mark legacy `verified` rows as source- or owner-verified. Review provenance, content and contacts through the pending queue.
7. Approve a small known-good batch and verify that only those records enter public results and listing sitemaps.

## Post-deployment checks

Run these against the preferred `https://www.nepalidirectory.com` host:

- all HTTP/www/non-www variants resolve through one permanent hop;
- `/robots.txt` returns 200 and references `/sitemap.xml`;
- `/sitemap.xml` references only existing sitemap files;
- empty listing chunks are absent;
- representative sitemap URLs return 200, self-canonical and indexable;
- unreviewed profiles return `noindex, follow`, with no LocalBusiness or review schema;
- qualified profiles return indexable metadata and truthful LocalBusiness schema;
- empty/below-threshold categories and cities return `noindex, follow` and stay out of sitemaps;
- city/category pages stay below 1 MB and show no more than 24 result cards;
- page 2 has a unique title, self-canonical and crawlable HTML pagination links;
- `/top-rated` permanently redirects to `/best-businesses`;
- no page emits a meta-keywords tag or unsupported aggregate rating.

In Search Console:

1. resubmit `/sitemap.xml`;
2. inspect the homepage, one qualifying category, one qualifying city, one qualifying profile and one intentionally noindexed profile;
3. verify no manual action or security issue;
4. monitor excluded-by-noindex, duplicate canonical, crawled-currently-not-indexed and soft-404 reports;
5. record impressions/clicks/CTR/position weekly for branded, national-directory, category-city and business-name query groups.

## Rollback

The schema migration is additive, so the safest initial rollback is to redeploy the previous application release while leaving the new columns in place. Restore the database backup only if data was corrupted; do not restore merely because rankings fluctuate.

To disable the replacement prompt without dropping data:

```sql
BEGIN;
UPDATE prompt_templates SET active = false WHERE key = 'CATEGORY_INTRO_V1' AND version = 2;
UPDATE prompt_templates SET active = true WHERE key = 'CATEGORY_INTRO_V1' AND version = 1;
COMMIT;
```

Dropping the trust columns is destructive and normally unnecessary. Consider it only after the old application is restored, an export is verified and no new reviewer/source audit data must be preserved.

## Monitoring cadence

- First 24 hours: error rate, sitemap responses, accidental indexability and admin approval behavior.
- Days 2–7: crawl stats, sitemap processing, noindex exclusions and representative URL Inspection.
- Days 14–30: branded impressions, long-tail city/category queries, CTR and indexed eligible URL counts.
- Days 30–90: content/inventory expansion based on verified demand and supply; authority/link acquisition; title/description experiments from query evidence.

Do not reverse the trust gate or republish unsupported ratings because of short-term ranking volatility.

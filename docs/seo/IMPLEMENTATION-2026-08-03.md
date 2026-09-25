# NepaliDirectory SEO trust and indexation implementation — 2026-08-03

This release prioritizes evidence, crawl efficiency and useful query architecture. It improves ranking eligibility; it cannot guarantee Google position 1.

## What changed

### Evidence-based publication gate

Migration `V19__seo_trust_verification.sql` adds conservative, additive trust fields:

- `verification_status`;
- `source_checked_at`;
- `content_reviewed_at` and `content_reviewed_by`;
- `last_meaningful_update_at`;
- `image_verified`.

Legacy rows are intentionally not backfilled as trusted. A single server-side policy now controls profile metadata, public result sets, search/AI retrieval, city/category counts, LocalBusiness schema and XML sitemaps.

A listing is ineligible when it is inactive, rejected, demo/placeholder data, awaiting category review, below the quality threshold, missing core fields/contact/description, missing human content review or lacks auditable source evidence. Admin approval returns the exact failed checks instead of publishing an incomplete record.

Owner and OSM acquisition paths now preserve trust state and source-check timestamps. Rejection is a reversible soft hide with reviewer audit fields.

### Unsupported rating and profile claims removed

- Legacy aggregate ratings, review counts and price tiers no longer enter cards, search, maps, AI output or LocalBusiness schema.
- The public review form and review-summary endpoint remain disabled until genuine first-party reviewer-level evidence, identity and moderation are implemented end to end.
- Generic Unsplash images are never emitted as a specific business image.
- Ineligible profiles withhold contacts and unsupported descriptions while remaining available for correction/claim workflows with `noindex, follow`.
- Static bundled business rows are explicitly classified as demo fixtures and cannot become public recommendations because a URL looks plausible.

### Page size and crawl architecture

- Category and city results paginate at 24 items with server-rendered links and self-canonical page URLs.
- Invalid, negative and beyond-last-page requests return 404.
- Result schemas contain only the visible page's compact ItemList entries.
- Category and city pages need at least ten qualifying profiles to be indexable or enter a sitemap.
- `/city/[city]/[category]` provides a static, crawlable long-tail route only when the same threshold is met.
- Empty/unqualified category and city pages use `noindex, follow`.

### Ranking-page cleanup

- Fixture-backed `/best/[category]/[city]` pages were retired.
- `/top-rated` permanently redirects to the noindexed `/best-businesses` publication-method page.
- Provider comparison guides contain decision criteria but no invented providers, ratings, prices or winner claims.
- Paid promotion language now requires sponsorship labels and does not imply changed organic eligibility.

### Sitemaps and structured data

- Sitemaps contain only canonical, index-eligible URLs from the central policy.
- Business sitemap chunks are created only when qualifying profiles exist.
- Profile `lastmod` uses `last_meaningful_update_at`; it is omitted when unavailable.
- Only verified, non-stock business images enter image sitemaps/schema.
- Empty categories/cities and retired ranking URLs are excluded.
- Every JSON-LD surface uses an HTML-safe serializer.
- Site-wide primary entity naming is `NepaliDirectory`, with `Nepali Directory` as an alternate.
- Legacy meta-keyword output was removed.

### Operational tools

`npm run seo:audit-listings -- --format json|csv [--output path]` performs a read-only audit for duplicate identities, contact/address fingerprints, exact or highly similar descriptions, repeated images/attributes/patterns and legacy rating/price values. It never overwrites an existing report and never outputs raw contacts or addresses.

Migration `V20__category_intro_without_ratings.sql` retires the rating-based category-intro prompt and replaces it with listing count, observed locality and internal completeness inputs.

## Verification completed

- `npm ci --ignore-scripts`
- ESLint: pass with zero warnings
- TypeScript: pass
- Vitest: 24 files, 134 tests passed
- Next.js production build: pass, 231 static pages generated
- Production-route smoke tests: pass
- HTML budgets: pass for representative home, category, city, profile and comparison routes
- Schema assertions: no unsupported rating, review-count or price markup
- Sitemap/redirect/indexation assertions: pass

The build emitted only the existing Supabase Edge-runtime compatibility warning during compilation; it did not fail compilation, type validation or static generation.

## Manual work required for rankings

Code cannot create genuine business evidence, branded demand or backlinks. After deployment, the owner must:

1. migrate and back up production safely;
2. review real listings and sources instead of bulk-approving legacy rows;
3. earn relevant Nepal citations and editorial links without buying manipulative link packages;
4. establish consistent `NepaliDirectory` profiles on owned social/business channels;
5. publish useful city/category inventory only as verified supply grows;
6. submit and monitor the new sitemap in Search Console;
7. measure branded and long-tail queries in a non-personalized rank tracker;
8. improve CTR and content from Search Console evidence over 30–90 days.

# Action Plan — nepalidirectory.com (RE-AUDIT, 2026-07-16)

Prioritized Critical → High → Medium → Low. Each item links to the findings file with full
evidence and code-level detail. Sequencing matters this cycle: items 1–3 under Critical are one
project, not three, and should be planned together.

---

## Critical (fix this sprint)

1. **Connect a real listing-data supply pipeline.** This is the single highest-leverage fix in the
   entire audit — it unblocks the Sitemap, Schema, Local, SXO, and GEO findings simultaneously.
   `isIndexableListing()` (`lib/public-listings.ts`) is correct and should **not** be relaxed; the
   problem is that nothing live can ever produce a row that passes it. Two independent paths, either
   sufficient to unblock:
   - **(a) Owner-submission path:** wire `app/claim-listing`'s `DashboardProvider.addListing()` (or
     a new server action) to write into `createListingRepository()` with `dataSource: "owner"`,
     and connect `app/super-admin/approvals`/`app/super-admin/businesses` (currently disconnected
     mock UI) to the same repository so an approval actually flips `listing.verified = true`.
   - **(b) Bulk-import path:** run the already-built `lib/acquire/osm` importer (seed data already
     exists at `db/seeds/osm_tag_map.sql`) against real Nepal business data with
     `dataSource: "osm"` — already in the `trustedSource` allowlist, needs no per-record manual
     claim.
   Either path, even at 20–50 real reviewed listings, is enough to validate the entire pipeline
   end-to-end. → `findings/sitemap.md` §VERDICT, `findings/schema.md`, `findings/local.md`

2. **Build sitemap chunking before real listing volume lands.** `app/sitemap-listings-1.xml/route.ts`
   is a literal filename with no `[chunk]`/`[page]` dynamic segment. Once item 1 starts producing
   real rows, an unbounded query past 50,000 URLs will silently under-report with no overflow index
   entry. Build this concurrently with item 1, not after. → `findings/sitemap.md` §N2

3. **Extend `localBusinessSubtype()` to cover all 6 published category verticals.** Currently only
   maps 8 needles (`restaurant`, `cafe`, `hotel`, `doctor`, `dentist`, `plumber`, `electrician`,
   `lawyer`); `hospitals`, `schools`, `it-companies`, and `shops` will fall back to generic
   `LocalBusiness` the moment real listings populate them. Fix before item 1 ships data into these
   categories, not after — incorrect primary category is Whitespark 2026's #1 negative local-ranking
   factor. → `findings/local.md` (Medium there, sequenced Critical here as a blocking dependency)

---

## High (fix within 1 week)

4. **Resolve the marketing-claims contradiction.** Homepage/city copy ("50,000+ local businesses,"
   "12,840 listings" for Kathmandu) is now directly, visibly contradicted by the moderation-gate
   banner a real visitor sees on the one example listing. Either scale back the numbers until
   backed by real approved listings (from item 1), or explicitly label them as target/aspirational
   figures. Zero engineering cost, real trust risk if left as-is. → `findings/sxo.md`

5. **Consolidate the 4 residual duplicate blog posts.** `/blog/how-to-compare-local-services-in-
   nepal-before-booking`, `-clinics-and-appointments-in-nepal`, `-repair-providers-in-nepal-before-
   hiring`, `-event-venues-and-vendors-in-nepal` (published 07-05/06) score 0.62–0.66 pairwise
   similarity against each other by the site's own current dedup threshold. Use the exact
   redirect pattern already proven on the other 7 in `lib/blog-dedup.ts` — either regenerate 3 of
   the 4 through the current pipeline or merge into one hub post and 301 the rest.
   → `findings/content.md` (High)

6. **Wire the blog ↔ city hub ↔ compare-business internal links.** `findings/cluster.md` proves
   zero bidirectional links exist between any blog post and its topically-matching hub page —
   the site's one working content funnel is three disconnected silos. Pure linking fix against
   data that already exists, no new content required. → `findings/sxo.md`, `findings/cluster.md`

7. **Add `priority` to the LCP `next/image` element on 3 templates** (homepage hero, business-hero
   photo, blog featured image). One line per template; addresses a confirmed `fetchpriority="high"`
   gap contributing directly to LCP of 2.69s (homepage) and 3.37s (blog post). Expected 100–300ms
   LCP improvement. → `findings/performance.md`

8. **Re-compress or re-source the homepage's Unsplash hero image.** Lighthouse flags 89% (70KB of
   80KB) avoidable file size, specific to this one image/URL configuration. Combine with item 7.
   → `findings/performance.md`

9. **Fix the `/claim-listing` sales-pitch contradiction.** No H1, only 133 words of copy, and the
   one visible "example" listing shows a preview-gate banner at the exact moment a prospective
   business owner is evaluating the product. Add an H1 and substantive copy; consider a
   purpose-built "what your listing will look like" example that doesn't carry live moderation UI.
   → `findings/sxo.md`, `findings/visual.md`

10. **Add `QAPage` JSON-LD to `/questions/trekking-annapurna`.** Currently ships zero page-specific
    schema (no `WebPage`, `BreadcrumbList`, or `QAPage`) despite being a textbook single-question
    Q&A page. Highest novel-content schema ROI found this cycle. → `findings/schema.md`

11. **Backfill the original ~14 baseline blog posts** (still 160–410 real words) through the current,
    much stronger generation pipeline so the oldest, most commercially competitive content (dental,
    contractors, wedding, schools) isn't also the thinnest. → `findings/content.md`

---

## Medium (fix within 1 month)

12. **Promote CSP from `Report-Only` to enforcing.** Add a `report-to`/`report-uri` endpoint first
    (none exists today, so report-only violations aren't even being collected), monitor briefly,
    then flip to enforcing `Content-Security-Policy`. Consider replacing `'unsafe-inline'` in
    `script-src`/`style-src` with nonces/hashes before enforcing. → `findings/technical.md`

13. **Fix the font-load CLS regression on `/category/*` pages.** The only CLS metric that fails
    "Good" across the four pages tested (0.110); root cause is a webfont-load reflow on the
    "Quick answer" block. Verify the preload link present on the homepage also fires on category
    templates. → `findings/performance.md`

14. **Reinstate explicit per-bot `Allow` rules in robots.txt** for GPTBot, OAI-SearchBot,
    ClaudeBot, PerplexityBot. Functionally harmless today (wildcard covers everything), but
    restores the auditable AI-crawler-access signal and the ability to later differentiate
    search-citation bots from training-only scrapers (CCBot, anthropic-ai). 5-minute fix.
    → `findings/geo.md`

15. **Clean up `llms.txt` curation.** Either remove the two now-empty section headers ("Business
    comparison guides," "Data-backed local answers") or add a one-line note explaining the gate;
    widen "Local guides" to track the full 89-post sitemap rather than a ~20-post snapshot.
    → `findings/geo.md`

16. **Add a named human reviewer byline for health-vertical blog content.** YMYL-adjacent posts
    (dental, clinics, veterinary, hospitals) are still attributed to anonymous "desk" bylines;
    this gap now covers more posts than at the last audit. → `findings/content.md`

17. **Add `ItemList` schema to `/city/*` and `/category/*` hub pages** once item 1 lands real
    listing data to populate it meaningfully. Now applies to 14 pages (8 city + 6 category).
    → `findings/schema.md`, `findings/local.md`

18. **Bump mobile nav tap targets to 44–48px min-height** (currently 38px) at the mobile breakpoint
    only. → `findings/visual.md`

19. **Re-verify `/claim-listing` has an `<h1>`; add one if still missing** (overlaps item 9's
    broader fix). → `findings/technical.md`

---

## Low / Backlog

20. **Create and link official social profiles** (Facebook, Instagram, LinkedIn) from the footer —
    zero cost, unblocks citation-directory submissions, the top recommended fix for the backlinks
    category. → `findings/backlinks.md`

21. **Delete the dead `app/[indexNowKey].txt` route folder** (no `route.ts` inside, cosmetic).
    → `findings/technical.md`

22. **Fix the duplicated paragraph on `/authors/team`**; give it the same guide-listing treatment
    as the other desk pages. → `findings/content.md`

23. **Enforce 5-decimal geo-coordinate precision** at the data-import/validation layer ahead of
    item 1's real data landing (current seed data is 3–4 decimals, ~11m accuracy vs. the
    recommended ~1.1m). → `findings/local.md`

24. **Confirm the site-wide floating AI-assistant button** never overlaps sticky/bottom CTAs on
    longer pages and meets the 48×48px touch-target minimum. → `findings/visual.md`

25. **Get a free Moz API key** (2,500 rows/month, no cost) — single highest-leverage improvement
    available to the Backlinks category for the next audit cycle. → `findings/backlinks.md`

26. **Submit to 3–5 free, high-relevance Nepal business directories/chambers of commerce** (FNCCI,
    Nepal Tourism Board, city chambers) — prerequisite is item 20 (social presence) landing first.
    → `findings/backlinks.md`

---

## What NOT to do

- **Do not relax `isIndexableListing()`** to "solve" the empty-sitemap problem faster. The gate is
  correct and doing its job — the fix is upstream (supply real, verified data), not downstream
  (index unverified data).
- **Do not add new `FAQPage` schema expecting a Google SERP benefit** — Google retired FAQ rich
  results for all sites as of 2026-05-07. Existing `FAQPage` blocks are fine to keep for AI/GEO
  citation value; don't invest further effort chasing a SERP feature that no longer exists.
- **Do not recommend `HowTo` schema** anywhere — deprecated since September 2023.

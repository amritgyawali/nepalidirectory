# Full SEO Audit — nepalidirectory.com (RE-AUDIT)

**Date:** 2026-07-16 · **Scope:** https://www.nepalidirectory.com (141 URLs across 4 live
sitemaps, cross-referenced against the production Next.js 15 source at
`d:\15 july files\NepaliDirectory page claude`) · **Overall SEO Health Score: 70 / 100** (was
57/100 on 2026-07-11)

**Baseline:** `AUDIT-CONTEXT.md` / `FULL-AUDIT-REPORT.md` dated 2026-07-11 (prior HEAD `81a7115`,
deployed stale). This pass verifies production against current `main` (`fc8c5ba`) after 5 commits
(`0d1ac8f` sitemap, `4a63e56` seo, `52367a5`/`023320a` "seo for ranking at top", `fc8c5ba` fix seo
issues). Ten specialist passes ran: Technical, Content, Schema, Sitemap, Performance, Visual, GEO,
SXO, Local, Backlinks. Full detail for each lives in `findings/*.md`; this report synthesizes.

---

## Executive Summary

The team shipped a genuinely large amount of real engineering since the last audit — every single
Critical/High technical and security finding from 2026-07-11 is fixed and verified live: hardcoded
admin credentials are gone, the host-canonicalization redirect works, admin URLs no longer leak
into the sitemap, security headers are live site-wide, duplicate page titles are fixed, and the
blog's original 12-post duplicate-content cluster has been resolved with real dedup guards that
have now held up cleanly across an 8x volume increase (12→97 posts). Technical (64→91), Visual
(68→87), and Sitemap hygiene (28→44) all show large, well-verified gains, and Performance now has
real Lighthouse lab data for the first time (87/100 homepage) instead of a manual estimate.

**But the site's single most important problem — the one the 2026-07-11 audit called
Critical — is not fixed. It has changed shape and gotten more visible.** In fixing the sitemap
*function* (it now correctly reads from a real listing repository instead of a hardcoded literal)
the team also correctly wired a data-integrity gate that excludes unverified "demo" data from the
index. That gate is well-built and doing exactly what it should. The problem is that **nothing in
the live product can ever produce a listing that isn't demo data** — the owner "claim a listing"
form only writes to `localStorage`, the admin approval screens are disconnected mock UI, and the
OSM/CSV import pipelines that could bulk-load real Nepal business data have zero production
wiring. The result: `sitemap-listings-1.xml` — the entire reason a business directory exists —
has **zero URLs**, down from 1 at the last audit. Five independent specialist passes
(Sitemap, Schema, Local, SXO, GEO) converged on this same root cause from five different angles.

This is no longer just a missing-inventory problem. The one demo listing a real visitor can reach
(`/business/newa-lahana`) now displays an explicit banner reading *"excluded from search indexing,
sitemaps and business ranking schema until its source and public details pass review"* — directly
beside homepage and city-page copy still claiming "50,000+ local businesses" and "12,840 listings"
for Kathmandu. That is a **trust problem**, not just a discovery-gap problem, and it is new
user-visible evidence of the gap that didn't exist at the last audit.

### Top 5 critical/high issues

1. **Zero live, indexable business listings — the site's core product has no supply pipeline.**
   The routing, sitemap, and schema code are now genuinely correct (`app/business/[slug]/page.tsx`
   exists, `getListingSitemapEntries()` reads from the real repository). But every one of the 11
   seed businesses is permanently tagged `dataSource: "demo"`, which the (correct) indexability
   gate excludes unconditionally — and no live UI or import job can ever write a non-demo row.
   Two independent unlock paths exist and either would work: (a) wire `claim-listing`'s
   `DashboardProvider.addListing()` to a real server write + a connected admin-approval flow, or
   (b) bulk-import real Nepal business data via the already-built `lib/acquire/osm` importer with
   `dataSource: "osm"` (already trusted by the gate). → `findings/sitemap.md` §"VERDICT", `findings/schema.md`, `findings/local.md`, `findings/sxo.md`, `findings/geo.md`
2. **Homepage/city marketing copy ("50,000+ local businesses," "12,840 listings" for Kathmandu)
   is now directly, visibly contradicted by the platform's own moderation-gate messaging.** A real
   visitor who clicks through to the one example listing is told in the site's own words that it
   isn't indexed. → `findings/sxo.md` (High)
3. **A residual pre-fix duplicate-content cluster of 4 blog posts (published 07-05/06) is still
   live** and scores 62–66% pairwise similarity against each other by the site's own current
   dedup threshold (0.55) — verbatim instances of a deterministic fallback template that predates
   the 07-11 fix. → `findings/content.md` (High)
4. **CSP ships as `Content-Security-Policy-Report-Only`, not enforcing.** XSS/injection mitigation
   from CSP specifically is not active yet (clickjacking protection via `X-Frame-Options` *is*
   active independently). → `findings/technical.md` (Medium, downgraded from the baseline's
   Critical admin-credentials finding, which is fixed)
5. **LCP images across all three main templates (homepage hero, business photo, blog featured
   image) are missing `fetchpriority="high"`**, contributing directly to LCP of 2.69s (homepage)
   and 3.37s (blog post) — both in the "Needs improvement" band. A one-line `priority` prop fix
   per template. → `findings/performance.md` (High)

### Top 5 quick wins

1. Add `priority` to the `next/image` LCP element on the homepage hero, business-hero photo, and
   blog featured-image templates — one line per template, directly targets the LCP finding above.
2. Consolidate or 301-redirect the 4 residual duplicate blog posts using the exact pattern already
   proven in `lib/blog-dedup.ts` for the other 7.
3. Reinstate explicit per-bot `Allow` rules (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) in
   `robots.txt` — 5-minute change, restores an auditable AI-crawler-access signal that was
   simplified away.
4. Add `QAPage` JSON-LD to `/questions/trekking-annapurna` — a genuine Q&A page currently shipping
   zero schema at all.
5. Delete the dead `app/[indexNowKey].txt` route folder; fix the duplicated paragraph on
   `/authors/team`; re-compress the homepage's Unsplash hero image (89% file-size savings
   available per Lighthouse).

---

## Category Scores

| Category | Score | Prior (2026-07-11) | Change | Weight in Health Score |
|---|---|---|---|---|
| Technical SEO | 91/100 | 64/100 | ↑ 27 | 22% |
| Content Quality | 60/100 | 52/100 | ↑ 8 | 23% |
| On-Page SEO (est., see note) | 58/100 | 50/100 | ↑ 8 | 20% |
| Schema / Structured Data | 61/100 | 74/100 | ↓ 13 | 10% |
| Performance (CWV) | 87/100 | ~60/100 (manual est.) | ↑ (not directly comparable) | 10% |
| AI Search Readiness (GEO) | 62/100 | 61/100 | flat | 10% |
| Images (est., see note) | 62/100 | — | new this pass | 5% |
| **Weighted Health Score** | **70/100** | **57/100** | **↑ 13** | **100%** |

**Supplementary specialist scores** (not part of the weighted Health Score formula, but core to a
full audit — see each finding file for detail):

| Category | Score | Prior | Change |
|---|---|---|---|
| Sitemap Architecture | 44/100 | 28/100 | ↑ 16 |
| SXO (search experience) | 30/100 | 40/100 | ↓ 10 |
| Local SEO | 40/100 | 45/100 | ↓ 5 |
| Backlinks | 8/100 (informational floor) | 8/100 | flat |

**Note on On-Page and Images:** this re-audit did not spawn dedicated on-page or image-optimization
specialists (no `seo-on-page`/`seo-images` subagent ran this cycle). The figures above are
synthesized from evidence gathered by the Technical, Content, Schema, and Performance passes
(clean title/meta hygiene now confirmed; homepage/category copy still very thin at 63–119 words;
one specific, fixable image-compression finding on the homepage hero). Treat these two figures as
directional, not independently audited to the same depth as the other eight — recommend a
dedicated on-page/images pass next cycle.

**Why the Health Score went up (57→70) while two specialist scores went down:** the weighted
formula rewards the technical/content/schema/performance work that genuinely improved. SXO and
Local dropped because they measure something the formula doesn't directly weight — whether a real
searcher's *core intent* ("find and evaluate a specific business") can be fulfilled at all — and
that got structurally worse (1 URL → 0 URLs), even as the code quality around it improved. Read
the Health Score as "is this a well-built site," not "is this directory doing its job for a user
today" — the SXO score (30/100) is the more honest answer to the second question.

---

## 1. The Core Finding: Zero Indexable Business Listings

This is not one bug — it's the same root cause discovered independently by five specialists.
Presenting the convergence here because no single findings file captures the full weight of it.

**What's fixed:** `lib/seo-auto/sitemaps.ts::getListingSitemapEntries()` now genuinely calls
`getIndexableListings()` → `createListingRepository().all()`, exactly the fix the 07-11 audit
recommended. `app/business/[slug]/page.tsx` is a real dynamic route with `generateMetadata()`,
per-listing `robots` gating, and conditional `LocalBusiness`/`Restaurant` JSON-LD. All 11 seed
business slugs return HTTP 200. This is substantial, correct engineering — not a redeploy artifact.

**What's still broken, and why it's worse than the original bug:** `isIndexableListing()`
(`lib/public-listings.ts`) correctly requires `dataSource` to be `owner`/`osm`/`import`/
`google_ondemand_reviewed` — not `"demo"`. Every one of the 11 seed businesses in `lib/data.ts` is
unconditionally tagged `dataSource: "demo"` at creation (`businessToListing()`), and a test
(`public-listings.test.ts`) proves this exclusion is total regardless of quality score. **Nothing
live can ever write a non-demo row**:
- `app/claim-listing` + `DashboardProvider.addListing()` — the only "add a business" UI — writes
  only to React state and `localStorage`, never calls `fetch()` or reaches the database.
- `app/super-admin/approvals` and `app/super-admin/businesses` — the moderation UI — never import
  `createListingRepository` or any real listing accessor; same client-side/mock pattern.
- `lib/acquire/osm`, `lib/acquire/csv`, `lib/acquire/crawler` — real, tested import pipelines that
  exist in the repo but are wired into zero cron jobs and zero routes (`grep -rl "lib/acquire"
  app/` returns nothing). `vercel.json` only crons blog-publish and listing-enrichment (which
  enriches existing rows, never imports new ones).

**Business impact, confirmed by fresh SERP checks (`findings/sxo.md`):** `site:nepalidirectory.com`
returns zero Google results today, while five competing Nepal directory/marketplace sites surface
instead. For "IT companies Nepal directory," "wedding planners Nepal," and similar queries, the
SERP is dominated by exactly the product type this site is — working directories and marketplaces
with real inventories (TechBehemoths, WedTayari, Bhoj Planner) — proving the page type is right and
the gap is purely inventory.

**The fix does not require touching the gate.** `isIndexableListing()` is correct and should stay
strict. It requires either (a) connecting the owner-claim flow to a real database write with a
genuinely-wired admin approval step, or (b) running the existing OSM importer against real Nepal
business data with `dataSource: "osm"`. Either path, even at small scale (20–50 real, reviewed
listings), unblocks the sitemap, the schema, the SXO personas, and the GEO citability findings
simultaneously — it is the single highest-leverage fix available anywhere in this audit.

---

## 2. Technical SEO — 91/100 (was 64/100)

All four Critical/High findings from the baseline (hardcoded admin credentials, missing host
redirect, admin URLs leaking into the sitemap, stale production deploy) are **fixed and verified
live**, not just in-repo. Security headers (CSP, X-Frame-Options, HSTS with preload,
Content-Type-Options, Referrer-Policy, Permissions-Policy) are now live site-wide. Duplicate page
titles (24 pages) are fixed via new per-page `layout.tsx` metadata. IndexNow now has an active
submission mechanism wired into the daily blog cron.

**Remaining, all Medium or lower:** CSP is Report-Only (not enforcing, and no reporting endpoint
configured to even collect violation data); `/claim-listing` H1 presence not re-verified; thin
content on ~21 pages not re-measured this pass (likely improved given large content-expansion
commits, not confirmed); a dead `app/[indexNowKey].txt` route folder remains; robots.txt lost its
explicit per-AI-bot `Allow` lines in favor of an equivalent wildcard.

Full detail: `findings/technical.md`.

## 3. Content Quality — 60/100 (was 52/100)

**The most important question for this re-audit was whether the blog's duplicate-content problem
got worse at 8x scale (12→97 posts). It did not — the fix genuinely worked.** A 43-post sample
using the site's own dedup algorithm found 0.00–0.03 pairwise similarity across every post-fix
template family, including same-topic/different-city pairs — genuinely distinct, AI-written
articles, not template swaps. However, **4 posts published 07-05/06, right before the fix landed,
remain live and still fail the site's own current 0.55 threshold against each other** (0.62–0.66
similarity) — verbatim instances of a deterministic fallback scaffold. The original ~14 baseline
posts also remain thin (160–410 real words once templated boilerplate is excluded) and haven't
been backfilled through the now-much-stronger pipeline.

New positive signals: `/authors/*` desk pages now function as real topical hubs; `/editorial-policy`,
`/directory-methodology`, and `/attribution` are good-faith trust additions; AI-content-disclosure
metadata carries through to new posts. The structural ceiling on this category remains the same one
driving the Critical finding above — the homepage (63 words) and category pages (119 words) are
thin because `getEvergreenPages()` (the code that would generate data-backed "Best X in Y" pages
from real listings) is gated behind an `includePreview` flag and returns `[]` in production.

Full detail: `findings/content.md`.

## 4. Schema / Structured Data — 61/100 (was 74/100)

The score **dropped** despite three genuine code-level fixes (`priceRange` malformed string fixed,
`geo`/`GeoCoordinates` added, `openingHoursSpecification` now maps full week data) because the
flagship schema surface — `/business/[slug]` — currently emits **zero** `LocalBusiness`/`Restaurant`
schema on any live page, for the same root cause as the Critical finding above. The improved
template has no live instance to validate. A capability regression independent of the indexability
issue: the entire menu graph (`hasMenu`/`MenuSection`/`MenuItem`/`Offer`, `servesCuisine`) that
existed in the old static template has no equivalent in the new schema builder. Separately,
`/questions/trekking-annapurna` — a genuine Q&A page — ships zero page-specific schema and should
get `QAPage` (not `FAQPage`).

Full detail: `findings/schema.md`.

## 5. Sitemap Architecture — 44/100 (was 28/100)

Hygiene and structure are now genuinely clean (sitemap index format, robots.txt alignment, zero
admin leakage, no priority/changefreq cruft, blog dedup + thin-category filtering) — that slice
alone would score in the 80s-90s. The category score is capped at 44 because the one sitemap that
matters most for a directory product — listings — has zero URLs, and the root cause is now a
missing data-supply pipeline rather than a one-line hardcoded literal, which is arguably a harder
fix. Also flagged: no chunking/pagination logic exists yet for when real listing volume exceeds
50,000 URLs — build this concurrently with the listings fix, not after.

Full detail: `findings/sitemap.md`.

## 6. Performance (Core Web Vitals) — 87/100 homepage (first real lab measurement)

Unlike the 07-11 baseline (source/header inspection only, no actual timing), this pass ran real
Lighthouse 13.4.0 mobile lab tests. Homepage LCP 2.69s (needs improvement), CLS 0.083 (good), TBT
273ms (needs improvement, used as the INP lab-proxy since INP itself requires real interaction
data). No page fails outright, but no page passes all three CWV metrics simultaneously. Top
findings: all three LCP-image templates are missing `fetchpriority="high"` (one-line `priority`
prop fix, expected 100–300ms LCP improvement); the homepage's Unsplash hero has 89% avoidable file
size; a web-font-load reflow causes the only CLS "needs improvement" result, on `/category/*`. The
baseline's ~980ms TTFB claim was re-measured and largely not reproduced (70–160ms real TTFB
measured this pass) — likely a false positive from the prior manual-timing methodology.

Full detail: `findings/performance.md`.

## 7. Visual / Mobile — 87/100 (was 68/100)

Both High/Medium findings from the baseline are fixed and confirmed both visually and in source:
the "Super Admin" nav link is gone, and the mobile nav was rebuilt as a compact horizontal-scroll
pill bar (down from a 580px stacked list). The "Rs Rs Rs" broken price display can no longer be
reproduced — that entire class of unverified fields is now correctly suppressed for non-indexed
listings. The core mobile value proposition (search bar, FIND CTA) is fully visible above the fold
with zero scrolling on a 375×812 viewport. New minor findings: mobile nav tap targets are 38px
(below the 44–48px guideline); a new site-wide floating AI-assistant button needs a spot-check for
CTA overlap on longer pages; the previously-rich listing template (badges, deals, owner profile) is
currently invisible on the one live listing, consistent with the preview-gate finding above.

Full detail: `findings/visual.md`.

## 8. AI Search Readiness (GEO) — 62/100 (was 61/100, net flat)

A genuine Critical fix (the 12-post duplicate-blog cluster is resolved at the URL level — 7
duplicates now 308-redirect to canonicals, both sitemap and `llms.txt` reflect only canonical URLs)
is offset by a new, worse citability gap: **zero AI-citable individual-business or named-comparison
pages exist sitewide.** `/business/newa-lahana` is now `noindex,nofollow`; comparison pages like
`/compare-business/beauty-salons` are `noindex` with no named providers; `/best/restaurants/kathmandu`
(live with 6 named restaurants at the last audit) now 404s. `llms.txt`'s "Business comparison
guides" and "Data-backed local answers" sections are present but completely empty. New/scaled blog
posts show materially stronger GEO structure (Quick-answer blocks, FAQPage-backed FAQ sections,
Source-and-fact-notes sections). robots.txt lost its explicit per-AI-bot directives (functionally
harmless — wildcard still covers every bot — but loses the auditable signal).

Full detail: `findings/geo.md`.

## 9. Search Experience Optimization (SXO) — 30/100 (was 40/100, regressed)

Confirms, via fresh live SERP analysis, that the site's core commercial query class ("[category]
in [city]," "IT companies Nepal directory," "wedding planners Nepal") is won by individual-listing
pages or real multi-vendor marketplaces — a page type this site is built to be but currently isn't,
inventory-wise. The weakest persona, "searcher trying to find and evaluate one specific real
business" (the core directory promise), scores 4/100. New this cycle: `findings/cluster.md` proves
the site's one working content funnel (blog ↔ city hub ↔ compare-business) is actually three
disconnected silos with zero bidirectional internal links — a pure linking fix, no new content
required. Also new: the marketing-claims-vs-moderation-gate contradiction described in the
Executive Summary.

Full detail: `findings/sxo.md`.

## 10. Local SEO — 40/100 (was 45/100)

The routing/sitemap-function half of the Critical finding is genuinely fixed (all 11 seed slugs
return 200, `getListingSitemapEntries()` reads from the real repository) — but the live outcome is
unchanged or worse: zero indexable, schema-bearing business pages, for a data-pipeline reason
rather than a code-bug reason. New finding: 4 of 6 published category verticals (hospitals, schools,
it-companies, shops) have no schema-subtype mapping and will default to generic `LocalBusiness` once
real listings populate them — fix this before the listings pipeline ships, not after. The platform's
own decision not to publish placeholder NAP for itself is confirmed appropriate, not a defect.

Full detail: `findings/local.md`.

## 11. Backlinks — 8/100 informational floor (unchanged)

Expected for a young, pre-launch directory with no active link-building yet — not a defect. Common
Crawl shows zero referring domains (re-confirmed with a forced cache-bypass fetch). One real fix
since the last audit: the homepage no longer links out to `example.com` placeholder businesses (the
same `isDemoListing()` gate that's suppressing the listings sitemap also removed these from the
homepage's featured surface). The `/attribution` page's OpenStreetMap credit links correctly carry
`rel="nofollow"`. Still zero social-profile footprint in the footer — the top recommended zero-cost
fix for this category.

Full detail: `findings/backlinks.md`.

---

## Methodology Notes

- No Google API credentials configured (`google_auth.py --check` → Tier -1) — Performance and GEO
  findings are lab-only/heuristic; no CrUX field data, GSC indexation status, or GA4 traffic data
  available. Recommend configuring free-tier Google API access before the next audit cycle.
- Backlinks analysis is Tier 0 (Common Crawl + verification crawler only) — no Moz/Bing/DataForSEO
  keys configured. Free Moz (2,500 rows/month) and Bing Webmaster keys would materially improve
  this category at zero cost.
- No DataForSEO MCP access — Local SEO and Maps intelligence are free-tier only (no GBP API data,
  no geo-grid rank tracking).
- Every specialist agent was instructed to independently re-verify carried-over findings against
  live production rather than trust the prior audit's conclusions — several findings changed
  status in non-obvious ways (e.g., the listings sitemap issue moved from "hardcoded literal" to
  "no supply pipeline," a harder problem with the same symptom) precisely because of this
  independent verification.

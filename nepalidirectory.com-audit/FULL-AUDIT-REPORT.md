# Full SEO Audit — nepalidirectory.com

**Date:** 2026-07-11 · **Scope:** https://www.nepalidirectory.com (103 pages crawled from 4 live
sitemaps, cross-referenced against the production Next.js 15 source at
`c:\Users\amrit\Downloads\NepaliDirectory page claude`) · **Overall SEO Health Score: 57 / 100**

---

## Executive Summary

Nepali Directory has strong technical bones — clean URLs, solid schema markup, good image
optimization, a genuinely well-built `llms.txt`, and an attractively designed UI (verified via
screenshots) — but the audit surfaced **three critical, code-level bugs that cap almost every
other category's real-world impact**, plus **one critical security issue that is outside SEO scope
but was found during this audit and needs immediate, independent attention.**

This is not a typical "polish an established site" audit. It is a pre-launch/mid-build product
where fixing three specific bugs will move the needle more than any amount of content or metadata
work — and that work is already substantially scoped, in some cases already coded and just not
deployed.

### Top 5 critical issues

1. **The core "business listing" page type does not exist in production.** Every "view business"
   link sitewide — homepage, `/near-me`, `/best-businesses`, every category page — points to one
   hardcoded demo page (`/business/newa-lahana`). `lib/seo-auto/sitemaps.ts::getListingSitemapEntries()`
   is hardcoded to return that single URL instead of enumerating real listings, and no
   `app/business/[slug]/page.tsx` dynamic route exists anywhere in the codebase. The homepage
   markets "50,000+ local businesses" and category counts like "12,840 listings" for Kathmandu —
   none of it is backed by indexable pages. **A real listing repository already exists and is
   fully wired for exactly this purpose** (`lib/enrich/factory.ts::createListingRepository()`) —
   the sitemap function simply never calls it. Full code-level fix in `findings/sitemap.md` §1.

2. **Hardcoded admin credentials are shipped in client-side JavaScript** (`app/login/page.tsx`:
   `superadmin`/`superadmin`, `admin`/`admin`), with `localStorage`-only session state and no
   server-side verification. `/super-admin/*` returns HTTP 200 with no server-side auth gate —
   the `noindex` tag and a trivially bypassable client check are the only things standing between
   any visitor and the full admin panel. The public mobile navigation links directly to this login
   path. This is flagged outside the normal SEO scoring but is the single most urgent fix in this
   report — **fix before `DATABASE_URL` is set and real data starts flowing in.**

3. **12 live blog posts form 5 near-duplicate content clusters** (85–90% shared text, published
   1–2 days apart), discoverable via `llms.txt` and the RSS feed but absent from the XML sitemap —
   meaning the auto-blog pipeline's "embedding dedup" is not preventing near-identical republishing,
   and Google's primary discovery path for these 12 pages doesn't exist at all.

4. **Host canonicalization relies solely on `rel=canonical`.** `nepalidirectory.com` (non-www)
   serves HTTP 200 directly instead of a 308 redirect to `www.nepalidirectory.com` — two fully
   crawlable, fully indexable copies of every page on the site exist right now.

5. **Production is running stale code.** Several of the above issues (admin pages in the public
   sitemap, incomplete robots.txt) are **already fixed in the current repo source** but the live
   site is deployed from an older commit. A redeploy alone resolves them — no new engineering
   required for that portion.

### Top 5 quick wins

1. Redeploy `origin/main` to production — resolves the admin-sitemap leakage and robots.txt gaps
   immediately, no new code needed.
2. Add a 308 host redirect (non-www → www) at the edge.
3. Add unique `metadata.title`/`description` to the 21 public static pages currently sharing the
   homepage's default title (33% of the crawled site).
4. Fix `priceRange: "Rs Rs Rs"` — a one-line bug that is both a schema defect and a visible,
   customer-facing UI bug on the one live business page.
5. Add a `headers()` security block (CSP, X-Frame-Options, X-Content-Type-Options,
   Referrer-Policy) — currently only HSTS is present.

### Business type detected

Local business directory / marketplace (Yelp-style), Nepal-focused — restaurants, hotels, home
services, healthcare, education, and more across 8 major Nepali cities.

---

## Category Scores

| Category | Weight | Score | Status |
|---|---|---|---|
| Technical SEO | 22% | **46/100** | Critical issues present (blended with sitemap deep-dive) |
| Content Quality | 23% | **52/100** | Duplicate content + thin depth |
| On-Page SEO | 20% | **58/100** | Large duplicate-title cluster |
| Schema / Structured Data | 10% | **74/100** | Strong foundation, a few real bugs |
| Performance (CWV, lab estimate) | 10% | **60/100** | No field data configured |
| AI Search Readiness (GEO) | 10% | **61/100** | Excellent llms.txt undermined by duplicate content |
| Images | 5% | **78/100** | Well-optimized, stock-photo trust gap |

**Overall SEO Health Score: 57/100**

Supplementary deep-dives (not in the weighted total, reported for completeness):

| Category | Score | Note |
|---|---|---|
| Sitemap Architecture (deep-dive) | 28/100 | Contains the audit's single most severe finding |
| Search Experience (SXO) | 40/100 | Structurally capped by the listings bug |
| Local SEO | 45/100 | City pages ~85% templated across different cities |
| Content Cluster Architecture | 32/100 | Thin blog↔category interlinking |
| Backlink Profile | 8/100 (informational floor) | Expected for a pre-launch site, not a diagnostic failure |

---

## Technical SEO

**Score: 46/100** (blended: `findings/technical.md` 64/100 holistic audit + `findings/sitemap.md`
28/100 crawlability deep-dive)

**What works:** AI-crawler-friendly robots.txt, 100% canonical-tag coverage, clean URL structure,
correct 404 handling, and — notably — the current repo source already contains fixes for two of
the issues below; they just haven't been deployed.

**Critical/High findings:**
- Core listing pages don't exist (see Executive Summary #1) — full fix plan in `findings/sitemap.md`.
- Hardcoded admin credentials in client-side code (see Executive Summary #2).
- Host canonicalization missing a hard redirect (see Executive Summary #4).
- Admin panel URLs (`/super-admin/*`, `/admin/ai`) exposed in the public sitemap, not disallowed
  in robots.txt — already fixed in repo source, pending deploy.
- Zero security headers beyond HSTS.

Full detail: `findings/technical.md`, `findings/sitemap.md`.

---

## Content Quality

**Score: 52/100**

**What works:** 14 original blog posts with consistent metadata, an author-desk attribution
system with `Organization`-typed schema, and a custom AI-content-transparency meta tag.

**Critical/High findings:**
- 12 posts form 5 near-duplicate topic clusters (see Executive Summary #3).
- Blog posts are thin (500–660 words) for competitive commercial-intent topics.
- Healthcare content is bylined to an organizational "desk," not a named individual with stated
  credentials — a real E-E-A-T gap for YMYL-adjacent content.

Full detail: `findings/content.md`.

---

## On-Page SEO

**Score: 58/100**

**What works:** sound title-template architecture, 100% meta description coverage.

**Findings:** 34 pages (33% of the crawled site) share one fallback title; 9 pages have a
duplicated brand suffix from a template-interaction bug; 55 titles exceed 60 characters; 12 pages
lack an `<h1>` (2 of them real, indexable, conversion-relevant pages: `/claim-listing`,
`/gallery`).

Full detail: `findings/on-page.md`.

---

## Schema & Structured Data

**Score: 74/100**

**What works:** `Organization`+`WebSite` on all 103 pages, well-layered contextual types
(`FAQPage`, `BreadcrumbList`, `ItemList`, `CollectionPage`), and a genuinely thorough `Restaurant`
schema on the one live listing — the template this will scale from once the listings bug is fixed.

**Findings:** malformed `priceRange` (also a visible UI bug), incomplete
`openingHoursSpecification` (4 of 7 days), missing `GeoCoordinates`.

Full detail: `findings/schema.md`.

---

## Performance (Core Web Vitals)

**Score: 60/100 (lab estimate — no PageSpeed/CrUX API configured)**

**What works:** `next/image` throughout with responsive srcset and automatic WebP delivery,
tightly-scoped remote image patterns, Brotli compression, edge caching, self-hosted preloaded
fonts.

**Findings:** inconsistent TTFB (median ~980ms, up to 1.7s on some routes) worth validating
against real field data; large HTML payloads on hub pages from verbose per-card srcset markup.

Full detail: `findings/performance.md`.

---

## AI Search Readiness (GEO)

**Score: 61/100**

**What works:** every major AI crawler explicitly allowed in robots.txt; a genuinely strong
`llms.txt` with organized, LLM-oriented descriptions; FAQ schema and clean heading structure aid
passage extraction.

**Findings:** `llms.txt` actively links to the 12 duplicate-content posts (Executive Summary #3),
undermining its own goal; individual-business AI citability capped at 1 real page.

Full detail: `findings/geo.md`.

---

## Images

**Score: 78/100**

**What works:** universal alt-text coverage, `next/image` responsive optimization, correct OG
image metadata.

**Findings:** all production imagery is stock photography (Unsplash), not real business photos —
a trust/differentiation gap once real listings launch; homepage OG image is undersized (512×512
logo vs. ideal 1200×630).

Full detail: `findings/images.md`.

---

## Supplementary Deep-Dives

### Sitemap Architecture — 28/100
Contains the audit's single most severe, most thoroughly root-caused finding (the listings bug)
plus a full code-level fix plan, discovery that the current repo source already fixes the
admin-leakage issue, and a forward-looking pagination gap. **Read this file first if you only read
one.** Full detail: `findings/sitemap.md`.

### Search Experience (SXO) — 40/100
Query-by-query analysis showing the site is structurally locked out of the highest-intent local
query class ("X near me") until the listings bug ships, but performs reasonably for
comparison/research-intent queries today. Full detail: `findings/sxo.md`.

### Local SEO — 45/100
City pages are ~85% templated/duplicate across genuinely different cities (verified: Kathmandu vs.
Dharan text diff). Full detail: `findings/local.md`.

### Content Cluster Architecture — 32/100
Assessment of hub-and-spoke interlinking maturity between blog and category/city pages, with a
prioritized list of net-new cluster topics. Full detail: `findings/cluster.md`.

### Backlink Profile — 8/100 (informational floor)
Expected, unconcerning score for a pre-launch site with no link-building activity yet — not a
diagnostic failure. Includes a forward-looking link-building strategy. Full detail:
`findings/backlinks.md`.

### Visual / Mobile
Screenshot-based review surfaced two additional findings not captured elsewhere: the "Super Admin"
link appears in the public mobile navigation (ties to the security finding above), and the
malformed `priceRange` bug is visible to real users, not just in schema. Full detail:
`findings/visual.md`.

---

## Methodology Notes

- 103 unique URLs crawled from all 4 live sitemaps (`sitemap.xml`, `sitemap-listings-1.xml`,
  `sitemap-blog.xml`, `sitemap-categories.xml`), all returning HTTP 200.
- Findings are evidence-backed: live HTTP checks, rendered-page capture, and direct inspection of
  the production Next.js source repository (not HTML-only inference) — root causes are cited to
  specific files and line numbers throughout the `findings/` directory.
- No Google PageSpeed Insights/CrUX API or Moz/Bing Webmaster API credentials were configured for
  this audit; Performance scores are lab estimates and the Backlink category uses Common Crawl
  only. Both are clearly disclosed in their respective findings files.
- DataForSEO MCP tools were not available in this environment.

# Audit Context Brief — nepalidirectory.com

Read this first. It contains ground truth already established by the orchestrator so you don't
have to re-derive it. Build on it; don't contradict it without new evidence.

## Site identity
- **Business type**: Local business directory / marketplace (Yelp-style), Nepal-focused. Lists
  restaurants, hotels, home services, healthcare, education, etc. across Nepali cities
  (Kathmandu, Pokhara, Lalitpur, Bhaktapur, Chitwan, Biratnagar, Butwal, Dharan).
- **Canonical host**: `https://www.nepalidirectory.com` (www). Non-www serves 200 directly
  (no 308 redirect to www) but carries a correct `rel=canonical` to the www version.
- **Stack**: Next.js 15 App Router + React 19 + TS, hosted on Vercel. Supabase Postgres exists
  as the intended datastore but `DATABASE_URL` is not yet set in production — the live site
  currently runs on **static/in-memory data baked into `lib/*.ts` at build time**, not the DB.
- **Deploy state**: Production is stale — newer commits on `origin/main` have not been deployed.
  Owner needs to trigger a fresh Vercel deploy and set env vars. Don't assume the live site
  reflects the latest repo code, but DO trust the live HTTP behavior as what users/crawlers see today.

## Already-confirmed CRITICAL finding — do not re-investigate, just reference it
**The core "business listing" page type effectively does not exist in production.** Every
"View business" link sitewide (homepage, `/near-me`, `/best-businesses`, category pages) points
to the exact same single hardcoded demo page: `/business/newa-lahana`. There is no
`app/business/[slug]/page.tsx` dynamic route in the codebase — only a static
`app/business/newa-lahana/page.tsx`. `lib/seo-auto/sitemaps.ts::getListingSitemapEntries()`
returns a single hardcoded entry (`routes.business = "/business/newa-lahana"`) instead of
iterating real listings. The homepage/marketing copy claims "50,000+ local businesses" and
category counts like "12,840 listings" (Kathmandu) but these are static display strings in
`lib/data.ts`, not backed by real crawlable/indexable pages. `sitemap-listings-1.xml` contains
exactly 1 URL. This is the #1 priority issue for the whole audit — treat all other findings as
secondary to it, but still do your normal full analysis of what DOES exist live.

## Sitemap inventory (already fetched, live as of this audit)
- `robots.txt`: allows `/`, disallows `/api/` and `/dashboard/` (does NOT disallow `/super-admin/`
  or `/admin/`). Lists 4 sitemaps: sitemap.xml, sitemap-listings-1.xml, sitemap-blog.xml,
  sitemap-categories.xml. Declares specific `Allow: /` blocks for Googlebot, Bingbot,
  OAI-SearchBot, ChatGPT-User, GPTBot, PerplexityBot, ClaudeBot.
- `sitemap.xml`: 104 URLs — static routes, 1 business listing, and (problematically) all
  `/super-admin/*` + `/admin/ai` URLs (10 pages, all correctly `noindex,nofollow` via meta tag,
  but should not be in a public sitemap at all — wastes crawl budget and discloses admin
  panel structure).
- `sitemap-listings-1.xml`: 1 URL only (`/business/newa-lahana`) — see critical finding above.
- `sitemap-blog.xml`: 24 URLs (14 blog posts + 10 blog category pages).
- `sitemap-categories.xml`: 26 URLs (16 `/compare-business/*` category pages + 8 `/city/*` pages
  + 1 `/best/restaurants/kathmandu` evergreen page).
- Total unique sitemap URLs crawled: 103, all HTTP 200.

## Pre-built crawl dataset (USE THIS — don't re-crawl these 103 URLs yourself)
`nepalidirectory.com-audit/crawl-data.json` — array of 103 objects, one per sitemap URL, each with:
`url, status_code, final_url, redirected, content_length_bytes, content_type, title,
title_length, meta_description, meta_description_length, canonical, robots_meta, h1_count,
h1_text, h2_count, img_count, img_missing_alt, word_count, schema_count, schema_types,
link_count, has_og_title, has_viewport, elapsed_ms`.

Known findings already extracted from it (verify/expand, don't just repeat):
- **34 pages share the identical `<title>`** "Nepali Directory | Nepal's trusted local business
  directory" (the homepage default) — includes /about, /advertise, /contact, /deals, /events,
  /find-people, /gallery, /get-app, /help, /map, /pricing, /privacy, /profile, /province, /qa,
  /qa/community, /request-callback, /restaurant-qa, /sitemap, /terms, /write-review, and all
  10 noindexed /super-admin+/admin pages. These pages never got page-specific `<title>`/meta,
  they inherit the root layout default.
- Schema.org JSON-LD coverage is actually strong: `Organization`+`WebSite` on all 103 pages;
  contextual types layered on top — `FAQPage` (34 pages), `BreadcrumbList` (33), `ItemList` (30),
  `CollectionPage` (25), `BlogPosting`/`Article` on blog posts, `Restaurant` on the one business
  page, `ProfilePage` on author pages. Validate correctness/completeness, don't assume it's zero.
- 12 pages missing `<h1>` (mostly noindexed admin pages + `/claim-listing` + `/gallery`).
- 30 pages under 200 words (mostly utility/index pages — expected for some, thin for others).
- No 4xx/5xx encountered across the 103 sitemap URLs (all 200).
- Homepage `extracted_text` and full render JSON available at
  `nepalidirectory.com-audit/homepage-render.json` (includes raw HTML, headers, is_spa=false,
  mode_used=raw i.e. server-rendered/SSG, no client-side-only content risk detected).

## Your task
Do your normal full specialist analysis using live HTTP checks + the crawl dataset + (if useful)
reading the actual Next.js source under `c:\Users\amrit\Downloads\NepaliDirectory page claude`
(you have filesystem access — the repo is right there, use it to find root causes the way the
orchestrator did for the listings-sitemap bug, e.g. grep `lib/`, `app/` for relevant logic rather
than guessing from HTML alone). Write your findings file to
`nepalidirectory.com-audit/findings/<yourname>.md` per your persistence contract, using the
severity levels Critical/High/Medium/Low/Info. Also return a concise structured summary in your
final message: category score (0-100), 3-5 top findings with severity, and 2-3 quick wins —
the orchestrator will fold this into the aggregate `audit-data.json` and final report.

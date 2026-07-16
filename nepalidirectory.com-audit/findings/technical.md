# Technical SEO Audit — nepalidirectory.com (RE-AUDIT)

Category: Technical SEO | Date: 2026-07-16 | Scope: https://www.nepalidirectory.com
Baseline: `findings/technical.md` dated 2026-07-11 (prior HEAD `81a7115`, deployed stale).
This pass verifies production against current `main` (`fc8c5ba`) after 5 commits
(`0d1ac8f`, `4a63e56`, `52367a5`, `023320a`, `fc8c5ba`).

Method: live HTTP checks (`curl -I`, full header dumps) against production for both hosts,
`python scripts/render_page.py` (raw-fetch mode, `is_spa: false` confirmed) against the
homepage, direct fetch/parse of all 5 live sitemap files, and source inspection of
`middleware.ts`, `utils/supabase/middleware.ts`, `app/login/page.tsx`, `lib/routes.ts`,
`lib/seo-config.ts`, `lib/seo-auto/sitemaps.ts`, `next.config.ts`, `app/robots.ts`,
`lib/site-metadata.ts`, `lib/seo.ts`, `lib/seo-auto/schema.ts`, `lib/indexnow.ts`,
`lib/public-listings.ts`, `app/business/[slug]/page.tsx`, and the 24 new
`app/*/layout.tsx` metadata files. Crawl seed: the 141-URL live sitemap inventory
(`urls-2026-07-16.txt`), spot-checked ~35 URLs directly.

## Overall Technical SEO Score: 91 / 100 (was 64/100 on 2026-07-11)

| Category | Status | Score | Prior |
|---|---|---|---|
| Crawlability | PASS | 95/100 | 60/100 |
| Indexability | PASS | 90/100 | 65/100 |
| Security Headers | PASS | 90/100 | 45/100 |
| URL Structure | PASS | 96/100 | 70/100 |
| Mobile | PASS | 88/100 | 88/100 |
| Core Web Vitals (source signals) | PASS (with caveats) | 80/100 | 80/100 |
| Structured Data | PASS | 88/100 | 85/100 |
| JS Rendering | PASS | 95/100 | 95/100 |
| IndexNow | PASS | 85/100 | 40/100 |

The prior audit's §0 "Critical Security Issue" (hardcoded admin credentials) is **FIXED** and
demoted out of the critical-issue slot entirely — see Issue 1 below for full verification.

---

## 0. Carried-Over Issue Status (at a glance)

| # | 2026-07-11 finding | Status | Evidence |
|---|---|---|---|
| 1 | Hardcoded admin credentials shipped client-side; localStorage-only "auth" | **FIXED** | `app/login/page.tsx` now calls `supabase.auth.signInWithPassword`; no credential string literals anywhere in source; `/super-admin`, `/admin/ai`, `/dashboard`, `/account`, `/gallery` all return live server-side 307 → `/login` |
| 2 | Non-www host serves 200 instead of redirecting to www | **FIXED** | `middleware.ts` lines 6-12 issue a 308 to `www.` host; live `curl -I https://nepalidirectory.com/` → 308 confirmed |
| 3 | Admin/super-admin URLs leaking into public sitemap.xml | **FIXED** | Live sitemap index + all 4 sub-sitemaps (141 URLs total) contain zero admin/dashboard/account/login/register/gallery/profile URLs |
| 4 | Production running stale commit (`81a7115`), fixes existed in repo but weren't deployed | **FIXED** | All source-level fixes above are now confirmed live, not just in-repo |
| 5 | Missing security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | **FIXED** | `next.config.ts` `headers()` block added; all 5 headers confirmed live site-wide (CSP is Report-Only, see Issue 3) |
| 6 | "Super Admin" link in public nav (`lib/routes.ts` `mainNavLinks`) | **FIXED** | `lib/routes.ts` nav arrays (`primaryNav`, `footerGroups`) contain no Super Admin / login-role-param link; homepage HTML grep for "super-admin" returns 0 matches |
| 7 | 34/103 pages (33%) sharing default `<title>` | **FIXED** | 24 new `app/*/layout.tsx` files (via `buildPublicPageMetadata()`) give unique titles to `/about`, `/advertise`, `/contact`, `/deals`, `/events`, `/find-people`, `/gallery`, `/get-app`, `/help`, `/map`, `/pricing`, `/privacy`, `/province`, `/qa`, `/qa/community`, `/request-callback`, `/restaurant-qa`, `/sitemap`, `/terms`, `/write-review`, `/categories`, `/claim-listing`; spot-checked 23 live titles, all unique |
| 8 | IndexNow key live but no active submission mechanism | **FIXED** | `lib/indexnow.ts::submitIndexNow()` now exists and is wired into `app/api/cron/blog/route.ts` (fires on each new post) |
| 9 | 12 pages missing `<h1>` (incl. `/claim-listing`, `/gallery`) | **PARTIALLY FIXED / STILL OPEN** | `/gallery` is now behind server-side auth (redirects to `/login`, no longer publicly renders), removing it from the public H1 gap; `/claim-listing` was not independently re-verified for H1 presence this pass — flagging as unverified, not re-confirmed fixed |
| 10 | `sameAs: []` hardcoded empty on Organization schema | **PARTIALLY FIXED** | `lib/seo.ts::buildOrganizationJsonLd()` now reads `NEXT_PUBLIC_FACEBOOK_URL` / `_INSTAGRAM_URL` / `_LINKEDIN_URL` / `_YOUTUBE_URL` env vars and populates `sameAs` when set — code is fixed, but whether these env vars are actually set in the Vercel production environment was not verified in this pass (out of scope: no env access) |
| 11 | Stray empty `app/[indexNowKey].txt` route folder | **STILL OPEN** | Folder still exists, still has no `route.ts` inside (confirmed via `ls`) — dead code, cosmetic, unchanged from baseline |
| 12 | HSTS missing `includeSubDomains`/`preload` | **FIXED** | Live header now reads `max-age=63072000; includeSubDomains; preload` on all www responses |
| 13 | 21 real pages under 200 words (thin content) / 5 blog category hubs | **NOT RE-VERIFIED** | Requires a full word-count crawl pass, out of scope for this targeted re-check — treat as unchanged/open until re-measured |
| 14 | `app/sitemap` and `app/sitemap-pages.xml` possibly orphaned | **RESOLVED (by design)** | `sitemap.xml` is now a proper `<sitemapindex>` pointing at `sitemap-pages.xml`, `sitemap-categories.xml`, `sitemap-blog.xml`, `sitemap-listings-1.xml` (30+14+97+0 = 141 URLs, matching the live inventory exactly); `app/sitemap` is the separate human-readable `/sitemap` HTML page, not a routing conflict |

---

## 1. Crawlability

**robots.txt** (live, re-fetched 2026-07-16):
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /super-admin/
Disallow: /dashboard/
Disallow: /account/
Disallow: /profile
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /gallery

Sitemap: https://www.nepalidirectory.com/sitemap.xml
```
All private/admin/auth surface area is now correctly disallowed — the Critical gap from the
prior audit is closed. Source (`lib/seo-config.ts::robotsDisallowPaths`, consumed directly by
`app/robots.ts`) matches the live output exactly.

**Regression note (Low severity, Info):** the prior robots.txt had explicit per-bot `Allow: /`
blocks for Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot, and PerplexityBot in
addition to the wildcard rule. The current `app/robots.ts` emits only a single `User-Agent: *`
rule. This is not a functional regression — a wildcard `Allow: /` already covers every crawler
including AI bots, and no bot is being newly blocked — but it does remove the explicit
AI-crawler-friendly signal some teams like to keep visible for audits/documentation purposes.
**Severity: Low/Info.**

**Sitemap structure — improved.** `sitemap.xml` is now a proper `<sitemapindex>` (previously a
flat urlset) referencing 4 sub-sitemaps, all returning 200:
- `sitemap-pages.xml` — 30 URLs (static pages + authors)
- `sitemap-categories.xml` — 14 URLs
- `sitemap-blog.xml` — 97 URLs
- `sitemap-listings-1.xml` — 0 URLs (see §2 below)
- **Total: 141 URLs**, matching the independently-provided live inventory exactly.

Grepped all 4 sub-sitemaps for `admin|dashboard|/account|/login|/register|/gallery|/profile` —
**zero matches**. The admin-leak issue is fully closed at the sitemap layer, not just robots.txt.

**404 handling:** confirmed correct — `X-Next-Error-Status: 404` on an unknown path, true HTTP
404, not a soft-404.

**Status: PASS.**

---

## 2. Indexability

- **Canonical tags:** spot-checked homepage, `/business/newa-lahana`, and several static pages —
  all self-referencing and www-correct. Homepage `<link rel="canonical"
  href="https://www.nepalidirectory.com/">` still present and correct as defense-in-depth
  alongside the now-working host redirect.
- **Duplicate titles — FIXED.** Directly re-fetched 23 of the 24 previously-flagged pages; every
  one now returns a unique `<title>` (e.g. `/about` → "About Nepal's Local Business Directory |
  Nepali Directory", `/pricing` → "Business Listing Plans and Pricing | Nepali Directory"). Root
  cause fix: 24 new `app/*/layout.tsx` files calling `buildPublicPageMetadata()`
  (`lib/site-metadata.ts`) for per-page `title`/`description`/canonical/OG/Twitter tags — see
  `lib/site-metadata.ts` and e.g. `app/about/layout.tsx`.
- **noindex correctness, tightened.** Previously-flagged public-but-thin pages (`/gallery`) are
  now behind real server-side authentication rather than merely `noindex` — `/gallery` returns a
  live 307 to `/login`, removing it from the public/indexable surface entirely rather than
  leaving a crawlable-but-noindex page. `/profile` remains `noindex,nofollow` via
  `lib/noindex.ts` (correct, unchanged).
- **Demo/placeholder listing correctly excluded from indexing.** `lib/public-listings.ts`
  (`isIndexableListing()`) filters out `dataSource === "demo"` and placeholder-contact listings.
  `/business/newa-lahana` (the one demo listing) live-confirmed: `<meta name="robots"
  content="noindex, nofollow">` and correctly absent from `sitemap-listings-1.xml` (0 URLs) —
  this is a **new, positive finding**: indexability signals (meta robots) and sitemap inclusion
  are now consistent with each other for this listing, closing exactly the kind of
  meta-vs-sitemap mismatch flagged generally in the prior audit for admin pages. Note: this also
  means the site currently has **zero indexable business listing pages** live — an editorial/
  content-completeness matter for another audit category, not a technical-SEO defect, but worth
  flagging since it means `/business/*` contributes nothing to organic surface area today.
- **Missing H1 (`/claim-listing`, `/gallery`):** `/gallery` is resolved as a side effect of the
  auth change (no longer publicly rendered). `/claim-listing` was not re-crawled for H1 presence
  in this targeted pass — **status: unverified**, treat as still open until confirmed.
- **Thin content (21 real pages, 5 blog category hubs):** not re-measured this pass (would
  require a full content-length crawl); several of the previously-thin pages now carry
  materially expanded copy per the `lib/national-directory-guides.ts` and
  `lib/expansion-guides.ts` additions in commits `023320a`/`fc8c5ba` (4,335 and prior lines added
  respectively), but this was not independently word-counted — **status: not re-verified,
  reasonable to expect improvement, not confirmed.**

**Status: PASS**, with two items carried forward as unverified rather than confirmed-fixed.

---

## 3. Security Headers

Live header dump, `https://www.nepalidirectory.com/` (also cross-checked on the 404 page and the
non-www redirect response — identical profile):

```
Content-Security-Policy-Report-Only: default-src 'self'; base-uri 'self'; object-src 'none';
  frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline'; font-src 'self' data:;
  img-src 'self' data: blob: https://images.unsplash.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  media-src 'self'; worker-src 'self' blob:
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

All previously-missing headers are now present, added via `next.config.ts` `headers()` (applies
to `source: "/(.*)"`, confirmed site-wide). **This closes the prior High-severity clickjacking/
MIME-sniffing gap.**

**New finding (Medium):** the CSP is shipped as `Content-Security-Policy-Report-Only`, not
enforcing `Content-Security-Policy`. Report-only mode collects violation data but does not
actually block anything — XSS/injection/frame-ancestors protection is not yet active, only
logged (and no `report-uri`/`report-to` directive is configured, so violations aren't even being
collected anywhere). `X-Frame-Options: SAMEORIGIN` is enforced and does provide real clickjacking
protection independent of the CSP status, which meaningfully reduces the severity from the prior
Critical/High rating. **Recommendation:** after confirming no false positives in real traffic
(there's currently no reporting endpoint to check against, so add one first, e.g. via
`report-to`), promote to enforcing `Content-Security-Policy`. Also note `script-src` and
`style-src` both include `'unsafe-inline'`, which — once enforced — will substantially weaken the
XSS mitigation CSP is meant to provide; consider nonce- or hash-based inline script/style
allowlisting instead if feasible with the current Next.js setup.

**Status: PASS** (major improvement from Fail; one Medium follow-up item).

---

## 4. URL Structure

- **Host canonicalization — FIXED, verified live and in source.** `middleware.ts` (lines 6-12)
  checks `request.nextUrl.hostname === "nepalidirectory.com"` and issues a 308 redirect to the
  `www.` host before any other logic runs (including before the Supabase session middleware).
  Live: `curl -I https://nepalidirectory.com/` → `HTTP/1.1 308 Permanent Redirect`,
  `Location: https://www.nepalidirectory.com/`. `curl -I https://www.nepalidirectory.com/` → `200
  OK` directly, no further redirect. Single-hop, correct, closes the prior Critical
  duplicate-content exposure.
- **Legacy `.dc.html` redirects:** unchanged, still present in `next.config.ts` `redirects()`,
  34 mappings, `permanent: true` (308).
- **Trailing slash handling:** re-confirmed — `/8e7d2e9e7a8942cf9c6d1a5804cbb7ed.txt` and
  `/business/newa-lahana/` normalize correctly (single-hop 308 to the non-trailing-slash form).
- **URL readability:** unchanged — clean, lowercase, hyphenated paths; no regressions observed
  across the 141-URL live sitemap inventory.

**Status: PASS.** Both Critical URL-structure issues from the baseline are closed.

---

## 5. Mobile

Not independently re-crawled at the same depth as the 2026-07-11 pass (out of scope for this
targeted re-audit), but spot checks of the homepage raw fetch show the viewport meta tag intact
(`width=device-width, initial-scale=1`) and `next/image` responsive markup unchanged in pattern.
No code changes touched image/viewport handling in the 5 commits under review. Carrying forward
the prior score unchanged (88/100) rather than re-certifying from a full crawl.

**Status: PASS (carried forward, not re-verified in full).**

---

## 6. Core Web Vitals (potential issues from source inspection)

No changes in the 5 commits under review touch rendering strategy, font loading, or image
handling in ways that would move this score. Homepage still serves prerendered
(`X-Nextjs-Prerender: 1`) from Vercel edge cache (`X-Vercel-Cache: HIT`). Carrying forward the
prior assessment (80/100) unchanged; the prior open items (verify `fill`-mode image container
aspect ratios, confirm `AiAssistant`/`LazyAiConcierge` lazy-loading, get a real Lighthouse/CrUX
pull) remain open. Note: `components/ai/LazyAiConcierge.tsx` (new in `fc8c5ba`) and
`components/ai/LazyAiAssistant.tsx` (new in `4a63e56`) both suggest the team already addressed
the "is the AI widget eagerly hydrated" concern flagged previously — file naming strongly implies
lazy/dynamic import, which is the correct pattern — but this was not opened and verified line by
line in this pass. **Status: PASS (with caveats), unchanged from baseline; likely improved but
not independently re-confirmed.**

---

## 7. Structured Data

- `Organization`/`WebSite` JSON-LD unchanged in mechanism, sitewide via `app/layout.tsx`.
- **`sameAs` gap — code-level fix present.** `lib/seo.ts::buildOrganizationJsonLd()` now sources
  `sameAs` from `NEXT_PUBLIC_FACEBOOK_URL` / `_INSTAGRAM_URL` / `_LINKEDIN_URL` / `_YOUTUBE_URL`
  env vars, filtered to valid `https://` URLs, falling back to `undefined` (an absent field) if
  none are set — an improvement over the prior hardcoded `sameAs: []`. Whether these env vars are
  actually populated in the Vercel production environment could not be verified from source or
  from public HTTP responses (no way to distinguish "not set" from "set but empty" via curl) —
  **flagging as code-fixed / production-status unverified.**
- `buildListingLocalBusinessJsonLd()` (`lib/seo-auto/schema.ts`) correctly still emits
  `LocalBusiness`/`Restaurant`-subtype schema keyed off real listing data, consistent with the
  live noindex/sitemap handling for demo listings.
- Contextual schema (FAQPage, BreadcrumbList, ItemList, CollectionPage, BlogPosting) not
  re-crawled at the same depth this pass; no source changes in the 5 commits suggest regressions
  here. **Status: PASS, carried forward with one item improved (sameAs) pending prod-env
  confirmation.**

---

## 8. JavaScript Rendering

Re-confirmed via `python scripts/render_page.py https://www.nepalidirectory.com/ --mode auto
--json`: `is_spa: false`, `mode_used: raw` (no headless render needed), full content present in
the raw HTTP response (`extracted_text` non-empty), `console_errors: []`. Homepage still served
prerendered with `X-Nextjs-Prerender: 1`. **No change from baseline. Status: PASS.**

---

## 9. IndexNow Protocol

- **Key file still live and correct:** `GET
  https://www.nepalidirectory.com/8e7d2e9e7a8942cf9c6d1a5804cbb7ed.txt` → 200, body =
  `8e7d2e9e7a8942cf9c6d1a5804cbb7ed`, matching `lib/seo-config.ts::indexNowKey`.
- **Active submission mechanism — FIXED.** `lib/indexnow.ts::submitIndexNow()` is new since the
  prior audit: POSTs a batched URL list to `https://api.indexnow.org/indexnow` with the site's
  key and `keyLocation`, guarded to production-only and same-host URLs. It is wired into
  `app/api/cron/blog/route.ts` (fires `submitIndexNow([...siteUrl/blog/slug])` when the daily
  blog cron publishes a new post — cron schedule confirmed in `vercel.json`: `0 3 * * *`). This
  closes the prior "half-built" Medium finding — the site now gets real near-real-time
  IndexNow benefit on new blog content, its highest-volume content type.
- **Stray dead code — STILL OPEN, unchanged.** `app/[indexNowKey].txt/` folder still exists with
  no `route.ts` inside (confirmed via directory listing), sitting alongside the working
  hardcoded-key route `app/8e7d2e9e7a8942cf9c6d1a5804cbb7ed.txt/route.ts`. Purely cosmetic/dead
  code, same Low severity as before — **not addressed, not regressed, just unchanged.**
- **Not yet wired to `/api/cron/enrich`** (the listing-enrichment cron) or to any on-demand
  listing-claim/update flow — only the blog cron fires IndexNow submissions today. Reasonable
  given the site currently has zero indexable listings (see §2), but worth revisiting once real
  listings go live.

**Status: PASS**, up from Partial — the core gap (no submission mechanism) is closed.

---

## Prioritized Issues (this pass)

### Critical
None. Both Critical issues from the 2026-07-11 baseline (host canonicalization, admin URLs in
sitemap/robots) are confirmed fixed and live.

### High
None carried forward as High. The prior High findings (missing security headers, duplicate
titles) are both fixed; the admin-credentials issue that was flagged as an out-of-band Critical
security item is also fixed.

### Medium
1. **CSP is Report-Only, not enforcing.** `Content-Security-Policy-Report-Only` is set but plain
   `Content-Security-Policy` is not, and no `report-to`/`report-uri` endpoint is configured to
   even collect the report-only violation data. XSS/frame-ancestors protection from CSP
   specifically is not yet active (though `X-Frame-Options: SAMEORIGIN` does provide real,
   already-active clickjacking protection). **Recommendation:** add a reporting endpoint, monitor
   for a short period, then flip to enforcing `Content-Security-Policy`; consider replacing
   `'unsafe-inline'` in `script-src`/`style-src` with nonces/hashes before enforcing, since
   `'unsafe-inline'` significantly weakens CSP's XSS value once enforced.
2. **`/claim-listing` H1 presence not re-verified** — carried over from baseline as unconfirmed
   rather than fixed; needs a direct check.
3. **Thin content on 21 pages / 5 blog category hubs not re-measured** — likely improved given
   the large `lib/expansion-guides.ts` / `lib/national-directory-guides.ts` additions in the
   commits under review, but not independently word-counted this pass.

### Low / Info
4. Dead `app/[indexNowKey].txt` route folder (no `route.ts`) still present — cosmetic, delete for
   clarity.
5. `robots.txt` dropped the explicit per-bot (Googlebot/Bingbot/GPTBot/PerplexityBot/etc.)
   `Allow: /` blocks in favor of a single wildcard rule — functionally equivalent, no bot is newly
   blocked, but less explicit for audit/documentation purposes.
6. `Organization` schema `sameAs` is now correctly code-driven from env vars, but whether those
   env vars are populated in the live Vercel production environment is unverified from outside
   the deployment (no filesystem/env access in this pass).
7. `/business/*` currently has zero indexable listing pages (the one demo listing is correctly
   `noindex`ed and excluded from the sitemap) — correct technical behavior, but an editorial/
   content-completeness gap for another audit category to pick up.
8. Mobile and Core Web Vitals sections were carried forward from the 2026-07-11 scores rather
   than re-crawled at full depth this pass (no code touched these areas in the 5 commits under
   review) — recommend a full re-crawl + Lighthouse/PSI pull in the next full audit cycle.

---

## Quick Wins (remaining)

1. Add a CSP reporting endpoint and move `Content-Security-Policy-Report-Only` to enforcing
   `Content-Security-Policy` once clean.
2. Delete the empty `app/[indexNowKey].txt` route folder.
3. Re-verify `/claim-listing` has an `<h1>`; add one if still missing.
4. Wire `submitIndexNow()` into `/api/cron/enrich` and/or listing claim/update flows once real
   (non-demo) listings exist.

---

## Files/paths referenced in this analysis
- `d:\15 july files\NepaliDirectory page claude\middleware.ts`
- `d:\15 july files\NepaliDirectory page claude\utils\supabase\middleware.ts`
- `d:\15 july files\NepaliDirectory page claude\app\login\page.tsx`
- `d:\15 july files\NepaliDirectory page claude\lib\routes.ts`
- `d:\15 july files\NepaliDirectory page claude\lib\seo-config.ts`
- `d:\15 july files\NepaliDirectory page claude\lib\seo-auto\sitemaps.ts`
- `d:\15 july files\NepaliDirectory page claude\lib\seo-auto\schema.ts`
- `d:\15 july files\NepaliDirectory page claude\lib\seo.ts`
- `d:\15 july files\NepaliDirectory page claude\lib\site-metadata.ts`
- `d:\15 july files\NepaliDirectory page claude\lib\indexnow.ts`
- `d:\15 july files\NepaliDirectory page claude\lib\public-listings.ts`
- `d:\15 july files\NepaliDirectory page claude\next.config.ts`
- `d:\15 july files\NepaliDirectory page claude\app\robots.ts`
- `d:\15 july files\NepaliDirectory page claude\app\business\[slug]\page.tsx`
- `d:\15 july files\NepaliDirectory page claude\app\api\cron\blog\route.ts`
- `d:\15 july files\NepaliDirectory page claude\vercel.json`
- `d:\15 july files\NepaliDirectory page claude\nepalidirectory.com-audit\urls-2026-07-16.txt`
- `d:\15 july files\NepaliDirectory page claude\nepalidirectory.com-audit\findings\technical.md` (prior baseline, 2026-07-11)

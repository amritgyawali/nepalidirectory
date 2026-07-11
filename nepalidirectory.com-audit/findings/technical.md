# Technical SEO Audit — nepalidirectory.com
Category: Technical SEO | Date: 2026-07-11 | Scope: https://www.nepalidirectory.com

Method: live HTTP checks (`curl -I`) against production, the pre-crawled 103-URL dataset
(`crawl-data.json`), the rendered-homepage capture (`homepage-render.json`), and direct
source-code inspection of the Next.js repo (`middleware.ts`, `next.config.ts`, `vercel.json`,
`app/robots.ts`, `lib/seo-config.ts`, `lib/seo-auto/sitemaps.ts`, `lib/seo.ts`, `app/layout.tsx`,
`lib/routes.ts`, image/font components). Builds on and does not re-derive
`nepalidirectory.com-audit/AUDIT-CONTEXT.md` ground truth (esp. the single-listing sitemap bug,
which is out of scope for this category and owned elsewhere in the audit).

## Overall Technical SEO Score: 64 / 100

| Category | Status | Score |
|---|---|---|
| Crawlability | PARTIAL FAIL | 60/100 |
| Indexability | PARTIAL FAIL | 65/100 |
| Security Headers | FAIL | 45/100 |
| URL Structure | PARTIAL FAIL | 70/100 |
| Mobile | PASS | 88/100 |
| Core Web Vitals (source signals) | PASS (with caveats) | 80/100 |
| Structured Data | PASS | 85/100 |
| JS Rendering | PASS | 95/100 |
| IndexNow | PARTIAL | 40/100 |

---

## 0. CRITICAL SECURITY ISSUE (outside normal SEO scope, flagged because it was found during this audit and needs immediate attention)

**Hardcoded default admin credentials are shipped in client-side JavaScript, and the "auth" gating
the admin panel is client-only with no server-side enforcement.**

`app/login/page.tsx` is a `"use client"` component (ships verbatim in the browser JS bundle,
readable via View Source / DevTools by anyone) containing:

```ts
if (username.trim() === "superadmin" && password === "superadmin") {
  localStorage.setItem("nd-superadmin-session", JSON.stringify({ name: "Super Admin", role: "Platform Owner", ... }));
  router.push(routes.superAdmin); // → /super-admin
}
if (username.trim() === "admin" && password === "admin") {
  localStorage.setItem(sessionKey, JSON.stringify({ name: "Admin", role: "Directory Administrator", ... }));
}
```

Both credential pairs are trivially guessable (`superadmin`/`superadmin`, `admin`/`admin`) and are
not a placeholder comment or a `.env` reference — they are literal string comparisons compiled into
the shipped bundle. Session state is then just a `localStorage` flag with no server-side session
token, no cookie, no backend verification — meaning **anyone can also just set
`localStorage.setItem("nd-superadmin-session", ...)` manually in DevTools and skip the login form
entirely**, no credentials needed at all. Combined with the earlier-confirmed finding that
`GET /super-admin` and `GET /super-admin/*` return HTTP 200 directly from the server (no
server-side redirect/auth check blocks the request before the client-side JS runs), the
`noindex,nofollow` meta tag and client-side auth check are the **only** things standing between
any site visitor and the full admin panel (`/super-admin/businesses`, `/super-admin/users`,
`/super-admin/approvals`, `/super-admin/controls`, `/super-admin/audit`, `/super-admin/settings`,
`/super-admin/ai-activity`, `/admin/ai`) — and both are trivially bypassable client-side controls,
not real security boundaries.

**Also found: the public nav links directly to this.** `lib/routes.ts` (`mainNavLinks` array,
lines 61-68) includes `{ label: "Super Admin", href: "\`${routes.login}?role=superadmin\`" }` as a
persistent nav item — confirmed rendering on every page's mobile menu (see `findings/visual.md`).
This actively points visitors at the login path for the exact role with hardcoded credentials.

**Current blast radius:** per audit context, `DATABASE_URL` is not yet set in production, so the
admin panel is currently operating on ephemeral in-memory demo data, not real business/user
records — today's actual data-exposure risk is lower than it will be the moment a real database is
connected. **This does not reduce urgency**: this must be fixed *before* `DATABASE_URL` is set and
real data flows in, not after.

**Severity: Critical — recommend fixing before any further production launch work, independent of
this audit's SEO priorities.**

**Recommendation:**
1. Remove hardcoded credential checks from client-side code entirely.
2. Implement real server-side authentication (the project already has Supabase wired up via
   `utils/supabase/` — use Supabase Auth or an equivalent server-verified session/JWT, not
   `localStorage` flags) with admin role checks enforced in `middleware.ts` or a server
   component/route handler that runs *before* any `/super-admin/*` or `/admin/*` page renders.
3. Remove the "Super Admin" link from public navigation (`lib/routes.ts`) — noted independently in
   `findings/visual.md`.
4. Rotate/remove the demo credentials from source control history if this repo or its history is
   ever made public.

---

## 1. Crawlability

**robots.txt** (live, re-fetched): allows `/`, disallows only `/api/` and `/dashboard/`; lists 4
sitemaps; declares explicit `Allow: /` blocks for Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User,
GPTBot, PerplexityBot, ClaudeBot. Good bot coverage for both classic and AI crawlers.

**Critical gap, root-caused in source — production is running stale code.** The live robots.txt
does **not** disallow `/admin/` or `/super-admin/`, and `sitemap.xml` contains all 10 admin/
super-admin URLs (confirmed live: `/admin/ai` + 8 `/super-admin/*` pages). However, the current
repo HEAD already contains the fix:

- `lib/seo-config.ts` — `robotsDisallowPaths` includes `"/admin/"` and `"/super-admin/"`, and
  `nonCrawlableRoutePrefixes` includes `/admin`, `/super-admin`, `/dashboard`, `/account`,
  `/api`.
- `app/robots.ts` consumes `robotsDisallowPaths` directly.
- `lib/seo-auto/sitemaps.ts::getStaticSitemapEntries()` filters every route through
  `isIndexableRoute()`, which excludes anything under those prefixes.
- `lib/routes.ts` confirms `superAdmin`, `superAdminBusinesses`, `superAdminUsers`,
  `superAdminReferrals`, `superAdminApprovals`, `superAdminControls`, `superAdminAudit`,
  `superAdminSettings`, `superAdminAiActivity`, and `adminAi` are all registered route constants
  — so they are exactly the routes `isIndexableRoute()` is built to strip.

Git history shows this filtering logic was added in commit `4553ccf` ("first commit" — despite
the name, it lands *after* `81a7115` in the commit graph). Per prior audit memory, **production
is deployed at `81a7115`**, i.e. before this fix landed. This means the admin-pages-in-sitemap
issue and the missing robots.txt disallow are **already fixed in code and only need a
redeploy** — no new engineering work required, just triggering a fresh Vercel production
deployment (the same stale-deploy problem already flagged for the AI/blog features in prior
audit memory).

**Severity: Critical** (until redeployed) — public disclosure of full admin panel URL structure
(`/super-admin/users`, `/super-admin/approvals`, `/super-admin/audit`, `/super-admin/controls`,
etc.) to any crawler or scraper, plus wasted crawl budget on 10 of 104 sitemap URLs (~10%).

**Recommendation:** Trigger a fresh Vercel production deployment to current `main` HEAD. After
deploy, re-verify `robots.txt` shows `Disallow: /admin/` and `Disallow: /super-admin/`, and that
`sitemap.xml` drops from 104 to 94 URLs. Do not treat this as "no code change needed" blindly —
confirm the live diff post-deploy since this file previously reported the fix as already present.

**Sitemap reachability:** all 4 declared sitemaps return 200 and are well-formed XML (verified:
`sitemap.xml` 104 URLs, `sitemap-listings-1.xml` 1 URL, `sitemap-blog.xml` 24 URLs,
`sitemap-categories.xml` 26 URLs). No sitemap index file is used — 4 flat sitemaps referenced
individually in robots.txt, which is acceptable at this scale (<50k URLs) but note `app/sitemap`
(a folder, likely a sitemap-index route) and `app/sitemap-pages.xml` exist in source but are not
referenced in the live robots.txt — worth confirming they aren't orphaned/duplicate sitemap
routes post-redeploy.

**404 handling:** confirmed correct — unknown paths return true HTTP 404 (`X-Next-Error-Status:
404`), not a soft-404. Good.

---

## 2. Indexability

- **Canonical tags:** 103/103 crawled pages have a canonical tag; 0 point to a non-www host; 0
  missing. Homepage canonical (`<link rel="canonical" href="https://www.nepalidirectory.com">`)
  correctly self-references www. This is the sole mitigation for the host-duplication issue in
  §4 — it is working as a mitigation, but is not a substitute for a hard redirect.
- **noindex correctness:** exactly 10 pages carry `noindex, nofollow` — all 10 are the
  admin/super-admin pages. Meta-tag-level noindex is correctly applied even though these pages
  are (currently) still exposed via sitemap.xml — the two mechanisms are inconsistent with each
  other, which is exactly the bug in §1.
- **Duplicate titles:** 34 of 103 pages (33%) share the exact root-layout default title
  `"Nepali Directory | Nepal's trusted local business directory"` — confirmed root cause in
  `app/layout.tsx`: this is the `metadata.title.default` fallback, and 24 non-admin pages
  (`/about`, `/advertise`, `/contact`, `/deals`, `/events`, `/find-people`, `/gallery`,
  `/get-app`, `/help`, `/map`, `/pricing`, `/privacy`, `/profile`, `/province`, `/qa`,
  `/qa/community`, `/request-callback`, `/restaurant-qa`, `/sitemap`, `/terms`, `/write-review`)
  never override it with a page-level `export const metadata`. This is a real, addressable
  indexability defect distinct from the admin-page noise. **Severity: High** — these are
  legitimate indexable marketing/utility pages competing against each other and the homepage for
  the same title string in SERPs.
- **Thin content:** 30/103 pages under 200 words. Of these, 9 are the (soon-to-be-excluded)
  admin pages and legitimately don't matter. The other 21 are real indexable pages — `/contact`,
  `/events`, `/get-app`, `/map`, `/claim-listing`, `/gallery`, `/terms`, `/write-review`,
  `/request-callback`, `/province`, `/ask-question`, `/qa/community`, `/authors/team`, and 5
  `/blog/category/*` hub pages (180-196 words each). Blog category hubs this thin, with no
  additional supporting copy beyond post excerpts, are a moderate risk for "thin content" quality
  signals if they keep growing in count. **Severity: Medium.**
- **Missing H1:** 12 pages lack an `<h1>` — 9 are admin pages (moot pending §1 fix); the other 3
  are `/claim-listing` and `/gallery` (confirmed real, indexable, in nav) plus `/admin/ai`.
  **Severity: Medium** for `/claim-listing` and `/gallery` specifically — both are
  conversion/engagement pages that would benefit from a clear on-page heading.
- **Schema/OG coverage:** 0 pages missing `og:title`; 0 pages with zero structured data present —
  see §7.

---

## 3. Security Headers

Verified via `curl -I https://www.nepalidirectory.com/` (also cross-checked on
`https://nepalidirectory.com/`, `/api/search`, and a 404 page — identical header profile
everywhere):

```
Strict-Transport-Security: max-age=63072000
```

That is the **only** security header present. Confirmed by source inspection that this is
expected: there is no `headers()` function in `next.config.ts`, no `headers` block in
`vercel.json` (which only defines two cron jobs), and `middleware.ts` only runs Supabase
session-refresh logic (`utils/supabase/middleware.ts`) — it never sets response headers. A
repo-wide grep for `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, and `Permissions-Policy` returns zero matches in application code.

**Missing:**
- `Content-Security-Policy` — no CSP at all. No mitigation against reflected XSS/script
  injection, no restriction on frame-ancestors, no protection against malicious third-party
  script injection via any future compromised dependency.
- `X-Frame-Options` (or CSP `frame-ancestors`) — site is clickjacking-vulnerable; can be embedded
  in a hostile iframe (e.g. fake "claim your listing" or "write a review" overlay phishing since
  this is a directory with claim/write-review/login flows).
- `X-Content-Type-Options: nosniff` — no protection against MIME-sniffing attacks.
- `Referrer-Policy` — browser default referrer behavior applies (varies by browser), leaking full
  URLs (including any query params) to third-party destinations on outbound link clicks.
- `Permissions-Policy` — no restriction on browser feature access (camera/mic/geolocation) for
  embedded/third-party content.
- `HSTS` is present but missing `includeSubDomains` and `preload` — worth adding given the site
  already forces HTTPS.

**Severity: High.** This is a real, exploitable gap for a site with user auth (`/login`,
`/register`, `/dashboard`, `/account`), a super-admin panel, and user-generated content flows
(`/write-review`, `/claim-listing`, `/ask-question`). While not purely an "SEO" ranking factor
today, Google has signaled security posture increasingly correlates with trust signals, and a
clickjacking/XSS incident on a directory site with business owner accounts would be reputationally
severe. Recommend prioritizing this above pure ranking-factor issues.

**Recommendation:** Add a `headers()` block to `next.config.ts` (applies at the Next.js layer,
works with the existing Vercel deployment) setting at minimum:
```
Content-Security-Policy: (start report-only, iterate to enforce)
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```
This is the natural place since `middleware.ts` is already reserved for Supabase auth and matches
almost all routes — either extend that middleware to append headers via
`response.headers.set(...)`, or use `next.config.ts` `headers()`, whichever the team standardizes
on. Given `middleware.ts`'s matcher already excludes only static assets, appending headers there
would apply site-wide with the least new surface area.

---

## 4. URL Structure

- **Host canonicalization — Critical, confirmed by source, no code path exists.** Both
  `https://www.nepalidirectory.com/` and `https://nepalidirectory.com/` return **HTTP 200** with
  byte-identical content (`Content-Length: 179860`, identical `Etag` on both). Verified this is
  not just a homepage quirk: `homepage-render.json`'s raw fetch of the non-www root shows
  `redirect_chain: []` and `status_code: 200` — no redirect occurs anywhere in the chain.
  Grepped `middleware.ts`, `utils/supabase/middleware.ts`, `next.config.ts`, and `vercel.json` —
  none contain any host-based redirect logic. `next.config.ts`'s `redirects()` function only
  covers 34 legacy `.dc.html` path migrations; it has no `has: [{ type: "host" }]` rule. The
  `Host:` directive in robots.txt (`Host: https://www.nepalidirectory.com`) is a non-standard,
  largely-ignored-by-Google hint, not an enforcement mechanism.
  **Impact:** two fully independent, fully crawlable, fully indexable copies of every single page
  on the site exist at this moment, mitigated only by `rel=canonical` (a hint Google usually but
  not always honors) rather than a definitive 308 signal. This duplicates the site's entire
  crawlable surface for any crawler that doesn't strictly respect canonicals (many AI crawlers
  and some international search engines are inconsistent here), risking split link equity,
  duplicate-content flags, and inconsistent indexing of which host appears in SERPs over time.
  **Severity: Critical.**
  **Recommendation:** Do not rely on canonical alone. Add a hard 308 redirect, implemented at the
  edge for lowest latency — either:
  1. `vercel.json` redirect rule using a `has` host condition (Vercel supports
     `"redirects": [{ "source": "/(.*)", "has": [{ "type": "host", "value": "nepalidirectory.com" }], "destination": "https://www.nepalidirectory.com/$1", "permanent": true }]`), or
  2. A host check at the top of `middleware.ts` that returns `NextResponse.redirect(...)` with
     308 before falling through to `updateSession()`.
  Vercel-level (option 1) is preferable — it avoids invoking the Node/Edge runtime (and the
  Supabase session middleware) for redirected requests entirely.
- **Legacy URL migration:** 34 `.dc.html` legacy paths redirect via `next.config.ts`
  `redirects()`; spot-checked `/Home.dc.html` → 308 → `/` in a single hop. Clean, no chains.
- **Trailing slash handling:** `/business/newa-lahana/` → 308 → `/business/newa-lahana` (Next.js
  default trailing-slash normalization). Single hop, correct.
- **URL readability:** paths are clean, lowercase, hyphenated, human-readable
  (`/compare-business/...`, `/city/kathmandu`, `/blog/annapurna-circuit-guide`). No query-string
  pollution, no session IDs, no unnecessary parameters observed across the 103-URL crawl set.
  This is a genuine strength.

---

## 5. Mobile

- **Viewport meta tag:** present and correct (`width=device-width, initial-scale=1`) on all
  103/103 crawled pages — confirmed both from crawl-data.json (`has_viewport: true` universally)
  and directly in the rendered homepage HTML.
- **Responsive images:** homepage confirmed using `next/image` throughout (`data-nimg="fill"`,
  responsive `srcSet` via `/_next/image` optimizer, `sizes` attributes tuned per breakpoint, e.g.
  `sizes="(max-width: 1040px) 50vw, 220px"`) — not raw `<img>` tags. Genuinely well-implemented.
- **PWA manifest:** `app/manifest.ts` defines a valid web manifest (`display: standalone`, theme
  color, icons) — supports "Add to Home Screen" on mobile, a minor but real mobile-UX plus.
- No horizontal-scroll risk indicators found in the fetched HTML/CSS at a structural level (no
  fixed-width containers found in the head/critical CSS inspected). Full tap-target and
  breakpoint-level layout review would require a rendered visual/DevTools mobile emulation pass,
  which is outside this source-inspection scope — flagging as **Info**, not a confirmed defect.

---

## 6. Core Web Vitals (potential issues from source inspection)

Overall the Next.js implementation shows above-average CWV hygiene for the signals visible from
source/headers:

- **Rendering strategy:** Homepage is prerendered/SSG (`X-Nextjs-Prerender: 1`) and served from
  Vercel's edge cache (`X-Vercel-Cache: HIT`, `Age: 275049`) — near-zero server compute on the
  hot path, favorable for LCP/TTFB.
- **Fonts:** Manrope loaded via `next/font/google`, which self-hosts the font (no external
  `fonts.googleapis.com` request) and is preloaded (`<link rel="preload" ... as="font"
  type="font/woff2">`) — avoids render-blocking third-party font requests and FOIT risk. Good.
- **LCP image handling:** the homepage's above-the-fold business card image uses
  `<FillImage priority />` (`components/directory/SeoLandingPage.tsx` line 76, wrapping
  `next/image` with `priority`), which correctly disables lazy-loading for that candidate LCP
  element. Below-the-fold city cards correctly use `loading="lazy"`. This is the right pattern —
  no evidence of a lazy-loaded LCP image (a common CWV anti-pattern) on the homepage.
- **Image sizing / CLS risk:** images use `fill` layout (`next/image fill` prop) rather than
  explicit `width`/`height` attributes. This is not inherently a CLS problem — `fill` requires the
  *parent* container to have a defined aspect ratio/size via CSS, which was not fully verified
  here (would need computed-style/rendered-layout inspection, out of scope for static source
  review). **Flagging as Medium/Info**: confirm in a Lighthouse/PageSpeed Insights run that
  container aspect-ratios are set correctly for all `fill`-mode images sitewide, since this
  pattern is CLS-safe only when done correctly.
- **Script payload:** homepage ships 71 `<script>` tags total (12 external chunk loads, rest are
  Next.js RSC/hydration inline data). Not unusual for a Next.js 15 App Router site with several
  client components (`AiAssistant`, header/search interactivity), but the `AiAssistant` component
  is mounted globally in `app/layout.tsx` on every page (including simple static pages like
  `/privacy`, `/terms`) — worth checking whether it's lazy/deferred (dynamic import) rather than
  eagerly hydrated everywhere, since an always-on AI chat widget is a plausible INP-risk
  contributor on lower-end mobile devices. Not independently verified in this pass — **flag for a
  follow-up Lighthouse/INP field-data check**, cannot confirm severity from source alone.
- **Page weight:** average HTML payload 74KB across 103 pages; largest are `/blog` (193KB),
  homepage (180KB), `/compare-business` (178KB), and all 6 `/city/*` pages (~145KB each). These
  are HTML-only sizes (JS/CSS/images not included) — not alarming by themselves but the `/city/*`
  pages being nearly identical in size across 6 different cities suggests heavily templated
  content, consistent with the "static demo data" finding in AUDIT-CONTEXT.
- No field data (CrUX) or synthetic Lighthouse run was available/executed in this pass — all CWV
  commentary above is source-derived risk assessment, not measured LCP/INP/CLS values. Recommend
  a live PageSpeed Insights / CrUX pull as a follow-up to convert these into measured scores.

---

## 7. Structured Data

Confirmed strong, not zero as a naive glance might suggest:

- `Organization` + `WebSite` JSON-LD injected sitewide via `app/layout.tsx`
  (`buildOrganizationJsonLd()` + `buildWebSiteJsonLd()` from `lib/seo.ts`), present on all
  103/103 crawled pages.
- `WebSite` schema includes a `SearchAction` (`potentialAction`) pointing at `/search?q=...` —
  correctly implemented for a Sitelinks Search Box.
- `Organization` schema: reasonable required fields (`name`, `url`, `logo`, `areaServed`,
  `contactPoint`) present. **Gap:** `sameAs: []` is hardcoded empty — no social profile URLs
  linked, which weakens entity disambiguation/Knowledge Panel eligibility. **Severity: Low.**
- Contextual schema layered per page type: `FAQPage` (34 pages), `BreadcrumbList` (33),
  `ItemList` (30), `CollectionPage` (25), `BlogPosting`/`Article` on blog posts, `Restaurant` on
  the one live business page, `ProfilePage` on author pages — all confirmed present via
  crawl-data.json `schema_types`, 0 pages with `schema_count: 0`.
- Did not run each JSON-LD payload through the Rich Results structural validator in this pass;
  recommend spot-validating `Restaurant` (business page) and `FAQPage` payloads through Google's
  Rich Results Test given they're the highest-value rich-result candidates. Not flagged as a
  defect, just unverified completeness — **Info**.

---

## 8. JavaScript Rendering

- **Pass.** `homepage-render.json` confirms `is_spa: false`, `mode_used: raw` (i.e., the crawler's
  raw HTTP fetch — no headless browser needed — already contained full content), `render_engine:
  null`, `render_ms: null`. All primary content (business names, prices, descriptions, nav) is
  present in the initial server response, confirmed via `extracted_text` non-empty on raw fetch.
- Consistent with `X-Nextjs-Prerender: 1` — pages are statically generated or server-rendered at
  request/build time, not client-side rendered. No JS-rendering risk for crawlers that don't
  execute JavaScript (Bingbot's render budget, some AI crawlers, etc.).
- `console_errors: []` on the homepage render capture — no client-side JS errors detected during
  the one render checked.

---

## 9. IndexNow Protocol

- **Key verification file is correctly live:** `GET
  https://www.nepalidirectory.com/8e7d2e9e7a8942cf9c6d1a5804cbb7ed.txt` → 200, body =
  `8e7d2e9e7a8942cf9c6d1a5804cbb7ed`, matching `lib/seo-config.ts::indexNowKey`. This satisfies
  the IndexNow key-hosting requirement for Bing/Yandex/Naver/Seznam.
- **No active submission mechanism found.** Repo-wide grep for `indexnow`/`IndexNow` returns only
  the key constant and the static key-file route (`app/8e7d2e9e7a8942cf9c6d1a5804cbb7ed.txt`) —
  there is no code anywhere (cron job, blog-publish hook, API route) that actually `POST`s new/
  changed URLs to `https://api.indexnow.org/indexnow` (or Bing's/Yandex's endpoints). The blog
  auto-publish cron (`/api/cron/blog`, referenced in `vercel.json`, per prior audit memory
  publishes new AI-generated posts every 6h) would be the natural place to fire an IndexNow
  submission on each new post/URL but does not currently do so.
- There is also a stray empty route folder, `app/[indexNowKey].txt` (dynamic segment, no
  `route.ts` inside) sitting alongside the working static
  `app/8e7d2e9e7a8942cf9c6d1a5804cbb7ed.txt` route — dead code, low risk, but worth deleting for
  clarity (having both a hardcoded key-file route and an empty dynamic-key route folder is
  confusing and could shadow routing behavior if a `route.ts` is later added there carelessly).
- **Severity: Medium.** The infrastructure is half-built: verification is live, but the site gets
  none of IndexNow's actual benefit (near-real-time indexing of new blog posts/pages on Bing/
  Yandex/Naver) without an active submission call. Given the site already runs a 6-hourly blog
  cron, this is a low-effort, high-leverage addition.
  **Recommendation:** Add an IndexNow POST call (batched list of new/changed URLs, using the
  existing `indexNowKey`) at the end of `/api/cron/blog` and `/api/cron/enrich`, and optionally
  on-demand when a business claims/updates a listing once real listing pages exist.

---

## Prioritized Issues

### Critical
1. **Host canonicalization gap** — `nepalidirectory.com` (non-www) serves full 200 duplicate
   content instead of a 308 redirect to `www.nepalidirectory.com`; mitigated only by
   `rel=canonical`, not enforced. No redirect logic exists anywhere in `middleware.ts`,
   `next.config.ts`, or `vercel.json`. **Fix:** add a host-based 308 redirect, preferably via
   `vercel.json` edge redirect rule (see §4 for exact config).
2. **Admin/super-admin URLs exposed in the public sitemap.xml, and not disallowed in the live
   robots.txt** — 10 of 104 sitemap URLs (`/admin/ai` + 8 `/super-admin/*` pages), all correctly
   `noindex,nofollow` at the meta-tag level but publicly listed and crawlable via sitemap.
   **Root cause confirmed:** production is running stale commit `81a7115`; the fix (route
   filtering in `lib/seo-config.ts` + `lib/seo-auto/sitemaps.ts`) already exists in current `main`
   (landed in `4553ccf` and is intact at current HEAD). **Fix:** trigger a fresh Vercel production
   deployment, then re-verify robots.txt and sitemap.xml reflect the change.

### High
3. **Missing security headers** — only `Strict-Transport-Security` is present sitewide (confirmed
   via curl and via absence of any `headers()`/CSP config in the codebase). No
   `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or
   `Permissions-Policy`. Meaningful clickjacking/XSS exposure for a site with login, dashboard,
   super-admin, and user-generated content (reviews, listing claims). **Fix:** add a headers block
   in `next.config.ts` or extend `middleware.ts`.
4. **34 pages (33% of crawled URLs) share the identical default `<title>`** inherited from
   `app/layout.tsx`'s `metadata.title.default`, because they never set page-level
   `export const metadata`. 24 of these are legitimate indexable pages (not just the 10 admin
   pages), including `/about`, `/contact`, `/pricing`, `/help`, `/privacy`, `/terms`, and more.
   **Fix:** add unique, page-specific `title`/`description` metadata exports to each.

### Medium
5. **IndexNow protocol half-implemented** — key file is live and correct, but no code anywhere
   actually submits URLs to IndexNow endpoints; the existing 6-hourly blog cron is the natural
   integration point and currently does nothing here.
6. 12 pages missing `<h1>`, including two real indexable pages (`/claim-listing`, `/gallery`),
   not just admin pages.
7. `fill`-mode `next/image` usage sitewide — CLS-safe only if parent containers have defined
   aspect ratios; not independently confirmed via rendered-layout inspection in this pass.
8. 21 real (non-admin) pages under 200 words, including 5 blog category hub pages — thin-content
   risk if left unexpanded as content volume grows.

### Low / Info
9. `Organization` JSON-LD has an empty `sameAs: []` — no social profiles linked for entity
   disambiguation.
10. Stray empty `app/[indexNowKey].txt` route folder alongside the working hardcoded key-file
    route — dead code, delete for clarity.
11. HSTS present but missing `includeSubDomains` and `preload` directives.
12. `app/sitemap` and `app/sitemap-pages.xml` exist in source but are not referenced by the live
    robots.txt — confirm these aren't orphaned/duplicate sitemap routes.
13. No measured Lighthouse/CrUX field data was pulled in this pass; CWV commentary is
    source-derived risk assessment only — recommend a live PageSpeed Insights check as a
    follow-up to convert flagged risks into measured LCP/INP/CLS numbers.

---

## Quick Wins (low effort, real impact)

1. **Redeploy to current `main` HEAD on Vercel.** This alone fixes the admin-pages-in-sitemap
   issue and adds the `/admin/`, `/super-admin/` robots.txt disallows — the code is already
   written and confirmed correct, it just isn't live. Zero new engineering required, highest
   leverage action available today.
2. **Add a host redirect (non-www → www) in `vercel.json`.** A few lines of config, closes the
   Critical duplicate-content exposure permanently and stops relying on canonical-tag-only
   mitigation.
3. **Add baseline security headers** (`X-Frame-Options`, `X-Content-Type-Options`,
   `Referrer-Policy` at minimum, CSP as a follow-up in report-only mode first) via
   `next.config.ts` `headers()` or `middleware.ts` — closes the clickjacking gap with minimal
   risk of breaking existing functionality.

---

## Files/paths referenced in this analysis
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\middleware.ts`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\utils\supabase\middleware.ts`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\next.config.ts`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\vercel.json`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\app\robots.ts`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\lib\seo-config.ts`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\lib\seo-auto\sitemaps.ts`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\lib\seo.ts`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\lib\routes.ts`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\app\layout.tsx`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\app\manifest.ts`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\app\8e7d2e9e7a8942cf9c6d1a5804cbb7ed.txt\route.ts`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\app\[indexNowKey].txt` (empty, dead code)
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\components\directory\SeoLandingPage.tsx`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\components\ui\FillImage.tsx`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\nepalidirectory.com-audit\crawl-data.json`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\nepalidirectory.com-audit\homepage-render.json`
- `C:\Users\amrit\Downloads\NepaliDirectory page claude\nepalidirectory.com-audit\robots.txt`

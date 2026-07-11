# Performance / Core Web Vitals — nepalidirectory.com

**Data source disclosure:** No Google PageSpeed Insights / CrUX API credentials were configured
for this audit (`google_auth.py --check` returned Tier -1, no credentials). Everything below is
**lab-style estimation from source/response inspection**, not measured field CWV data (LCP/INP/CLS
numbers Google actually uses for ranking). Treat this as directional, not authoritative — set up
PageSpeed/CrUX API access (free, just needs a `GOOGLE_API_KEY`) for real field measurements.

**Score: 60/100** (estimated)

## What works
- Images are served via `next/image` with responsive `srcset`, `loading="lazy"`,
  `decoding="async"`, and automatic WebP negotiation (confirmed: requesting `/_next/image` with an
  `Accept: image/webp` header returns `Content-Type: image/webp`) — this is the single biggest
  performance lever for an image-heavy directory site and it's already done correctly.
- `next.config.ts` restricts `images.remotePatterns` to `images.unsplash.com` only — tight,
  correct configuration (also a minor security hardening: prevents open image-proxy abuse via
  `next/image`).
- Responses are Brotli-compressed (`Content-Encoding: br`) and served through Vercel's edge
  (`X-Vercel-Cache: HIT` observed on the homepage, `X-Nextjs-Prerender: 1` — confirms static/ISR
  caching is active for at least some routes).
- A webfont is preloaded (`<link rel="preload" ... as="font" type="font/woff2">`) on the homepage
  — correct practice to avoid a render-blocking font-discovery round-trip.

## Findings

### Medium — TTFB is inconsistent and occasionally slow (median ~980ms, up to 1.7s on some blog posts)
**Description:** Raw HTTP response timing across all 103 sitemap URLs (this machine → Vercel,
single-threaded, not a CDN-edge-accurate benchmark, but directionally useful): median ~980ms,
worst cases 1.2–1.75s on `/`, `/blog/pokhara-travel-guide`, `/blog/kathmandu-restaurant-guide`,
`/best/restaurants/kathmandu`. For pages that should be static/ISR-cached (many carry
`X-Vercel-Cache` / `X-Nextjs-Prerender` headers), sub-200ms TTFB from cache is the expectation;
consistent near-1s+ responses suggest either cache misses during this crawl, non-trivial
server-side work happening per-request despite prerender headers, or cold starts on
less-frequently-hit routes.
**Recommendation:** Re-measure with real CrUX/PageSpeed field data once API access is configured
— this estimate alone shouldn't drive prioritization, but it's worth confirming ISR/static caching
is actually being hit consistently in production, not just declared via `export const dynamic`.

### Medium — Large HTML payloads on hub pages (up to 193KB) with no visible code-splitting signal for below-fold content
**Description:** `/blog` (192,938 bytes), homepage (179,860 bytes), `/compare-business`
(177,981 bytes), and every `/city/*` page (~145KB each) ship substantially larger HTML than the
~500-line blog posts (~70KB) despite comparable visual complexity. The `/city/*` pages in
particular are templated (same layout, different city) yet all weigh in near-identically at
~145KB — consistent with each city page embedding a full card grid (with full `next/image`
srcset markup repeated per card, which is verbose) rather than a lighter initial payload with
progressive loading.
**Recommendation:** For city/category grid pages, consider trimming the `sizes`/`srcset`
breakpoint count per card (the srcset samples up to 8 breakpoints from 384w to 3840w per image
per earlier inspection — likely excessive for small grid thumbnails) and verify whether all cards
render in the initial HTML or whether pagination/virtualization would reduce payload once real
listings scale these grids from a handful of demo cards to potentially hundreds per city.

### Low — No explicit `Cache-Control` tuning visible beyond Vercel defaults for non-prerendered routes
**Description:** Static pages show `Cache-Control: public, max-age=0, must-revalidate` (stale-
while-revalidate pattern via Vercel's default ISR handling) which is reasonable, but no custom
cache policy was found in `next.config.ts` or `vercel.json` (the latter only configures cron jobs)
to distinguish caching behavior between genuinely static content (city/category pages that change
weekly per their own `changefreq`) and anything more dynamic.
**Recommendation:** Not urgent — Vercel's Next.js defaults are reasonable — but worth an explicit
`revalidate` tuning pass once real listing data introduces more frequently-changing content
(ratings, hours) that shouldn't share the same cache window as evergreen city guides.

### Info — `next/image` `sizes` attribute uses fixed breakpoints, not measured against actual rendered card width
**Description:** Sampled `sizes="(max-width: 1040px) 50vw, 220px"` on homepage city cards — this
looks reasonable but should be verified against actual rendered card width at each breakpoint to
avoid over-fetching (a common `next/image` misconfiguration is a `sizes` value larger than the
image ever actually renders at, which defeats the responsive-loading benefit).
**Recommendation:** Spot-check with browser DevTools' Network panel at a few viewport widths once
real production traffic/devices are available to validate against.

## Quick wins
1. Set up free Google PageSpeed Insights / CrUX API access (`GOOGLE_API_KEY`) to replace this
   lab-only estimate with real field CWV data — highest-leverage fix for this category's accuracy.
2. Audit `srcset` breakpoint counts on card-grid images (city/category pages) for
   over-fetching relative to actual rendered card size.
3. Confirm ISR/static caching is consistently hit in production (check Vercel deployment
   analytics) rather than relying on header presence alone.

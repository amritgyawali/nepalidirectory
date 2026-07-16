# Performance / Core Web Vitals — nepalidirectory.com

**Re-audit date:** 2026-07-16 (prior baseline: 2026-07-11)

**Data source disclosure:** No Google PageSpeed Insights / CrUX API credentials are configured
(`google_auth.py --check` → Tier -1, all APIs `[MISSING]`), so field data (real-user CrUX, 75th
percentile) is still unavailable and `lcp_subparts.py` fails outright (`Error: Google API key not
configured`). **Unlike the 2026-07-11 baseline — which was pure source/header inspection with no
actual timing — this re-audit uses real Lighthouse 13.4.0 lab runs** (mobile, simulated
mid-tier device + throttled network, Moto G power profile) against all four target pages, giving
genuine LCP/CLS/TBT numbers for the first time. INP itself still cannot be lab-measured (it
requires a real user interaction); Total Blocking Time (TBT) is reported as the standard lab proxy
for INP risk per Lighthouse/web.dev guidance — never treat it as FID, which is fully deprecated.
Treat all numbers below as lab estimates to be cross-checked against CrUX field data once API
credentials are configured — real-world INP in particular could differ from the TBT proxy.

**Score: 87/100 (homepage, mobile, Lighthouse 13.4.0 lab)** — category 81, business 86, blog 85.
(Baseline had no comparable score; its "60/100" was a manual estimate, not a Lighthouse score, so
it is not directly comparable to these numbers.)

## Core Web Vitals summary (lab, mobile, Lighthouse 13.4.0)

| Page | LCP | Status | CLS | Status | TBT (INP proxy) | Status |
|---|---|---|---|---|---|---|
| `/` (homepage) | 2.69s | **Needs improvement** (>2.5s) | 0.083 | Good | 273ms | Needs improvement (>200ms) |
| `/category/restaurants` | 2.25s | Good | 0.110 | **Needs improvement** | 455ms | Needs improvement |
| `/business/newa-lahana` | 2.29s | Good | 0.000 | Good | 450ms | Needs improvement |
| `/blog/kathmandu-restaurant-guide` | 3.37s | **Needs improvement** | 0.000 | Good | 245ms | Needs improvement |

None of the four pages fail outright ("Poor"), but **none pass all three CWV thresholds
simultaneously** — every page trips at least one metric, and TBT (the closest lab proxy for INP)
is elevated on every page tested. Since Google evaluates the 75th percentile across all three
metrics, this pattern would likely fail the "pass all three" origin-level CWV assessment even
though each individual metric looks only moderately over threshold.

## What works (confirmed, unchanged from baseline)
- Images are served via `next/image` with responsive `srcset` and automatic WebP negotiation.
- `next.config.ts` restricts `images.remotePatterns` to `images.unsplash.com` only.
- Responses are Brotli-compressed and served through Vercel's edge.
- Webfont is preloaded on the homepage.
- **New this pass:** real (unthrottled) server response time is fast and consistent —
  `server-response-time` audit shows 70–160ms root-document TTFB across all four pages, well
  under the 800ms "good" TTFB target in `cwv-thresholds.md`. This directly informs the baseline's
  open TTFB question below.
- CLS is well-controlled on 3 of 4 pages (business and blog both measure **0.000** — perfect;
  homepage 0.083 is inside the "good" band).

## Findings

### High — LCP images across all three template types are missing `fetchpriority="high"` (NEW)
**Description:** Lighthouse's `lcp-discovery-insight` audit fails (score 0) on the homepage,
business page, and blog page. The LCP image is correctly discoverable in the initial HTML and is
not lazy-loaded (`loading="lazy"` is correctly absent) — but none of them set
`fetchpriority="high"` on the `<img>`/preload:
- Homepage: `main > section.home-hero > div.home-hero__media > img` (Unsplash hero, via
  `/_next/image?url=...images.unsplash.com...`)
- Business page: `section.business-hero > div.container > div.business-hero__photo > img`
- Blog post: `article.article-page > div.container > div.article-page__image > img`

Without `fetchpriority="high"`, the browser's preload scanner still finds the image early (good),
but it isn't bumped to the front of the fetch queue ahead of other same-priority resources
(fonts, other images, scripts), which contributes directly to `resourceLoadDelay` /
`elementRenderDelay` in the LCP breakdown. `preload_check.py` independently flags the same gap on
every page tested (`lcp_resource_hints.fetchpriority_high: 0`, `preload_lcp_candidate: false`) and
scores all four pages 50/100 for LCP-resource-hint hygiene.
**Recommendation:** Pass `priority` to `next/image` for the hero/LCP image on each template
(homepage hero, business-hero photo, blog featured image). `next/image`'s `priority` prop sets
`fetchpriority="high"` and emits a `<link rel="preload">` automatically — this is a one-line change
per template and directly targets the `elementRenderDelay` component of LCP. Expected impact:
100–300ms LCP improvement on image-led pages, likely enough to move the homepage (2.69s) and blog
post (3.37s) into or closer to the "Good" band.

### High — Homepage hero image is ~89% larger than necessary (69KB of 79.6KB wasted) (NEW)
**Description:** Lighthouse's `image-delivery-insight` audit (score 0) flags the homepage's
Unsplash hero image request
(`/_next/image?url=...unsplash.com/photo-1605640840605...&w=750&q=75`) at 79,612 bytes with an
estimated 70,966 bytes (89%) of savings available purely from better compression — Lighthouse's
own note: "Increasing the image compression factor could improve this image's download size."
This is despite `next/image` already negotiating WebP and using `q=75`. By contrast, the business
page's hero photo scores a clean 1 (no savings available) and the blog featured image only has
~5KB of headroom — so this looks specific to this one Unsplash source image/URL configuration, not
a systemic `next/image` misconfiguration.
**Recommendation:** Re-encode or re-source this specific hero image (try `q=60–65` via the
Unsplash URL's own `q` param before it reaches `next/image`, or swap to an AVIF-capable source) and
verify the resulting file size drops meaningfully without visible quality loss. Combine with the
`fetchpriority="high"` fix above — smaller file + higher fetch priority compounds directly into
`resourceLoadDuration`, the second-largest LCP subpart on this page (559ms of the 2.69s LCP).

### Medium — Total Blocking Time elevated on every page tested; INP field-data blind spot (NEW)
**Description:** TBT (Lighthouse's lab proxy for INP responsiveness) is 245–455ms on all four
pages — above the 200ms "Good" INP threshold on every one, and in the "Needs improvement" band
(200–500ms) for category (455ms) and business (450ms) specifically. `mainthread-work-breakdown`
scores 0 (worst) on homepage, category, and business, with 2.2–2.8s of total main-thread work
despite low JS "bootup time" (0.8–1.1s) — meaning most of the main-thread cost is layout/style/
rendering work, not script execution per se, which fits an image/card-grid-heavy directory UI.
Because INP cannot be lab-measured (it requires a real interaction, not a page-load trace), this
is a **blind spot without CrUX field data** — TBT is directionally useful but not a substitute for
real INP.
**Recommendation:** Not urgent enough to block on right now, but flag for the next audit once
CrUX/PageSpeed API access exists — cross-check field INP against this TBT signal. If field INP
does turn out to be a problem, the card-grid pages (category/business, both at ~450ms TBT) are the
first place to look: profile main-thread work during hydration for excessive layout/reflow from
the repeated `next/image` srcset markup called out in the baseline's payload-size finding below.

### Medium — Web-font load causes a real layout shift on category-page "Quick answer" block (NEW)
**Description:** `/category/restaurants` is the only page of the four with CLS in the "Needs
improvement" band (0.110, just over the 0.1 "Good" ceiling). Lighthouse's `cls-culprits-insight`
attributes the entire 0.110 score to one shift: `body > main > section.section` (the "Quick
answer" AI-summary block) shifting when
`/_next/static/media/4c9affa5bc8f420e-s.p.woff2` finishes loading — i.e., a FOUT-style reflow, not
missing image dimensions (homepage hero and business/blog images all show zero CLS contribution).
This contradicts the baseline's "What works" claim that the preloaded webfont avoids layout shift
— that's true on the homepage, but the same font isn't preloaded (or isn't preloaded early enough
relative to this block's render) on the category template.
**Recommendation:** Confirm the font `<link rel="preload">` present on the homepage is also
emitted on category/listing templates, or set `font-display: swap` with pre-sized fallback
metrics (e.g., `next/font`'s automatic fallback-font size adjustment) so the "Quick answer" block
doesn't reflow when the webfont swaps in. Low effort, directly fixes the one CLS regression found.

### Medium — Blog post LCP (3.37s) is the weakest of the four pages tested (NEW)
**Description:** `/blog/kathmandu-restaurant-guide` has the worst LCP of the four pages (3.37s,
"Needs improvement", closest to the 4.0s "Poor" cliff). Its `lcp-breakdown-insight` shows an
unusually large `elementRenderDelay` (713ms — 2–3x the ~220–280ms seen on homepage/business) for
the featured image (`article.article-page__image img`), on top of the same missing-
`fetchpriority="high"` issue shared with the other templates.
**Recommendation:** Apply the `priority` prop fix (see first finding) here first — it directly
targets discovery/priority, which should shrink both `resourceLoadDelay` and part of
`elementRenderDelay`. If render delay remains high after that fix, check for render-blocking work
between the image finishing download and paint (e.g., client-side hydration or a wrapping
component that defers paint) specific to the article template.

### Medium — TTFB inconsistency (baseline claim) — RE-MEASURED, largely not reproduced
**Baseline claim (2026-07-11):** "TTFB is inconsistent and occasionally slow (median ~980ms, up to
1.7s on some blog posts)" based on raw single-threaded HTTP timing from this machine.
**Re-measurement:** Lighthouse's `server-response-time` audit (actual backend TTFB, throttling
excluded) measured 70–160ms root-document response time on all four pages this pass — well inside
the 800ms "Good" TTFB target. Note: Lighthouse's own `lcp-breakdown-insight` reports a much larger
"Time to first byte" subpart (1.2–1.4s) for the *LCP resource*, but that number bundles in
Lighthouse's simulated mobile network throttling (RTT + bandwidth caps applied to reproduce a
median mobile device/connection) — it is not a real unthrottled server-latency measurement and
should not be read as "TTFB is 1.4s in production."
**Status: STILL OPEN / UNVERIFIED, but likely a false positive** — this pass's Vercel-edge-cache
TTFB looks healthy; the baseline's ~980ms median may reflect network path from this specific
machine, cold-start/cache-miss variance across the 103-URL crawl, or transient conditions rather
than a systemic issue. Recommend confirming via Vercel's own edge analytics or CrUX TTFB field
data (once API access exists) rather than further local timing.
**Recommendation:** Deprioritize unless CrUX TTFB field data (available as an LCP subpart per
`cwv-thresholds.md`) shows a real problem once API access is configured.

### Medium — Large HTML payloads on hub pages (baseline claim) — STILL OPEN, not re-verified this pass
**Description:** Baseline flagged `/blog` (193KB), homepage (180KB), `/compare-business` (178KB),
and `/city/*` (~145KB each) as carrying large HTML payloads, with a hypothesis that verbose
per-card `srcset` markup (up to 8 breakpoints, 384w–3840w) on grid pages was a contributing factor.
**Status:** Not re-measured in this pass (out of scope: this audit focused on rendered CWV timing,
not byte-for-byte payload re-inspection). The elevated TBT/mainthread-work findings above on
category/business pages are consistent with (but not proof of) the same root cause — heavy
per-card markup driving layout/style work during hydration.
**Recommendation:** Unchanged from baseline — trim `srcset` breakpoint count on grid thumbnails and
verify pagination/virtualization plans before listing volume scales up. Worth re-measuring payload
size alongside the next CWV re-audit.

### Low — Cache-Control tuning (baseline claim) — STILL OPEN, not re-verified this pass
Unchanged from baseline: no custom `Cache-Control`/`revalidate` tuning found beyond Vercel
defaults. Not re-checked this pass; low urgency, unchanged recommendation to revisit once dynamic
content (ratings/hours) is introduced.

### Info — `next/image` `sizes` attribute accuracy (baseline claim) — STILL OPEN, not re-verified this pass
Unchanged from baseline. Not re-checked this pass.

## Quick wins (prioritized by expected impact)
1. **Add `priority` to the LCP `next/image` on the homepage hero, business-hero photo, and blog
   featured-image templates.** Single highest-leverage fix identified this pass — addresses a real
   gap (`fetchpriority="high"` missing) on 3 of 4 page templates simultaneously, and is a one-line
   prop change per template.
2. **Re-compress/re-source the homepage's Unsplash hero image** — 89% file-size savings available
   per Lighthouse, specific to this one image, compounds with fix #1.
3. **Fix the font-load-driven CLS on `/category/*`** — verify the webfont preload link that exists
   on the homepage also fires (early enough) on category templates; this is the only CLS metric
   that fails the "Good" threshold across the four pages tested.
4. Once Google API credentials exist, replace this lab-only TBT proxy with real field INP data —
   TBT elevated on every page tested (245–455ms) is a real signal worth field-verifying, not
   dismissing.
5. Re-verify the baseline's HTML-payload-size and `srcset`-breakpoint findings alongside the next
   CWV pass — plausible shared root cause with this pass's mainthread-work findings on
   category/business pages, but not yet confirmed.

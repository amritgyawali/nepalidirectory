# Backlink Profile Audit — nepalidirectory.com

**Category:** Backlink Profile
**Data tier:** Tier 0 (Common Crawl + verification crawler only — no Moz/Bing/DataForSEO credentials configured)
**Date:** 2026-07-16 (RE-AUDIT — baseline: 2026-07-11)
**Site stage:** Young, newly launched local directory (per repo commit history). A minimal
backlink profile remains the **expected, confirmed** baseline this cycle too — nothing in the
data below suggests active off-site link-building has started yet.

## Category score: 8 / 100 — INFORMATIONAL FLOOR, unchanged from prior audit

At Tier 0, still only 1 of 7 standard scoring factors (referring domain count, via Common Crawl)
has any data at all — domain quality distribution, anchor text naturalness, toxic link ratio,
link velocity, follow/nofollow ratio, and geographic relevance all remain **without a data
source**. Per the confidence-weighted scoring rules this would normally mean "report
INSUFFICIENT DATA, not a numeric score." The 8/100 floor is retained unchanged from the 2026-07-11
baseline because the one fact we *can* confirm with confidence — referring-domain count is
effectively zero — has not changed. Treat this as "link authority not yet established," not
"link profile actively unhealthy."

## What changed since 2026-07-11

| # | Finding | Status |
|---|---------|--------|
| 1 | No measurable referring-domain footprint (Common Crawl) | **STILL OPEN** |
| 2 | Zero off-site footprint (no social profile links) | **STILL OPEN** |
| 3 | No known/claimed backlinks exist to verify | **STILL OPEN** (n/a, nothing to verify) |
| 4 | Tier 0 data-source ceiling (no Moz/Bing/DataForSEO) | **STILL OPEN** |
| 5 | Homepage outbound links to `example.com` placeholder businesses | **FIXED** |
| 6 | `/attribution` page outbound link-equity risk | **NEW** — checked, no risk found |

## What was checked

1. **Common Crawl domain graph** — `commoncrawl_graph.py nepalidirectory.com --json`, re-run
   with `--update` (forced cache bypass) to confirm the result wasn't stale cache noise.
2. **Known-backlink verification** — `verify_backlinks.py` requires a supplied list of known
   backlink URLs; none were provided and none were discovered via Common Crawl, so this step had
   nothing to verify (correctly skipped, not silently omitted) — same as prior audit.
3. **Homepage outbound-link re-scan** — fetched live homepage HTML via `render_page.py
   https://www.nepalidirectory.com --mode never` and searched all `href="http(s)://..."` anchors.
4. **`/attribution` page review** (new this cycle, per audit brief) — read `app/attribution/page.tsx`
   directly, since this page is the one place in the sitemap explicitly built to carry outbound
   third-party credit links (OpenStreetMap / ODbL attribution).
5. **Footer / social-footprint re-scan** — re-read `components/layout/Footer.tsx` and re-grepped
   the repo for `facebook.com`, `instagram.com`, `linkedin.com`, `twitter.com`/`x.com`,
   `youtube.com`.
6. **Demo-listing gating check** — read `lib/data.ts` and `lib/public-listings.ts` to understand
   why the homepage outbound-link count changed (see finding #5 below).
7. **Pre-delivery review** — manual checks per skill instructions (source labels, no inferences
   presented as facts, platform/HTML signals directly observed). Automated
   `validate_backlink_report.py` was not run this cycle (informational note — see Data freshness
   section); all claims below are individually source-labeled and directly observed or Tier-0
   domain-level, consistent with what that validator checks for.

## Findings

### 1. [High] No measurable referring-domain footprint (Common Crawl) — STILL OPEN
**Source: Common Crawl Web Graph, release `cc-main-2026-jan-feb-mar` (confidence: 0.50, domain-level)**

- Re-ran with `--update` (bypassing cache) to force a fresh fetch rather than trust the cached
  2026-07-10 result: **identical outcome**. `in_crawl: true`, `in_rankings: false`,
  `pagerank: null`, `harmonic_centrality: null`, `top_referring_domains: []`,
  `referring_domains_sample: 0`.
- The underlying CC release itself hasn't advanced past `cc-main-2026-jan-feb-mar` since the
  prior audit (quarterly-ish cadence), so a materially different result wasn't expected in a
  5-day window regardless of real-world link growth — this is a re-confirmation, not new
  evidence of stagnation.
- **Interpretation unchanged from baseline:** normal pre-growth state for a domain with no active
  link-building push yet, not a penalty or defect.

### 2. [High] Zero off-site footprint to anchor future citations/backlinks to — STILL OPEN
**Source: direct source inspection, `components/layout/Footer.tsx` + repo-wide grep (confidence: 0.95)**

- `Footer.tsx` still contains no social profile links — only internal `Link` components (Privacy,
  Terms, Editorial Policy, Directory Methodology, Sitemap, Data Attribution) plus internal
  category/city links. No Facebook, Instagram, LinkedIn, X/Twitter, or YouTube link block exists
  anywhere in the footer or header.
- Repo-wide grep for `facebook.com|instagram.com|linkedin.com|twitter.com|x.com|youtube.com`
  across all `.tsx/.ts/.jsx/.js` files returned exactly one hit: a YouTube Data API URL builder
  inside `lib/blog-engine/sources/fetchers.ts` (used to construct links to *source* videos the
  AI blog engine cites) — unrelated to an on-site social presence and not a footer/header link.
- No change from the 2026-07-11 finding: there is still nothing to submit to citation
  aggregators or business-association directories as supporting off-site presence.

### 3. [Medium] No known/claimed backlinks exist to verify or protect — STILL OPEN (n/a)
**Source: verify_backlinks.py workflow (confidence: n/a — step correctly skipped)**

- Same as prior cycle: no backlink list supplied, Common Crawl returned zero referring domains,
  so nothing existed to run through the verification crawler. Re-check in a future cycle once
  outreach (see strategy section, carried over unchanged from the 2026-07-11 report) starts
  landing links.

### 4. [Info] Data-source ceiling limits confidence of this whole category — STILL OPEN
**Source: `backlinks_auth.py --check --json` (confidence: n/a, meta-finding)**

- Confirmed Tier 0 again this cycle: `moz.available: false`, `bing.available: false`, no
  DataForSEO MCP tools. No DA/PA, Spam Score, anchor-text distribution, follow/nofollow ratio,
  link velocity, or geographic distribution available for any domain, not just this one.
- **Unchanged recommendation, worth repeating:** both Moz (moz.com/products/api, 2,500
  rows/month free) and Bing Webmaster Tools (bing.com/webmasters, free, and uniquely offers a
  competitor-gap comparison endpoint) have free tiers and would materially improve this category
  — DA/PA/Spam Score from Moz alone would move this report from a domain-level floor score to a
  real multi-factor score. This is a config gap, not a site defect, and remains the single
  highest-leverage improvement available to future audit cycles at zero cost.

### 5. [Medium] Homepage outbound links to `example.com` placeholder businesses — FIXED
**Source: direct HTML fetch, `render_page.py https://www.nepalidirectory.com --mode never` (confidence: 0.95, directly observed live)**

- 2026-07-11 baseline: 3 outbound `href`s on the homepage, all pointing to
  `example.com/<slug>` placeholder URLs for demo listings (`newa-lahana`, `bhojan-griha`,
  `yangling`).
- 2026-07-16 re-check: **0 external anchor `href`s** on the live homepage. The only
  `https://www.nepalidirectory.com`-referencing `href` present is the self-referential
  `<link rel="canonical">` tag, not an outbound anchor. Full page has 130 `<a>` tags total, all
  internal.
- **Why it changed:** `lib/public-listings.ts` (`isDemoListing()` / `isIndexableListing()`) and
  `lib/data.ts` (`isDemoBusiness()`) now explicitly detect and gate out listings whose `website`
  field resolves to an `example.com`/`www.example.com` hostname (or whose email ends in
  `.example`) from the indexable/public-facing listing set. This appears to have removed the
  demo businesses from the homepage's featured-listing surface specifically, closing the
  external-link-equity leak the prior audit flagged.
- **Residual note (Low, not separately scored):** `lib/data.ts` still contains 11 demo business
  records with `example.com` `website` values, and `canPreviewListing()` only requires a
  name + slug (not real data) to render a preview page — so individual demo-listing detail pages
  may still exist as directly-navigable URLs with an outbound "visit website" link to
  `example.com`, even though they're excluded from the indexable set and the homepage. This is a
  crawlability/indexation question (are these preview pages `noindex`? do they carry `nofollow`
  on the outbound link if rendered?) rather than a backlink-profile question, and is better
  verified by `/seo technical <url>` than re-investigated here.

### 6. [Info] `/attribution` page outbound link-equity check — NEW, no risk found
**Source: direct source read, `app/attribution/page.tsx` (confidence: 0.95, directly observed)**

- The audit brief specifically flagged `/attribution` (visible in the sitemap) as a page worth
  checking for link-equity risk, since attribution pages are a common place for directory sites
  to accumulate outbound links to data-source providers.
- Found exactly 2 outbound links on this page: `https://opendatacommons.org/licenses/odbl/` and
  `https://www.openstreetmap.org/copyright` (both required OpenStreetMap/ODbL attribution
  credits). **Both already carry `rel="nofollow noopener"`.**
- No outbound link to Google (the page describes on-demand Google Places API usage but does not
  link to Google), and no outbound link for the "Official & licensed records" or "Business owners
  & user submissions" sections (no external href there either).
- **Conclusion: no link-equity leak on this page.** Whoever built this page already applied the
  correct `nofollow` treatment to third-party attribution links — this is good practice, not a
  finding requiring remediation. Flagging it as checked-and-clear rather than omitting it, per
  the audit brief's request.

## Forward-looking link-building strategy (carried over unchanged)

Nothing in this cycle's data changes the recommended plan from 2026-07-11 — repeating it
unchanged since it remains the actionable core of this category:

1. **Business/tourism-board & chamber-of-commerce directory listings** — FNCCI, Nepal Tourism
   Board, city-level chambers (Kathmandu, Pokhara, Lalitpur, Bhaktapur, Chitwan, Biratnagar,
   Butwal, Dharan).
2. **Build the missing social presence first** (finding #2) — Facebook Page, Instagram, LinkedIn
   company profile, linked from the site footer — prerequisite for most citation-directory
   submissions.
3. **Encourage claimed businesses to link back** to their Nepali Directory listing from their own
   site/socials — the most sustainable long-run source at scale.
4. **Guest posts / digital PR** on Nepal travel & lifestyle blogs and local news, pitching the
   directory as a newsworthy local-relevance angle.
5. **Re-run this category** once real backlinks exist — supply them to `verify_backlinks.py` and
   track growth against this now-twice-confirmed zero baseline.

## Quick wins

1. **Create and link out to official social profiles** (Facebook, Instagram, LinkedIn) from the
   footer — still zero cost, still unblocks citation-directory submissions. *Severity: High (#2),
   unchanged.*
2. **Submit to 3-5 free, high-relevance directories** (FNCCI, Nepal Tourism Board, city chambers
   of commerce). *Severity: High (#1), unchanged.*
3. **Add a "Listed on Nepali Directory" backlink badge** to the claim-listing confirmation flow.
   *Severity: Medium (#3), unchanged.*
4. **Get a free Moz API key** (2,500 rows/month, no cost) to unlock Tier 1 for the next audit
   cycle — highest-leverage change available to this category. *Addresses (#4).*
5. **(New, Low priority)** Confirm demo-listing preview pages (the `example.com`-sourced records
   in `lib/data.ts`) are `noindex` and that any outbound "visit website" button on them carries
   `rel="nofollow"`, closing the residual gap noted in finding #5. Hand off to `/seo technical`.

## Data freshness & confidence notes

- Common Crawl: release `cc-main-2026-jan-feb-mar` (unchanged since baseline), re-fetched with
  `--update` this cycle to bypass cache and confirm freshness, confidence 0.50, domain-level only.
- Direct source/HTML inspection (Footer.tsx, attribution page source, live homepage HTML fetch):
  confidence 0.95 — directly observed, not inferred.
- Still no Moz (0.85 tier), Bing (0.70 tier), or DataForSEO (1.00 tier) data available this cycle
  — see finding #4.

## Cross-references

- Do not duplicate here: content/E-E-A-T analysis → `/seo content <url>`; crawlability/indexation
  of demo-listing preview pages (residual note in finding #5) → `/seo technical <url>`.
- This category's findings remain secondary to, and dependent on, any still-open Critical
  findings tracked in AUDIT-CONTEXT.md regarding production listing-page availability — link
  equity spent before real listing pages exist for the businesses being asked to link back is
  lower-value than spending it after.

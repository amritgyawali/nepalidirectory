# Backlink Profile Audit — nepalidirectory.com

**Category:** Backlink Profile
**Data tier:** Tier 0 (Common Crawl + verification crawler only — no Moz/Bing/DataForSEO credentials configured)
**Date:** 2026-07-11
**Site stage:** Newly built, pre-launch-quality local directory (per AUDIT-CONTEXT.md). The
core listing-page type doesn't exist in production yet, and the site has no visible marketing
push. A minimal/near-zero backlink profile is the **expected, confirmed** baseline here — this
report exists to establish that baseline and lay out a concrete initial link-building plan, not
to chase links that don't exist yet.

## Category score: 8 / 100 — INFORMATIONAL FLOOR, not a diagnostic failure score

At Tier 0 only 1 of 7 standard scoring factors (referring domain count, via Common Crawl) has
any data at all — the rest (domain quality distribution, anchor text naturalness, toxic link
ratio, link velocity, follow/nofollow ratio, geographic relevance) have **no data source**
available without Moz/Bing/DataForSEO. Per the confidence-weighted scoring rules, a factor
count this low would normally mean "report INSUFFICIENT DATA, not a numeric score." The 8/100
shown here is not a computed multi-factor score — it is a floor value reflecting the one fact we
*can* confirm with confidence: **referring-domain count is effectively zero**, which is the
single most important backlink factor (20% weight) and is verifiable even at Tier 0. Treat this
score as "link authority not yet established," not as "link profile actively unhealthy" —
those are different problems with different remediation paths, and this site is squarely in the
former category.

## What was checked

1. **Common Crawl domain graph** — `commoncrawl_graph.py nepalidirectory.com --json`
2. **Known-backlink verification** — `verify_backlinks.py` requires a supplied list of known
   backlink URLs; none were provided by the orchestrator and none were discovered via Common
   Crawl, so this step had nothing to verify (correctly skipped, not silently omitted).
3. **Outbound link / social-footprint scan** — homepage raw HTML (`homepage-render.json`) and
   the `components/` and `lib/` source directories, to assess what off-site footprint currently
   exists that future backlinks/citations could anchor to.
4. **Pre-delivery validation** — `validate_backlink_report.py` run against the collected data;
   status **PASS** (1 info-level note, already incorporated into the framing above: report
   Common-Crawl "in crawl, not in rankings" as "below ranking threshold," not "no authority").

## Findings

### 1. [High] No measurable referring-domain footprint (Common Crawl)
**Source: Common Crawl Web Graph, release cc-main-2026-jan-feb-mar (confidence: 0.50, domain-level, quarterly-ish freshness)**

- `in_crawl: true` — the domain has been seen by Common Crawl's crawler (expected once a site
  is live on the public web).
- `in_rankings: false`, `pagerank: null`, `harmonic_centrality: null` — the domain falls below
  CC's ranking threshold entirely. Per the tool's own interpretation guardrail, this means
  "too small/new to rank," **not** "penalized" or "zero authority forever" — it is the normal,
  expected state for a domain with no inbound link graph yet.
- `top_referring_domains: []`, `referring_domains_sample: 0` — CC has no referring-domain
  sample for this host at all.
- **Interpretation:** This is consistent with, and confirms, the expectation set by the audit
  brief — a newly built site with no active link-building has essentially no external link
  equity yet. This is a normal pre-growth state, not a technical defect, but it is High severity
  in the sense that domain authority is currently the binding constraint on organic visibility
  once the (separately tracked, Critical) listings-page indexability issue is fixed — rankings
  won't follow from technical SEO fixes alone without some link equity.

### 2. [High] Zero off-site footprint to anchor future citations/backlinks to
**Source: direct source/HTML inspection (confidence: 0.95 — directly observed, not inferred)**

- Grepped the entire homepage raw HTML for outbound links: only 3 external `href`s exist on the
  homepage, and all three point to `example.com/<slug>` placeholder URLs for demo business
  listings (`newa-lahana`, `bhojan-griha`, `yangling`) — not real destinations.
- Grepped `components/` and `lib/` (and the wider repo, excluding the `claude-seo` toolkit
  itself) for any social profile URL pattern (`facebook.com`, `instagram.com`, `linkedin.com`,
  `twitter.com/x.com`, `youtube.com`) — **zero matches**. There is no footer/header social link
  block anywhere in the codebase.
- **Why this matters for backlinks specifically:** the easiest, fastest, zero-cost initial
  citations for a local directory (Google Business Profile link-out, Facebook Page, Instagram
  bio link, LinkedIn company page, Nepal-focused business directories that will want to verify
  "is this a real business with a real social presence") all require the site to *have* social
  profiles to link from. Right now there is nothing to submit to citation aggregators or
  business-association directories as supporting off-site presence.

### 3. [Medium] No known/claimed backlinks exist to verify or protect
**Source: verify_backlinks.py workflow (confidence: n/a — step correctly skipped, not a false negative)**

- No backlink list was supplied by the orchestrator, and Common Crawl returned zero referring
  domains, so there was nothing to run through the verification crawler this cycle. This isn't
  a failure of the check — it's additional confirmation of finding #1 (no inbound links exist
  yet). Re-run this check in future audit cycles once outreach (see Quick Wins) starts landing
  links, to confirm they stay live/dofollow over time.

### 4. [Info] Data-source ceiling limits confidence of this whole category
**Source: backlinks_auth.py --check (confidence: n/a, meta-finding)**

- Tier 0 only: no `MOZ_API_KEY`, no `BING_WEBMASTER_API_KEY`, no DataForSEO MCP tools
  configured. This means: no Domain Authority/Page Authority, no Spam Score, no anchor-text
  distribution, no follow/nofollow ratio, no link velocity, no geographic distribution — for
  *any* domain, not just this one. Everything reported above is domain-level (Common Crawl) or
  directly observed (source inspection), never page-level backlink lists.
- This is a tooling/config gap, not a site defect. If deeper backlink-quality benchmarking is
  wanted later (e.g. once real links start accumulating), get a free Moz API key
  (moz.com/products/api, 2,500 rows/month free tier) — that alone would unlock Tier 1
  (DA/PA/Spam Score/referring domains/anchor text/top pages) at no cost.

## Forward-looking link-building strategy (the actionable core of this report)

Because there is effectively nothing to "fix" in an existing backlink profile, the highest-value
output here is a concrete initial-link-acquisition plan suited to a Nepal-focused local business
directory at this stage:

1. **Business/tourism-board & chamber-of-commerce directory listings** — submit
   nepalidirectory.com to the Federation of Nepalese Chambers of Commerce & Industry (FNCCI),
   Nepal Tourism Board, and city-level chambers of commerce (Kathmandu, Pokhara, Lalitpur,
   Bhaktapur, Chitwan, Biratnagar, Butwal, Dharan — matching the site's own city coverage).
   These are typically easy, relevant, and durable dofollow or citation-value links for a
   directory business.
2. **Reciprocal footer/social presence build-out first** — before outreach, create the missing
   Facebook Page, Instagram, and LinkedIn company profiles (finding #2) and link them from the
   site footer/header. These aren't classic "backlinks" but they're the prerequisite off-site
   footprint most business-association directories and journalists will check before linking in.
3. **Encourage claimed businesses to link back** — every business that claims/verifies its
   listing should be prompted (in the claim-listing flow and in a post-claim email) to add
   "Find us on Nepali Directory" to their own website and social bios. At scale this is the
   single most sustainable, on-topic, naturally-growing backlink source for a directory site,
   and it compounds as more businesses onboard.
4. **Guest posts / digital PR on Nepal travel & lifestyle blogs** — pitch a small set of
   Nepal-focused travel/lifestyle/expat blogs and local news outlets with the "AI-powered local
   business directory for Nepal" angle as a newsworthy hook (novelty + local relevance), aiming
   for contextual dofollow links from within article bodies rather than directory listings.
5. **Re-run this audit category after outreach lands** — once even a handful of real backlinks
   exist, supply them to `verify_backlinks.py` and re-check Common Crawl in a future crawl
   release to start tracking actual growth instead of a zero baseline.

## Quick wins

1. **Create and link out to official social profiles** (Facebook, Instagram, LinkedIn at
   minimum) from the site footer — zero cost, unblocks citation-directory submissions, and is
   the fastest way to move off a literal zero off-site footprint. *Severity addressed: High
   (#2).*
2. **Submit to 3-5 free, high-relevance directories this week**: FNCCI, Nepal Tourism Board
   partner listings, and one general-purpose local chamber-of-commerce directory per major city
   covered. Low effort, directly improves referring-domain count (the single highest-weighted
   backlink factor). *Severity addressed: High (#1).*
3. **Add a "Powered by / Listed on Nepali Directory" backlink badge/snippet** to the
   claim-listing confirmation flow so newly claimed businesses can copy-paste it onto their own
   site — turns every future business onboarding into a potential backlink opportunity at
   near-zero marginal cost. *Severity addressed: Medium (#3), sets up future growth.*

## Data freshness & confidence notes

- Common Crawl: quarterly-ish release cadence (this run used `cc-main-2026-jan-feb-mar`),
  confidence 0.50, domain-level only (no page-level backlink list available at Tier 0).
- Direct source/HTML inspection: confidence 0.95 (directly observed in repo and rendered HTML,
  not inferred).
- No Moz (confidence 0.85 tier), Bing (confidence 0.70 tier), or DataForSEO (confidence 1.00
  tier) data available this cycle — see finding #4.

## Cross-references

- Do not duplicate here: content/E-E-A-T analysis → `/seo content <url>`; crawlability/technical
  → `/seo technical <url>`.
- This category's findings are secondary to, and dependent on, the already-confirmed Critical
  finding in AUDIT-CONTEXT.md (business listing pages don't exist in production / single hardcoded
  demo page). Link-building effort spent before that's fixed risks sending new authority to a
  site that can't yet serve real listing pages to the businesses being asked to link back.

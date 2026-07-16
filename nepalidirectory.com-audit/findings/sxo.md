# SXO (Search Experience Optimization) — nepalidirectory.com

**SXO Gap Score: 30/100** (was 40/100 on 2026-07-11 — net regression)

Re-audit date: 2026-07-16. Method: SERP-backwards analysis for representative Nepali local-search
intents this site should compete for, judged against what the site can actually serve today, plus
direct verification of the live `/business/newa-lahana` demo listing and the live
`sitemap-listings-1.xml`. This score is separate from the SEO Health Score — it measures whether
the search *experience* (page type, journey completion, trust) matches what searchers and Google
reward, not on-page technical hygiene.

## What changed since 2026-07-11 (headline finding)

The single most important fact for this re-audit: **`sitemap-listings-1.xml` went from 1 URL to 0
URLs**, and the live `/business/newa-lahana` page — the one demo listing every "View business" CTA
sitewide points to — now renders an explicit banner:

> "Preview profile. This record is available for product review but is excluded from search
> indexing, sitemaps and business ranking schema until its source and public details pass review."

This resolves the open question flagged for this re-audit (bug vs. intentional moderation gate):
**it is an intentional moderation gate**, not a rendering bug — the code now deliberately excludes
any listing that hasn't passed a review step, and as of today zero listings (including the one
demo record) have passed it. That is a partial *positive* finding (the site no longer silently
indexes an unapproved/demo record as if it were real — see `findings/sitemap.md` §1 for the
code-level root cause of the sitemap function itself) but a *structural negative* for SXO: the
directory's indexable listing inventory is now verifiably **zero**, not one. From a
search-experience standpoint this is unambiguous — a directory with zero indexable individual
business pages cannot fulfill the implicit user story "find and evaluate a specific business," no
matter how good the homepage, city hubs, or comparison content are. Every persona score below is
capped by this fact.

## Status of carried-over findings (2026-07-11 → 2026-07-16)

| Finding | Status | Evidence |
|---|---|---|
| Zero real indexable listings caps the site out of local-pack/near-me query class | **REGRESSED** | Sitemap went 1 URL → 0 URLs; the one demo listing now shows an explicit "excluded from search indexing" preview-gate banner live |
| `/compare-business/*` + `/blog/*` combo reasonably serves research-stage comparison queries | **STILL OPEN, downgraded** | Content still exists and still topically matches (verified live SERP for "dental clinic Kathmandu," "wedding planners Nepal"), but `findings/cluster.md` (new this audit) proves zero bidirectional links exist between any blog post and its matching `/city/[slug]` or `/compare-business/[slug]` hub — the one bright spot from the baseline audit is now confirmed to be three disconnected silos, not a working funnel |
| `/claim-listing` has no H1, thin content (133 words), undersells the product | **STILL OPEN** | Confirmed via `crawl-data.json` (h1_count: 0, word_count: 133); not independently re-rendered live this session — see Limitations |
| City pages ~85% templated across genuinely different cities | **STILL OPEN** | Restated from `findings/local.md`, not re-verified this session but no code change evidence found |
| Neighborhood-level pages (Thamel, Boudha) don't exist | **STILL OPEN** | No `/city/thamel` or similar route found in the 141-URL inventory |
| Moderation-gate banner contradicts homepage marketing claims | **NEW** | The banner text confirms the "50,000+ local businesses" / "12,840 listings" homepage marketing claims (`app/page.tsx`) are now demonstrably contradicted by the site's own review-gate messaging on the one listing a real visitor can reach — a trust-signal problem, not just a discovery-gap problem |
| Real Nepal directory/marketplace competitors validate the page type | **NEW** | Fresh SERP checks (below) show competing Nepal business-directory/marketplace sites (WedTayari, Bhoj Planner, directoryofnepal.com, inquirynepal.com, nepalyp.com, pudirectory.com, bizdirenepal.com) *do* rank for generic Nepal-directory and vendor-comparison queries — proving the page type this site is built to be is exactly what wins in this vertical; the gap is inventory, not category viability |

## Query-by-query page-type-mismatch analysis (fresh SERP pulls, 2026-07-16)

| Query | What Google rewards | What nepalidirectory.com can serve today | Gap |
|---|---|---|---|
| "restaurants in Kathmandu" | TripAdvisor, independent food-blog listicles ("5 Best Restaurants," "Top Ten Restaurants"), one dedicated multi-restaurant guide (thebagaicha.com, 17 restaurants + 6 bars) — all individual-venue-level detail | `/city/kathmandu` (generic 510-word hub) or the single demo listing, now preview-gated and excluded from search | Severe — unchanged from baseline, worse in practice since the one demo page is now explicitly non-indexed |
| "best hotels Nepal" | TripAdvisor, Expedia, luxury-travel curators, Hotel Association Nepal — individual property profiles with pricing/booking | Nothing — no `/compare-business/hotels` content found live-linked to a hotel-specific SERP-competitive page; `lib/data.ts` seed includes `lakefront-inn-pokhara` but it has no live route | Severe |
| "IT companies Nepal directory" | TechBehemoths (258 companies), Nepal IT Hunt (1,000+ verified companies), GoodFirms, GitHub community list — every result is itself a *working directory/listicle with real company inventories* | `/category/it-companies` exists as a route but has zero real listings beneath it — same page type Google rewards here, zero content to fill it | Critical — this is the cleanest evidence that the site's core page type is right and its inventory is the entire problem |
| "dental clinic Kathmandu" | Individual clinic sites (DentaLife, Dent Inn, Kathmandu Dental Home, Studio Dentale) — no aggregator/directory ranks in top 10 for this exact query | `/compare-business/dental-clinics` + `/blog/kathmandu-dental-clinic-guide` — reasonable comparison-intent coverage, but per `cluster.md` these two pages don't link to each other | Partial — good research-stage coverage, undermined by broken internal journey between the two pages that should form a funnel |
| "plumber Lalitpur" | Local service-provider sites and Nepal-specific service aggregators (Plumber Dai, Technical Sewa, A2Z Marmat, ServiceOrca — itself a city-filterable directory) — high commercial urgency, "near me"/booking-ready intent | `/compare-business/plumbers` (Kathmandu-focused, not Lalitpur-scoped) | Moderate-severe — unchanged from baseline |
| "wedding planners Nepal" | WedTayari and Bhoj Planner — both real, live Nepal wedding **marketplaces** with multi-vendor listings and reviews — plus individual planner sites (Aakar Events, Gajur, SANJ) | `/compare-business/wedding-planners` + `/blog/nepal-wedding-planning-checklist` — topically matched but with zero real vendor listings underneath; WedTayari/Bhoj Planner are the direct proof that this exact product (Nepal vendor marketplace) works when populated | Good topical fit, Critical inventory gap — the SERP literally contains the site's intended business model, executed by competitors, with real data |
| `site:nepalidirectory.com` | N/A — control query to check own-domain indexation | Google returned **zero nepalidirectory.com results**; instead surfaced five competing Nepal directory sites (directoryofnepal.com, inquirynepal.com, pudirectory.com, bizdirenepal.com, nepalyp.com) | Critical — independent confirmation that the domain currently has negligible-to-no meaningful search visibility for its own core content type |

## User stories (derived from the SERP signals above)

1. **As a diner searching "restaurants in Kathmandu"** (awareness/decision), I want a specific
   restaurant with photos, menu, and reviews, because I'm choosing where to eat tonight, but I'm
   blocked by **zero indexable listing pages** — every "View business" link sitewide resolves to
   one demo record that itself now displays "excluded from search indexing." *(Source: TripAdvisor/
   Bagaichā/food-blog dominance in the live SERP; `sitemap-listings-1.xml` = 0 URLs;
   `/business/newa-lahana` preview-gate banner)*

2. **As someone comparing dental clinics before booking** (consideration), I want pricing/
   credentials to narrow candidates, because appointments cost time and clinic quality varies, but
   I'm blocked because `/compare-business/dental-clinics` and `/blog/kathmandu-dental-clinic-guide`
   — the two pages that together would answer this — **never link to each other**, so I land on one
   and never discover the other exists. *(Source: SERP shows individual clinic sites, no
   aggregator competitor; `findings/cluster.md` confirms zero bidirectional links between these
   pages)*

3. **As a bride/groom-to-be searching "wedding planners Nepal"** (consideration/decision), I want
   to compare multiple vetted planners side by side with real reviews — exactly what WedTayari and
   Bhoj Planner (both real Nepal wedding marketplaces) provide and rank for — but
   nepalidirectory.com's `/compare-business/wedding-planners` has no real vendor data beneath it,
   only a generic checklist blog post. *(Source: SERP dominated by WedTayari, Bhoj Planner, Aakar
   Events — the site's own intended business model, executed by competitors)*

4. **As a prospective business owner evaluating whether to claim a listing** (decision), I want
   proof the directory has real visibility/traffic before I invest time or money, but I'm blocked
   by two compounding signals: the one example listing I can view shows a "Preview profile...
   excluded from search indexing" disclaimer, and `/claim-listing` itself has no H1 and only 133
   words of copy. *(Source: live `/business/newa-lahana` banner text; `crawl-data.json` h1_count=0,
   word_count=133 for `/claim-listing`)*

5. **As a searcher relying on Google/AI Overview synthesis for "IT companies Nepal directory"**
   (awareness), I want a directory citing many real, differentiated companies, because I'm
   comparing vendors for a project, but nepalidirectory.com has nothing for Google or an AI crawler
   to cite — confirmed by `site:nepalidirectory.com` returning zero results while five competing
   Nepal directories surface instead. *(Source: TechBehemoths/Nepal IT Hunt/GoodFirms all being
   *working* directories with real inventories; `site:nepalidirectory.com` WebSearch control query)*

Journey stages covered: awareness (stories 1, 5), consideration (stories 2, 3), decision (stories
3, 4).

## Persona scoring

Scored per `skills/seo-sxo/references/persona-scoring.md` (4 dimensions × 25 pts). The zero-listing
inventory (weighted heavily per this audit's brief) suppresses every persona's Relevance, Trust,
and Action scores, not just the ones directly about finding a business.

| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Diner/tourist searching "[category] near me / in [city]" | 8/25 | 4/25 | 3/25 | 3/25 | **18/100** | Critical Mismatch |
| Local resident comparing service providers before booking (dental, plumbers, wedding) | 18/25 | 12/25 | 8/25 | 6/25 | **44/100** | Needs Work |
| Business owner evaluating claim-listing/advertise | 16/25 | 8/25 | 5/25 | 8/25 | **37/100** | Critical Mismatch |
| Searcher trying to find and evaluate one specific real business (the core directory promise) | 0/25 | 0/25 | 2/25 | 2/25 | **4/100** | Critical Mismatch |

**Weakest persona: "Searcher trying to find and evaluate one specific real business" (4/100).**
**Top issue:** Zero listings pass the moderation gate; the entire "individual business page" page
type is functionally absent from the live site, both structurally (no `/business/[slug]` dynamic
route — see `findings/sitemap.md` §1) and now explicitly by policy (the one demo record is
labeled "excluded from search indexing" pending review).
**Recommended fix:** No SXO-specific fix exists independent of the audit-wide Critical finding —
approve/seed real listings through the review pipeline and ship the dynamic `/business/[slug]`
route (`lib/enrich/factory.ts::createListingRepository()` is already wired for this per
`findings/sitemap.md`). Until at least a handful of real listings pass review and appear in
`sitemap-listings-1.xml`, this persona's score cannot move.

**Second-weakest: Business owner evaluating claim-listing (37/100).** The preview-gate banner on
the one visible example listing directly undercuts the sales pitch at the exact moment a
prospective customer is evaluating the product — compounded by `/claim-listing` having no H1.
**Recommended fix:** Either exclude the preview-gate banner from the *one* listing used as the
public demo/example (if it's meant to showcase the finished product), or replace it with a
purpose-built "what your listing will look like" example page that doesn't carry real-listing
moderation UI; separately, add an H1 and substantive copy to `/claim-listing`.

**Systemic issue across all four personas: Trust.** Every persona's Trust score is suppressed by
the same root cause — homepage/category marketing copy claiming "50,000+ local businesses" and
per-city counts like "12,840 listings" (Kathmandu) sits directly alongside a verifiably empty
listings sitemap and a demo listing that says, in the user's own words, it isn't indexed yet. This
is a more acute trust problem than the baseline audit could document, because the moderation-gate
banner text is new, user-visible evidence of the gap in the site's own language.

### Priority actions (weakest persona first)
1. Get real listings through the moderation/review pipeline and ship `app/business/[slug]/page.tsx`
   — the only action that moves the weakest persona (4/100) off Critical Mismatch.
2. Fix the claim-listing sales-pitch contradiction (banner + thin `/claim-listing` copy) — second
   weakest persona, and the one most within reach without waiting on listing volume.
3. Wire the blog↔hub internal links (systemic Clarity/Action fix for the "local resident
   comparing providers" persona, the site's best-scoring persona today).

## Page-type mismatch severity: **CRITICAL** (unchanged from baseline, evidence strengthened)

SERP dominant type for the site's core commercial query class ("[category] in [city]," "[category]
near me," "best [category] in [city]") is **Local Page / individual listing** (per
`page-type-taxonomy.md` — physical address, map, NAP, reviews) or, where a directory itself ranks
(IT companies, wedding planners), a **working directory/marketplace page with real inventory**.
nepalidirectory.com serves neither today: city/category hubs are **Comparison-adjacent Hub pages**
with zero individual listings beneath them, and the one page that would be a true Local Page
(`/business/newa-lahana`) is explicitly excluded from indexing. This is the textbook "Blog Post /
Hub Page targeting Local-Page-intent query" mismatch the taxonomy rates CRITICAL.

## Findings

### Critical — Zero indexable individual listing pages (regressed from 1 to 0 since 2026-07-11)
**Description:** See headline finding above. Restated for the record: `sitemap-listings-1.xml` is
now an empty `<urlset>`; `/business/newa-lahana` (the sole possible listing page) renders "Preview
profile... excluded from search indexing, sitemaps and business ranking schema until its source
and public details pass review." Root cause and fix are already fully specified in
`findings/sitemap.md` §1 (wire `getListingSitemapEntries()` to `createListingRepository()`, ship
`app/business/[slug]/page.tsx`) — the SXO-specific addition here is that this is no longer just a
missing-inventory problem, it's now a user-visible trust problem, since real visitors who reach the
one example listing are told explicitly it isn't indexed.
**Recommendation:** Unchanged from baseline — this is the single highest-leverage fix for every
SXO persona score above. Additionally: get at least a handful of real listings through the review
pipeline (not just fix the code path) so the moderation gate has something to approve.

### High — The one working "research-stage" content funnel (blog ↔ compare-business ↔ city hubs) is three disconnected silos
**Description:** New evidence this audit via `findings/cluster.md`: zero bidirectional links exist
between any blog post and its topically-matching `/city/[slug]` or `/compare-business/[slug]` hub.
This downgrades what the baseline audit called the site's one genuine SXO strength (comparison-
intent query coverage) — the content exists and is topically correct (verified again this session
via live SERP for "dental clinic Kathmandu," "wedding planners Nepal"), but a user who lands on one
page in the intended funnel has no path to the next stage.
**Recommendation:** Ties directly to `cluster.md`'s "Internal link matrix recommendation" — wire
the 12-14 identified blog↔hub link pairs before investing in new content; this is a render-layer
fix against data that already exists, not new content work.

### High — Marketing claims ("50,000+ businesses," "12,840 listings" for Kathmandu) are now directly contradicted by user-visible moderation-gate copy
**Description:** New this audit. Previously this was inferable only by cross-referencing the
sitemap; now a real visitor reaching the one example listing sees the platform's own words
confirming it isn't indexed/ranked yet, right next to homepage scale claims. This is a sharper
trust gap than "thin content" — it's a direct, page-adjacent contradiction.
**Recommendation:** Either scale back the homepage/category count claims until they're
substantiated by real approved listings, or clearly label them as target/aspirational figures, so
the copy doesn't contradict what a user discovers two clicks later.

### Medium — City pages remain ~85% templated (unchanged, restated from `findings/local.md`)
**Description/Recommendation:** No new evidence gathered this session; carried over as STILL OPEN.
See `findings/local.md` for full detail.

### Info — Competing Nepal directory/marketplace sites validate the page type, sharpening urgency
**Description:** Fresh SERP pulls this session found WedTayari, Bhoj Planner (wedding vendor
marketplaces), and TechBehemoths/Nepal IT Hunt/GoodFirms (IT-company directories) all ranking with
real multi-vendor inventories for queries this site should compete on. `site:nepalidirectory.com`
returned zero results while five competing general Nepal directories surfaced instead. This isn't
a new problem, but it's stronger, dated evidence (2026-07-16) that the page type is viable and
actively being won by competitors while this site's inventory sits at zero.
**Recommendation:** No new action beyond the Critical fix above — cited to make the competitive
cost of delay concrete for prioritization conversations.

## Quick wins
1. Treat the listings fix (code + actually getting real listings through the review gate) as the
   single SXO priority — every persona score is capped by it, and the gap is now worse (0 vs. 1
   URL) than at the last audit.
2. Wire the blog ↔ city/compare-business internal links per `cluster.md`'s matrix — zero new
   content required, converts the site's one working content funnel from three silos into an
   actual journey.
3. Resolve the marketing-claim-vs-moderation-gate contradiction (scale back or label counts as
   aspirational) before it's seen by more real prospective business-owner visitors.
4. Add an H1 and substantive copy to `/claim-listing` (still open from baseline).

## Limitations
- `/claim-listing`, `/near-me`, `/best-businesses`, `/city/kathmandu`, `/categories`,
  `/compare-business/*` were evaluated via `crawl-data.json` (fetched 2026-07-11) plus the fresh
  141-URL inventory (`urls-2026-07-16.txt`) and `findings/{local,cluster,sitemap}.md` from this
  audit round, not independently re-rendered live in this session — only `/business/newa-lahana`
  and `sitemap-listings-1.xml` were directly re-fetched. No evidence was found suggesting these
  pages changed since 2026-07-11, but this is inferred, not independently re-verified per-page.
- SERP analysis used live WebSearch (not a full rank-tracking tool), so PAA boxes, AI Overview
  presence/citations, and ad density could not be directly inspected — signals were inferred from
  organic result composition and titles only.
- No GSC/analytics access — actual current click-through, impressions, or ranking position for
  nepalidirectory.com on any query above could not be confirmed beyond the `site:` control query
  returning zero results.
- Did not assess whether the moderation-review pipeline itself (queue length, approval criteria,
  time-to-approve) is a bottleneck — flagged as an open question for the team, out of scope for a
  search-experience audit of live HTTP/HTML behavior.

Cross-reference: for the code-level root cause and fix of the zero-listings problem, see
`findings/sitemap.md`. For the internal-linking fix, see `findings/cluster.md`. For city-page
templating, see `findings/local.md`.

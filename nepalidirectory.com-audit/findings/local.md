# Local SEO — nepalidirectory.com

**Score: 45/100**

Scope note: this site is a local business *directory/marketplace*, not a single brick-and-mortar
business, so this assesses (a) the 8 `/city/*` pages as the site's own local landing pages, (b)
NAP/schema data quality on the one live listing as the template that will matter at scale, and
(c) how well-positioned the platform is to help *its listed businesses* win local visibility.

## What works
- All 8 city pages (`kathmandu`, `pokhara`, `lalitpur`, `bhaktapur`, `chitwan`, `biratnagar`,
  `butwal`, `dharan`) exist, return 200, have unique titles/meta descriptions, and carry
  `Organization`+`WebSite`+`CollectionPage` schema.
- The one live listing (`/business/newa-lahana`) has a complete, correctly-structured
  `PostalAddress` (`streetAddress`, `addressLocality`, `addressRegion`, `addressCountry`) — good
  NAP data modeling at the schema level once real listings populate it.
- `robots.txt` and `llms.txt` both explicitly support AI-crawler discovery of city pages, which
  matters for "near me" style queries increasingly answered by AI Overviews/assistants.

## Findings

### High — City pages are ~85% templated/duplicate content across genuinely different cities
**Description:** Verified directly: all 8 city pages fall in a tight 508–514 word band, and a
direct text comparison between `/city/kathmandu` (capital, ~2.5M metro population) and
`/city/dharan` (a much smaller eastern city) shows **423 of 499 five-word phrase sequences shared
(≈85% overlap)** — despite the cities having essentially nothing in common demographically or
geographically. This reads as the same paragraph template with the city name substituted, not
locally-researched content. For local SEO specifically, Google and users both expect city landing
pages to reflect real local specificity (neighborhoods, known landmarks, locally relevant
categories) — near-identical city pages are a classic "doorway page" pattern that underperforms
and, at scale, risks a Google Panda-style thin/duplicate-content quality signal.
**Recommendation:** Before adding more city pages, differentiate the existing 8 with real
city-specific detail: named neighborhoods/landmarks (the homepage already demonstrates this is
possible — see the Boudha/Bhaktapur Durbar Square listing quotes), locally-relevant category
emphasis (e.g. Pokhara should lead with travel/lakeside/adventure categories, not the same generic
category list as Kathmandu), and city-specific stats once real listing data exists.

### High — NAP data has no real-world instance beyond one demo listing
**Description:** Restated from the audit-wide critical finding, scoped to Local specifically: a
directory's core local-SEO value proposition is aggregating accurate, consistent NAP (Name,
Address, Phone) data across many real businesses. Today there is exactly one. Local SEO cannot be
meaningfully evaluated at the aggregate/platform level until real listings exist — this caps the
category score regardless of how well the template performs.
**Recommendation:** Same fix as the audit-wide Critical finding (wire the sitemap + add the
dynamic listing route) — Local SEO is one of the categories with the most to gain once that ships.

### Medium — No visible `LocalBusiness`/`ItemList` schema aggregating listings on city pages
**Description:** Cross-referencing `findings/schema.md`: city pages carry `CollectionPage` but not
`ItemList` (unlike `/compare-business/*` pages, which do). For a page whose entire purpose is
"local businesses in this city," an `ItemList` of the featured/top local businesses (once real
data exists) is a natural, high-value schema addition specifically for local/map-adjacent rich
results.
**Recommendation:** Extend city pages with `ItemList` matching the pattern already used on
compare-business pages.

### Info — Platform-level local SEO strategy for listed businesses is not yet visible
**Description:** Once real businesses are onboarded, the platform's value depends on helping those
businesses actually win local visibility (citations, review signals, GBP consistency guidance).
Nothing in the current build suggests this coaching/consistency layer exists yet — worth scoping
as a forward-looking product feature (e.g. an NAP-consistency checker in the claim-listing flow)
rather than an audit finding against current code.

## Quick wins
1. Differentiate the 8 city pages with real local specifics (neighborhoods, category emphasis)
   rather than a shared template.
2. Add `ItemList` schema to city pages once real listing data exists to populate it.
3. Prioritize the platform-wide listings fix — Local SEO has the most to gain of any category once
   real NAP data exists at scale.

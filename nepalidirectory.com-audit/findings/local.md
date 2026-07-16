# Local SEO — nepalidirectory.com (RE-AUDIT, 2026-07-16)

**Score: 40/100** (baseline 2026-07-11 was 45/100 — see "Why the score moved" below)

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| GBP Signals | 25% | 8/25 | `/map` + city/category structure exist; zero live GBP-adjacent proof (photos, verified badge, posts, place refs) for any real business — all gated behind demo/non-indexable status |
| Reviews & Reputation | 20% | 4/20 | `aggregateRating` capability exists in the schema template; zero real reviews live; demo ratings explicitly excluded from JSON-LD |
| Local On-Page SEO | 20% | 11/20 | 8 city pages + 6 new category pages + breadcrumbs + FAQ scaffolding is decent structure (dedicated category pages = highest-leverage local-organic factor per Whitespark 2026); content still thin/templated |
| NAP Consistency & Citations | 15% | 4/15 | Correct principle (no placeholder NAP published anywhere, including for the platform itself) but zero real, citable listings exist to check consistency against |
| Local Schema Markup | 10% | 6/10 | Well-designed listing schema template (correct subtype mapping, geo, hours, ratings) — but it never renders in production today |
| Local Link & Authority Signals | 10% | 4/10 | Not primary focus this pass; carried at prior-session estimate, no new evidence either direction |

Scope note (unchanged from baseline): nepalidirectory.com is a Nepal-wide directory, not a single
business. This assesses (a) the platform's own local signals, and (b) — the higher-weight question
— the quality of local signals it manufactures for the businesses it lists.

## Why the score moved (45 → 40): root cause changed, live outcome didn't improve

The prior audit's #1 Local finding was "NAP data has no real-world instance beyond one demo
listing" and implicitly credited that one listing (`/business/newa-lahana`) as a working template
example (full `PostalAddress`, `aggregateRating`, `hasMenu`). Direct re-fetch this session shows
that credit no longer applies:

- **`app/business/[slug]/page.tsx` now exists as a real dynamic route** (confirmed live: `bhojan-
  griha`, `yangling-tibetan`, `roadhouse-cafe`, `himalayan-java-lazimpat`, `annapurna-thakali`,
  `kathmandu-plumbing-services`, `patan-electric-solar`, `citycare-dental-clinic`, `lakefront-inn-
  pokhara`, `legal-line-nepal` — all 10 remaining seed businesses — now return HTTP 200, not 404).
  This is the routing half of the prior Critical sitemap finding — **FIXED**.
- **`lib/seo-auto/sitemaps.ts::getListingSitemapEntries()` now correctly calls
  `getIndexableListings()`** instead of returning a hardcoded 1-URL array — **FIXED**.
- But `sitemap-listings-1.xml` is live-verified **empty (0 URLs)**, and every business page —
  including `newa-lahana` — now renders with `<meta name="robots" content="noindex,nofollow">` and
  a visible banner: *"Preview profile. This record is available for product review but is excluded
  from search indexing, sitemaps and business ranking schema until its source and public details
  pass review."* The page's only live JSON-LD today is `Organization`+`WebSite`+`WebPage`+
  `BreadcrumbList` — **the `Restaurant`/`LocalBusiness` block the Jul 11 audit graded is gone from
  the rendered page.**

**Root cause, read from `lib/public-listings.ts`:** `isIndexableListing()` requires
`!isDemoListing(listing)`, and `isDemoListing()` returns `true` for anything with
`dataSource === "demo"`. All 11 seed businesses in `lib/data.ts` are `dataSource: "demo"` by
construction, so **no seed business can ever become indexable, by design** — this is a deliberate,
correct data-integrity gate (never let Google index placeholder restaurant data), not a bug. The
same principle is applied to the platform's own Organization schema: `/contact` states verbatim
*"Nepali Directory does not display a phone number, office address or social profile unless that
channel has been configured and verified"* — confirmed no address/phone anywhere on `/contact` or
in the sitewide Organization JSON-LD (`contactPoint` has a URL only, no `telephone`, no
`PostalAddress`).

**Net effect: the previous Critical finding is functionally unchanged (STILL OPEN) at the business-
impact level, even though the underlying code is now more correct.** There is no evidence
`DATABASE_URL` is wired to a populated Postgres table in production — the live site is still
serving `InMemoryListingRepository` seeded entirely from the same 11 demo rows. Fixing the routing/
sitemap bug was necessary but not sufficient — **the platform still has exactly zero indexable,
schema-bearing business pages**, which remains the single largest cap on this category's score, now
for a data-pipeline reason rather than a code-bug reason. The score moved down slightly (not up)
because the one artifact the baseline partially credited — a live, schema-complete demo page — has
now been correctly, but visibly, taken away.

## What works (carried over + new)

- **FIXED** — dynamic `/business/[slug]` route now exists; all 11 known seed slugs return 200.
- **FIXED** — `getListingSitemapEntries()` now sources from the real listing repository, not a
  hardcoded literal (`lib/seo-auto/sitemaps.ts`).
- **FIXED** — `priceRange` malformed value (`"Rs Rs Rs"`, flagged High in the Jul 11 schema audit)
  is gone from source: `priceTierLabel()` in `lib/seo-auto/schema.ts` now returns a repeated `₨`
  currency-symbol string (e.g. `₨₨₨`), a valid Google-recognized tier format.
- **FIXED (partial)** — `geo` (`GeoCoordinates`) is now a first-class field in
  `buildListingLocalBusinessJsonLd()`, addressing the prior "no geo property at all" Medium finding
  from `findings/schema.md` — see residual precision issue below.
- **NEW (good)** — `localBusinessSubtype()` correctly maps categories to Google-supported subtypes
  for the verticals it covers: `Restaurant`, `Hotel`, `MedicalClinic`, `Dentist`, `Plumber`,
  `Electrician`, and — correctly avoiding the deprecated type — **`LegalService`, not `Attorney`**.
- **NEW (good)** — the schema template, when it does render, is genuinely strong: `@id`,
  `telephone`, `email`, `priceRange`, full `PostalAddress`, `geo`, `aggregateRating`,
  `openingHoursSpecification` (from a structured `weeklyHours` model — an improvement over the
  prior ad-hoc array that silently dropped 3 of 7 days), and `amenityFeature`.
- **NEW (good)** — 6 `/category/*` hub pages now exist (`restaurants`, `hotels`, `hospitals`,
  `schools`, `it-companies`, `shops`) in `sitemap-categories.xml` alongside the 8 `/city/*` pages —
  dedicated category/service pages are the **#1 local-organic ranking factor** per the Whitespark
  2026 study.
- All 8 city pages, the new `/city` index route, and `/map` still return 200.
- `robots.txt` and `llms.txt` still explicitly support AI-crawler discovery.

## Findings

### Critical — STILL OPEN (root cause changed): zero indexable business pages in production
**Description:** See "Why the score moved" above for full detail. `sitemap-listings-1.xml` = 0
URLs live; every business page is `noindex,nofollow` with no `LocalBusiness`/`Restaurant` JSON-LD.
This is now correctly explained by design (demo data is intentionally excluded from indexing) —
not a code defect — but the business-facing outcome — zero local search visibility for every
listed business — is unchanged from the prior audit and remains the dominant cap on this category.
**Recommendation:** Connect a real data source: either set `DATABASE_URL` to a populated
`PostgresListingRepository` (owner-claimed, OSM-imported, or `google_ondemand_reviewed` rows), or
run the existing enrichment/import pipeline (`lib/enrich/sweep.ts`, `auto-enrich.ts`) against real
Nepal business data so `isIndexableListing()` has non-demo rows to pass. Do **not** relax the demo
gate itself — it is doing its job correctly.

### High — REGRESSED: the one template example that demonstrated schema quality is now invisible
**Description:** `/business/newa-lahana` previously served as live proof the listing schema
template worked end-to-end. It now renders with schema stripped and `noindex,nofollow` applied.
The template code itself is fine (see "What works"), but there is currently no URL on the live
site where correct `LocalBusiness`/`Restaurant` JSON-LD can be observed — verification is only
possible by reading source, not by fetching a page.
**Recommendation:** Once real listings exist (see Critical finding), spot-check the first ones
against Google's Rich Results Test to confirm the template renders as designed in production, not
just in source — this audit found the two had already diverged once.

### Medium — NEW: 4 of 6 published category verticals will get the wrong schema subtype
**Description:** `localBusinessSubtype()` (`lib/seo-auto/schema.ts`) only maps 8 needles
(`restaurant`, `cafe`, `hotel`, `doctor`, `dentist`, `plumber`, `electrician`, `lawyer`). Of the 6
live `/category/*` hubs, **`hospitals`, `schools`, `it-companies`, and `shops` match none of these
needles** and will fall back to generic `LocalBusiness` once real listings populate them —
`hospitals` should map to `Hospital`/`MedicalClinic`, `shops` to `Store`, `schools` arguably to
`School`. Per the schema-types reference, generic `LocalBusiness`/`MedicalBusiness` should be
avoided whenever a specific subtype exists — incorrect primary category is also Whitespark 2026's
**#1 negative local-ranking factor**.
**Recommendation:** Extend `subtypeByCategory` to cover all 6 published category verticals before
real listings in those categories go live, not after.

### Medium — STILL OPEN, widened scope: no `ItemList` schema on city or category hub pages
**Description:** Confirmed live: `/city/kathmandu` JSON-LD types are
`Organization, WebSite, CollectionPage, FAQPage, City, Country` — no `ItemList`. The 6 new
`/category/*` pages (e.g. `/category/restaurants`) have the same gap:
`Organization, WebSite, CollectionPage, BreadcrumbList, FAQPage` — still no `ItemList`, even though
`/compare-business/*` pages do carry one. This finding now applies to 14 pages (8 city + 6
category), not just 8.
**Recommendation:** Extend both page types with `ItemList` once real listing data exists to
populate it meaningfully — same recommendation as the Jul 11 audit, just widened in scope.

### Low — NEW: geo precision in the demo/seed dataset is below the 5-decimal recommendation
**Description:** `lib/data.ts` seed coordinates are mostly 4 decimal places (e.g.
`{ lat: 27.6722, lng: 85.4298 }`; one is 3 decimals: `lng: 85.342`). Google's guidance recommends a
minimum of 5 decimal places (~1.1m accuracy); 4 decimals is ~11m. Low severity because this is
seed/demo data that should be replaced by OSM-import or GBP-sourced coordinates (typically far more
precise) once the real pipeline is connected — but worth catching now so it isn't silently carried
into any default/fallback coordinate path in the real pipeline.
**Recommendation:** If any manual/default coordinate-entry path survives into production, enforce a
5-decimal minimum at the data-entry or import-validation layer.

### High — STILL OPEN (not independently re-verified this session): city pages likely still ~85% templated
**Description:** The Jul 11 finding (423/499 five-word sequences shared between `/city/kathmandu`
and `/city/dharan`) was not re-diffed this session due to time constraints. No evidence of a
content-generation change in `lib/city-pages.ts` was found while reviewing adjacent code, so this
is carried forward as still-open rather than re-verified — flag for the next pass to re-run the
text-diff check directly.
**Recommendation:** Unchanged from baseline — differentiate city pages with real local specificity
before scaling to more cities.

### Info — NEW: platform's own NAP is intentionally unpublished, not missing/inconsistent
**Description:** `/contact` explicitly states Nepali Directory "does not display a phone number,
office address or social profile unless that channel has been configured and verified." The
sitewide Organization JSON-LD has no `telephone` or `address`, only a `contactPoint` with a URL.
This is consistent, deliberate, and appropriate for an online-only national aggregator (not itself
a brick-and-mortar or SAB business) — there is no NAP discrepancy to report because nothing
placeholder is being published. This re-classifies the original audit brief's question ("does the
platform have its own local signals as a company?"): the answer is "by design, no — and that's
correct for this business model."
**Recommendation:** None — working as intended. If Nepali Directory ever opens a physical office it
wants to rank locally for, add real NAP + `LocalBusiness`/`Organization` schema at that time, not
before.

## Business type & industry vertical detected

- **Platform itself:** online-only national directory/aggregator — no brick-and-mortar or SAB
  language on its own behalf, consistent with the deliberate no-NAP policy above. Not evaluable as
  a local-pack candidate itself.
- **Listed businesses (from the 11-row seed set, standing in for the eventual real catalog):**
  spans restaurant (`newa-lahana`, `bhojan-griha`, `yangling-tibetan`, `roadhouse-cafe`,
  `himalayan-java-lazimpat`, `annapurna-thakali`), home services/SAB-leaning (`kathmandu-plumbing-
  services`, `patan-electric-solar`), healthcare (`citycare-dental-clinic`), hospitality
  (`lakefront-inn-pokhara`), and legal (`legal-line-nepal`) — a genuinely representative
  cross-section of the 6 published category verticals plus lodging.

## GBP-adjacent signal checklist (for listed businesses)

| Signal | Status |
|---|---|
| Map embed / `/map` page | Present (route returns 200); per-listing embed not evaluated |
| Place ID / GBP reference on listing pages | Not observed in schema or HTML |
| Review widget / `aggregateRating` | Template-only; 0 live instances (gated by non-indexable status) |
| Photos | Demo images only (Unsplash placeholders); no evidence of real business photos |
| Posts / GBP activity indicators | None observed |
| Verified/claimed badges | Present in UI (`ShieldCheck`/`BadgeCheck`) but conditioned on `indexable` — never shown live today |

## Review health snapshot

Not scoreable against real data: 0 real reviews exist. The schema template supports
`aggregateRating` (`ratingValue`, `reviewCount`, `bestRating`, `worstRating`) and the UI displays a
rating badge for demo rows, but both are explicitly suppressed from indexing/JSON-LD. No review-
velocity (18-day rule) or response-rate signal is assessable.

## Citation presence (Tier 1)

Not directly assessable this session: there are zero real, named businesses live on the site to
search for on Yelp/BBB/Google. This dimension cannot be meaningfully scored until real listings
exist — same limitation as the Jul 11 audit, unchanged.

## Local schema validation summary

| Check | Result |
|---|---|
| Correct subtype for covered verticals (restaurant/hotel/medical/dental/plumber/electrician/legal) | Pass — including correctly avoiding deprecated `Attorney` |
| Correct subtype for `hospitals`/`schools`/`it-companies`/`shops` | **Fail** — falls back to generic `LocalBusiness` (see Medium finding) |
| Required properties (`name`, `address`) | Present in template |
| `geo` present | Present in template; precision below 5-decimal recommendation in seed data |
| `openingHoursSpecification` | Present in template via structured `weeklyHours` model |
| `telephone`, `url` | Present in template |
| `priceRange` valid format | **Fixed** — now `₨` repeated instead of malformed `"Rs Rs Rs"` |
| Renders live on any real URL today | **Fail** — gated to `null` for all rows (all are demo) |

## Location page quality (multi-location)

- 8 `/city/*` pages + 6 `/category/*` pages + `/city` index = 15 location/category-flavored pages,
  still well under the 30-page doorway-pattern warning threshold (per `findings/sitemap.md`'s
  independent count).
- Internal linking depth: business pages link to their category hub and city hub via breadcrumbs
  (confirmed in `BreadcrumbList` JSON-LD) — good structural depth once real listings exist to
  populate those hubs.
- Unique-content/doorway-swap check: not re-run this session (see High finding above) — carried
  forward as still-open from baseline.

## Top 10 prioritized actions

1. **Critical** — Connect a real listing data source (`DATABASE_URL` + populated Postgres, or run
   the existing OSM-import/enrichment pipeline) so `getIndexableListings()` returns real rows. This
   is the single highest-leverage fix; every other Local finding is downstream of it.
2. **Critical** — Once real listings exist, verify the first batch renders `LocalBusiness`/
   `Restaurant` JSON-LD live via Google's Rich Results Test — don't assume source-code correctness
   equals production output.
3. **High** — Extend `subtypeByCategory` to cover `hospitals` (→`Hospital`/`MedicalClinic`),
   `shops` (→`Store`), `schools`, and `it-companies` before real listings populate those verticals.
4. **High** — Re-run the city-page duplicate-content diff check; differentiate the 8 city pages
   with genuine local specificity before adding more.
5. **Medium** — Add `ItemList` schema to both `/city/*` and `/category/*` hub pages once real
   listing data exists.
6. **Medium** — Add `updatedAt`/`createdAt` to the `Listing` type (per `findings/sitemap.md`) so
   real listing `lastmod` and "facts checked" dates are accurate once live.
7. **Medium** — Build sitemap chunking (`sitemap-listings-2.xml`, etc.) ahead of real listing
   volume — doesn't exist yet at any scale.
8. **Low** — Enforce 5-decimal geo precision at the data-import/validation layer.
9. **Low** — Reconsider `cafe` → `Restaurant` mapping; `CafeOrCoffeeShop` is the more precise
   Google-supported subtype.
10. **Info** — Build the citation-consistency / NAP-coaching layer for claimed listings (from the
    Jul 11 audit) — still not started, still appropriate as a forward-looking product feature.

## Limitations disclaimer

No DataForSEO MCP access this session (free-tier analysis only) — no live GBP API data, no
geo-grid rank tracking, no verified Google review counts, no real citation-presence checks (Yelp/
BBB) since zero real businesses exist to search for. Proximity (55.2% of local ranking variance per
Search Atlas ML study) is entirely outside this audit's or the platform's control. City-page
duplicate-content and internal-linking-depth checks were not independently re-run this session
(time-boxed re-audit) and are carried forward from the Jul 11 baseline as still-open rather than
re-verified.

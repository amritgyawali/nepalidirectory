# Schema / Structured Data — nepalidirectory.com

**Re-audit date:** 2026-07-16 (baseline: 2026-07-11)

**Score: 61/100** (was 74/100)

The score drops despite real code-level fixes because the site's flagship schema surface — the
`/business/[slug]` listing template — currently emits **zero** `LocalBusiness`/`Restaurant`
structured data on production. `lib/seo-auto/schema.ts` was improved correctly, but a separate
indexability gate (`lib/public-listings.ts`) currently blocks every listing, including
`newa-lahana`, from qualifying, so the improved template has no live instance to validate against.

## Methodology
- Read baseline `schema.md` and diffed `lib/seo-auto/schema.ts` against git history
  (`31fb613` → `4a63e56`, "seo").
- Read `app/business/[slug]/page.tsx` (the file that replaced the old static
  `app/business/newa-lahana/page.tsx` template referenced in the baseline).
- Fetched live HTML with `render_page.py --mode auto` for: homepage, `/category/restaurants`,
  `/business/newa-lahana`, `/blog/kathmandu-restaurant-guide`, `/questions/trekking-annapurna`,
  and `/sitemap.xml` → `/sitemap-listings-1.xml`, then extracted and parsed every
  `<script type="application/ld+json">` block per page.

## What works
- **Site-wide `Organization` + `WebSite` graph is intact and consistent** across every page
  sampled (home, category, business, blog, questions) — `@id`-anchored, `SearchAction`
  `potentialAction`, `knowsAbout`, `contactPoint`. No regressions here.
- **`priceRange` bug is FIXED.** `priceTierLabel()` now returns `"₨".repeat(tier)` (`₨`, `₨₨`,
  `₨₨₨`) instead of the malformed `"Rs Rs Rs"` string. Applies to both `buildLocalBusinessJsonLd`
  and the new `buildListingLocalBusinessJsonLd`. Confirmed correct in source; **not yet
  observable live** (see Critical finding below — no listing currently renders this property).
- **`geo` (GeoCoordinates) is FIXED/ADDED.** Both schema builders now emit
  `geo: {"@type": "GeoCoordinates", latitude, longitude}` whenever coordinates exist on the
  record. This was a Medium finding in the baseline and is now correctly implemented at the code
  level.
- **`openingHoursSpecification` gap is FIXED at the code level.** The new listing builder maps
  `listing.attributes.weeklyHours` verbatim (all 7 days, with type-guarding for malformed entries)
  rather than the old hard-coded partial array. Cannot be verified live for the same reason as
  above.
- Blog post (`/blog/kathmandu-restaurant-guide`) carries a strong `BlogPosting` block: `headline`,
  `alternativeHeadline`, `datePublished`/`dateModified` (ISO 8601), `author` (with `knowsAbout`,
  `parentOrganization`), `publisher`, `reviewedBy`, `mainEntityOfPage`, `wordCount`,
  `timeRequired`, `about[]`/`mentions[]`, plus `BreadcrumbList` and a 2-question `FAQPage` whose
  content is visibly rendered on-page. This is a well-built template, unchanged from baseline and
  still passing validation.
- Category page (`/category/restaurants`) correctly layers `CollectionPage` + `BreadcrumbList` +
  `FAQPage` (3 Q&As, matching visible `<details>/<summary>` markup on the page — satisfies
  Google's on-page-visibility requirement for FAQ markup, for whatever residual AI/citation value
  it has).

## Findings

### Critical (NEW) — Zero live business listings currently carry `LocalBusiness`/`Restaurant` schema
**Description:** `/business/newa-lahana` — the exact page the baseline audit highlighted as "a
genuinely thorough Restaurant schema" — now renders **only** `WebPage` + `BreadcrumbList` in its
JSON-LD. No `LocalBusiness`, no `Restaurant`, no `aggregateRating`, no `hasMenu` /
`MenuSection`/`MenuItem`/`Offer` graph, no `amenityFeature`, no `servesCuisine`. The page itself
now displays a visible on-page notice: *"Preview profile. This record is available for product
review but is excluded from search indexing, sitemaps and business ranking schema until its
source and public details pass review."*

Root cause, confirmed in code: the old static, hand-built `app/business/newa-lahana/page.tsx`
(434 lines, referenced in the baseline) was replaced by a generic, data-driven
`app/business/[slug]/page.tsx`. It only emits `buildListingLocalBusinessJsonLd(...)` when
`isIndexableListing(listing)` is true (`lib/public-listings.ts`). That gate requires
`dataSource` to be `owner`/`osm`/`import`/`google_ondemand_reviewed` (i.e., **not** `"demo"`),
`qualityScore >= 55`, `!needsCategoryReview`, and `claimed || verified || trustedSource`.
`newa-lahana` is seed/demo data, so it fails the gate — `indexable` is `false`, and
`localBusinessJsonLd` is `null`.

This isn't isolated to one page: `/sitemap-listings-1.xml` (fetched live) contains **zero URLs**.
Every business listing on the entire site is currently non-indexable, meaning the entire
`LocalBusiness`/`Restaurant` schema surface — the core value proposition of a business directory —
has no live instance anywhere on the production site right now, even though the underlying
generator code (`buildListingLocalBusinessJsonLd`) is solid and includes all the baseline's
requested fixes (`geo`, full 7-day hours, corrected `priceRange`).

Additionally, the entire menu graph (`hasMenu`/`MenuSection`/`MenuItem`/`Offer`,
`servesCuisine`) that existed in the old static template has **no equivalent** anywhere in the
new `lib/seo-auto/schema.ts` or `lib/enrich`/`Listing` type — a repo-wide search for
`hasMenu`/`servesCuisine`/`MenuSection` returns no matches. If menu data still exists in the
underlying listing model, it is no longer surfaced as structured data at all.
**Recommendation:**
1. Treat this as a product/content-pipeline issue, not just a schema-code issue: get at least one
   real listing (owner-claimed, OSM-imported, or reviewed) through the `isIndexableListing` gate
   so the improved schema template has a live instance to validate in Google's Rich Results Test
   and Search Console before scaling to "thousands of listings."
2. Re-add a `Menu`/`hasMenu` (and `servesCuisine` for restaurants) property to
   `buildListingLocalBusinessJsonLd` if menu data is still collected anywhere in the `Listing`
   model — this was a differentiator in the baseline template and currently has no replacement.
3. Once listings pass the gate, re-verify `priceRange`, `geo`, and `openingHoursSpecification`
   render correctly live (code review says they will, but nothing has exercised this path in
   production yet).

### New — `/questions/trekking-annapurna` (genuine Q&A page) carries no page-specific schema at all
**Description:** Verified live: this page's only JSON-LD is the site-wide `Organization` +
`WebSite` block. There is no `WebPage`, no `BreadcrumbList`, and — most notably — no `QAPage`
schema, despite the page being a textbook Q&A page (single question, single accepted "best
answer", "Add your answer" CTA). Source (`app/questions/trekking-annapurna/page.tsx`) confirms no
`<script type="application/ld+json">` is rendered at all. A repo-wide search also confirms
`QAPage` is never emitted anywhere in the codebase (only an unrelated React component,
`app/qa/page.tsx`, whose function is coincidentally also named `QAPage`).
**Recommendation:** Per current guidance, this is exactly the right content shape for `QAPage`
(not `FAQPage` — this is a single user-submitted question with a community/editorial answer, not
a business FAQ list). Add a `QAPage` block with `mainEntity: Question` →
`acceptedAnswer: Answer` (include `author`, `dateCreated`/`upvoteCount` if that data exists), plus
the `WebPage`/`BreadcrumbList` pair every other content page already gets — both are currently
missing here specifically, not just the Q&A-specific type.

### Medium (STILL OPEN) — No verification path exists yet for the fixed listing-schema properties
**Description:** Baseline flagged missing `geo` and incomplete `openingHoursSpecification` as
Medium findings. Both are now fixed in `lib/seo-auto/schema.ts`. However, because of the Critical
finding above, this fix is unverified in production — there is currently no way to confirm via
Rich Results Test / Search Console that these render without error once a listing does become
indexable (e.g., malformed `weeklyHours` attribute data silently resolving to `undefined` via the
type-guard in `listingWeeklyHours()`, which fails closed/safe but could still mean 0 days for a
listing with imperfect data).
**Recommendation:** As soon as one listing clears the indexability gate, run it through Google's
Rich Results Test and Schema Markup Validator to close this out for real.

### Low (STILL OPEN) — City hub pages (`/city/*`) still lack `ItemList` schema
**Description:** Not directly re-tested this cycle (out of the sampled-page set), but no code
changes touched `app/city/[slug]/page.tsx`'s schema emission in the diffed commits, and a source
read of that route confirms the baseline's observation still holds (`Organization` + `WebSite` +
`CollectionPage` only, no `ItemList`).
**Recommendation:** Unchanged from baseline — extend with the same `ItemList` pattern used on
`/compare-business/*` pages once real listing data exists to populate it.

### Info (STILL OPEN — policy updated) — `FAQPage` usage, revised guidance
**Description:** `FAQPage` schema is present and correctly formed on category pages (verified live
on `/category/restaurants`: 3 questions, content visibly rendered in matching `<details>/<summary>`
markup) and on the sampled blog post (2 questions). As of 2026-05-07, Google has retired FAQ rich
results for **all** sites, not just non-government/health ones (superseding the 2023 restriction
the baseline cited) — so this schema now has **no** Google SERP benefit for any page on the site,
full stop.
**Recommendation:** Do not remove existing `FAQPage` blocks — they still carry genuine value for
AI/LLM answer-extraction and entity resolution (GEO). Do not add further `FAQPage` blocks with an
expectation of a Google rich-result; if new FAQ-shaped content is added purely for search-snippet
purposes, there's no SERP upside left to justify the effort. This is unchanged in spirit from the
baseline's note but the policy basis has hardened — flagging as Info, not for removal.

## Fixed since baseline
1. **`priceRange: "Rs Rs Rs"` → `"₨".repeat(tier)`** (High baseline finding). Fixed correctly in
   `priceTierLabel()`. Currently unverifiable live (see Critical finding).
2. **Missing `geo`/`GeoCoordinates`** (Medium baseline finding). Fixed — both schema builders emit
   `geo` when coordinates exist. Currently unverifiable live.
3. **Incomplete `openingHoursSpecification`** (Medium baseline finding). Fixed — the new builder
   maps whatever `weeklyHours` data exists in full rather than a hard-coded partial array.
   Currently unverifiable live.

## Regressed since baseline
1. **Entire `LocalBusiness`/`Restaurant`/menu schema graph on `/business/newa-lahana` disappeared**
   from production (see Critical finding). The baseline's centerpiece "strong template" example no
   longer emits any business schema at all; this is the dominant factor in the score drop.
2. **Menu graph (`hasMenu`/`MenuSection`/`MenuItem`/`Offer`, `servesCuisine`) has no equivalent** in
   the new schema builder — a capability regression independent of the indexability-gate issue.

## Quick wins
1. Get one real listing through `isIndexableListing()` so the fixed `priceRange`/`geo`/
   `openingHoursSpecification` template actually ships to production and can be validated.
2. Add `QAPage` (+ `WebPage`/`BreadcrumbList`) JSON-LD to `/questions/trekking-annapurna` — highest
   novel-content ROI of anything found this cycle, page has zero schema today.
3. Decide whether menu data (`hasMenu`/`servesCuisine`) still exists in the `Listing` model; if so,
   restore it to `buildListingLocalBusinessJsonLd`.
4. Extend `/city/*` pages with `ItemList` (carried over from baseline, still open).

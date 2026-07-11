# Schema / Structured Data — nepalidirectory.com

**Score: 74/100**

## What works
- Broad, consistent coverage across the whole crawled site: `Organization` + `WebSite` on all 103
  sitemap URLs, layered with contextual types — `FAQPage` (34 pages), `BreadcrumbList` (33),
  `ItemList` (30), `CollectionPage` (25), `BlogPosting`/`Article` on blog and category pages,
  `ProfilePage` on author pages. This is well above what most sites this early in development
  ship with.
- The one live business page (`/business/newa-lahana`) carries a genuinely thorough `Restaurant`
  schema: `@id`, `image[]`, `description`, `telephone`, `servesCuisine`, structured `address`
  (`PostalAddress` with `streetAddress`/`addressLocality`/`addressRegion`/`addressCountry`),
  `aggregateRating` (`ratingValue`/`reviewCount`/`bestRating`/`worstRating`), `amenityFeature`,
  and a full `hasMenu` → `MenuSection` → `MenuItem` → `Offer` graph with real NPR prices. This is a
  strong template — **getting it fully correct matters enormously since it will presumably be
  reused for thousands of listings** once the routing/sitemap bug (see Critical finding elsewhere
  in this audit) is fixed.
- `compare-business/restaurants` (a category hub page) correctly layers `Article` + `ItemList` +
  `BreadcrumbList` + `FAQPage` — appropriate typing for a hub/comparison page.

## Findings

### High — `priceRange` value is malformed: `"Rs Rs Rs"`
**Description:** The Restaurant schema on `/business/newa-lahana` sets
`"priceRange": "Rs Rs Rs"`. This isn't a valid `priceRange` format under schema.org/Google's Rich
Results guidance, which expects either currency symbols repeated to indicate tier (`"$$$"`) or an
explicit numeric range (`"Rs 160–Rs 2400"`, matching the actual menu prices present elsewhere in
the same schema block). "Rs Rs Rs" reads as a template bug — likely a symbol-repeat pattern
(`"$".repeat(tier)`) that wasn't adapted correctly when the currency symbol was localized from
`$` to `Rs`.
**Recommendation:** Fix the price-tier formatting logic (likely in `lib/seo-auto/schema.ts`, per
the sitemap generation code being adjacent to it) to either use repeated single currency symbols
consistently (`Rs`, `RsRs`, `RsRs Rs` is still odd — better to just use `$`/`$$`/`$$$` which Google
recognizes universally regardless of local currency) or a real numeric range derived from the
actual `hasMenu` offer prices, since that data already exists in the same object.

### Medium — `openingHoursSpecification` only covers 4 of 7 days (Mon, Wed, Thu, Sun) with no explanation
**Description:** Tuesday, Friday, and Saturday are absent from the `openingHoursSpecification`
array — no explicit "closed" entry, they simply don't appear. For a restaurant with "nightly
cultural performances" per its homepage marketing quote, silently missing weekend days looks like
a data-generation gap rather than an intentional closure, and Google will interpret missing days
as "no hours data" for those days rather than "closed," which can produce a confusing rich-result
(e.g., a "Closed" or "Hours unavailable" badge showing on peak days).
**Recommendation:** Either populate all 7 days (with explicit closed markers where the business
genuinely doesn't open) or verify this is real demo data intentionally left incomplete — if the
latter, note it so it isn't carried forward as a template default once real listings are onboarded.

### Medium — No `GeoCoordinates` (`geo`) property on the Restaurant/LocalBusiness schema
**Description:** The address block has full `PostalAddress` detail but no `geo: {"@type":
"GeoCoordinates", "latitude":..., "longitude":...}`. For a directory whose value proposition
includes location/map-based discovery (the site has a `/map` page and city-based browsing), adding
geo coordinates strengthens eligibility for map-pack-adjacent rich results and is straightforward
to add once listings carry lat/long in the data model (which the OSM-import pipeline per project
docs should already produce).
**Recommendation:** Add `geo` to the listing schema template before it's reused at scale.

### Low — City hub pages (`/city/*`) don't carry `ItemList`/ ~aggregation schema for the businesses they list
**Description:** `/city/kathmandu` only carries `Organization` + `WebSite` + `CollectionPage` —
no `ItemList` of the businesses/categories featured on that page, unlike the `/compare-business/*`
pages which do include `ItemList`. Inconsistent schema depth between the two hub-page types that
serve a similar aggregation role.
**Recommendation:** Extend city pages with the same `ItemList` pattern already used on
compare-business pages, once real listing data exists to populate it meaningfully.

### Info — `FAQPage` usage should be spot-checked against Google's on-page-visibility requirement
**Description:** 34 pages carry `FAQPage` schema. Google requires the FAQ content to be visibly
rendered on the page (not schema-only) and discourages FAQPage rich results for non-authoritative/
commercial pages as of the 2023 guideline tightening (FAQ rich results are now largely restricted
to well-known, authoritative government/health sites in practice) — the rich-result may simply not
render even if the schema validates, which is a wasted-effort risk rather than a penalty risk.
**Recommendation:** Not urgent to remove (schema is still valid and helps AI/LLM answer extraction
even without a Google rich-result), but don't expect FAQ rich snippets to appear in classic Google
search for this site's commercial pages — treat the schema's value here as GEO/AI-citability
oriented rather than classic-SERP-rich-result oriented.

## Quick wins
1. Fix `priceRange: "Rs Rs Rs"` → a valid format (highest-leverage single-line fix, affects every
   future listing using this template).
2. Complete `openingHoursSpecification` to all 7 days or explicit closures.
3. Add `geo` (GeoCoordinates) to the listing schema template.

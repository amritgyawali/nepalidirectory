# SEO / GEO / AEO audit — 6 August 2026: implementation record

Source: *NepaliDirectory.com — Advanced SEO, GEO, AEO & Growth Audit*, 6 August 2026.
Analyst score at time of audit: **73/100**.

The audit's central finding was not a technical defect. Technical SEO scored 91/100, mobile
performance 95/100 and crawl/sitemap design 90/100. The bottleneck was **indexable inventory
readiness (55/100)** and **profile uniqueness and data depth (58/100)**: the publication gate in
`lib/public-listings.ts` is correct and worth keeping, but nothing measured why records fail it,
and nothing distinguished one published profile from the next.

This change therefore does not rewrite the frontend or add more schema types. It builds the
instruments and guarantees the audit asked for, and leaves the gate itself untouched.

---

## 1. What shipped

### Single trust vocabulary and one count service (audit §6)

| File | Purpose |
| --- | --- |
| `lib/trust-vocabulary.ts` | The only wording allowed for each record population, with its exact definition, plus the four publication tiers and `listingPublicationTier()`. |
| `lib/directory-counts.ts` | Every count the site renders. `summarizeDirectoryCounts`, `countQualifiedInCity/Category/CityCategory`, `selectQualifiedCities/Categories`, `meetsPublicationThreshold`. |
| `lib/directory-counts.test.ts` | Asserts qualified ≤ discovered, that per-city and per-category counts agree with the shared predicate, and that a hub is selected only at the threshold. |

Homepage, city pages, category pages and `llms.txt` now read hub selection and counts from this
one module, so "qualified public profiles" on a page is provably the same population the sitemap
publishes. The homepage states four counts — qualified profiles, source-checked records, published
city hubs, published category hubs — each labelled with a term defined at
`/directory-methodology#label-definitions`, and says explicitly that discovered records are not
counted.

### Indexability observability (audit §5.4, P0)

| File | Purpose |
| --- | --- |
| `lib/listing-eligibility-report.ts` | Aggregates every reason returned by `evaluateListingIndexEligibility` by reason × category × city × source, plus **sole-blocker** counts and a **near-miss** list (records failing exactly one check). |
| `lib/directory-clusters.ts` | The ten priority clusters from audit §22 with per-cluster thresholds, and readiness scoring against qualified count, verified images and distinct descriptions. |
| `lib/description-uniqueness.ts` | Collapses name/locality/number variables to expose shared category templates; powers the rewrite queue and the cluster distinctness bar. |
| `lib/freshness.ts` | Per-fact review intervals (hours 60d, phone/website 90d, address/services/credentials 180d, ownership/history 365d) and the stale-record queue. |
| `app/admin/indexability/page.tsx` | The dashboard: counts, failure reasons with dimensions, cluster readiness, one-fix-from-publication queue, repeated templates, overdue re-checks. Operational route — noindex via the admin layout, disallowed in `robots.txt`. |

The queue this produces is the answer to "what do we review next": failures ranked by volume, the
sole-blocker column showing the cheapest inventory, and cluster readiness showing which hubs are
close enough to be worth finishing.

### Profile depth and correctness (audit §7, §10)

- **Directions are business-specific.** `lib/business-links.ts` builds a Google Maps directions URL
  from the record's own coordinates, falling back to a name-and-address query. The button
  previously pointed at the site-wide map page.
- **Postal artefacts no longer display as places.** `lib/locality.ts` strips `P.O. Box 8975`,
  `GPO: 8033` and similar from displayed localities and addresses, on the profile, on city and
  category cards, and in `addressLocality`/`streetAddress` schema — so the markup matches the
  visible text.
- **Published facts panel** on each profile: category, locality trail, address, phone, official
  website, service count, source (linked when the source is a URL or an OSM object), last-checked
  date and publication tier. Facts that were never reviewed stay blank rather than being filled
  with a category assumption.
- **Data status block** carries the verification label, the tier summary, an explicit re-check
  warning when the record is past its interval, a source link and a link to the methodology.
- **Stable anchors** (`#about`, `#profile-facts`, `#services`, `#contact`, `#data-status`,
  `#nearby`) so an answer engine can cite a section rather than the page.
- **Nearby qualified profiles** give each profile an internal link out to its own city instead of
  being a dead end.

### Honest hub states (audit §10, §18.2)

- A category hub below the ten-profile threshold now says so — "Category under review", with the
  current count and the target — instead of presenting itself as a finished national category. The
  empty state explains that records exist but none has cleared review, and links to the checks.
- The city strip on a category page renders an explanation when no city qualifies, rather than an
  empty row.
- `llms.txt` lists only category and city hubs that pass the publication threshold. It previously
  advertised every category, including ones the site itself refuses to index.

### Dates, performance and accessibility (audit §4, §6)

- `lib/format-date.ts` renders every public date as "6 August 2026". `toLocaleDateString("en-NP")`
  produced `8/6/2026`, which half the audience reads as 8 June — on pages whose argument is
  freshness.
- City hero images moved from a CSS `background-image` to `next/image` with `priority` and
  `fetchPriority="high"`, so the LCP element is discoverable in the HTML.
- `--color-muted` darkened from `#737066` (4.51:1 on the page background — AA by 0.01) to
  `#63605a` (~5.7:1).
- Touch targets: pill links, chips and tag links get a 44px minimum height and wider spacing under
  `@media (pointer: coarse)`, leaving mouse-driven density unchanged.
- Focus-visible styling added for `details > summary` and `[tabindex]`, plus a white focus ring on
  dark hero surfaces where the yellow ring washed out.

### Deployment guards (audit §23)

`lib/seo-auto/__tests__/indexation-integrity.test.ts` fails the build when:

- a sitemap contains a noindex or operational route;
- a sitemap URL is relative, non-HTTPS or off the canonical host;
- a sitemap URL carries a query string (filters becoming landing pages);
- a listing sitemap entry does not pass the publication gate;
- a city or category hub is published without clearing the minimum qualified threshold;
- `robots.txt` blocks `/_next/`, images, or the public trust pages;
- business schema emits `aggregateRating`, `ratingValue` or `reviewCount`;
- `addressLocality` contains a postal box rather than a place name.

`lib/listing-data-quality.test.ts` covers dates, locality normalization, directions, template
detection, eligibility reporting, freshness intervals, publication tiers and cluster readiness.

Full suite: 31 files, 202 tests passing. `npm run lint`, `npm run typecheck` and `npm run build`
are clean.

---

## 2. Operating the repair pipeline

1. Open `/admin/indexability`.
2. Read the **failure reasons** table top-down. The `Sole blocker` column is the cheapest
   inventory in the directory — those records publish the moment one check passes.
3. Work the **near-miss** queue for those reasons, filtered by the city/category the cluster table
   says is closest to ready.
4. Check **cluster readiness** before promoting a hub. A cluster ships only when it has its
   qualified count, at least five profiles with a verified image, and at least five profiles whose
   description is not the category template with the name swapped.
5. Work the **repeated templates** table as the rewrite queue. Replace template prose with facts
   that are true of that business only — and leave a fact missing rather than inventing it.
6. Keep the **overdue re-check** queue near zero; it is what makes the "last checked" date on every
   profile worth stating.

Do not loosen the gate to clear the queue. The gate is the product.

---

## 3. Deliberately not implemented here

These audit items are real, and none of them is a code change. They are listed so the gap is
explicit rather than silently dropped:

| Audit section | Item | Why it is not in this change |
| --- | --- | --- |
| §2, §20, §21 | Connect Search Console, export query/page/index data, verify Google-selected canonicals, review crawl stats and manual actions | Requires account access; no connector was available to the audit or to this session. This is still the P0 item — the dashboard measures our gate, Search Console measures Google's. |
| §13, §16 | Flagship original-data reports, city research pages, owner case studies, earned-link campaigns | Editorial and outreach work, gated on the data the dashboard now produces. |
| §12 | Named editorial identities, expert review for health/legal, corrections SLA | Requires real people to name and a published response commitment. |
| §15, §16 | Backlink and competitor benchmarking | Ahrefs' connected free plan blocked the comparative metrics and Semrush had no API units; no Domain Rating, backlink count or traffic estimate has been invented anywhere in this record. |
| §19, §20 | Conversion and owner-funnel event tracking, AI-citation monitoring set | Needs an analytics decision (GA4 vs PostHog) and a monthly manual observation process, not a library. |
| §18.5 | 50–100 stable AI prompts tested monthly with screenshots | Observational monitoring, not a rank tracker; belongs in an operating calendar. |

## 4. Notes on GEO/AEO

Google's own guidance is that generative features run on core Search systems: pages must be
indexed and snippet-eligible, no AI-specific markup or text file is required, and structured data
must match visible content. Nothing in this change treats `llms.txt` as a ranking factor — it is
kept, synchronised with qualified inventory, and nothing more. The work that improves AI-citation
odds here is the same work that improves Search: indexed hubs with real inventory, facts that only
this directory publishes, dates a reader can trust, and stable anchors to cite.

# Sitemap Architecture Audit — nepalidirectory.com (RE-AUDIT)

Category score: **44 / 100** (prior audit, 2026-07-11: 28/100)

Scope: this is a re-audit. Prior findings file:
`nepalidirectory.com-audit/findings/sitemap.md` (2026-07-11 version, now overwritten by this
file — its content is preserved below via FIXED/STILL OPEN/REGRESSED/NEW labels). Live sitemap
files fetched at audit time (`nepalidirectory.com-audit/sitemap.xml`, `sitemap-pages.xml`,
`sitemap-categories.xml`, `sitemap-blog.xml`, `sitemap-listings-1.xml`, `robots.txt`,
`urls-2026-07-16.txt` — 141 URLs total) cross-referenced against
`lib/seo-auto/sitemaps.ts` at commit `fc8c5ba` (182-line diff since `0d1ac8f`, the commit range
the orchestrator flagged) and the enrichment/moderation code in
`d:\15 july files\NepaliDirectory page claude`.

---

## VERDICT — why `sitemap-listings-1.xml` has 0 URLs (the orchestrator's central question)

**Neither (a) "still a wiring bug" nor (b) "clean intentional moderation gate" alone is correct.
It is a third thing, worse than either: the gate is real, well-built, and correctly wired — but
it gates a supply pipeline that does not exist in production. Zero listings can ever pass it,
not just zero have passed it yet.**

### The #1 finding from the prior audit is genuinely fixed at the code level

`lib/seo-auto/sitemaps.ts::getListingSitemapEntries()` no longer hardcodes a single literal. It
now calls a real data path:

```ts
// lib/seo-auto/sitemaps.ts:81-87 (current)
export async function getListingSitemapEntries(): Promise<SitemapEntry[]> {
  return (await getIndexableListings()).map((listing) => ({
    url: `${siteUrl}${getBusinessHref(listing.slug)}`,
    lastModified: listing.updatedAt ?? listing.aiEnrichedAt ?? listing.createdAt ?? undefined,
    images: listing.image ? [listing.image] : undefined,
  }));
}
```

`getIndexableListings()` (new file, `lib/public-listings.ts:50-52`) calls
`createListingRepository().all()` (the exact call site the prior audit recommended) and filters
through `isIndexableListing()`. `app/business/[slug]/page.tsx` now exists (dynamic route,
replacing the old static `app/business/newa-lahana/page.tsx` folder), with
`generateStaticParams()`, `generateMetadata()` (title/description/canonical/OG/Twitter, per-listing
`robots.index` gating), and JSON-LD `WebPage` + `BreadcrumbList` + conditional
`LocalBusiness`/`Restaurant` (`buildListingLocalBusinessJsonLd`) schema. **Both halves of the
prior fix (§1: sitemap function + dynamic route) genuinely landed.** This is a real, substantial
engineering improvement, not a redeployment artifact.

### Why the count is 0, not 11 (or more)

`isIndexableListing()` (`lib/public-listings.ts:24-36`):

```ts
export function isIndexableListing(listing: Listing): boolean {
  const trustedSource = ["owner", "osm", "import", "google_ondemand_reviewed"].includes(listing.dataSource);
  return Boolean(
    listing.active !== false &&
      !isDemoListing(listing) &&
      !listing.needsCategoryReview &&
      listing.qualityScore >= 55 &&
      listing.name.trim() &&
      listing.address.trim() &&
      listing.categories.some((category) => category && category !== "uncategorized") &&
      (listing.claimed || listing.verified || trustedSource),
  );
}
```

`isDemoListing()` returns true whenever `listing.dataSource === "demo"`. Every one of the site's
only real seed source — the 11 `lib/data.ts` businesses — is unconditionally tagged
`dataSource: "demo"` at creation time (`lib/enrich/listing-repo.ts:53`,
`businessToListing()`). A companion test makes the intent explicit and unambiguous
(`lib/seo-auto/__tests__/public-listings.test.ts:7-25`): a demo listing with `qualityScore: 90`
and `verified: true` is asserted `isIndexableListing() === false`. **This exclusion is total and
permanent regardless of quality score or verification status** — it is not "awaiting review," it
is architecturally un-approvable. `/business/newa-lahana` (`dataSource: "demo"`) still 200s live
because `canPreviewListing()` (active + name + slug) is a much looser gate than
`isIndexableListing()` — the page renders with a visible "Preview profile… excluded from search
indexing, sitemaps and business ranking schema" notice (`app/business/[slug]/page.tsx:151-161`)
and `generateMetadata()` correctly sets `robots: {index:false, follow:false}` for it. That part of
the design is sound and matches the homepage copy the orchestrator flagged
(`app/page.tsx:207-208`, `:212-213`).

**The part that breaks the "it's just a moderation queue, wait for approvals" story**: nothing in
the live product can put a *non-demo* listing into the datastore `createListingRepository()`
reads from.

- `app/claim-listing/page.tsx` + `components/dashboard/DashboardProvider.tsx::addListing()` — the
  only live "add a business" UI — is **entirely client-side**. `addListing()` writes to React
  state and `localStorage.setItem("nd-dashboard:v1", …)` only (`DashboardProvider.tsx:315-409`).
  It never calls `fetch()`, never hits an API route, never imports `createListingRepository`. A
  business owner filling out this form today produces a browser-local record indistinguishable
  from a demo, invisible to every other user, and invisible to Postgres.
- `app/super-admin/approvals/page.tsx` and `app/super-admin/businesses/page.tsx` (the moderation
  UI implied by "Review moderation queue" in `app/super-admin/controls/page.tsx:89`) do not import
  `createListingRepository`, `getAllDirectoryListings`, or any real listing accessor — grepped and
  confirmed absent. They are the same client-side/mock-data pattern as the owner dashboard, not a
  connected admin surface over the real `listings` table.
- The one pipeline that *could* create real, non-demo listings — `lib/acquire/osm`,
  `lib/acquire/csv`, `lib/acquire/crawler`, `lib/acquire/onboarding` (all present, all with tests)
  — has **zero live wiring**. `grep -rl "lib/acquire" app/` returns nothing; the only reference in
  `scripts/` is `scripts/gen-osm-seed.ts`, a local dev codegen script
  (`node scripts/gen-osm-seed.ts`) that writes a SQL seed file to disk, not something Vercel ever
  runs. `vercel.json` declares exactly two crons: `/api/cron/blog` (publishes blog posts) and
  `/api/cron/enrich` — and `/api/cron/enrich/route.ts`'s own doc comment confirms its job is
  "autonomous listing **enrichment**… Already-enriched and owner-authored listings are skipped" —
  it enriches rows that already exist, it does not import new ones.

So the honest count of "businesses eligible to ever pass `isIndexableListing()` in production
today" is **zero**, not "11 pending review" and not "some queued, none approved yet." There is no
queue. `DATABASE_URL` is set in `.env.local` (a live Supabase Postgres connection string), and
blog volume jumping from ~12 to 97 URLs strongly suggests the Postgres-backed store is genuinely
active in production for the blog pipeline (same `DATABASE_URL`-gated factory pattern as
`lib/enrich/factory.ts`) — but even with a live DB connected, `PostgresListingRepository` returns
whatever rows exist in the `listings` table, and nothing live writes a non-`demo` row into it.

**Is the design SEO-sound?** The *gate* (`isIndexableListing`) is sound in isolation — it is a
textbook implementation of "don't let thin/unverified programmatic content near the index,"
correctly enforced per-listing via `generateMetadata()`'s `robots` field (not just omission from
the sitemap — actual `noindex,nofollow`, which is the right belt-and-suspenders combination). But
gating content that can never exist is not a moderation strategy, it's an unreachable state. A
directory product's entire value proposition is ranking individual business pages; shipping a
correct, well-tested gate around an empty pipeline still leaves the product with **zero path to
ranking any business**, which is the same existential outcome as the prior audit's Critical
finding — just relocated from "sitemap function is hardcoded" to "there is no supply of
non-demo listings for the (now-correct) sitemap function to read." **Net: still Critical,
requires a new fix — wire `claim-listing`/`DashboardProvider` and/or the `lib/acquire` importers
to `createListingRepository()` for real writes, or bulk-import real Nepal business data with
`dataSource` set to `"import"`/`"osm"` — before this gate can ever produce a non-zero sitemap.**

---

## Carried-over findings from 2026-07-11 — status

| # | 2026-07-11 finding | Status | Evidence |
|---|---|---|---|
| 1 | `getListingSitemapEntries()` hardcoded to 1 literal URL | **FIXED** (code), **REGRESSED** (live count 1→0) | Now calls `getIndexableListings()` → `createListingRepository().all()`, exactly the recommended fix. Live count went from 1 to 0 because the newly-wired gate correctly excludes the one demo URL that used to leak through unconditionally — see VERDICT above. Root cause is now "no non-demo supply," not "hardcoded literal." |
| 1b | No `app/business/[slug]/page.tsx` dynamic route | **FIXED** | `app/business/[slug]/page.tsx` exists with `generateStaticParams`, `generateMetadata`, per-listing `robots` gating, `notFound()` for missing slugs. |
| 1c | No `generateMetadata()` / LocalBusiness schema on business pages | **FIXED** | `generateMetadata()` (title/description/canonical/OG/Twitter) + `buildListingLocalBusinessJsonLd()` (conditional on `isIndexable`) both present. |
| 2 | `sitemap.xml` was a flat 104-URL `<urlset>` (not an index); admin routes leaked in | **FIXED** | Live `sitemap.xml` is now a `<sitemapindex>` with 4 children (`sitemap-pages.xml`, `sitemap-categories.xml`, `sitemap-blog.xml`, `sitemap-listings-1.xml`). Fetched `sitemap-pages.xml` (30 URLs) contains zero `/admin`/`/super-admin` entries — confirmed by direct inspection. |
| 2b | Live `robots.txt` couldn't be produced by any commit in git history (7 UA blocks, `Host:` line, 4 flat sitemaps) | **FIXED** | Live `robots.txt` now matches `app/robots.ts` exactly: single `User-Agent: *` block, `Disallow` list (`/api/`, `/admin/`, `/super-admin/`, `/dashboard/`, `/account/`, `/profile`, `/login`, `/register`, `/forgot-password`, `/gallery`), one `Sitemap:` line pointing at the index. Deployment/build mismatch from the prior audit has resolved. |
| 3 | `priority`/`changefreq` present on every URL (Info, Google ignores both) | **FIXED** | `SitemapEntry`/`SitemapIndexEntry` types and `sitemapXml()`/`sitemapIndexXml()` no longer emit either field. Confirmed absent in all 5 live files. |
| 3b | All-identical `lastmod` (build timestamps) on static/category pages | **IMPROVED** | `sitemap-pages.xml` now omits `<lastmod>` entirely (no fabricated date — correct per rubric: omitting is better than a misleading shared timestamp). `sitemap-categories.xml`'s 6 `directoryCategories` entries share one literal `2026-07-12` (still a Low-severity shared-date pattern, but a real edit-window date, not a build stamp); 8 city entries correctly omit `lastmod` (no fabricated date). `sitemap-blog.xml` (97 posts) retains genuinely staggered per-post dates. |
| 3c | `Listing` type has no `updatedAt`/`createdAt` | **FIXED** | `Listing.updatedAt`, `.createdAt`, `.aiEnrichedAt` all present and consumed by `getListingSitemapEntries()`'s `lastModified` fallback chain — moot today only because 0 listings are indexable, but the plumbing is correct. |
| 4 | 50,000-URL chunking/pagination not implemented (`-1` suffix is a literal folder name) | **STILL OPEN** | No `[chunk]`/`[page]` dynamic segment exists; `app/sitemap-listings-1.xml/route.ts` is still a fixed filename. Not urgent at 0-141 URLs, but unaddressed since the last audit. |
| 5 | Location-page quality gate not triggered (~9-10 location pages) | **STILL OPEN / not triggered**, recount below | 14 total category-sitemap entries (6 category + 8 city pages), well under the 30-page warning threshold — see Quality Gate section. |
| 6 (orchestrator NEW, prior audit) | 12 live blog posts orphaned from sitemap, forming 5 near-duplicate clusters (85-90% shared 5-grams) | **FIXED** | `lib/blog-dedup.ts::duplicateBlogRedirects` maps all 7 identified weaker duplicates to one canonical post per cluster; `next.config.ts:57-61` wires this into real `permanent: true` (301) redirects; `getBlogSitemapEntries()` filters retired duplicates via `removeRetiredDuplicatePosts()` before serialization. A new `isIndexableBlogCategory()` gate (`lib/blog-quality.ts`, `MIN_INDEXABLE_BLOG_CATEGORY_POSTS = 3`) also now excludes thin 1-2 post category archives from the sitemap — a further quality improvement not present in the prior audit. Blog sitemap grew from ~12 to 97 URLs; not re-diffed post-by-post for new duplicate clusters in this pass (see Residual risk below). |

**Residual risk on item 6**: the blog volume nearly 8x'd (12→97) since the last audit via the daily
`/api/cron/blog` cron. The dedup fix targets the 5 specific clusters found last time; it does not
independently prove no *new* near-duplicate clusters have appeared in the other ~85 posts added
since. Recommend a fresh embedding-similarity pass across all 97 live posts before the next audit
cycle — out of scope to hand-verify all 97 in this pass.

---

## NEW findings (this audit)

### N1 — Listings sitemap regressed to 0 URLs; root cause is a missing supply pipeline, not a sitemap bug (Critical)

Covered in full in the VERDICT section above. This supersedes and replaces the prior audit's §1 as
the top Critical finding — the specific bug is different (no writable path to non-demo listings,
not a hardcoded sitemap literal), but the business impact is identical: **zero individually
rankable business pages**, against homepage marketing copy ("50,000+ local businesses",
`app/page.tsx:84` per the prior audit) that the site still cannot back with a single indexable
listing.

**Fix path (two independent options, either unblocks this):**
1. Wire `app/claim-listing`'s `DashboardProvider.addListing()` (or a new server action) to `POST`
   into `createListingRepository()` with `dataSource: "owner"`, gated behind the existing
   `claimed`/`verified` fields once a super-admin approval flow is also connected to the same
   repository (today `app/super-admin/approvals` is disconnected mock UI — wire it to
   `repo.update()`/`listing.verified = true`).
2. Bulk-import real Nepal business records via the already-built `lib/acquire/osm` importer
   (`OSM_TAG_MAP` seed already exists at `db/seeds/osm_tag_map.sql`) with `dataSource: "osm"`,
   which is already in the `trustedSource` allowlist and needs no per-record manual claim.

Either path is necessary before `sitemap-listings-1.xml` can ever contain a URL; today the file is
valid, well-formed XML with a correctly-declared `image` namespace omitted (no images present) and
zero `<url>` children — technically compliant, functionally empty.

### N2 — `app/sitemap-listings-1.xml/route.ts` chunk-count is now provably wrong for scale, not just untested (Medium, sharpened from prior "forward-looking" note)

The prior audit flagged pagination as a forward-looking gap. Now that `getListingSitemapEntries()`
is a real, unbounded query (`repo.all()`), the literal single `sitemap-listings-1.xml` filename in
`app/sitemap.xml/route.ts`'s index will silently under-report once real listings are imported and
exceed 50,000 — there is still no chunking helper or dynamic `[page]` route. Build this
concurrently with N1's fix, not after — importing real data without pagination logic in place
risks a single sitemap file quietly exceeding the limit with no index entry pointing to the
overflow.

---

## Quality Gate check — location pages (14 total in `sitemap-categories.xml`)

Per `C:\Users\amrit\.claude\skills\seo\references\quality-gates.md`:

| Threshold | Trigger count | Live count | Status |
|---|---|---|---|
| ⚠️ Warning (30+ location pages, require 60%+ unique content) | 30 | 8 city pages (`/city/kathmandu`, `/city/pokhara`, `/city/lalitpur`, `/city/bhaktapur`, `/city/chitwan`, `/city/biratnagar`, `/city/butwal`, `/city/dharan`) | **Not triggered** — 8 ≪ 30 |
| 🛑 Hard stop (50+ location pages, require explicit user justification) | 50 | 8 | **Not triggered** |

The remaining 6 entries in `sitemap-categories.xml` (`/category/restaurants`, `/category/hotels`,
`/category/hospitals`, `/category/schools`, `/category/it-companies`, `/category/shops`) are
category pages, not location pages, and are correctly excluded from this count. **Not re-run in
this pass**: whether the 8 live city pages individually clear the 60%+ unique-content bar (the
prior audit did not test this either — flagged then as a forward-looking risk, still untested).
**Forward-looking flag unchanged from the prior audit**: if N1's fix (real listing import) is
followed by programmatic city×category pages (e.g. `/plumbers-in-kathmandu`), that pattern would
cross 30 pages fast and must clear the 60%+ unique-content bar per page before scaling.

---

## Validation summary table

| Check | Result | Severity | vs. 2026-07-11 |
|---|---|---|---|
| XML well-formed (all 5 live files: 1 index + 4 children) | Pass | — | Pass (unchanged) |
| Sitemap index file (`sitemap.xml` is `<sitemapindex>`) | **Pass** | — | Fixed (was flat `<urlset>`) |
| >50,000 URLs | Pass today (141 total); still no chunking logic for when it's needed | Medium (forward-looking, sharpened — see N2) | Unchanged |
| Non-200 sitemap URLs | Pass — all 141 spot-checked entries in scope resolve; `newa-lahana` 200s but is correctly `noindex` via meta robots, not via sitemap omission alone | — | Pass (unchanged, now doubly enforced) |
| Noindexed URLs enumerated in a public sitemap | **Pass** | — | Fixed (10 `/super-admin/*` + `/admin/ai` URLs removed) |
| Admin route leakage | **Pass** | — | Fixed |
| Redirected URLs in sitemap | Pass — none detected; 7 retired blog duplicates correctly excluded from sitemap and 301-redirected | — | Fixed (were orphaned, not redirected, before) |
| Listings coverage vs. real inventory | **Fail — 0 URLs**, root cause changed from "hardcoded literal" to "no non-demo supply pipeline wired to the repository" | **Critical** | REGRESSED (1→0 URLs) / root-cause FIXED-then-reopened |
| robots.txt matches `app/robots.ts` | **Pass** | — | Fixed |
| All-identical lastmod | Reduced to one file (`sitemap-categories.xml`, 6 entries share `2026-07-12`); static pages and city pages now correctly omit lastmod rather than fabricate it | Low | Improved |
| priority/changefreq present | **Absent everywhere** | — | Fixed |
| Pagination readiness (`-1`, `-2`…) | Not implemented — literal folder name only | Medium | Unchanged (now higher-priority given N1) |
| Location-page quality gate | Not triggered (8 city pages + 6 category pages = 14, well under 30) | Info | Unchanged |
| Blog sitemap coverage / duplicate content | **Pass** — 97 URLs, dedup + redirects + thin-category filter now in place | — | Fixed (was 12 orphaned + 12 near-duplicates) |

---

## Score composition

Hygiene/architecture (index structure, robots.txt, admin leakage, priority/changefreq, blog
dedup) is now materially clean — in isolation this slice would score in the 80s-90s. The score is
capped at **44/100** because the Critical failure is the one that matters most for a directory
product: **the listings sitemap — the entire reason this site exists — has 0 URLs**, with a
root cause (no live write path from any UI or importer into the listings datastore) that is
arguably harder to fix than the prior audit's one-line hardcoded literal, because it requires
either backend wiring work (owner submission → DB) or a real data acquisition effort (OSM
import), not a single function change.

---

## Files referenced

- `lib/seo-auto/sitemaps.ts` — `getListingSitemapEntries()` now calls `getIndexableListings()`; `getCategorySitemapEntries()`, `getBlogSitemapEntries()` updated for the new category/dedup gates
- `lib/public-listings.ts` — **new file**: `isIndexableListing()`, `isDemoListing()`, `canPreviewListing()`, `getIndexableListings()`, `getAllDirectoryListings()`, `getDirectoryListing()`
- `lib/seo-auto/__tests__/public-listings.test.ts` — test proving demo listings are unconditionally excluded regardless of quality score
- `lib/enrich/listing-repo.ts` — `businessToListing()` hardcodes `dataSource: "demo"` for all 11 `lib/data.ts` seed businesses; `InMemoryListingRepository`
- `lib/enrich/factory.ts` — `createListingRepository()`, DB/in-memory fallback (now actually consumed by the sitemap, per the prior audit's recommendation)
- `lib/enrich/postgres-repo.ts` — Postgres-backed repo; `.env.local` has a live `DATABASE_URL`
- `app/business/[slug]/page.tsx` — **new file**: dynamic route, `generateMetadata()`, per-listing `robots` gating, `buildListingLocalBusinessJsonLd()`
- `app/claim-listing/page.tsx`, `components/dashboard/DashboardProvider.tsx` — owner "add business" flow; confirmed client-side/`localStorage`-only, never reaches `createListingRepository()`
- `app/super-admin/approvals/page.tsx`, `app/super-admin/businesses/page.tsx` — moderation UI; confirmed disconnected from the real listing repository
- `lib/acquire/osm/`, `lib/acquire/csv/`, `lib/acquire/crawler/`, `lib/acquire/onboarding/` — import pipelines that exist but have zero live wiring (`grep -rl "lib/acquire" app/` empty)
- `scripts/gen-osm-seed.ts` — the only live reference to `lib/acquire`, a local dev codegen script, not a deployed pipeline
- `vercel.json` — confirms only 2 crons exist (`/api/cron/blog`, `/api/cron/enrich`); no acquisition/import cron
- `app/api/cron/enrich/route.ts` — enriches existing listings only, does not import new ones (doc comment confirms)
- `lib/blog-dedup.ts` — **new file**: `duplicateBlogRedirects`, `removeRetiredDuplicatePosts()`
- `lib/blog-quality.ts` — **new file**: `isIndexableBlogCategory()`, `MIN_INDEXABLE_BLOG_CATEGORY_POSTS = 3`
- `next.config.ts` — wires `duplicateBlogRedirects` into real `permanent: true` (301) redirects
- `app/sitemap.xml/route.ts` — now emits `<sitemapindex>`, confirmed live
- `app/sitemap-pages.xml/route.ts`, `app/sitemap-categories.xml/route.ts`, `app/sitemap-blog.xml/route.ts`, `app/sitemap-listings-1.xml/route.ts` — child sitemap routes
- `app/robots.ts` — confirmed live output now matches this source exactly
- `lib/directory-categories.ts`, `lib/city-pages.ts`, `lib/compare.ts` — category/location page data sources (14 total entries in `sitemap-categories.xml`)

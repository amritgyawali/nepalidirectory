# Sitemap Architecture Audit — nepalidirectory.com

Category score: **28 / 100**

Scope: live sitemap files fetched at audit time (`sitemap.xml`, `sitemap-listings-1.xml`,
`sitemap-blog.xml`, `sitemap-categories.xml`, `robots.txt`) cross-referenced against the actual
Next.js 15 source in `c:\Users\amrit\Downloads\NepaliDirectory page claude`.

---

## 1. Blast radius of the #1 critical finding (listings sitemap = 1 URL)

Already root-caused by the orchestrator: `lib/seo-auto/sitemaps.ts::getListingSitemapEntries()`
is hardcoded:

```ts
// lib/seo-auto/sitemaps.ts:71-78
export function getListingSitemapEntries(): SitemapEntry[] {
  return [
    { url: `${siteUrl}${routes.business}`, lastModified: "2026-06-28" },
  ];
}
```

`routes.business` (`lib/routes.ts:8`) is itself a hardcoded literal `"/business/newa-lahana"`,
and only `app/business/newa-lahana/page.tsx` exists — there is no `app/business/[slug]/page.tsx`
dynamic route anywhere in `app/business/`.

**What data source it should be calling instead — exact recommendation:**

A real listing store already exists and is fully wired for exactly this purpose:

- `lib/data.ts` — a static `businesses: Business[]` array with **11** demo businesses, each with
  a real, unique `slug` (`newa-lahana`, `bhojan-griha`, `yangling-tibetan`, `roadhouse-cafe`,
  `himalayan-java-lazimpat`, `annapurna-thakali`, `kathmandu-plumbing-services`,
  `patan-electric-solar`, `citycare-dental-clinic`, `lakefront-inn-pokhara`,
  `legal-line-nepal`). Only 1 of these 11 (`newa-lahana`) has a live page today.
- `lib/enrich/listing-repo.ts::seedListingsFromData()` already maps every entry in `businesses`
  into a normalized `Listing` record (with `slug`, `qualityScore`, etc.) — this conversion layer
  is already built and tested, just never consumed by the sitemap.
- `lib/enrich/factory.ts::createListingRepository()` is the **correct single call site** for the
  sitemap function to use. It already implements the exact fallback the site needs:
  `DATABASE_URL` set → `PostgresListingRepository` (real Supabase-backed listings, unbounded
  count); `DATABASE_URL` unset → `InMemoryListingRepository` seeded from the 11 `lib/data.ts`
  businesses. This is the same repository already used by the enrichment pipeline
  (`lib/enrich/enrich-listing.ts`, `lib/enrich/sweep.ts`) — the sitemap should be just another
  consumer of it, not a separate hardcoded literal.

**Concrete fix:**

```ts
// lib/seo-auto/sitemaps.ts
import { createListingRepository } from "@/lib/enrich/factory";

export async function getListingSitemapEntries(): Promise<SitemapEntry[]> {
  const repo = createListingRepository();
  const listings = await repo.all();
  return listings.map((l) => ({
    url: `${siteUrl}/business/${l.slug}`,
    lastModified: l.aiEnrichedAt ?? undefined, // see §3 — Listing has no updatedAt field yet
  }));
}
```

This requires two coordinated changes, not one — fixing only the sitemap function without the
dynamic route (or vice versa) will make things worse, not better:

1. **Sitemap function** — as above, plus propagate the now-`async` signature up through
   `allSitemapEntries()` (`lib/seo-auto/sitemaps.ts:93`) and
   `app/sitemap-listings-1.xml/route.ts` (trivial — `app/sitemap-blog.xml/route.ts` already
   demonstrates the `async function GET()` pattern in this codebase).
2. **`app/business/[slug]/page.tsx`** — must be created (does not exist today in any form,
   dynamic or otherwise, besides the one static `newa-lahana` folder). Without it, fixing the
   sitemap function alone would put 10 new URLs into the sitemap that instantly 404. Recommend
   `notFound()` for unknown slugs via `repo.get()`/`findBySlug()`, plus `generateMetadata()` per
   listing (title/description/canonical) and JSON-LD `LocalBusiness`/`Restaurant` schema matching
   what `newa-lahana` already renders (schema coverage on that one page is otherwise strong per
   the crawl dataset).

Until both land, the sitemap will keep shipping exactly 1 listing URL against homepage/marketing
copy that claims "50,000+ local businesses" (`app/page.tsx:84`) and category counts like
"12,840 listings" for Kathmandu — a directory site with effectively zero indexable inventory for
its core content type. This is the single highest-leverage fix in the entire audit.

---

## 2. Sitemap segmentation, admin-route leakage, and index-file question

**Live sitemaps today** (as fetched) are 4 flat, independent `<urlset>` files:
`sitemap.xml` (104 URLs, catch-all), `sitemap-listings-1.xml` (1 URL), `sitemap-blog.xml`
(24 URLs), `sitemap-categories.xml` (26 URLs). `robots.txt` lists all 4 directly — no sitemap
index file exists live today. `sitemap.xml` improperly doubles as a "static pages" sitemap AND
contains all 10 `/super-admin/*` + `/admin/ai` URLs (correctly `noindex,nofollow` via meta tag,
per the crawl dataset, but should never be enumerated in a public XML sitemap — wastes crawl
budget and discloses admin panel structure/URL patterns to anyone who requests
`/sitemap.xml`).

**This is already fixed in the repo — but not deployed.** Reading the current source shows a
materially different, better architecture than what's live:

- `app/sitemap.xml/route.ts` no longer emits a flat `<urlset>`. It now emits a **sitemap index**
  (`sitemapIndexXml`) pointing to 4 children: `sitemap-pages.xml`, `sitemap-categories.xml`,
  `sitemap-blog.xml`, `sitemap-listings-1.xml`.
- A new route, `app/sitemap-pages.xml/route.ts`, now carries the static-page list
  (`getPageSitemapEntries()` = static routes + author pages) — this is the intended replacement
  for what `sitemap.xml` used to contain directly.
- `lib/seo-auto/sitemaps.ts::getStaticSitemapEntries()` filters routes through
  `isIndexableRoute()` (`lib/seo-config.ts:45`), which excludes any path under
  `nonCrawlableRoutePrefixes = ["/api","/admin","/super-admin","/dashboard","/account"]` and any
  path in `noIndexRoutes` (`/search`, `/profile`, `/account`, `/login`, `/register`,
  `/forgot-password`, `/dashboard*`). **Once deployed, `/super-admin/*` and `/admin/ai` will
  correctly disappear from the sitemap entirely.**
- `app/robots.ts` (current source) also disallows `/api/`, `/admin/`, `/super-admin/`,
  `/dashboard/`, `/account/`, `/search`, `/profile`, `/login`, `/register`,
  `/forgot-password` — but only declares **one** sitemap (`${siteUrl}/sitemap.xml`, i.e. the
  index), matching best practice of pointing robots.txt at the index rather than every child.

**The live robots.txt cannot be produced by this code at all**: it has 7 explicit per-bot
`User-Agent` blocks (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot, PerplexityBot,
ClaudeBot) plus a `Host:` line and 4 flat `Sitemap:` entries — none of which the single-rule
`MetadataRoute.Robots` object in `app/robots.ts` can generate (Next's robots() here only emits
one generic `User-Agent: *` block, no `Host` field, one sitemap URL). `git log` shows
`app/robots.ts` and `app/sitemap.xml/route.ts` have looked essentially like this since the
earliest tracked commits (`4553ccf`, `31fb613`) — there is no version of this repo that would
have produced the live robots.txt. Combined with the audit context's confirmation that
**production is stale (newer `origin/main` commits never deployed)**, this means the live
robots.txt/sitemap.xml were built from a different, older deployment artifact than anything
currently in git history. **Recommend the owner verify how production was actually built**
(check Vercel deployment source commit / whether a static `public/robots.txt` was ever used and
later removed from the repo) in addition to simply redeploying `origin/main`.

**Net recommendation:** redeploy `origin/main` to production. That alone fixes the admin-leakage
and flat-vs-index issues (assuming the deployed commit matches what's in this repo). Verify
post-deploy that:
- `GET /sitemap.xml` returns a `<sitemapindex>`, not a `<urlset>`.
- `GET /sitemap-pages.xml` exists and excludes all `/super-admin/*` and `/admin/ai`.
- `robots.txt` reflects `app/robots.ts` (single UA block, disallows admin/dashboard/account,
  one `Sitemap:` line pointing at the index) — if it still doesn't match, the mismatch is coming
  from outside this repo (Vercel project settings / a stale build) and needs separate
  investigation.

---

## 3. lastmod / priority / changefreq quality gate

**priority/changefreq**: present on every URL in all 4 live sitemaps. Both are ignored by
Google (and largely by Bing) — pure Info-level noise, not harmful, but safe to drop to simplify
`sitemapXml()`/`sitemapIndexXml()` output. Values are internally reasonable relative to each
other (home=1.0, blog index=0.9, city pages=0.86, blog posts/compare categories=0.85, generic
static=0.7) but that relative signal reaches no audience that consumes it.

**lastmod accuracy — mixed**:
- Static pages in `sitemap.xml` (`/about`, `/contact`, `/privacy`, etc.) all share **one
  identical timestamp** (`2026-07-07T15:29:06.702Z`) — this is a build/generation timestamp, not
  a real content-modification date. Classic Low-severity "all identical lastmod" pattern per the
  rubric; harmless but not meaningful. `getStaticSitemapEntries()` doesn't set `lastModified` at
  all for these routes in the current source — good, since omitting a misleading date is better
  than fabricating one, but means static pages will emit no `<lastmod>` post-deploy. Recommend
  adding real content-hash or CMS-edit timestamps only if/when static pages become editable;
  otherwise omitting is fine.
- The single listing entry's lastmod is inconsistent between live (`2026-07-07T15:29:09.004Z`,
  a build timestamp) and current source (hardcoded literal `"2026-06-28"` string) — another
  signal of stale deployment, not a live bug to fix directly (goes away once §1's real fix ships
  real listing `updatedAt`/`aiEnrichedAt` values).
- Blog posts (`sitemap-blog.xml`) have genuinely distinct, staggered dates
  (2026-06-06 through 2026-06-27) — good, plausible per-post dates, no complaint here.
- Category pages (`compare-business/*`, `city/*`) all share one identical timestamp per file
  (`2026-06-27T00:00:00.000Z` for compare categories; `2026-07-07T15:29:0X.00XZ` for city pages)
  — again build-time stamps rather than real content dates, Low severity.
- **Data-model gap enabling this**: `Listing` (`lib/enrich/types.ts`) has no `updatedAt`/
  `createdAt` field at all, even though `PostgresListingRepository.update()`
  (`lib/enrich/postgres-repo.ts:153`) already writes `updated_at=now()` to the DB. Recommend
  adding `updatedAt: Date` to the `Listing` type and surfacing it through `all()`/`get()` so the
  listings sitemap (once fixed per §1) can emit real, per-listing `lastmod` instead of a single
  hardcoded string.

**XML validity**: all 4 sitemaps are well-formed XML, correct `urlset` namespace, and the
`image:` namespace is (in the live files) declared even on files with no images
(`sitemap-listings-1.xml` declares `xmlns:image` but has no `<image:image>` — harmless but
unnecessary). The current source's `sitemapXml()` (`lib/seo-auto/sitemaps.ts:106-123`) only adds
the image namespace conditionally (`hasImages` check) — an improvement already in place, pending
deploy.

**Pagination / 50,000-URL-limit readiness — does NOT exist yet.** `sitemap-listings-1.xml`'s
`-1` suffix implies chunked pagination (`-2`, `-3`, …) once listing volume grows, but this is
purely a literal folder name (`app/sitemap-listings-1.xml/route.ts`) — there is no
`[page]`/`[chunk]` dynamic segment, no loop that emits multiple listing sitemap files, and no
logic anywhere in `lib/seo-auto/sitemaps.ts` or `app/sitemap.xml/route.ts` that checks entry
count against 50,000 or generates additional `<sitemap>` index entries. Confirmed via search —
no "50000", "chunk", or "listings-2" pattern exists in `app/` or `lib/`. **This is fine at
today's real scale (1–11 businesses) but is a Medium-severity gap that must be built before real
listing volume approaches even a few thousand URLs**, let alone the marketed "50,000+". Needed
work once §1 ships:
1. Add a chunking helper (e.g. `chunkSitemapEntries(entries, 50000)`).
2. Convert `app/sitemap-listings-1.xml/route.ts` into a dynamic route
   (`app/sitemap-listings-[page]/route.ts` or equivalent) that serves the correct chunk based on
   `[page]`.
3. Have `app/sitemap.xml/route.ts`'s index enumerate however many listing-chunk URLs are
   actually needed (currently hardcodes exactly one `sitemap-listings-1.xml` entry regardless of
   real listing count).

**Location-page quality gate**: not currently triggered. `cityDirectoryPages` (`lib/city-pages.ts`)
= 8 cities; only 1 `/compare-business/*` slug carries a city qualifier
(`cafes-lalitpur`); `best/restaurants/kathmandu` is a single evergreen page. Total
location-flavored pages ≈ 9-10, well under the 30-page warning threshold. **Forward-looking
flag**: if the listings fix in §1 is followed by programmatic city×category "doorway" pages
(e.g. `/plumbers-in-kathmandu`, `/plumbers-in-pokhara`, …) to make the marketed 7-province,
50,000+ listing scale look real, that pattern would cross the 30-page warning almost immediately
and the 50-page hard stop shortly after — require 60%+ unique content per page (real listing
data per city, not just a swapped city name in a template) before scaling any such page type.

---

## Validation summary table

| Check | Result | Severity |
|---|---|---|
| XML well-formed (all 4 live files) | Pass | — |
| >50,000 URLs | Pass today (103 total); no chunking logic exists for when it's needed | Medium (forward-looking) |
| Non-200 sitemap URLs | Pass — all 103 return 200 | — |
| Noindexed URLs in sitemap | **Fail** — 10 `/super-admin/*` + `/admin/ai` URLs in live `sitemap.xml`, all noindex,nofollow | High |
| Redirected URLs in sitemap | Pass — none detected | — |
| Listings coverage vs. real inventory | **Fail** — 1 URL vs. 11 seedable businesses vs. "50,000+" marketing claim; no dynamic route exists to render them | Critical |
| Sitemap index file | Missing live (4 flat files); already implemented in repo source, not deployed | High (deploy gap) |
| robots.txt matches current app/robots.ts | **Fail** — live robots.txt cannot be produced by any commit in git history | High |
| All-identical lastmod | Present on static pages + category pages (build timestamps) | Low |
| priority/changefreq present | Present everywhere, Google ignores both | Info |
| Pagination readiness (`-1`, `-2`…) | Not implemented — literal folder name only | Medium |
| Location-page quality gate | Not triggered today (~9-10 location pages); flag for future scale-up | Info |

---

---

## 4. NEW (orchestrator, post-hoc) — 12 live blog posts orphaned from the sitemap, forming 5 near-duplicate content clusters

Found by cross-referencing `llms.txt` and `/blog/rss.xml` (both dynamic, both correctly track live
content) against `sitemap-blog.xml` (static, 15 URLs including the index page) and against
`lib/blog.ts`'s hardcoded `blogPosts` array (14 entries — the same array `sitemap-blog.xml`
serializes). **12 blog posts exist live (HTTP 200, spot-checked 7 of them directly), are listed in
both `llms.txt` and `/blog/rss.xml`, but are completely absent from `sitemap-blog.xml`** — same
root-cause shape as §1's listings bug (a static seed array in `lib/blog.ts` not reflecting real
published content), but this time affecting a content type that genuinely *is* being published
live (via the daily `/api/cron/blog` job, `vercel.json`: `0 3 * * *`), just not sitemap-tracked.

The 12 orphaned slugs cluster into **5 topic groups with 2-3 near-duplicate posts each**,
published within 1-2 days of each other:

| Topic cluster | Slugs | Published |
|---|---|---|
| Choosing a restaurant/cafe | `questions-to-ask-before-choosing-a-restaurant-or-cafe-in-nepal`, `questions-to-ask-before-choosing-a-restaurant-or-cafe-in-nepal-a-comprehensive-g`, `choosing-the-right-restaurant-or-cafe-in-nepal-questions-to-ask` | 3 posts |
| Comparing local services before booking | `how-to-compare-local-services-in-nepal-before-booking`, `how-to-compare-local-services-in-nepal-before-booking-a-practical-guide`, `compare-local-services-in-nepal-a-practical-guide` | 3 posts |
| Comparing event venues/vendors | `how-to-compare-event-venues-and-vendors-in-nepal`, `how-to-compare-event-venues-and-vendors-in-nepal-a-practical-guide` | 2 posts |
| Comparing clinics/appointments | `how-to-compare-clinics-and-appointments-in-nepal`, `how-to-compare-clinics-and-book-appointments-in-nepal-a-practical-guide` | 2 posts |
| Comparing repair providers | `how-to-compare-repair-providers-in-nepal-before-hiring`, `compare-plumbers-and-electricians-in-nepal-a-guide-to-hiring-the-right-repair-pr` | 2 posts |

**Verified, not assumed**: fetched and text-diffed the 3-post "local services" cluster directly.
Published 2026-07-05/2026-07-06 (1 day apart), 886-972 words each, and share **85-90% of their
5-word phrase sequences** pairwise (686/771, 703/819, 687/771 shared 5-grams) — this is
near-verbatim duplicate content under three different slugs and titles, not three genuinely
distinct angles on the same topic.

**Why this matters beyond "missing from sitemap"**: the project's own build docs describe the
auto-blog cron as having "embedding dedup" specifically to prevent this. Live evidence shows
dedup is not preventing near-identical republishing across at least 5 topic clusters. This is a
Critical-severity finding in its own right (separate from, and in addition to, the sitemap-only
gap): duplicate content dilutes ranking signal across near-identical URLs, wastes crawl budget,
and — because these posts aren't in the sitemap — Google's primary discovery path for them is
whatever internal links exist plus (if Google chooses to fetch it, which is not guaranteed the way
XML sitemap submission is) the RSS feed, no structured discovery guarantee at all.
**Recommend**: (1) fix the dedup embedding-similarity threshold in the auto-blog cron so near-
duplicate topics are rejected or merged before publish, not after; (2) 301-redirect or canonicalize
the 7 weaker duplicates in each cluster to one surviving canonical post per topic rather than
leaving 2-3 live URLs per topic; (3) once deduped, make sure `lib/blog.ts`/`sitemap-blog.xml`'s
data source matches whatever store `llms.txt` and `/blog/rss.xml` already correctly read from, so
this doesn't recur for future legitimately-distinct posts.

---

## Files referenced

- `lib/seo-auto/sitemaps.ts` — sitemap entry generators, `getListingSitemapEntries()` bug
- `lib/routes.ts` — hardcoded `routes.business = "/business/newa-lahana"`
- `lib/data.ts` — `businesses: Business[]` (11 entries) — real listing source, unused by sitemap
- `lib/enrich/listing-repo.ts` — `InMemoryListingRepository`, `seedListingsFromData()`
- `lib/enrich/factory.ts` — `createListingRepository()` — correct call site for the fix
- `lib/enrich/postgres-repo.ts` — Postgres-backed repo, used once `DATABASE_URL` is set
- `lib/enrich/types.ts` — `Listing` type, missing `updatedAt`/`createdAt`
- `lib/seo-config.ts` — `isIndexableRoute()`, `nonCrawlableRoutePrefixes`, `robotsDisallowPaths`
- `app/robots.ts` — current robots source, doesn't match live output
- `app/sitemap.xml/route.ts` — now a sitemap index (undeployed)
- `app/sitemap-pages.xml/route.ts` — new static-pages sitemap (undeployed, not in live robots.txt)
- `app/sitemap-listings-1.xml/route.ts`, `app/sitemap-categories.xml/route.ts`,
  `app/sitemap-blog.xml/route.ts` — child sitemap routes
- `app/business/newa-lahana/page.tsx` — only existing business page (static, not dynamic)
- `lib/city-pages.ts`, `lib/compare.ts` — location/category page data sources

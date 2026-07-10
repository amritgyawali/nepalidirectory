# Content Architecture / Semantic Clustering — nepalidirectory.com

**Score: 32/100** (Content Architecture Maturity)

## Method note
This is a code-verified audit (read `lib/blog.ts`, `lib/city-pages.ts`, `lib/compare.ts`,
`app/blog/[slug]/page.tsx`, `app/city/[slug]/page.tsx`, `app/compare-business/[slug]/page.tsx`,
`components/directory/CityLandingPage.tsx`, `components/layout/{Header,Footer}.tsx`, `app/page.tsx`,
`lib/routes.ts`, `lib/data.ts`), not just HTML scraping — so link-graph claims below are ground truth
from source, not inference. SERP-overlap methodology (per `skills/seo-cluster/references/`) was applied
selectively via live WebSearch to validate the highest-priority gap topics for real demand/competition
(see "SERP validation" section) rather than exhaustively pairwise across 40+ keywords, since this is one
input into a larger site audit rather than a standalone clustering engagement.

## What works
- A real taxonomy exists at the data layer: 10 blog categories, 16 `/compare-business/*` categories, 8
  `/city/*` pages — a legitimate hub-and-spoke *content model*, just not a hub-and-spoke *link graph* (see
  Critical finding below).
- No keyword cannibalization detected among the 14 existing posts — each has a distinct primary keyword
  set (`lib/blog.ts` `keywords[]`); topical overlap between `kathmandu-newari-food` and
  `kathmandu-restaurant-guide` is real but intent-differentiated (dish-led vs. area-led) and low risk.
- `BlogPostPage` computes a genuine "Related guides" widget (category + tag match, 3 posts) — the only
  working piece of automated internal linking in the whole content layer.
- Schema (`BlogPosting`/`Article` + `BreadcrumbList` + `FAQPage`/`ItemList`) is correctly layered per page
  type, which is a reasonable foundation to build real hub/spoke `isPartOf`/`ItemList` relationships on
  top of later.
- Centralized, typed data files (`lib/blog.ts`, `lib/city-pages.ts`, `lib/compare.ts`) make the fixes
  below cheap to implement — this is a link-wiring problem, not a content-modeling problem.

## Findings

### Critical — Blog posts and city/category hub pages do not link to each other at all
**Description:** Verified in source, not just crawl data. `app/blog/[slug]/page.tsx` renders body content
from `post.sections[].paragraphs` as plain `<p>` text with zero embedded links — there is no mechanism for
inline contextual links at all. The only outbound links on a blog post are: back to `/blog`, the author
page, tag search (`/blog?tag=`), and one generic "Continue researching" block that links to the *index*
pages `/compare-business`, `/categories`, `/ask-question` — never to a specific `/city/[slug]` or
`/compare-business/[slug]`. Conversely, `CityLandingPageView` (used by every `/city/[slug]` page) and
`app/compare-business/[slug]/page.tsx` link only to search, other cities, other compare categories, and
generic category tiles that themselves point at `/search` (see next finding) — never to any blog post.
Concretely, `/blog/kathmandu-newari-food` never links to `/city/kathmandu` or
`/compare-business/restaurants`, and `/city/kathmandu` never links back to any of the 6 Kathmandu-relevant
blog posts that exist. This is true for every one of the 12 blog posts that has an obvious topical match
to a live city/category hub page (see matrix below). The result: the three page types that should form a
hub-and-spoke cluster (`/blog/*` spokes, `/city/*` hubs, `/compare-business/*` hubs) function as three
disconnected silos. None of the "mandatory spoke-to-pillar" or "pillar-to-spoke" link rules from the
hub-spoke architecture spec are satisfied anywhere on the site today.
**Recommendation:** Add contextual `<Link>`s inside `BlogSection` paragraphs (or a dedicated "Related to
this guide" block placed mid-article, not just in a footer strip) from each post to its matching
`/city/[slug]` and `/compare-business/[slug]` page, and add a "From our guides" module to
`CityLandingPageView` and the compare-business template that pulls matching posts by category/city (the
data needed — `post.category`, `post.tags`, city name substring match — already exists; this is a
render-layer fix, not a data-modeling one).

### Critical — Footer "City Guides" navigation omits the 5 highest-value city hub pages entirely
**Description:** `Footer.tsx` renders `cityLinks.slice(0, 12)` from `lib/data.ts`. That `cityLinks` array
is `["Biratnagar","Birgunj","Butwal","Bharatpur","Dharan","Nepalgunj","Hetauda","Itahari","Dhangadhi",
"Janakpur","Ghorahi","Tulsipur","Damak","Kirtipur","Banepa"]` — a *different* list from the `cities` array
that actually backs the 8 real `/city/*` pages. **Kathmandu, Pokhara, Lalitpur, Bhaktapur, and Chitwan —
the 5 cities with real dedicated hub pages and the highest sitemap priority (0.86) — never appear in the
footer at all.** Of the 12 names the footer does render, only 3 (Biratnagar, Butwal, Dharan) resolve to a
real `/city/[slug]` page via `getCityHref()`; the other 9 fall back to `/search?location=X`, a thin,
non-canonical, non-indexed page type. So the sitewide footer's one city-navigation widget spends 9 of its
12 links on pages that don't structurally exist as content, and skips the pages that do. The homepage
separately renders the correct 8 cities via a different `cities` array/`CityCard` component, so the real
hub pages aren't fully orphaned — but they depend entirely on the homepage module and the sitemap for
discovery, with no reinforcement from the global footer that appears on all 103 pages.
**Recommendation:** Point `Footer.tsx`'s "City Guides" block at the same `cities` array (or
`cityDirectoryPages`) used on the homepage instead of the unrelated `cityLinks` list, so every page on the
site reinforces the 8 real city hubs. Keep the longer `cityLinks` list for a genuinely separate
"more locations we cover" widget if desired, but don't label it "City Guides."

### High — Primary header navigation has no Blog or Compare Business entry point
**Description:** `lib/routes.ts` `primaryNav` (rendered by `Header.tsx` on every page) contains: Find
People, Deals, Add Business, Advertise, Write a Review, Super Admin, Log In, Sign Up. Neither `/blog` nor
`/compare-business` appears in primary nav — both are footer-only. This doesn't block crawling (both are
in `sitemap-blog.xml`/`sitemap-categories.xml` and linked from the footer), but it materially weakens the
click-path a user or a search engine's "reasonable surfer" model would assign to the cluster content,
compounding the two findings above.
**Recommendation:** Add "Guides" (or "Blog") and "Compare" to primary nav, or at minimum a mega-menu
entry, given these represent 14 + 16 pages of the site's non-transactional content.

### High — 8 of 16 `/compare-business/*` categories and 4 of 8 cities have zero supporting blog content
**Description:** Full city × category coverage audit (from `lib/blog.ts` `category`/`tags`/`title` fields
cross-referenced against `lib/city-pages.ts` and `lib/compare.ts`):
- **Cities with 0 blog posts:** Bhaktapur, Biratnagar, Butwal, Dharan (4 of 8 — all have live, indexed
  `/city/*` pages with 0.86 sitemap priority but no editorial content pointing at them).
- **Cities with content:** Kathmandu (6 posts — newari-food, restaurant-guide, hospitals-clinics, home-
  services, dental-clinic, compare-schools), Pokhara (2 posts, both travel-only — no restaurant/hotel/
  service spoke despite being the #2 tourism hub), Lalitpur (1 post — cafes only), Chitwan (1 post — safari
  travel only, no business-category spoke).
- **`/compare-business/*` categories with 0 blog support:** Photography, Hotels, Travel Agencies, Doctors,
  Plumbers, Electricians, Beauty Salons, Gyms & Fitness Centers (8 of 16).
- **Categories with at least indirect support:** Restaurants, Home Services, Healthcare-clinics,
  Contractors, Dental-clinics, Schools, Cafes (Lalitpur), Wedding-venues/planners (partial, via the
  wedding checklist).
Content is heavily Kathmandu- and travel-skewed relative to the directory's actual footprint (7 provinces,
8 cities, 16 service categories claimed sitewide).
**Recommendation:** See prioritized net-new cluster proposal below — target the zero-coverage
cities/categories first since they compound two problems at once (thin/orphaned hub pages *and* missing
spoke content).

### Medium — "View all cities" CTA and city index are broken/misleading
**Description:** `routes.city = "/city/kathmandu"` — a single specific city page, not an index. The
homepage's "Popular cities" section CTA is labeled "View all cities" but `href={routes.city}` sends users
to `/city/kathmandu` again. There is no `app/city/page.tsx` — only `app/city/kathmandu/page.tsx` (static)
and `app/city/[slug]/page.tsx` (dynamic), so a true `/city` index route doesn't exist to link to even if
the CTA were fixed.
**Recommendation:** Either build a real `/city` index page listing all 8 cities (a natural "super-hub"
that would also give the cluster architecture a top-level entry point beyond the homepage/footer/sitemap)
or repoint the CTA at `/compare-business`-style browse pattern; don't label a single-city link "View all."

## City × Category coverage matrix (blog spoke support)

| City | Blog posts | Compare-business categories with a matching spoke |
|---|---|---|
| Kathmandu | 6 (Newari food, restaurant guide, hospitals/clinics, home services, dental, schools) | Restaurants, Home Services, Healthcare-clinics, Contractors, Dental-clinics, Schools |
| Pokhara | 2 (travel guide, Annapurna Circuit) — both travel only | none |
| Lalitpur | 1 (cafes) | Cafes (Lalitpur) only |
| Chitwan | 1 (safari travel) — travel only | none |
| Bhaktapur | 0 | none |
| Biratnagar | 0 | none |
| Butwal | 0 | none |
| Dharan | 0 | none |
| (Nepal-wide, no city) | 3 (wedding checklist, list-your-business, local-SEO checklist) | Wedding-venues/planners (partial) |

Categories with **zero** blog spoke anywhere: Photography, Hotels, Travel Agencies, Doctors, Plumbers,
Electricians, Beauty Salons, Gyms & Fitness Centers.

## SERP validation of proposed gap topics (live WebSearch, per SERP-overlap methodology)

Spot-checked the highest-priority proposed topics for real search demand and competitive shape before
recommending them:
- **"best restaurants in Pokhara Nepal"** — active SERP dominated by TripAdvisor + independent travel
  blogs (travelinsighter.com, travellingmandala.com, kimkim.com); nepalidirectory.com does not currently
  rank. Genuine open opportunity, commercial/rank intent → `best-of` template.
- **"hotels in Pokhara Lakeside best"** — TripAdvisor/Booking/Expedia + independent blogs dominate;
  confirms Hotels is a real, competitive, zero-coverage category gap.
- **"wedding photographer cost Kathmandu Nepal"** — SERP is Nepal-specific vendor/blog content
  (weddingkathmandu.com, blazebytemedia.com) with real published price ranges (NPR 35,000–150,000+);
  commercial-investigation intent → `comparison`/`review` template, pairs naturally with the existing
  `nepal-wedding-planning-checklist` pillar-ish post (same cluster, overlap estimated 4-6, not 7+, so a
  separate deep-dive post is warranted, not a merge).
- **"best gym Kathmandu membership cost"** — SERP mixes local operators (Unique Power Gym, KlumFit,
  Jacked Fitness) and one competitor content roundup (thulobazaar.com.np); real local pricing data exists
  (NPR 1,500–12,000/mo) to build a genuinely useful comparison page against; Gyms & Fitness is a
  zero-coverage category with real demand.
- **"things to do in Biratnagar Nepal"** and **"how to plan a trip to Chitwan National Park from
  Kathmandu"** — both return active, ranking third-party content (hellotravel, thrillophilia, kimkim,
  thelongestwayhome), confirming these are addressable topics with real query volume, not dead-end
  keywords, and that Biratnagar specifically (currently 0 posts, city page exists) has enough distinct
  local subject matter (Kali Temple, Haat Bazaar, jute mill heritage, Koshi Barrage) to support original,
  non-thin content rather than a generic filler post.

No 7+ overlap ("merge into one post") pairs were found between any proposed new topic and an existing
post — all proposed topics are additive, not cannibalizing.

## Proposed net-new cluster plan (prioritized)

Treat existing `/city/[slug]` and `/compare-business/[slug]` pages as the pillars (per the site's existing
information architecture) and add spokes to close the coverage gaps, in priority order:

### Cluster 1 — Pokhara local business spokes (pillar: `/city/pokhara`) — Priority 1
1. "Best Restaurants in Pokhara Lakeside" — commercial/rank — `best-of` — ~1,400 words — links to
   `/city/pokhara` + `/compare-business/restaurants` (mandatory)
2. "Best Hotels in Pokhara: Lakeside Budget to Luxury" — commercial/rank — `best-of` — ~1,500 words —
   links to `/city/pokhara` + `/compare-business/hotels` (fills the only fully-zero category, mandatory)
3. "Pokhara Travel Agencies and Trekking Permit Desks Compared" — commercial/compare — `comparison` —
   ~1,300 words — links to `/city/pokhara` + `/compare-business/travel-agencies`, interlinks to existing
   `pokhara-travel-guide` and `annapurna-circuit-guide` (sibling spokes, recommended)

### Cluster 2 — Wedding vendor deep-dives (pillar: `/compare-business/wedding-venues` +
`/compare-business/wedding-planners` + `/compare-business/photography`) — Priority 2
1. "Wedding Photographer Cost in Kathmandu: Packages Compared" — commercial/evaluate — `comparison` —
   ~1,400 words — links to `/compare-business/photography` + existing `nepal-wedding-planning-checklist`
2. "Best Wedding Venues in Kathmandu by Guest Count" — commercial/rank — `best-of` — ~1,500 words — links
   to `/compare-business/wedding-venues`

### Cluster 3 — Fitness & wellness (pillar: `/compare-business/gyms-fitness-centers`) — Priority 2
1. "Gym Membership Costs in Kathmandu: What You Actually Pay" — informational/how + commercial — `how-to`
   — ~1,300 words — links to `/compare-business/gyms-fitness-centers` + `/city/kathmandu`
2. "Best Gyms in Kathmandu and Lalitpur for Beginners" — commercial/rank — `best-of` — ~1,400 words

### Cluster 4 — Home services category depth (pillar: `/compare-business/plumbers` +
`/compare-business/electricians`) — Priority 3
1. "Plumber Call-Out Charges in Kathmandu: Fair Price Guide" — informational/how — `how-to` — ~1,200
   words — interlinks with existing `home-services-kathmandu-costs-booking-safety` (sibling, same cluster,
   estimated overlap 4-6 — differentiate as pricing deep-dive vs. the existing booking/safety overview)
2. "Electrician Safety Checklist Before You Hire in Nepal" — informational/how — `how-to` — ~1,200 words

### Cluster 5 — City coverage gap-fill (pillars: `/city/bhaktapur`, `/city/biratnagar`, `/city/butwal`,
`/city/dharan`) — Priority 1 (structural — these hub pages currently have zero supporting content anywhere)
1. "Bhaktapur Heritage Food and Pottery Square Guide" — informational — `explainer`/`listicle` — ~1,300
   words — links to `/city/bhaktapur`
2. "Biratnagar Local Guide: Temples, Markets and Jute Mill Heritage" — informational — `listicle` —
   ~1,300 words — links to `/city/biratnagar` (validated: real distinct local subject matter, zero
   existing site competition)
3. "Butwal Local Business and Travel Guide" — informational — `explainer` — ~1,200 words — links to
   `/city/butwal`
4. "Dharan Local Guide: Food, Colleges and Things to Do" — informational — `explainer` — ~1,200 words —
   links to `/city/dharan`

Total proposed: 13 new spoke posts across 5 clusters, all additive (no cannibalization against the
existing 14), each closing a specific, code-verified coverage or link-graph gap rather than being
speculative topic ideation.

## Internal link matrix recommendation (existing content — no new posts required)

Wire these bidirectional links first; this is pure render-layer work against data that already exists:

| Blog post | Should link to (mandatory) | Should link to (recommended) |
|---|---|---|
| `kathmandu-newari-food` | `/city/kathmandu`, `/compare-business/restaurants` | `kathmandu-restaurant-guide` |
| `kathmandu-restaurant-guide` | `/city/kathmandu`, `/compare-business/restaurants` | `kathmandu-newari-food` |
| `verified-contractor-nepal` | `/compare-business/contractors` | `home-services-kathmandu-costs-booking-safety` |
| `home-services-kathmandu-costs-booking-safety` | `/city/kathmandu`, `/compare-business/home-services` | `verified-contractor-nepal` |
| `pokhara-travel-guide` | `/city/pokhara` | `annapurna-circuit-guide`, `chitwan-safari-local-travel-guide` |
| `annapurna-circuit-guide` | `/city/pokhara` | `pokhara-travel-guide` |
| `kathmandu-hospitals-clinics-checklist` | `/city/kathmandu`, `/compare-business/healthcare-clinics`, `/compare-business/doctors` | `kathmandu-dental-clinic-guide` |
| `kathmandu-dental-clinic-guide` | `/city/kathmandu`, `/compare-business/dental-clinics` | `kathmandu-hospitals-clinics-checklist` |
| `lalitpur-cafes-work-meetings` | `/city/lalitpur`, `/compare-business/cafes-lalitpur` | — |
| `chitwan-safari-local-travel-guide` | `/city/chitwan` | `pokhara-travel-guide` |
| `nepal-wedding-planning-checklist` | `/compare-business/wedding-venues`, `/compare-business/wedding-planners`, `/compare-business/photography` | — |
| `compare-schools-kathmandu-admissions` | `/city/kathmandu`, `/compare-business/schools` | — |
| `list-business-nepal-directory` | `/advertise`, `/claim-listing` | `nepal-local-seo-checklist-small-businesses` |
| `nepal-local-seo-checklist-small-businesses` | `/advertise` | `list-business-nepal-directory` |

Reverse direction (add to `CityLandingPageView` and compare-business template, "From our guides" module):
every `/city/[slug]` and `/compare-business/[slug]` page should surface the posts listed as linking to it
above — currently zero city or compare pages link to any blog post.

## Cannibalization check
Reviewed all 14 `keywords[]` arrays in `lib/blog.ts` for near-duplicate primary targeting. No pair scores
in the 7-10 ("merge") range. One pair in the soft 2-3 ("interlink") range —
`kathmandu-newari-food` vs. `kathmandu-restaurant-guide` (both Kathmandu food/dining, different sub-intent)
— resolved by the interlink recommendation above rather than merging. No other conflicts found.

## Quick wins
1. Add 2-4 contextual in-body links per blog post to its matching `/city/[slug]` and
   `/compare-business/[slug]` page (12 of 14 posts have an obvious match already identified in the link
   matrix above) — this alone converts the site from zero hub-spoke connectivity to a working cluster
   graph with no new content required.
2. Fix `Footer.tsx` to source "City Guides" from the same `cities`/`cityDirectoryPages` data the homepage
   uses instead of the unrelated `cityLinks` array, so Kathmandu, Pokhara, Lalitpur, Bhaktapur and Chitwan
   stop being omitted from the one navigation widget that appears on all 103 pages.
3. Add a "From our guides" module (2-4 linked posts) to `CityLandingPageView` and the
   `compare-business/[slug]` template, filtered by category/city match — same data-driven pattern already
   proven by the working "Related guides" widget on blog posts.

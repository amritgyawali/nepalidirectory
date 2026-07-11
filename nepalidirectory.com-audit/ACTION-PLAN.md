# Action Plan — nepalidirectory.com

Prioritized Critical → High → Medium → Low. Each item links to the findings file with full
evidence and code-level detail.

---

## Critical (fix immediately)

1. **Fix the core listings pipeline.** Wire `lib/seo-auto/sitemaps.ts::getListingSitemapEntries()`
   to `lib/enrich/factory.ts::createListingRepository()` (already built, already used by the
   enrichment pipeline — just never called by the sitemap) and build
   `app/business/[slug]/page.tsx` with `generateMetadata()` and `LocalBusiness`/`Restaurant`
   schema matching the existing `newa-lahana` template. Both changes are required together — one
   without the other either produces an unchanged sitemap or 404s on new URLs.
   → `findings/sitemap.md` §1 (full code diff included)

2. **Replace client-side admin auth with real server-side authentication.** `app/login/page.tsx`
   ships hardcoded credentials (`superadmin`/`superadmin`, `admin`/`admin`) in the browser bundle
   with `localStorage`-only session state. Implement Supabase Auth (already wired via
   `utils/supabase/`) enforced in `middleware.ts` before any `/super-admin/*` or `/admin/*` route
   renders. Remove the public "Super Admin" nav link in `lib/routes.ts`. **Do this before
   `DATABASE_URL` is set in production.**
   → `findings/technical.md` §0, `findings/visual.md`

3. **Fix the auto-blog duplicate-content pipeline.** 12 live posts across 5 topic clusters share
   85–90% of their text, published 1–2 days apart. Tighten the embedding-dedup similarity
   threshold in the blog cron; consolidate each cluster to one canonical post (301 the rest).
   → `findings/sitemap.md` §4, `findings/content.md`, `findings/geo.md`

4. **Add a hard host redirect.** `nepalidirectory.com` (non-www) serves HTTP 200 directly instead
   of a 308 to `www.nepalidirectory.com`. Add a Vercel host-based redirect rule or a
   `middleware.ts` host check.
   → `findings/technical.md` §4

5. **Redeploy `origin/main` to production.** Several issues below (admin URLs in the public
   sitemap, incomplete robots.txt disallow rules) are already fixed in the current repo source —
   production is simply running an older commit.
   → `findings/technical.md` §1, `findings/sitemap.md` §2

---

## High (fix within 1 week)

6. Add unique `metadata.title`/`description` to the 21 public static pages currently inheriting
   the homepage's default title (`/about`, `/advertise`, `/contact`, `/pricing`, `/help`, `/map`,
   `/gallery`, `/write-review`, `/find-people`, `/get-app`, and 11 more).
   → `findings/on-page.md`

7. Add a `headers()` security block to `next.config.ts`: CSP, `X-Frame-Options`,
   `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`; extend HSTS with
   `includeSubDomains; preload`.
   → `findings/technical.md` §3

8. Fix `priceRange: "Rs Rs Rs"` in the Restaurant schema template — a malformed schema value that
   is also visibly broken in the live UI.
   → `findings/schema.md`, `findings/visual.md`

9. Add real per-listing lat/long (`GeoCoordinates`) and complete `openingHoursSpecification` to
   all 7 days in the listing schema template before it scales to more businesses.
   → `findings/schema.md`

---

## Medium (fix within 1 month)

10. Fix the 9 pages with a duplicated "Nepali Directory" brand suffix in their titles
    (`/attribution` + 8 `/authors/*` pages); shorten the 55 titles exceeding 60 characters.
    → `findings/on-page.md`

11. Add an `<h1>` to `/claim-listing` and `/gallery`.
    → `findings/on-page.md`, `findings/sxo.md`

12. Differentiate the 8 `/city/*` pages beyond the current ~85%-shared template — real
    neighborhoods, landmarks, and category emphasis per city (verified: Kathmandu vs. Dharan text
    diff shares 85% of phrasing despite the cities having nothing in common).
    → `findings/local.md`

13. Expand the 3–4 highest commercial-intent blog posts (dental, contractors, wedding, schools)
    with concrete local specifics instead of generic checklist advice.
    → `findings/content.md`

14. Add a named human reviewer byline to healthcare-related blog posts specifically (YMYL E-E-A-T
    gap).
    → `findings/content.md`

15. Generate a proper 1200×630 branded OG/social image for the homepage (currently the 512×512
    logo).
    → `findings/images.md`

16. Add `ItemList` schema to `/city/*` pages, matching the pattern already used on
    `/compare-business/*` pages.
    → `findings/schema.md`, `findings/local.md`

17. Reduce the mobile nav's pre-content scroll distance (currently ~580px of stacked menu items
    before hero content).
    → `findings/visual.md`

---

## Low (backlog)

18. Set up free Google PageSpeed Insights / CrUX API access (`GOOGLE_API_KEY`) to replace lab-only
    performance estimates with real field data.
    → `findings/performance.md`

19. Audit `srcset` breakpoint counts on card-grid images for over-fetching relative to actual
    rendered card size.
    → `findings/performance.md`

20. Migrate city/category hero images from Unsplash hotlinking to owned/self-hosted assets before
    they become permanent production content.
    → `findings/images.md`

21. Build a sitemap pagination scheme (`sitemap-listings-2.xml`, etc.) before listing volume
    approaches a few thousand URLs — no chunking logic exists yet.
    → `findings/sitemap.md` §3

---

## Ongoing / Monitoring

22. Re-run the GEO and SXO categories of this audit once real listings exist to measure post-fix
    improvement — both are structurally capped by the Critical listings bug today.
    → `findings/geo.md`, `findings/sxo.md`

23. Begin real link-building outreach (Nepal tourism boards, chambers of commerce, encouraging
    claimed businesses to link back) — current backlink profile is an expected, unconcerning
    near-zero for a pre-launch site.
    → `findings/backlinks.md`

24. Once listings scale, interlink blog posts into relevant city/category pages and vice versa —
    current interlinking is thin/nav-driven rather than contextual.
    → `findings/cluster.md`, `findings/on-page.md`

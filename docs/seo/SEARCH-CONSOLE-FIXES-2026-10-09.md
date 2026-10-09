# Search Console fixes — 2026-10-09

A production build was crawled the way Googlebot crawls it: every sitemap URL plus every internal
link, about 360 URLs. The crawl checked status codes, canonicals, robots directives, titles,
descriptions, H1s, page weight and JSON-LD. The live site and the Search Console account were not
reachable from the build environment, so the Search Console report names below are the reports
each problem produces, not a copy of the live report.

| Search Console report | Cause found | Fix |
|---|---|---|
| Not found (404) | Unpublished city/category hubs return 404, but `/near-me` category cards, links inside blog articles, `/search` results and `/province` still linked to them | Every one of those surfaces now checks `isLiveHubHref` (moved to the client-safe `lib/hub-links.ts`). Article links to an unpublished hub render as plain text |
| Indexed, though blocked by robots.txt | `/login`, `/register`, `/forgot-password`, `/profile` and `/gallery` were linked from the header on every page but disallowed in robots.txt, so Google could never read their `noindex` | Removed them from `robots.txt` (they keep `noindex`). The login, register and password pages now also set a canonical, so `?next=` variants consolidate |
| Duplicate, Google chose different canonical | Two Google Business Profile guides shared the same title and search intent | `/blog/google-business-profile-nepal-setup-verification` now 301-redirects to `/blog/google-business-profile-nepal-setup-guide`; its unique Plus Code section and FAQ were merged into the guide that stays |
| Excluded by 'noindex' tag | `/blog` linked 25 thin blog categories that are `noindex` | The `/blog` category nav lists only indexable categories |
| Structured data (invalid items) | Empty `ItemList` on `/`, `/city` and `/best-directory-in-nepal`; incomplete `BlogPosting` nodes on author pages; a `QAPage` on an editorial (non-forum) page | Empty lists are omitted. Author pages carry full `BlogPosting` nodes. `/questions/trekking-annapurna` is now an `Article` plus `FAQPage` with substantive content |
| Page experience / crawl efficiency | `/blog` HTML was 1.08 MB: three copies of a 140-post list in JSON-LD, a keyword list built from every post, and 140 image cards | Down to about 240 KB: one `ItemList` referenced by `@id`, topic-level keywords, 18 image cards followed by a compact text archive (every post is still linked) |

Snippet quality:

- `lib/meta-text.ts`: `seoTitle()` drops the " | Nepali Directory" suffix when it would push a title
  past about 60 characters. `metaDescription()` and `pickMetaDescription()` keep descriptions to
  160 characters or fewer, cutting at a natural boundary. These are applied to blog posts, blog
  categories, categories, cities, comparisons, business profiles, authors, near-me and every page
  built with `buildPublicPageMetadata`.
- Titles over 65 characters went from 143 to 20; each of the remaining 20 is already over 60
  characters without the brand suffix. Descriptions over 165 characters went from 46 to 0.
- Blog category hubs list the questions their guides answer, with links. Author pages and
  `/authors` have social images.

Remaining `noindex` exclusions are intentional: search, deals, map, Q&A, app, sign-in pages and
comparison pages that have no published providers yet. Search Console lists them as
"Excluded by 'noindex' tag", which is informational and not an error.

## After deploying

1. Search Console → Sitemaps: resubmit `https://www.nepalidirectory.com/sitemap.xml`.
2. Page indexing: open "Not found (404)", "Indexed, though blocked by robots.txt" and
   "Duplicate, Google chose different canonical", then click **Validate fix** on each.
3. URL Inspection → Request indexing for `/`, `/blog`,
   `/blog/google-business-profile-nepal-setup-guide` and `/questions/trekking-annapurna`.
4. Enhancements: validate any structured-data report that listed errors.

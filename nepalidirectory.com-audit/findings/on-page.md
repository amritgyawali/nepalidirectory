# On-Page SEO (Titles, Meta Descriptions, Headings, Internal Linking) — nepalidirectory.com

**Score: 58/100**

## What works
- Root metadata architecture is sound: `app/layout.tsx` defines a title template
  (`title: { default: "Nepali Directory | Nepal's trusted local business directory", template: "%s | Nepali Directory" }`)
  so any page that sets its own `title` automatically gets the brand suffix appended — a good
  Next.js Metadata API pattern in principle.
- Every one of the 103 crawled pages has a non-empty meta description (0 pages missing one).
- Every page has an `og:title` and a `viewport` meta tag.
- No pages exceed the meta description upper bound in a way that matters (only 1 page > 160
  chars).

## Findings

### High — 34 pages have no page-specific title/description; they silently inherit the homepage default
**Description:** Confirmed via crawl-data.json: `/about`, `/advertise`, `/contact`, `/deals`,
`/events`, `/find-people`, `/gallery`, `/get-app`, `/help`, `/map`, `/pricing`, `/privacy`,
`/profile`, `/province`, `/qa`, `/qa/community`, `/request-callback`, `/restaurant-qa`,
`/sitemap`, `/terms`, `/write-review`, plus all 10 `/super-admin/*` + `/admin/ai` pages, all
render the exact title "Nepali Directory | Nepal's trusted local business directory" and near-
identical meta description — because these route files never export their own `metadata` object,
so Next.js falls back to the root layout's `default`. This is textbook duplicate-title/duplicate-
meta-description territory: Google explicitly flags this pattern in Search Console as a
crawl/indexing quality issue and it materially hurts how these pages compete against each other
and the homepage in search results.
**Recommendation:** Add an `export const metadata: Metadata = { title: "...", description: "..." }`
block to each of the 21 public static route files (the 10 `/super-admin`+`/admin` pages should
instead be excluded from the sitemap entirely per the Technical/Sitemap findings — fixing their
titles is lower priority than de-indexing them). Titles should be unique, ≤60 chars ideally (see
next finding), and description-match the page's actual purpose.

### Medium — 9 pages have a duplicated "Nepali Directory" brand suffix in the title
**Description:** `/attribution` renders `<title>Data Attribution & Licensing | Nepali Directory | Nepali Directory</title>`
— the literal string "Nepali Directory" appears twice. Root cause confirmed in
`app/attribution/page.tsx` (line 5): `title: "Data Attribution & Licensing | Nepali Directory"` —
the page manually includes the brand suffix in its own title string, which then gets the root
layout's `template: "%s | Nepali Directory"` applied on top, duplicating it. The same bug pattern
affects all 9 `/authors/*` pages (e.g. `/authors/business-desk` →
"Nepali Directory Business Desk: Business listing and local growth editors | Nepali Directory" —
here the duplication is "Nepali Directory" appearing at both the start of the custom title and via
the template suffix, which is redundant/keyword-stuffy even if not a literal repeated substring).
**Recommendation:** Never include "Nepali Directory" in a page's own `metadata.title` string when
that page is rendered under the root layout's template — let the template add the suffix. Fix
`app/attribution/page.tsx` and the 9 `app/authors/*` page title strings.

### Medium — 55 of 103 pages have titles over 60 characters (SERP truncation risk)
**Description:** The longest confirmed titles are the author desk pages at 77-92 characters (e.g.
"Nepali Directory Services Desk: Home services and contractor editors | Nepali Directory" = 87
chars). Google typically truncates title display around 555-600px (~55-60 characters for average
character width), so a meaningful fraction of this site's titles will be cut off mid-word in
search results, and the brand suffix — the most consistently useful trust signal — is the part
most likely to get truncated away.
**Recommendation:** For the author desk pages specifically, drop to a shorter form, e.g. "Business
Desk | Nepali Directory Editors" or similar — keep unique differentiators in the first ~50
characters and treat the appended brand suffix as expendable padding, not core content.

### Low — Heading structure: 12 pages missing `<h1>`, 1 page with multiple `<h1>`s
**Description:** From crawl-data.json: `/claim-listing` and `/gallery` are public pages missing an
`<h1>` entirely (the other 10 are the noindexed admin pages, lower priority). One page has
multiple H1s (minor structural issue, worth a spot check).
**Recommendation:** Add a single, descriptive `<h1>` to `/claim-listing` and `/gallery` — both are
conversion-relevant pages (claiming a listing is a core business action) that currently lack a
clear on-page heading anchor for both users and crawlers.

### Info — Internal link counts are flat/uniform (~49-90 links) across very different page types
**Description:** Utility and admin pages carry the same ~49 internal links as content pages,
suggesting link counts are dominated by a shared global nav/footer rather than contextual in-
content linking. This isn't necessarily wrong for a directory site's chrome, but it means
contextual internal linking (e.g., blog posts linking into relevant city/category pages) is likely
thin — cross-reference with the Content Cluster findings (`findings/cluster.md`) for the specific
interlinking gap between blog posts and category/city hub pages.

## Quick wins
1. Add unique `metadata.title`/`description` to the 21 public static pages currently inheriting
   the homepage default — single highest-leverage on-page fix on the site.
2. Remove the redundant "Nepali Directory" from `app/attribution/page.tsx` and the 9
   `app/authors/*` page titles.
3. Add an `<h1>` to `/claim-listing` and `/gallery`.

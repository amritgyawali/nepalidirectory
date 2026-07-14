# Nepali Directory SEO ranking playbook

Updated: 2026-07-15

No legitimate change can guarantee Google's first position. This plan separates the work the
website can enforce from the ownership, data, and promotion work that requires an account holder.

## Current baseline

- Canonical production host: `https://www.nepalidirectory.com` (non-www redirects with HTTP 308).
- Robots and sitemap endpoints return HTTP 200.
- The production database contains 11 demo listings and **zero qualified public listings**.
- The production listing sitemap is therefore empty by design.
- Static/category/blog content is crawlable, but a directory cannot become competitive until its
  main product—accurate individual business profiles—exists.

## Required launch actions

1. Deploy the current repository changes.
2. Create a Google Search Console **Domain property** for `nepalidirectory.com` and complete DNS
   TXT verification. A Domain property covers www/non-www and HTTP/HTTPS together.
3. Submit `https://www.nepalidirectory.com/sitemap.xml` in Search Console.
4. Inspect and request indexing for the homepage, `/categories`, `/city/kathmandu`,
   `/category/restaurants`, and `/blog/list-business-nepal-directory`.
5. Add the optional URL-prefix verification token as `GOOGLE_SITE_VERIFICATION` in Vercel. Add the
   Bing token as `BING_SITE_VERIFICATION` and redeploy.
6. In Search Console, check Page indexing, Manual actions, Security issues, Crawl stats, and Core
   Web Vitals weekly. Fix exclusions based on the reported reason; do not request indexing for
   noindex, demo, search-result, account, or empty utility URLs.

Google documentation:

- https://support.google.com/webmasters/answer/34592
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## The work that will create ranking ability

### 1. Publish the first 50 real profiles

Use the existing owner submission, CSV, or OSM/ODbL acquisition flow. Do not scrape Google Maps.
Prioritize restaurants, hotels, hospitals/clinics, schools, shops, and IT companies across
Kathmandu, Pokhara, Lalitpur, Bhaktapur, Chitwan, Biratnagar, Butwal, and Dharan.

Every published record should have:

- real name, category, address/service area, and at least one working contact method;
- source/provenance and a recent fact-check date;
- no placeholder domain/email and no unresolved category review;
- a quality score of at least 55 plus an owner, OSM, reviewed import, or verified source;
- latitude/longitude and full weekly hours when those facts are available.

The code automatically adds qualified profiles to business pages, city/category lists, structured
data, `llms.txt`, and the listing sitemap. Automatic blog publishing remains paused until at least
50 qualified profiles exist (with a hard safety floor of 25).

### 2. Earn links that prove the directory exists

- Ask every claimed business to link to its accurate profile from its website or social bio.
- Seek editorial links from Nepal chambers, trade associations, tourism organizations, campuses,
  municipalities, and credible local publications where the directory is genuinely useful.
- Publish source-backed local datasets or reports that journalists and associations can cite.
- Avoid bought links, link exchanges at scale, private blog networks, and mass directory spam.

### 3. Build evidence, not more empty URLs

- Add new city/category pages only when they contain qualified profiles and unique local guidance.
- Keep one-post blog archives noindex; expand or consolidate them before indexing.
- Publish fewer, stronger guides with named review, primary sources, original local research, and
  meaningful links into real listing/category pages.
- Do not claim rankings, reviews, offers, opening status, or verification that the data cannot
  prove.

## Weekly measurement

Record these from Search Console and analytics every Monday:

- indexed canonical URLs and excluded-URL reasons;
- impressions, clicks, CTR, and average position for `nepali directory`, `Nepal business
  directory`, category, city, and business-name queries;
- referring domains and links to business/category pages;
- qualified listing count, claimed profiles, data freshness, and profile-to-contact conversions;
- Core Web Vitals by page type.

Judge technical changes after several weeks, not hours. Prioritize listing quality, recognized
authority, and useful local evidence over keyword repetition or bulk page generation.

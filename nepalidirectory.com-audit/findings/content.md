# Content Quality (E-E-A-T, Readability, Thin Content, AI Citability) — nepalidirectory.com

**Score: 52/100**

Note: this category score is capped by the same root cause flagged throughout this audit — the
site's core content type (individual business listings) barely exists in production (1 real page
vs. a claimed 50,000+ businesses). Content quality here is scored on what actually exists live:
14 blog posts, city/category aggregator pages, and Q&A pages.

## What works
- **14 blog posts exist with consistent, well-formed metadata**: every post has a distinct
  `<title>` (77-90 chars), unique meta description (131-158 chars, within the ~150-160 char sweet
  spot), `og:`/`twitter:` card tags, `article:published_time`/`article:modified_time`, and
  keyword-relevant tagging (verified on `/blog/kathmandu-dental-clinic-guide`).
- **Author attribution system exists**: posts are bylined to topical "desks" (Health Desk, Food
  Desk, Travel Desk, SEO Desk, etc.), each with its own `/authors/<desk>` profile page carrying a
  `description` and `knowsAbout` array, expressed as `Organization`-type schema authors with a
  `parentOrganization` link back to Nepali Directory. This is a legitimate, if lightweight,
  E-E-A-T structure.
- **Explicit AI-content transparency signal**: pages carry a custom
  `<meta name="ai-content-declaration" content="human-reviewed local directory and guide content"/>`
  tag. This isn't a recognized schema.org/Google property, so it has no direct ranking effect, but
  it's a good-faith transparency practice, increasingly valued by AI answer engines doing
  provenance checks — verify in practice that a human review step genuinely happens before
  publish, since the claim itself becomes a liability if untrue.
- Consistent internal structure: every sampled blog post has exactly 10–11 H2 sections, indicating
  a disciplined content template (practical for scale, consistent with the site's auto-blog
  pipeline noted in project history).

## Findings

### High — Blog posts are thin for their topic competitiveness (500–660 words)
**Description:** All 14 posts fall in a narrow 504–658 word band (from crawl-data.json). Topics
like "Kathmandu Dental Clinic Guide: Costs, Questions and Reviews" or "Verified Contractor Nepal"
are commercial-investigation / practical-guide formats where ranking competitors typically run
1,200–2,000+ words with concrete specifics (named clinics, actual price ranges, named
neighborhoods) rather than generic checklists. The uniform word count and uniform 10-11 H2
structure across every post regardless of topic suggests a templated generation process that
prioritizes structure over topic-specific depth.
**Recommendation:** For the highest commercial-intent posts (dental, contractors, wedding
planning, schools), expand with specific, verifiable local detail — actual price ranges in NPR,
named neighborhoods/landmarks, and (once listings exist) links to and mentions of real claimed
businesses. Generic advice ("ask for a written estimate," "check hygiene") reads as safe but
interchangeable with any city's version of the same post — Google and AI engines reward
specificity for local intent.

### Medium — Author bylines are organizational "desks," not named individuals with credentials
**Description:** All content is attributed to `Organization`-typed pseudo-authors (e.g. "Nepali
Directory Health Desk") rather than named people with stated qualifications. For YMYL-adjacent
topics (healthcare/dental content, e.g. `/blog/kathmandu-dental-clinic-guide`,
`/blog/kathmandu-hospitals-clinics-checklist`), Google's E-E-A-T guidance specifically rewards
named authors with verifiable expertise; anonymous desk bylines are a weaker trust signal,
particularly for health content.
**Recommendation:** For healthcare and any other YMYL-adjacent verticals, add a named
reviewer/author with real credentials (e.g. "Reviewed by [Name], [credential]") alongside the desk
byline — even a single real editorial reviewer per vertical materially strengthens E-E-A-T here.

### Medium — 34 static pages inherit the homepage's default title/meta (duplicate content signal)
**Description:** Confirmed via crawl-data.json: pages like `/about`, `/advertise`, `/contact`,
`/pricing`, `/help`, `/map`, `/gallery`, `/write-review`, `/find-people`, `/get-app`, etc. all
serve the identical title "Nepali Directory | Nepal's trusted local business directory" and
(by extension) identical/near-identical meta description, rather than page-specific values. From a
content-quality standpoint (beyond the technical title-tag mechanics, which the Technical findings
cover), this reads to both users and AI crawlers as templated/unfinished pages — a `/pricing` page
titled identically to the homepage signals it wasn't written with topic-specific intent in mind.
**Recommendation:** Write unique, intent-matched titles and descriptions for each static page as
part of the broader on-page fix — treat this as a content-completeness gap, not just a metadata
bug.

### Medium — Q&A content (`/qa`, `/ask-question`, `/restaurant-qa`) is thin and pre-population-stage
**Description:** These pages are under or near the 200-word thin-content threshold
(`/ask-question`: 196 words) — consistent with a not-yet-seeded Q&A community feature. The site
has an AI-answer feature for Q&A per its build docs; if AI-generated answers begin populating these
pages, they need visible attribution/disclosure (similar to the `ai-content-declaration` pattern
used on blog posts) to avoid an E-E-A-T penalty for undisclosed AI content at scale.
**Recommendation:** Seed `/qa` and `/restaurant-qa` with a first batch of genuinely useful
Q&A pairs before this becomes a public, indexed content type at scale, and ensure AI-authored
answers are clearly labeled.

### Info — Content depth is structurally capped by the missing-listings issue
**Description:** The single most valuable content type for a local directory — verified,
detailed business profiles with real reviews, hours, and photos — exists for exactly one business.
This isn't fixable at the content layer; it's the Critical technical/sitemap bug documented
elsewhere in this audit. Flagging here because it caps the achievable Content score until fixed:
no amount of blog/editorial polish substitutes for the core product content a local-directory
audience actually searches for.

## Quick wins
1. Write unique titles/meta descriptions for the 34 templated static pages (shared fix with the
   Technical/On-Page findings — same root cause, cross-functional priority).
2. Add a named human reviewer byline to the healthcare-related blog posts specifically.
3. Expand the 3-4 highest commercial-intent blog posts (dental, contractors, wedding, schools) with
   concrete local specifics rather than generic checklist advice.

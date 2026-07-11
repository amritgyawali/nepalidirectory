# GEO / AI Search Readiness — nepalidirectory.com

**Score: 61/100**

## What works
- **robots.txt explicitly allows every major AI crawler**: dedicated `User-Agent` blocks for
  Googlebot, Bingbot, `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `PerplexityBot`, and `ClaudeBot`,
  all with `Allow: /` (minus `/api/`, `/dashboard/`). AI crawler access is a deliberate, correctly-
  implemented decision here, not an accident.
- **`llms.txt` exists at `/llms.txt` and is genuinely well-built** — not a boilerplate stub. It's
  organized into clear sections (Main directories, City directories, Business comparison guides,
  Local guides, Data-backed local answers, Trust and machine-readable resources, Optional), gives
  each linked page a one-line description written for an LLM consumer, explicitly tells AI agents
  to "confirm time-sensitive details such as opening hours, prices, availability... directly with
  the relevant provider," and points to the XML sitemap for canonical discovery. This is one of
  the stronger llms.txt implementations this audit has seen for a site this early-stage.
- Blog posts and comparison pages are structured with clear H2 sections, FAQ schema, and direct,
  quotable claims (e.g. specific NPR prices in the one live business listing's menu schema) —
  good raw material for passage-level extraction by AI answer engines.
- `Organization` schema with `sameAs`, `knowsAbout`, and a stable `@id` gives AI engines a clear
  entity anchor to attribute citations to.

## Findings

### Critical — `llms.txt` links to 12 near-duplicate blog posts across 5 topic clusters, undermining the citability of the exact content it's promoting
**Description:** Cross-referencing `llms.txt`'s own "Local guides" section against the actual
content confirms it lists e.g. THREE separate live URLs for "how to compare local services in
Nepal before booking" and THREE for "questions to ask before choosing a restaurant/cafe in Nepal"
— posts published 1-2 days apart with 85-90% shared phrasing (full verification in
`findings/sitemap.md` §4). **This directly undermines GEO goals**: an AI engine crawling via
`llms.txt` (as the file itself instructs) will encounter 2-3 nearly-identical answers to the same
implicit question and has no signal for which one is canonical — at best it picks one arbitrarily,
at worst it treats the topic as lower-confidence/spammy and downweights citing the site for that
query entirely. This is the single highest-leverage GEO fix available: a well-crafted `llms.txt`
actively pointing AI crawlers at duplicate content is worse than not having the granular listing
at all.
**Recommendation:** Fix the auto-blog dedup pipeline (see `findings/sitemap.md` §4 for the
technical root cause and fix), consolidate each cluster to one canonical post, then curate
`llms.txt`'s "Local guides" section down to one entry per topic.

### High — Individual business/listing citability is capped at 1 real page
**Description:** `llms.txt` correctly lists `/business/newa-lahana` under "Main directories" as
the example business profile — but it's the *only* one that exists. For AI engines answering
queries like "best momos in Boudha" or "verified plumber in Lalitpur," this site currently has
zero citable individual-business pages to serve for the vast majority of real local intents. This
is the GEO-facing consequence of the Critical listings/routing bug documented elsewhere in this
audit — restating it here because it's the single biggest lever for AI Overviews / ChatGPT /
Perplexity local-business citations specifically, not just classic SEO.
**Recommendation:** Prioritize the listings-page fix; re-run a GEO citability check once even a
few dozen real listings are live to validate the `Restaurant`/`LocalBusiness` schema template
performs well for AI extraction (it's already schema-rich per `findings/schema.md`, so this should
translate quickly once pages exist).

### Medium — No visible citation/attribution guidance beyond the general note in llms.txt
**Description:** `llms.txt` tells AI agents to "link to the exact canonical page" but individual
pages don't carry any additional machine-readable citation metadata (e.g. no `citation` or
structured "last verified" timestamp distinct from `dateModified` on time-sensitive facts like
hours/prices, which the llms.txt text itself flags as something AI agents should double-check).
**Recommendation:** Low urgency given `dateModified` already exists in `WebPage` schema, but
consider a distinct "facts last verified" signal on listing pages specifically once they exist —
hours/prices are the fields most likely to go stale and most damaging to trust if an AI engine
cites an outdated price.

### Low — FAQ schema (34 pages) is GEO-valuable even where it won't earn a classic Google rich result
**Description:** Cross-referencing `findings/schema.md`'s note that Google's FAQ rich-result
eligibility has tightened significantly since 2023 — but for AI engines doing passage extraction
(ChatGPT, Perplexity, AI Overviews), FAQ-schema question/answer pairs remain a strong, low-effort
extraction target regardless of whether Google renders a visual rich result. No action needed;
noting this so the schema investment isn't miscategorized as "wasted" if classic rich results don't
appear.

## Quick wins
1. Consolidate the 5 duplicate blog clusters to one canonical post each, then update `llms.txt`
   accordingly — single highest-leverage GEO fix on the site today.
2. Once listing pages exist (even a small batch), re-audit GEO citability specifically for
   individual business queries.
3. Add a distinct "facts last verified" date on listing pages for time-sensitive fields (hours,
   prices) once real listings launch.

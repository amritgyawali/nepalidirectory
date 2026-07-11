# SXO (Search Experience Optimization) — nepalidirectory.com

**Score: 40/100**

Method: SERP-backwards analysis for representative Nepali local-search intents this site should
compete for, judged against what the site can actually serve today.

## Query-by-query page-type-mismatch analysis

| Query | What Google rewards | What nepalidirectory.com can serve today | Gap |
|---|---|---|---|
| "best momos in Boudha" | Individual restaurant profiles with photos, reviews, hours, map pin — often surfaced via local pack | `/city/kathmandu` (generic city hub, ~85% templated per `findings/local.md`) or the one unrelated demo listing | Severe — no matching page exists |
| "dental clinic Kathmandu" | Mix of local pack (individual clinics) + comparison/guide content | `/compare-business/dental-clinics` (real hub page, has FAQ/Article schema) **and** `/blog/kathmandu-dental-clinic-guide` — genuinely reasonable comparison-intent coverage | Partial — good for research-stage intent, has nothing for "which specific clinic, right now" intent |
| "wedding planners Nepal" | Comparison/guide content ranks well for this broader, research-stage query | `/compare-business/wedding-planners` + `/blog/nepal-wedding-planning-checklist` — solid match | Good — this is the query type the site is actually built for today |
| "plumber Lalitpur" | Local pack + individual providers, high commercial urgency | `/compare-business/plumbers` (Kathmandu-focused, not Lalitpur-specific) — no city-scoped service pages exist | Moderate-severe — category exists but not localized to the specific city in the query |
| "restaurants in Thamel" | Local pack + neighborhood-level lists | Nothing neighborhood-scoped exists (city pages are city-wide, not neighborhood-level) | Severe |

## Persona scoring

- **Tourist looking for a restaurant near a specific landmark** (e.g. Boudha, Thamel): poorly
  served today — needs neighborhood/individual-listing granularity the site doesn't yet have.
  **Score: 2/10.**
- **Local resident comparing service providers before booking** (dental, contractors, wedding,
  schools): reasonably well served — the compare-business + blog combination is a genuine, if
  thin, match for this research-stage intent. **Score: 6/10.**
- **Business owner researching whether to claim/list**: the `/claim-listing`, `/advertise`,
  `/pricing` pages exist and the one live listing page demonstrates a credible finished product —
  but `/claim-listing` itself is thin content with no H1 (per `findings/on-page.md`), undercutting
  the pitch at the exact moment a prospective customer is evaluating it. **Score: 5/10.**

## Findings

### Critical — The site's page-type inventory structurally caps it out of the highest-intent, highest-volume local query class
**Description:** The query class Google rewards local-pack/individual-listing results for —
"[category] in [neighborhood/city]," "[category] near me," "best [category] in [city]" — is
exactly the query class a directory site should be built to dominate, and is exactly the page type
(individual business listings) that doesn't functionally exist yet (see the audit-wide Critical
finding). Every other SXO issue is secondary to this one.
**Recommendation:** No new recommendation beyond the audit-wide fix — flagging here to make the
SXO cost of the delay explicit: every day the listings bug stays unfixed is lost ranking
opportunity specifically in the query class this product exists to win.

### Medium — "Before" vs "after" SXO ceiling is worth stating explicitly for prioritization
**Description:** Before the fix: the site can realistically only compete for research-stage,
comparison-intent queries ("how to compare X," "X vs Y") — a real but narrower and generally
lower-commercial-urgency query class than "X near me right now." After the fix (real listings +
working `/business/[slug]` route): the same comparison content becomes a strong top-of-funnel
complement to a now-complete bottom-of-funnel (individual listing pages), which is a materially
stronger overall SXO position — the comparison/blog content isn't wasted work, it's exactly the
right complementary content, it's just currently unpaired with the listings it should be funneling
traffic toward.
**Recommendation:** Sequence work accordingly: ship the listings fix first, then invest in
interlinking the existing blog/compare content into the new listing pages (ties to
`findings/cluster.md`) to complete the funnel rather than building either layer in isolation.

## Quick wins
1. Treat the listings fix as the SXO priority — every persona score improves once it ships.
2. Add a clear H1 and slightly more substantive copy to `/claim-listing` — it's the conversion
   page for the business-owner persona and currently undersells the product.
3. Once listings exist, plan neighborhood-level pages (e.g. Thamel, Boudha) as a follow-on, not a
   day-one requirement — city-level is a reasonable intermediate step.

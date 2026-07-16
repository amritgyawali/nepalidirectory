# GEO / AI Search Readiness — nepalidirectory.com

**Re-audit: 2026-07-16** (prior audit: 2026-07-11, score 61/100)

**Score: 62/100** (net flat vs. prior 61 — a genuine Critical fix and stronger blog
structure are offset by a new/worse citability gap on business and comparison pages)

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| Citability | 25% | 58/100 | Duplicate-cluster fix is real; but 0 indexable business/comparison pages now |
| Structural Readability | 20% | 78/100 | Quick-answer blocks, FAQ schema, question headings on new posts |
| Multi-Modal Content | 15% | 35/100 | Only `ImageObject` schema found; no video/YouTube signal detected |
| Authority & Brand Signals | 20% | 48/100 | Strong on-site entity/author infra; off-site brand signals not re-verified this cycle |
| Technical Accessibility | 20% | 82/100 | Full SSR confirmed on every sampled template; robots.txt simplified (see below) |

## AI Crawler Access (robots.txt, live-checked 2026-07-16)

Current `robots.txt` (matches saved copy at `nepalidirectory.com-audit\robots.txt`):
```
User-Agent: *
Allow: /
Disallow: /api/ /admin/ /super-admin/ /dashboard/ /account/ /profile /login /register /forgot-password /gallery
Sitemap: https://www.nepalidirectory.com/sitemap.xml
```

| Crawler | Status | How |
|---|---|---|
| GPTBot | Allowed | Inherits wildcard `Allow: /` |
| OAI-SearchBot | Allowed | Inherits wildcard `Allow: /` |
| ClaudeBot | Allowed | Inherits wildcard `Allow: /` |
| PerplexityBot | Allowed | Inherits wildcard `Allow: /` |
| Google-Extended | Allowed | Inherits wildcard `Allow: /` (no dedicated rule) |
| CCBot / anthropic-ai / cohere-ai | Allowed (undifferentiated) | No block exists — same wildcard applies |

Net effect: **AI-search crawler access is not blocked** — functionally fine. But see Finding
below: this is a **REGRESSION** from the per-bot explicit blocks the prior audit documented.

## llms.txt Status: Present, restructured, partially stale

Live at `https://www.nepalidirectory.com/llms.txt` (HTTP 200, `Cache-Control: s-maxage=300`).
Compared line-by-line against the saved prior version at `nepalidirectory.com-audit\llms.txt`.

## What works
- **Technical accessibility holds across the board.** Homepage, category page
  (`/category/restaurants`), the one business profile, and a blog post were all fetched via
  raw HTTP with no JS execution needed (`is_spa: false` on every sample) — fully server-rendered,
  fast Vercel edge delivery. No change from prior audit; still a clean baseline for AI crawlers.
- **Deliberate content-integrity gating is a legitimate (if costly) trust signal.** The site now
  actively refuses to publish or index unverified business data: the one demo listing
  (`/business/newa-lahana`) carries `noindex, nofollow` with on-page copy reading *"excluded from
  search indexing, sitemaps and business ranking schema until its source and public details pass
  review,"* and comparison pages like `/compare-business/beauty-salons` are `noindex, follow` with
  copy reading *"This guide does not publish placeholder businesses, invented ratings or sample
  prices."* This is the opposite of the low-effort pattern (publish fabricated "best of" lists)
  that gets AI engines burned and domains blocklisted — a real long-term trust asset, discussed
  further as a citability trade-off below.
- **New/scaled blog posts show materially stronger GEO structure than the prior sample.** The
  July 15 post `nepal-business-directory-find-local-services-guide` runs 729 words across 16 H2s
  including a **"Quick answer"** opening section, a **"Frequently asked questions"** section backed
  by `FAQPage`/`Question`/`Answer` JSON-LD, a **"Source and fact notes"** section, and a "Related
  guides" block — this is close to a template built for passage extraction, not just classic SEO.
- **Duplicate-cluster fix is real and clean (see Findings — Critical, FIXED).**
- **`llms.txt` was actively maintained, not left stale wholesale**: it proactively dropped the
  dead `/business/newa-lahana` link (correctly, since that page is now noindexed) and added six
  new category-page entries (Restaurants, Hotels, Hospitals, Schools, IT Companies, Shops in
  Nepal) that didn't exist in the prior version. This shows the file is regenerated from live
  state, not hand-frozen — good operational hygiene, even though the regeneration has gaps (below).

## Findings

### Critical — REGRESSED: Zero AI-citable individual-business or named-comparison pages exist sitewide
**Description:** The prior audit's High finding ("business citability capped at 1 real page") has
gotten worse, not better. Verified live 2026-07-16:
- `/business/newa-lahana` — the only individual business page on the site — now returns
  `<meta name="robots" content="noindex, nofollow">` and is absent from `sitemap-listings-1.xml`,
  which is now an **empty `<urlset>`** (0 `<url>` entries). It was removed from `llms.txt` too.
- `/compare-business/beauty-salons` (and by the same pattern, presumably all 17 comparison pages
  previously listed in `llms.txt`) returns `noindex, follow` and contains only generic
  process-guidance copy — zero named businesses, prices, or ratings.
- `/best/restaurants/kathmandu` — live in the prior audit with 6 named restaurants — now returns
  **HTTP 404**.
- Consequently `llms.txt`'s "Business comparison guides" and "Data-backed local answers" sections
  are both now **present but completely empty** (headers with no list items) — confirmed by
  fetching the full live file.

This means the site currently has **no page anywhere** that an AI engine could cite for the
highest-value local-intent queries it's built for — "best momos in Boudha," "compare plumbers in
Kathmandu," "top-rated restaurants Kathmandu" — despite `Organization`/`LocalBusiness`-ready
schema templates existing and being production-tested (confirmed present on the noindexed
`newa-lahana` page). The informational blog layer scaled 12→89 posts in this window while the
transactional/entity layer that GEO citations actually anchor to shrank to zero.
**Recommendation:** This is very likely an intentional trade — gating unreviewed data is
defensible — but it needs a finish line, not an indefinite hold. Prioritize getting even a small
batch (20-50) of reviewed, real business records through the review pipeline so `noindex` can be
lifted and `sitemap-listings-1.xml` populated. Until then, GEO citability for the site's core
local-business use case is structurally capped at zero regardless of any other GEO work.

### Critical — FIXED: `llms.txt` no longer links to near-duplicate blog posts
**Description:** Prior audit found `llms.txt` listing 2-3 near-duplicate URLs per topic across 5
clusters (12 URLs total, 85-90% shared phrasing). Verified fix, live, 2026-07-16:
- The current `llms.txt` "Local guides" section lists **none** of the 7 removed duplicate URLs —
  only the 5 canonical survivors' topics appear, each once.
- The 7 removed URLs (e.g.
  `/blog/questions-to-ask-before-choosing-a-restaurant-or-cafe-in-nepal-a-comprehensive-g`,
  `/blog/how-to-compare-local-services-in-nepal-before-booking-a-practical-guide`,
  `/blog/how-to-compare-event-venues-and-vendors-in-nepal-a-practical-guide`) now return
  **HTTP 200 with a clean 308 permanent redirect** to the single canonical post per cluster —
  spot-checked 3 of 7, all correct.
- `sitemap-blog.xml` (97 `<loc>` entries: 89 posts + 8 `/blog/category/*` index pages) contains
  only the 5 canonical URLs, not the 7 redirected ones.

This is exactly the fix the prior audit recommended: one canonical URL per cluster, sitemap and
`llms.txt` both aligned, old URLs 308-redirected (preserving any inbound link equity) rather than
orphaned or 404'd.
**Caveat — flag for cross-reference:** This confirms the fix at the **URL/routing level**. Whether
the *text itself* on the 5 surviving canonical posts (and the ~57 new posts added since, many
following repeatable city×category templates like `{city}-{category}-guide`) is sufficiently
differentiated is a content-level question outside this audit's direct scope — the content-quality
agent is independently verifying this in parallel for the scaled 89-post corpus. **This matters
directly for citability**: even with clean URLs, if the new templated posts share heavy structural
or phrasal overlap across cities, AI engines applying near-duplicate detection during retrieval
will still down-weight or collapse them the same way the old cluster was flagged. Treat this
finding as fixed for the specific 12-URL cluster audited in July; treat sitewide duplication risk
as open pending the content-quality agent's findings.

### Medium — NEW: `llms.txt` "Local guides" curation covers ~22% of live posts and has left two empty section headers
**Description:** The blog scaled to 89 live posts, but `llms.txt`'s "Local guides" section lists
only 20 of them — the July 12-15 batch plus a handful from late June. It does not include the
large mid-July wave of city/category cost-and-booking guides (e.g.
`kathmandu-plumber-callout-cost-guide`, `pokhara-hotels-lakeside-booking-guide`,
`bhaktapur-newari-restaurant-booking-guide`, and ~30 more dated 2026-07-11/12), nor the ~35
earlier posts from June. Separately, as covered in the Critical finding above, "Business
comparison guides" and "Data-backed local answers" are present as headers with zero list items —
technically honest (there's genuinely nothing indexable to link yet) but reads as a malformed or
broken file to an LLM or tool parsing it section-by-section, and a maintainer glancing at the file
could reasonably conclude a generation bug rather than a deliberate content gate.
**Recommendation:** Either drop empty section headers entirely until they have content, or add a
one-line explanatory note under each ("Comparison pages are gated pending data review — see
Editorial Policy") so the empty state reads as intentional. Separately, either widen the curation
window/logic so "Local guides" keeps pace with sitemap growth, or make explicit in the file's
intro that `llms.txt` is a curated subset (it already says this) and lean harder on the "use the
XML sitemap for complete canonical URL discovery" instruction so AI agents know to go there for
full coverage.

### Medium — REGRESSED: robots.txt lost its explicit per-AI-bot directives
**Description:** The prior audit (2026-07-11) documented dedicated `User-Agent` blocks for
Googlebot, Bingbot, `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `PerplexityBot`, and `ClaudeBot`,
each with explicit `Allow: /`. The current live `robots.txt` (verified 2026-07-16, matches the
saved copy) has been simplified to a single `User-Agent: *` block with no bot-specific rules at
all. **Net crawl access is unaffected** — GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, and
Google-Extended all still inherit `Allow: /` — so this is not blocking anything today. But two
things were lost: (1) the explicit, auditable signal that AI-search access is a deliberate
decision rather than an accident of an open wildcard, and (2) the ability to differentiate
AI-search crawlers (GPTBot, PerplexityBot, ClaudeBot, OAI-SearchBot — worth allowing for citation
visibility) from AI-training-only crawlers (CCBot, anthropic-ai, cohere-ai — commonly blocked by
sites that want search citation but not training scraping), which now all inherit the same
blanket allow with no way to distinguish intent.
**Recommendation:** Confirm this simplification was intentional. If the goal is still "AI search
visibility yes, AI training scraping optional," reinstate explicit per-bot blocks — this is a
5-minute change with no downside, and restores the auditable signal for future reviews.

### Low/Medium — STILL OPEN: No distinct machine-readable "facts last verified" signal
**Description:** Same gap as the prior audit. `llms.txt` still instructs AI agents to confirm
time-sensitive details directly, and this instruction is now also reinforced in on-page body copy
across templates (seen verbatim on both the category page — *"Menus, kitchens and opening hours
can change without notice... Ask the restaurant directly"* — and the business page — *"Directory
profiles help with discovery, but hours, prices, availability, credentials and service coverage
can change. Confirm important details directly"*). This is good defensive copy, but there is still
no structured field (e.g., a distinct `lastVerified` date separate from `dateModified`) an AI
engine could extract programmatically to gauge freshness of a specific fact.
**Recommendation:** Unchanged from prior audit — low urgency, revisit once business listings are
live in volume (see Critical finding above), since hours/prices on real listings are exactly where
a stale-fact citation would cause the most harm.

### Low — STILL OPEN / IMPROVED: FAQ schema remains a strong, underused-for-classic-SEO GEO asset
**Description:** Unchanged assessment from prior audit, reinforced by new evidence: the sampled
July blog post carries `FAQPage` + `Question` + `Answer` JSON-LD alongside a dedicated "Frequently
asked questions" H2 section, and the pattern appears structurally consistent with the "Quick
answer" opening block used across the newer post template. This remains a low-priority note (no
action needed) rather than a problem — flagging so the schema investment continues to be
recognized as GEO-valuable independent of Google rich-result eligibility.

## Brand mention & external signals
Not independently re-verified this cycle (Wikipedia/Reddit/YouTube/LinkedIn presence, Domain
Rating) — no material change expected for a domain at this stage over a 5-day window, and this
re-audit was scoped toward crawler access, `llms.txt`, and passage-level citability. Carry forward
the prior audit's implicit baseline (early-stage domain, minimal external brand signal) and treat
as a gap to close in the next full audit cycle, ideally alongside the content-quality agent's
findings on the current post corpus.

## Quick wins
1. **Highest leverage:** push even 20-50 reviewed business records through the review pipeline so
   `noindex` can come off real listings and `sitemap-listings-1.xml` stops being empty — this is
   the single biggest lever for local-intent AI citations (Critical finding #1).
2. Reinstate explicit per-bot `Allow` rules for GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot
   (and decide intentionally on CCBot/anthropic-ai/cohere-ai) in `robots.txt` — 5-minute fix,
   restores the auditable signal lost since the last audit.
3. Either remove the two empty `llms.txt` section headers or add one-line notes explaining the
   gate, and widen "Local guides" curation to track the full 89-post sitemap rather than a ~20-post
   snapshot.
4. Cross-reference the content-quality agent's findings on the scaled 89-post corpus before
   declaring blog duplication fully resolved — the URL-level fix (this audit) and text-level fix
   (their audit) are two different claims.
5. Add a distinct "facts last verified" signal ahead of the business-listing relaunch, so it ships
   with the review-pipeline work rather than being retrofitted later.

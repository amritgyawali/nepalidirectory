# Content Quality (E-E-A-T, Readability, Thin Content, AI Citability) — nepalidirectory.com

**Re-audit date: 2026-07-16** (prior baseline: 2026-07-11, `FULL-AUDIT-REPORT.md` / `audit-data.json`)

**Score: 60/100** (was 52/100 — **+8**)

## Re-audit methodology (duplicate-content check — the primary question for this pass)
The blog grew from 12–14 posts (07-11 baseline) to **97 posts** live in `sitemap-blog.xml` — an 8x
increase. Rather than crawl all 97, this re-audit sampled **43 blog posts** via `render_page.py`
(raw HTML; pages are server-rendered, no JS render needed) and isolated the true `<article>` prose
(H1 + "Quick answer" + genuine H2 body sections + FAQ), explicitly excluding the templated closing
blocks repeated on every post ("Related guides", "About", "Directory", "Popular Categories", "City
Guides"). The sample deliberately spans:
- All 6 reachable posts from the original 07-11 baseline cohort (published 2026-06-12 to 06-27,
  pre-dating the dedup fix below).
- 4 posts from the `how-to-compare-*` cluster (published 2026-07-05/06 — the 24-48h window right
  before the fix landed).
- 33 posts from the "new" corpus spanning 2026-07-11 through 07-15, across 8 template families
  (city×restaurants, city×hotels, city×schools, city×beauty, city×health/clinics, Kathmandu
  niche-clinic guides, generic "X in Nepal" comparison guides, Kathmandu-specific niches), plus 3
  `/authors/*` desk pages, the homepage, one category page, and one city page.
- Pairwise 5-word-shingle Jaccard similarity was computed for every pair inside each family using
  **the exact same method the site's own dedup guard uses**
  (`lib/blog-engine/generate/seo.ts` → `isNearDuplicateContent`, threshold 0.55), so the verdict is
  directly comparable to production logic, not an arbitrary external metric.

## Duplicate-content verdict: the pipeline fix genuinely worked, at scale, with one residual pocket

The prior audit's root-cause hypothesis — "AI auto-blog pipeline with weak dedup" — was **fixed in
the codebase the same day the prior audit completed**. Commit `4a63e56` ("seo", 2026-07-11
12:48 +0545, ~65 minutes after the prior audit's data files were written) rewrote
`lib/blog-engine/generate/seo.ts` / `handlers/blog-generate.ts` to add three independent guards
that now run before any post is created:
1. `isDuplicateTopic` — title-level token-Jaccard, threshold 0.72.
2. `isNearDuplicateContent` — 5-word-shingle Jaccard over the full draft body, threshold 0.55.
3. `isDuplicateEmbedding` — cosine similarity, threshold **lowered from 0.9 to 0.84** (stricter).

**Result on the 33 posts published 07-11 through 07-15 (generated under the fixed pipeline):
pairwise similarity within every template family sampled was 0.00–0.03** — effectively zero
overlap, including on the most structurally-similar-possible test case (same topic, different
city): `biratnagar-restaurants-dining-guide` vs `butwal-restaurants-dining-guide` vs
`dharan-restaurants-local-food-guide` scored 0.014–0.023; the `nepal-business-directory-find-
local-services-guide` / `shops-in-nepal-...` / `restaurants-in-nepal-...` generic cluster
published 07-15 scored a max of 0.013. These read as genuinely distinct AI-written articles with
city/topic-specific detail, not template swaps. **At 8x scale, the duplicate-content problem has
not gotten worse — it has been substantially resolved for everything generated since the fix.**

**However, one pre-fix cluster is still live and still fails the site's own current threshold.**
Four posts published 2026-07-05/06 (24–48h before the fix) — `/blog/how-to-compare-local-services
-in-nepal-before-booking`, `/blog/how-to-compare-clinics-and-appointments-in-nepal`,
`/blog/how-to-compare-repair-providers-in-nepal-before-hiring`, `/blog/how-to-compare-event-venues
-and-vendors-in-nepal` — score **0.622–0.658 pairwise similarity in 3 of their 6 pairs**, all above
the site's own 0.55 near-duplicate threshold. Inspecting the text shows why: these four are
verbatim instances of the `ensureBodyMarkdown()` deterministic fallback scaffold in
`lib/blog-engine/generate/writer.ts` (its own code comment warns: *"the deterministic scaffold
below... is near-identical across posts"*). Sample opening line, identical across all four except
the bracketed noun: *"Use this guide as a practical checklist for **[topic]**. It is written for
people comparing Nepal businesses through NepaliDirectory, where category fit, location, contact
details, service notes and public review signals all matter before making a booking decision."*
`lib/blog-dedup.ts` shows the site *did* do partial cleanup — 7 near-exact-title duplicates of this
same cluster were caught and 301-redirected into these 4 "survivors" — but the 4 survivors were
apparently never checked against **each other**, so a smaller but still-live near-duplicate cluster
(~4% of the sampled corpus) persists in the index today.

**Verdict: STILL PARTIALLY OPEN, but the severity and scope changed completely.** Baseline was "the
pipeline doesn't work — expect this to compound at scale." Current state is "the pipeline works and
held up cleanly under 8x growth; a small pre-fix cluster of 4 posts was never retroactively
cleaned up." Recommend either merging the 4 `how-to-compare-*` posts into one broader guide, or
regenerating 3 of the 4 through the current (fixed) pipeline, then adding the retired slugs to
`blog-dedup.ts` — the same pattern already proven on the other 7.

## What works
- **[FIXED] Embedding/topic/shingle dedup pipeline holds at 8x scale** — see verdict above. This
  was the single most important open question for this re-audit and it resolved favorably.
- **[NEW] Blog category hub thin-archive guard**: `lib/blog-quality.ts`
  (`MIN_INDEXABLE_BLOG_CATEGORY_POSTS = 3`) keeps `/blog/category/*` hubs out of the index until
  they have ≥3 posts, avoiding one-post archive pages that would duplicate their single article's
  intent. All 9 `/blog/category/*` URLs in the current sitemap comfortably clear this bar.
- **[IMPROVED] New-corpus posts are substantially deeper and more specific than the 07-11 baseline.**
  True article prose (boilerplate excluded) on the 33 post-fix sample ran 800–1,400+ words across
  6–9 genuine H2 sections, versus 160–410 words on the 6 baseline posts re-checked this round (see
  next Finding — that baseline figure is *lower* than the 504–658 word_count the prior audit
  reported, because that figure came from a naive DOM word count that folded in the repeated
  "Related guides / About / Directory / Popular Categories / City Guides" boilerplate embedded
  inside the `<article>` tag; this re-audit's boilerplate-excluded extraction is a cleaner
  content-only measure and should be the baseline methodology going forward).
- **[NEW] `/authors/*` desk pages now function as real topic hubs, not just bio stubs.**
  `/authors/health-desk` and `/authors/travel-desk` each list 15–19 guides with distinct one-line
  summaries (477 and 501 words respectively) — a legitimate topical-authority signal and a genuine
  internal-linking asset. `/editorial-policy`, `/directory-methodology`, and `/attribution` are new
  pages since the prior audit and are good-faith trust/transparency additions.
- **[CARRIED FORWARD] AI-content transparency signal still present and applied to new content.**
  Spot-checked a 07-15-published post (`/blog/nepal-insurance-agent-guide`) and confirmed
  `<meta name="ai-content-declaration" content="human-reviewed local directory and guide content"/>`
  plus `BlogPosting` schema and `authors/<desk>` linkage carry through to the new corpus, not just
  the original 14.

## Findings

### High — [STILL OPEN, narrower scope] Residual pre-fix near-duplicate cluster (4 posts, fails the site's own current dedup threshold)
**Description:** `/blog/how-to-compare-local-services-in-nepal-before-booking`,
`/blog/how-to-compare-clinics-and-appointments-in-nepal`,
`/blog/how-to-compare-repair-providers-in-nepal-before-hiring`, and
`/blog/how-to-compare-event-venues-and-vendors-in-nepal` (all published 07-05/06) are
0.62–0.66 pairwise-similar to each other by the site's own shingle-Jaccard measure — all built
from the same deterministic fallback scaffold in `writer.ts`. This is the last surviving fragment
of the original "5 near-duplicate clusters" finding; the other clusters were evidently caught by
the 07-11 fix or already redirected via `lib/blog-dedup.ts`.
**Recommendation:** Regenerate 3 of the 4 through the current pipeline (which would now correctly
reject them as duplicates of each other and force genuinely distinct drafts), or manually merge
into one "How to Compare Local Services in Nepal" hub post and 301 the other three via the existing
`duplicateBlogRedirects` map.

### High — [STILL OPEN, original cohort only] The 6 re-checked baseline posts remain thin once boilerplate is excluded (160–410 words of real prose)
**Description:** Re-measuring `kathmandu-dental-clinic-guide`, `kathmandu-hospitals-clinics-
checklist`, `verified-contractor-nepal`, `annapurna-circuit-guide`, `nepal-wedding-planning-
checklist`, and `compare-schools-kathmandu-admissions` with boilerplate stripped from the
`<article>` tag shows only 3–4 genuine H2 body sections (~289–408 true words), not the 504–658
figure previously reported (see methodology note above). These are the same original posts
flagged as thin in the 07-11 audit, and they have **not** been retroactively rewritten — only new
posts benefit from the deeper writing the current pipeline produces.
**Recommendation:** Backfill the original ~14 posts through the current (fixed, higher-output)
generation pipeline rather than leaving them as the thinnest, most dated content on the site —
several are on commercially competitive topics (dental, contractors, wedding, schools).

### Medium — [CARRIED FORWARD, gap now larger in absolute terms] Author bylines remain organizational "desks," not named individuals with credentials
**Description:** Every post sampled — old and new — is still attributed to `Organization`-typed
desk bylines (Health Desk, Travel Desk, etc.) rather than a named person with stated credentials.
For YMYL-adjacent health content, this gap now covers more posts than at the 07-11 baseline, since
several new health-adjacent guides have shipped since (`kathmandu-ayurveda-clinic-guide`,
`kathmandu-eye-clinic-optical-shop-guide`, `kathmandu-veterinary-clinic-pet-care-guide`,
`pokhara-hospitals-clinics-guide`, `biratnagar-doctors-clinics-appointment-guide`, and others),
all under the same anonymous-desk pattern.
**Recommendation:** Unchanged from prior audit — add a named reviewer with real credentials for
healthcare content specifically, even one real editorial reviewer per vertical.

### Medium — [CARRIED FORWARD, not re-verified this pass] 34 static pages inherit the homepage's default title/meta
**Description:** Not re-crawled in this pass (this re-audit focused on the blog duplicate-content
question and E-E-A-T/homepage checks per scope); flagging as carried forward pending re-verification
by the Technical/On-Page workstream, since it shares the same root cause documented at 07-11
(pages like `/about`, `/advertise`, `/contact`, `/pricing`, `/help` inheriting the homepage's
default title/description rather than page-specific values).
**Recommendation:** Unchanged — see Technical/On-Page findings for current status; treat as a
content-completeness gap, not just a metadata bug.

### Medium — [STILL OPEN, unchanged root cause, now with direct on-page confirmation] Homepage and category pages remain thin; moderation gate is confirmed to be suppressing indexable content volume
**Description:** Homepage `extracted_text` is 63 words; `/category/restaurants` is 119 words —
both far under any reasonable page-type floor. The homepage copy explicitly states *"Unreviewed
preview records stay outside public rankings"*, and `/city/kathmandu` states *"Only active records
that pass source, location, category and completeness checks appear here... Preview, incomplete
and unreviewed records stay outside city rankings."* This confirms the hypothesis directly: a real
moderation/verification gate on business listings is intentionally keeping content out of the
public, indexable surface — consistent with (likely the same root cause as) the prior audit's
Critical finding that the directory has ~1 real listing against a claimed 50,000+. Separately,
`getEvergreenPages()` in `lib/seo-auto/evergreen.ts` — the code that would generate data-backed
"Best `<category>` in `<city>`" pages from real listings — is gated behind an `includePreview` flag
and returns `[]` in production (`if (!options.includePreview) return [];`, with a code comment
noting the bundled businesses are demo fixtures). This is a second, code-level confirmation that
the site's most valuable potential content type (real, ranked local-listings pages) is
deliberately not shipping yet.
**Recommendation:** Unchanged priority from the prior audit: this is the structural ceiling on the
whole Content category. The blog-dedup fix proves the team can ship pipeline fixes fast — apply the
same urgency to unblocking the listings/moderation backlog, since no amount of blog volume
substitutes for the core directory product.

### Medium — [CARRIED FORWARD, not re-verified this pass] Q&A content (`/qa`, `/ask-question`, `/restaurant-qa`) likely still thin/pre-population-stage
**Description:** Not re-crawled this pass; flagging as carried forward from 07-11 pending
re-verification, since it was outside this re-audit's blog-duplication/E-E-A-T scope. If AI-
generated answers have begun populating these pages since 07-11, verify they carry the same
`ai-content-declaration`-style disclosure used on blog posts.
**Recommendation:** Unchanged — re-verify word counts and AI-answer disclosure on next full crawl.

### Low — [NEW] Minor QA bug: `/authors/team` repeats its only paragraph verbatim
**Description:** The team author page's extracted content is a single 2-sentence AI-disclosure
paragraph, immediately duplicated: *"NepaliDirectory Team publishes AI-assisted articles that are
grounded in cited sources, fact-checked and controlled by configured quality gates. See the
editorial policy for the full process."* appears twice back-to-back with no other content (54
words total). Not a duplicate-content SEO risk given the page's low priority, but worth a quick fix.
**Recommendation:** Render the description once; consider expanding `/authors/team` with the same
guide-listing structure already used well on `/authors/health-desk` and `/authors/travel-desk`.

### Info — [CARRIED FORWARD] Content depth is still structurally capped by the missing-listings issue
**Description:** Unchanged from the prior audit — restated because it remains the ceiling on the
achievable Content score even as the blog corpus itself has substantially improved. See the
Medium "Homepage and category pages" finding above for fresh confirmation (moderation-gate copy +
`evergreen.ts` code).

## Quick wins
1. Consolidate or regenerate the 4 residual `how-to-compare-*` posts (07-05/06 cohort) that fail
   the site's own current 0.55 near-duplicate-content threshold against each other — the fastest,
   highest-confidence fix available, using the exact redirect pattern already proven in
   `lib/blog-dedup.ts`.
2. Backfill the original ~14 baseline posts (still 160–410 words of real prose) through the current
   generation pipeline so the oldest, most competitive-topic content isn't also the thinnest.
3. Fix the duplicated paragraph on `/authors/team` and give it the same guide-listing treatment as
   the other desk pages.
4. Add a named human reviewer byline for healthcare-vertical posts specifically (unchanged
   recommendation, now covering a larger set of health posts than at the 07-11 baseline).
5. Treat the homepage/category thinness and the disabled `getEvergreenPages()` output as one
   workstream with the listings-moderation backlog — content-side polish cannot move the needle
   further until that unblocks.

# NEPALIDIRECTORY — AI TRANSFORMATION BUILD PROMPT (for Claude Code)

**Executor:** Claude Code — paste this entire file as the brief, then run phase by phase.
**Owner:** Amrit | **Project:** nepalidirectory (Pahelo) — Nepal business directory
**Version:** 1.0 | July 2026
**Assumed stack:** Spring Boot 3.x / Java 21 + Next.js (App Router, TypeScript) + PostgreSQL 16 + pgvector. Flyway migrations. Redis optional (not required — queue is DB-backed).

---

## 0. HOW TO EXECUTE THIS PROMPT (instructions to Claude Code)

1. **Phase 0 first — audit the repo.** Detect the actual stack, existing entities (listings, categories, locations, reviews, users), routing, and admin surface. If the real stack differs from the assumed stack, map every module below onto the actual stack but KEEP the contracts (tables, endpoints, prompt templates, env vars) identical. Write findings to `docs/PHASE0_AUDIT.md`.
2. **Do not ask clarifying questions.** Make reasonable decisions, record every non-obvious decision in `docs/DECISIONS.md` (one line each: decision, alternative rejected, why).
3. **Work in the phase order of §17.** Each phase must end with: compiling code, applied Flyway migration, passing tests, seeded demo data, and a conventional commit per module (`feat(ai-core): ...`, `feat(blog): ...`).
4. **Everything AI is behind a feature flag** (env-driven). Every automated pipeline has a kill switch. Nothing auto-publishes to production by default.
5. **Hard rules (non-negotiable, restated in §20):**
   - Never scrape or bulk-store Google Maps/Places data (see §2).
   - Never generate content presented as a user review. AI summarizes reviews; it never writes them.
   - Never fabricate business facts (hours, prices, phone numbers, awards). AI may only rephrase provided structured data.
   - Blog auto-publish stays OFF until the human review queue has been used for ≥20 posts.
6. **Testing:** implement a `MockAiProvider` that returns deterministic canned JSON per task type. All unit/integration tests run against the mock — zero external API calls in CI.
7. **Idempotency:** every ingestion and enrichment job must be safe to re-run (upserts keyed on stable natural keys, content hashes).

---

## 1. MISSION

Transform a basic directory website into an **AI-native local discovery platform for Nepal**. Three pillars:

- **A — Autonomous content engine:** detects what's trending in Nepal and publishes grounded, SEO-ready blog articles that funnel readers into directory listings.
- **B — Intelligent data acquisition & enrichment:** legally builds and enriches a large listing base (descriptions, categories, FAQs, embeddings) with near-zero manual effort.
- **C — Semantic discovery:** natural-language search, an AI concierge, review intelligence, and AEO so both humans and AI platforms (ChatGPT, Gemini, AI Overviews, Perplexity) find and cite the site.

North-star loop: **Trend → Article → internal links → Category/Listing pages → business claims → richer data → better answers → more citations/traffic.**

---

## 2. DATA SOURCING — LEGAL REALITY (read before writing any importer)

**Do NOT build a Google Maps scraper.** Scraping Maps or bulk-harvesting Places API responses into a permanent directory database violates Google Maps Platform ToS/policies. Consequences: API key + project bans, potential legal exposure, and a strategically worthless dataset (you cannot out-rank Google using Google's own data). Places policy in one line: **`place_id` may be stored indefinitely; nearly all other Places content may only be cached temporarily and must not be used to build a standalone dataset.** Claude Code: re-verify the current caching windows at `developers.google.com/maps/documentation/places/web-service/policies` before implementing B2.

**Compliant acquisition stack (build all five tiers):**

| Tier | Source | Legal basis | Role |
|---|---|---|---|
| 1 | **OpenStreetMap** (Geofabrik Nepal extract / Overpass) | ODbL, free | Bulk seed: thousands of POIs nationwide |
| 2 | **Google Places API — on-demand only** | Places ToS | Verify/enrich a single listing at claim-time or admin-review time; store `place_id` + our own derived quality flags only |
| 3 | **Business claims + user submissions** | First-party | THE moat — AI-assisted onboarding makes this near-effortless (§6.3) |
| 4 | **Polite crawler of business-owned websites** | robots.txt respected, public pages | Enrich known/claimed listings (hours, services, photos-by-link) |
| 5 | **Official/manual imports** (OCR company registry lists, municipal/ward business lists, chamber-of-commerce CSVs) | Public records / licensed | Long-tail coverage; CSV import pipeline |

**ODbL note (Tier 1):** OSM-sourced rows must carry `data_source='osm'` + source element id, the site must show "© OpenStreetMap contributors" attribution (footer + `/attribution` page), and be aware ODbL share-alike can apply to the derivative parts of the database. Keep OSM-derived fields flagged so they are separable.

---

## 3. AI USE-CASE MATRIX (what AI does in a Yellow-Pages-style directory)

| # | Use case | What it does | Value | Effort | Phase |
|---|---|---|---|---|---|
| 1 | Trending blog engine | Trend detection → grounded article → auto internal links to listings | ★★★★★ | High | P3 |
| 2 | Listing enrichment | Description (EN+NE), category, tags, FAQ, SEO meta per listing — one AI call each | ★★★★★ | Med | P1 |
| 3 | Semantic + NL search | "waterproofing thulo ghar lalitpur open now" → correct results | ★★★★★ | Med | P4 |
| 4 | AI concierge chat | Conversational finder grounded ONLY in the DB | ★★★★ | Med | P4 |
| 5 | Entity resolution / dedup | Merge duplicates across OSM + submissions + imports | ★★★★★ | Med | P2 |
| 6 | Review intelligence | "What people say" summaries, pros/cons, sentiment, spam flagging | ★★★★ | Low | P5 |
| 7 | Programmatic SEO pages | "Best [category] in [city]" from REAL data, quality-gated | ★★★★ | Low | P5 |
| 8 | AEO/GEO automation | Schema, llms.txt, citable answer blocks → AI platforms cite the site | ★★★★ | Low | P5 |
| 9 | AI listing onboarding | Owner pastes their website/FB URL → AI drafts the full listing | ★★★★ | Low | P2 |
| 10 | Category/city intro copy | Unique intro per category×city page (kills thin-content risk) | ★★★ | Low | P5 |
| 11 | Owner reply drafter | 3-tone AI drafts for replying to reviews (owner dashboard upsell) | ★★★ | Low | P5 |
| 12 | Demand intelligence | Zero-result searches + concierge asks → "businesses we need" + blog topics | ★★★ | Low | P4 |
| 13 | Bilingual EN/NE | Translate/generate Nepali variants, hreflang pairs | ★★★ | Med | P5 |
| 14 | Data-quality scoring | Completeness 0–100 per listing → ranking factor + owner nudge | ★★★ | Low | P1 |
| 15 | Attribute extraction | Pull structured attributes (delivery? parking? eSewa accepted?) from text | ★★ | Low | P2 |
| 16 | Alt-text + image tagging | Accessibility + image SEO on uploaded photos | ★★ | Low | P5 |

---

## 4. ARCHITECTURE OVERVIEW

```
                       ┌────────────────────────────────────────────┐
   RSS / Reddit /      │              SPRING BOOT API               │
   YouTube / OSM ────▶ │  ingestion crons        REST + SSE         │
                       │      │                     ▲               │
                       │      ▼                     │               │
                       │  ai_jobs queue (Postgres SKIP LOCKED)      │
                       │      │                                     │
                       │      ▼                                     │
                       │  AI Worker ──▶ AiProvider abstraction ─────┼──▶ Gemini / Groq /
                       │      │         (cache → budget → fallback) │    OpenRouter / Ollama
                       │      ▼                                     │
                       │  PostgreSQL 16 + pgvector + pg_trgm        │
                       └────────────────────────────────────────────┘
                                          ▲
                                          │ REST/ISR
                       ┌────────────────────────────────────────────┐
                       │  NEXT.JS: public site + blog + /admin/ai   │
                       └────────────────────────────────────────────┘
```

**Key decisions:** DB-backed job queue (`FOR UPDATE SKIP LOCKED` — no new infra), provider-agnostic AI layer, response cache table (free-tier survival), prompt templates stored versioned in DB, human review queues for blog + merges + flags.

---

## 5. MODULE A — AI PROVIDER LAYER (`ai-core`)

The user supplies free-tier API keys via env. Build a provider-agnostic layer so any key works.

### 5.1 Interfaces (Java)

```java
public interface AiProvider {
    String id();                                  // "gemini" | "groq" | "openrouter" | "ollama" | "mock"
    AiResult complete(AiRequest req);             // text out
    AiResult completeJson(AiRequest req, String jsonSchema); // schema-validated JSON out
    float[] embed(String text);                   // dim from EMBEDDING_DIM
    boolean healthy();
}

public record AiRequest(String taskKey, String system, String user,
                        double temperature, int maxTokens, Map<String,Object> meta) {}
public record AiResult(String text, int inputTokens, int outputTokens,
                       String provider, String model, long latencyMs, boolean cached) {}
```

### 5.2 Behavior chain (implement as decorators around the raw adapters)

`CachingProvider` → `BudgetGuard` → `RateLimiter` → `FallbackChain(primary, fallbacks…)` → adapter.

- **Cache:** key = `sha256(provider+model+system+user+schema)`; table `ai_cache`; TTL `AI_CACHE_TTL_DAYS` (default 30). Enrichment tasks are highly cacheable — this alone can cut token spend 40–60% on re-runs.
- **Budget:** per-provider daily token caps from env; when exceeded → next provider in chain; all exhausted → job re-queued with `run_after = tomorrow 00:15 NPT`.
- **Rate limiter:** token-bucket per provider using env RPM/RPD values.
- **JSON mode:** ask for strict JSON, strip code fences, validate against the task's JSON schema; on invalid → one retry with the validation error appended; still invalid → job FAILED with payload saved for admin replay.
- **Retry/backoff:** 429/5xx → exponential backoff (1s, 4s, 15s), then fallback provider.
- **Logging:** every call → `ai_usage_log` (provider, model, task_key, tokens in/out, latency, cache_hit, status).

### 5.3 Adapters

| Adapter | Endpoint style | Notes |
|---|---|---|
| `GeminiAdapter` | Google AI Studio REST (`generativelanguage.googleapis.com`) | Best free tier + strongest Nepali quality → default primary. Also provides embeddings. |
| `GroqAdapter` | OpenAI-compatible `/chat/completions` | Very fast Llama models, good free tier → default fallback. |
| `OpenRouterAdapter` | OpenAI-compatible | Access to rotating `:free` models → second fallback. |
| `OllamaAdapter` | Local `OLLAMA_BASE_URL` | Zero-cost embeddings (`bge-m3` handles Nepali) and dev completions. |
| `MockAiProvider` | none | Deterministic canned JSON per `taskKey` for tests/CI. |

Claude Code: implement Groq/OpenRouter through ONE `OpenAiCompatibleAdapter` with configurable base URL — that future-proofs for any key Amrit supplies. **Verify current free-tier model names and limits at build time** (they change quarterly); read them from env, never hardcode. Suggested env defaults are placeholders in §18.

### 5.4 Job queue (`ai_jobs`)

Poller: `@Scheduled(fixedDelay=2000)` worker claims jobs via
`UPDATE ai_jobs SET status='RUNNING', locked_by=:node WHERE id = (SELECT id FROM ai_jobs WHERE status='PENDING' AND run_after <= now() ORDER BY priority DESC, id LIMIT 1 FOR UPDATE SKIP LOCKED) RETURNING *;`
Attempts max 4 → `DEAD` (visible + replayable in admin console). Job types: `ENRICH_LISTING`, `EMBED_LISTING`, `TREND_SCAN`, `TREND_CLUSTER`, `BLOG_GENERATE`, `BLOG_FACTCHECK`, `REVIEW_SUMMARY`, `MERGE_ADJUDICATE`, `TRANSLATE_NE`, `EVERGREEN_PAGE`.

---

## 6. MODULE B — DATA ACQUISITION ENGINE (`acquire`)

### 6.1 OSM bulk importer (Tier 1 — the seed)

- Source: `https://download.geofabrik.de/asia/nepal-latest.osm.pbf` (config `OSM_PBF_URL`). Parse with **osm4j** or shell out to `osmium export --output-format=geojsonseq` and stream-parse (pick whichever is simpler in the repo; record in DECISIONS.md).
- Import nodes/ways carrying any of: `shop=*`, `amenity=*` (whitelist commercial values: restaurant, cafe, bank, pharmacy, hospital, clinic, dentist, fuel, school, college…), `office=*`, `craft=*`, `tourism=hotel|guest_house|hostel|attraction`, `healthcare=*`, `leisure=fitness_centre|sports_centre`.
- **Tag→taxonomy mapping table** `osm_tag_map(osm_key, osm_value, category_slug)` seeded with ~120 rows; unmapped tags land in category `uncategorized` for the AI classifier (§7) to fix.
- Fields: name (skip unnamed), lat/lng, `addr:*`, phone/website/opening_hours if present, `osm_type+osm_id` as natural key (upsert), `data_source='osm'`, `source_ref`, `license_note='ODbL'`.
- **Admin geography:** resolve province → district → municipality → ward by point-in-polygon against OSM admin boundaries (import `boundary=administrative` admin_level 4/6/7/9 into PostGIS-lite via plain polygon columns, or use a prebuilt Nepal GeoJSON of wards committed to the repo). Every listing must resolve to at least district + municipality.
- Batch record in `ingest_batches` (source, counts inserted/updated/skipped, started/finished). Re-runnable monthly via cron for diffs.
- Ship the `/attribution` page + footer credit in the same PR.

### 6.2 Google Places — on-demand enrichment only (Tier 2, optional key)

Allowed uses ONLY:
1. **Claim verification:** owner claiming a listing → Find Place by phone/name → show match → store `google_place_id` + our own `verified=true`.
2. **Admin spot-enrichment:** admin opens a listing → "check against Google" → display fresh data side-by-side → admin manually accepts field updates (data then becomes first-party-curated, provenance `google_ondemand_reviewed`).
Forbidden: batch loops over Places endpoints, storing ratings/reviews/photos, any background harvesting. Enforce in code: the Places client class exposes only `findPlaceForClaim()` and `adminSpotCheck()` and is annotated with a comment block quoting the policy.

### 6.3 Business claims + AI-assisted onboarding (Tier 3 — the moat)

- Public "Add your business" + "Claim this listing" flows (claim = OTP to the listed phone, or document upload → admin queue).
- **AI onboarding:** owner pastes their website / public FB page URL → crawler (§6.4) fetches → `LISTING_ENRICH` extracts name, services, hours, price hints → pre-filled form → owner edits/approves → saved with `data_source='owner'`. Target: <3 minutes to a complete listing.

### 6.4 Enrichment crawler (Tier 4)

- Respect robots.txt (use `crawler-commons` robots parser), identify as `NepaliDirectoryBot/1.0 (+https://SITE/bot)`, 1 req/2s per host, cache raw HTML 30 days in `crawl_cache`.
- Only crawls URLs attached to a listing (never discovery-crawls the open web).
- Extract with jsoup → main text + JSON-LD if present → feed `ATTRIBUTE_EXTRACT` prompt → structured fields with `data_source='crawler'` provenance, shown to admin/owner as "suggested", never silently overwriting owner data.

### 6.5 CSV/official import (Tier 5)

Admin CSV upload → column-mapping UI → dry-run preview → import with `data_source='import'` + `source_ref=<batch name>`. Same dedup pipeline as everything else.

### 6.6 Entity resolution / dedup (runs on EVERY insert from any tier)

1. **Blocking keys:** normalized phone (strip +977/0, spaces) OR (geohash-5 AND name trigram similarity > 0.35).
2. **Scoring:** `score = 0.4*trgm(name) + 0.3*phone_exact + 0.2*geo_proximity(≤150m) + 0.1*embedding_cosine(name+category)`.
3. `score ≥ 0.90` → auto-merge (keep richest record, union fields, log). `0.65–0.90` → `merge_candidates` row → AI adjudicator (`MERGE_ADJUDICATE_V1`, §15) proposes verdict + confidence → admin queue confirms. `< 0.65` → distinct.
4. Merges are reversible: store `merged_from` JSON snapshot.

### 6.7 Data quality score

`quality_score` 0–100 = weighted completeness (name 10, category 10, geo 10, phone 15, hours 10, description 15, photos 10, website 5, claimed 15). Recompute on write. Used in ranking (§9) and owner-dashboard nudges ("Add hours to reach 85").

---

## 7. MODULE C — LISTING ENRICHMENT PIPELINE (`enrich`)

One AI call per listing does everything (token-efficient): job `ENRICH_LISTING` → prompt `LISTING_ENRICH_V1` (§15) → returns JSON `{description_en, meta_title, meta_description, faqs[3-5], tags[], category_slug, category_confidence, attributes{}}`.

Rules:
- Input = ONLY the listing's structured fields + crawled text snippet if present. The prompt forbids inventing facts; description length 60–110 words; no unsupported superlatives.
- `category_confidence < 0.6` → keep old category, flag for admin.
- Write provenance: `description_source='ai_v1'`, `ai_enriched_at`. Owner-written descriptions are NEVER overwritten (skip if `description_source='owner'`).
- Separate cheap job `EMBED_LISTING`: embed `name + category + description + tags + locality` → `listing_embeddings`.
- Trigger points: after import batch, after claim approval, after significant edit, nightly sweep of `ai_enriched_at IS NULL` (cap `ENRICH_DAILY_CAP`).
- Nepali variant: job `TRANSLATE_NE` (flagged, Phase 5) writes `description_ne` etc.; hreflang wiring in §11.

---

## 8. MODULE D — TRENDING BLOG ENGINE (`blog`) — flagship

### 8.1 Trend sources (`trend_sources` seeded rows; fetchers tolerant to failure)

| Kind | Source | Notes |
|---|---|---|
| rss | english.onlinekhabar.com/feed | verify path at build |
| rss | onlinekhabar.com/feed (NE) | |
| rss | kathmandupost.com RSS | verify path |
| rss | setopati.com, ratopati.com, myrepublica, thehimalayantimes | verify each; skip broken silently, log |
| reddit | reddit.com/r/Nepal/hot.json?limit=50 | send real User-Agent |
| youtube | Data API v3 `videos.list?chart=mostPopular&regionCode=NP` | free 10k units/day, optional key |
| gtrends | trends.google.com/trending/rss?geo=NP | UNOFFICIAL/fragile — wrap in try/catch, feature flag |

Cron `TREND_SCAN_CRON` (default 06:00 & 16:00 NPT): fetch all active sources → normalize to `trend_items(title, url, summary, published_at, source_id)` → dedupe by URL hash → embed title+summary.

### 8.2 Clustering & scoring (`TREND_CLUSTER` job)

- Window: items from last 72h. Greedy agglomerative: cosine ≥ 0.82 joins a cluster.
- `score = ln(1+item_count) * source_diversity * recency_decay(半life 24h)`; store top 20 as `trend_clusters(status='new')`.

### 8.3 Selection gate (`TREND_SELECTOR_V1` prompt)

Input: top clusters (label + sample headlines). Output JSON per cluster: `{selected, angle, article_type: news_explainer|guide|listicle, target_category_slugs[], safety: ok|blocked, reason}`.
- **Brand-safety hard filter (code-level, before the prompt):** drop clusters matching blocklist regex (politics/elections, deaths/accidents/disasters/crime victims, communal/religious conflict, adult) — a business directory must not monetize tragedy. Configurable `BRAND_SAFETY_BLOCKLIST`.
- **Commercial bridge rule:** a cluster is selected only if it maps to ≥1 directory category (e.g., "monsoon flooding preparedness" → waterproofing, hardware, insurance) OR is evergreen-useful (festival shopping guides, IPO/eSewa how-tos, admission season). Max `BLOG_MAX_PER_DAY` (default 3) clusters proceed.

### 8.4 Generation chain (`BLOG_GENERATE` job — 5 passes, each logged)

1. **Source pack:** fetch top 3–5 cluster URLs (crawler rules apply), extract main text, truncate each to ~1,500 chars → SOURCES block.
2. **Outline** → **Draft** via `BLOG_WRITER_V1` (§15): 900–1,400 words, grounding rules (only facts present in SOURCES; no invented statistics/quotes/prices/dates), Nepal-localized voice, insert link placeholders `{{category:slug}}` / `{{listing:id}}`, FAQ block (3 Q&As), outputs strict JSON.
3. **Fact-check pass** `BLOG_FACTCHECK_V1`: draft vs SOURCES → `{verdict: pass|revise, unsupported_claims[]}`. `revise` → one auto-revision → still failing → status `REVIEW` with claims attached (never auto-publish).
4. **SEO pass:** title ≤60 chars, meta ≤155, slug, H2/H3 sanity, uniqueness check: embedding cosine vs existing posts must be < 0.90 else discard as duplicate.
5. **Link injection (deterministic code, not AI):** resolve placeholders against real category pages / top listings (quality_score ≥ 60); 3–8 internal links; strip unresolved placeholders.

### 8.5 Editorial workflow

`DRAFT → REVIEW → PUBLISHED | REJECTED`. Admin review UI (§12) shows draft, sources, fact-check output, one-click publish/edit/reject. `BLOG_AUTOPUBLISH=false` default; when later enabled, only posts with fact-check `pass` AND selector confidence ≥ 0.8 auto-publish, still capped per day. Byline: "NepaliDirectory Team" linking to `/editorial-policy` page that transparently states AI-assisted, human-reviewed process (E-E-A-T + Google scaled-content-abuse mitigation — the policy targets mass low-value pages, so quality gates + review are the defense, not hiding AI use).

### 8.6 Publishing (Next.js)

- Route `/blog/[slug]` with ISR (revalidate 300s) + `/blog` index + category/tag filters + RSS out at `/blog/rss.xml`.
- `Article` + `BreadcrumbList` JSON-LD; author → Organization. OG image: generate with satori/@vercel/og brand template (headline + category art) — **no AI image API needed**, deterministic and free.
- On publish: update sitemap, ping IndexNow (Bing) — Google discovers via sitemap.
- Related listings widget under each article (from the injected categories) — this is the conversion surface.

### 8.7 Evergreen generator (`EVERGREEN_PAGE` job, Phase 5)

"Best [category] in [city]" pages generated ONLY when gates pass: ≥5 listings, avg quality_score ≥ 60. Content = AI intro (120–180 words, unique per page) + REAL ranked data (listings, stats) + FAQ. Refresh quarterly. Hard caps per the SEO skill's quality gates: warn at 30+ such pages, stop at 50+ without explicit go-ahead; ≥60% of each page must be data-driven unique content.

---

## 9. MODULE E — SEMANTIC SEARCH & AI CONCIERGE (`discover`)

### 9.1 Hybrid retrieval

```sql
WITH fts AS (
  SELECT l.id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(l.search_tsv, q) DESC) rnk
  FROM listings l, websearch_to_tsquery('simple', :query) q
  WHERE l.search_tsv @@ q AND l.status='ACTIVE' LIMIT 50),
vec AS (
  SELECT e.listing_id id, ROW_NUMBER() OVER (ORDER BY e.embedding <=> :qvec) rnk
  FROM listing_embeddings e LIMIT 50)
SELECT id, SUM(1.0/(60+rnk)) AS rrf FROM (SELECT * FROM fts UNION ALL SELECT * FROM vec) u
GROUP BY id ORDER BY rrf DESC LIMIT :k;
```
Then re-rank: `final = rrf * (0.7 + 0.3*quality_score/100)` and apply structured filters. Maintain `search_tsv` via trigger over name+category+tags+locality; add a `category_synonyms` table (AI-generated once per category: EN, NE, romanized-NE like "momo pasal", "chiya") folded into the tsvector.

### 9.2 NL query parser

Fast path: if query matches `[category-ish] in [known place]` patterns → skip AI. Else `NL_QUERY_PARSER_V1` (§15) → `{intent, category_hint, location{city,area}, filters{open_now,price_level}, keywords[], language}`. Cacheable; log to `search_queries_log`.

### 9.3 Concierge chat

- `POST /api/concierge` (SSE stream). Tool loop with exactly two tools: `search_listings(query, category, location, open_now, limit≤5)` and `get_listing(id)`.
- **Grounding contract (system prompt, §15 CONCIERGE_V1):** recommend ONLY businesses returned by tools; if none found, say so and offer to widen the search or record the request; never invent names/phones; always show listing links.
- Zero-result or "I need X" with no supply → write `demand_signals(query, category_guess, location, created_at)` → feeds admin ("businesses to recruit") and the blog topic queue.
- Rate-limit per session; conversation transcripts stored 30 days for QA.


---

## 10. MODULE F — REVIEW INTELLIGENCE (`reviews-ai`)

- `REVIEW_SUMMARY` job when a listing hits ≥3 published reviews; regenerate on every +3 reviews or 90 days. Prompt `REVIEW_SUMMARIZER_V1` → `{summary≤80w, pros[], cons[], sentiment:-1..1, themes[]}` → rendered as "What people say" block (marked AI-generated) + `aggregateRating` stays computed from raw ratings, never AI.
- **Spam/fake detection (heuristics first, AI second):** velocity (>N reviews/listing/day), text-duplication trigram sim > 0.8 across reviews, account age < 24h + 5★, reviewer only reviews one owner's listings. Score > threshold → AI classifier second opinion → `moderation_queue`. Auto-hide only at extreme confidence; humans decide the rest.
- **Owner reply drafter:** owner dashboard button → 3 drafts (professional / warm / brief) referencing the review's specifics; owner edits before posting; drafts watermarked internally `ai_draft=true`.
- **HARD RULE:** no code path may create a review body via AI and store it as a user review. Enforce with a DB check: reviews table has no AI provenance columns, period.

---

## 11. MODULE G — SEO / AEO AUTOMATION (`seo-auto`)

- **Schema map:** listing page → `LocalBusiness` (correct subtype per category map: Restaurant, MedicalClinic, Electrician…) + `BreadcrumbList`; category/city page → `ItemList` + `BreadcrumbList`; blog → `Article` + `FAQPage` markup ONLY as on-page FAQ content (note: Google FAQ rich results are restricted to gov/health since Aug 2023 — keep FAQPage JSON-LD anyway for AI-platform citability, don't promise rich results). Never emit `HowTo` schema (deprecated).
- **Meta everywhere:** enrichment output feeds `<title>`/`<meta description>`/OG on listing pages; category×city pages get AI intro copy (`CATEGORY_INTRO_V1`, unique per pair, gated ≥3 listings).
- **AEO:** serve `/llms.txt` (site purpose, top category URLs, data freshness note); answer-shaped blocks on category pages ("Top 5 X in Y — updated <month>", clean tables, stable anchors); ensure fully SSR/ISR HTML (no client-only content for listings); FAQ answers ≤50 words each — these are what AI Overviews/Perplexity lift.
- **Internal-link suggester:** nightly job proposes links between semantically-near blog posts and category pages (embedding cosine 0.75–0.9), admin approves in bulk.
- **Hreflang:** when `description_ne` exists and NE route is enabled, emit `en`/`ne` hreflang pairs; default `x-default` → EN.
- Sitemaps: split indexes (`/sitemap-listings-N.xml`, `/sitemap-blog.xml`, `/sitemap-categories.xml`), lastmod real, regenerate on publish.

---

## 12. MODULE H — ADMIN AI CONSOLE (`/admin/ai`)

Pages: **Jobs** (filter by type/status, retry, dead-letter replay, payload viewer) · **Spend** (tokens/day per provider chart from `ai_usage_log`, budget bars) · **Prompts** (versioned editor over `prompt_templates`, test-run box against MockAiProvider or live) · **Trend inbox** (clusters → selected/skipped + reasons) · **Blog review queue** (§8.5) · **Merge queue** (§6.6) · **Moderation queue** (§10) · **Demand signals** · **Kill switches** (per-pipeline toggles persisted in `feature_flags` table, override env).
Auth: existing admin role. Server components + simple tables; no design system gymnastics needed here.

---

## 13. DATA MODEL (Flyway migrations — adjust names to existing conventions)

```sql
-- V__ai_core.sql
CREATE EXTENSION IF NOT EXISTS vector; CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE ai_jobs (
  id BIGSERIAL PRIMARY KEY, type TEXT NOT NULL, payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING|RUNNING|DONE|FAILED|DEAD
  priority INT NOT NULL DEFAULT 5, attempts INT NOT NULL DEFAULT 0,
  run_after TIMESTAMPTZ NOT NULL DEFAULT now(), locked_by TEXT,
  result JSONB, error TEXT, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());
CREATE INDEX ON ai_jobs(status, run_after, priority);

CREATE TABLE ai_usage_log (id BIGSERIAL PRIMARY KEY, provider TEXT, model TEXT, task_key TEXT,
  input_tokens INT, output_tokens INT, latency_ms INT, cache_hit BOOL DEFAULT false,
  status TEXT, created_at TIMESTAMPTZ DEFAULT now());

CREATE TABLE ai_cache (cache_key TEXT PRIMARY KEY, response TEXT NOT NULL,
  provider TEXT, model TEXT, created_at TIMESTAMPTZ DEFAULT now(), expires_at TIMESTAMPTZ);

CREATE TABLE prompt_templates (id BIGSERIAL PRIMARY KEY, key TEXT NOT NULL, version INT NOT NULL,
  system_text TEXT NOT NULL, user_template TEXT NOT NULL, json_schema TEXT,
  model_hint TEXT, temperature NUMERIC DEFAULT 0.4, active BOOL DEFAULT true, UNIQUE(key, version));

CREATE TABLE feature_flags (key TEXT PRIMARY KEY, enabled BOOL NOT NULL DEFAULT false, note TEXT);

-- V__acquisition.sql
ALTER TABLE listings ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'user',      -- osm|owner|user|crawler|import|google_ondemand_reviewed
  ADD COLUMN IF NOT EXISTS source_ref TEXT, ADD COLUMN IF NOT EXISTS license_note TEXT,
  ADD COLUMN IF NOT EXISTS google_place_id TEXT, ADD COLUMN IF NOT EXISTS claim_status TEXT DEFAULT 'unclaimed',
  ADD COLUMN IF NOT EXISTS quality_score INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS description_source TEXT, ADD COLUMN IF NOT EXISTS ai_enriched_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS description_ne TEXT, ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS search_tsv tsvector;
CREATE INDEX IF NOT EXISTS idx_listings_tsv ON listings USING gin(search_tsv);
CREATE INDEX IF NOT EXISTS idx_listings_name_trgm ON listings USING gin (lower(name) gin_trgm_ops);

CREATE TABLE osm_tag_map (osm_key TEXT, osm_value TEXT, category_slug TEXT, PRIMARY KEY(osm_key, osm_value));
CREATE TABLE ingest_batches (id BIGSERIAL PRIMARY KEY, source TEXT, stats JSONB,
  started_at TIMESTAMPTZ, finished_at TIMESTAMPTZ);
CREATE TABLE crawl_cache (url_hash TEXT PRIMARY KEY, url TEXT, html TEXT, fetched_at TIMESTAMPTZ);
CREATE TABLE merge_candidates (id BIGSERIAL PRIMARY KEY, a_id BIGINT, b_id BIGINT, score NUMERIC,
  features JSONB, ai_verdict TEXT, ai_confidence NUMERIC, decision TEXT DEFAULT 'pending',
  decided_by TEXT, created_at TIMESTAMPTZ DEFAULT now());

-- V__embeddings.sql  (set dim to EMBEDDING_DIM before running; default 768)
CREATE TABLE listing_embeddings (listing_id BIGINT PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  embedding vector(768), model TEXT, updated_at TIMESTAMPTZ DEFAULT now());
CREATE INDEX ON listing_embeddings USING hnsw (embedding vector_cosine_ops);
CREATE TABLE category_synonyms (category_slug TEXT, synonym TEXT, lang TEXT, PRIMARY KEY(category_slug, synonym));

-- V__blog.sql
CREATE TABLE trend_sources (id BIGSERIAL PRIMARY KEY, name TEXT, kind TEXT, url TEXT,
  region TEXT DEFAULT 'NP', active BOOL DEFAULT true, last_fetched_at TIMESTAMPTZ, fail_count INT DEFAULT 0);
CREATE TABLE trend_items (id BIGSERIAL PRIMARY KEY, source_id BIGINT REFERENCES trend_sources(id),
  title TEXT, url TEXT, url_hash TEXT UNIQUE, summary TEXT, published_at TIMESTAMPTZ,
  embedding vector(768), cluster_id BIGINT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE trend_clusters (id BIGSERIAL PRIMARY KEY, label TEXT, score NUMERIC, item_count INT,
  status TEXT DEFAULT 'new', -- new|selected|skipped|generated
  selector_output JSONB, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE blog_posts (id BIGSERIAL PRIMARY KEY, slug TEXT UNIQUE, title TEXT, excerpt TEXT,
  body_md TEXT, lang TEXT DEFAULT 'en', status TEXT DEFAULT 'DRAFT', -- DRAFT|REVIEW|PUBLISHED|REJECTED
  hero_image_url TEXT, seo JSONB, sources JSONB, cluster_id BIGINT, article_type TEXT,
  author_type TEXT DEFAULT 'ai_assisted', factcheck JSONB, confidence NUMERIC,
  reviewed_by TEXT, published_at TIMESTAMPTZ, embedding vector(768), created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE demand_signals (id BIGSERIAL PRIMARY KEY, query TEXT, category_guess TEXT,
  location TEXT, source TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE search_queries_log (id BIGSERIAL PRIMARY KEY, query TEXT, parsed JSONB,
  results_count INT, created_at TIMESTAMPTZ DEFAULT now());

-- V__reviews_ai.sql
CREATE TABLE review_summaries (listing_id BIGINT PRIMARY KEY, summary TEXT, pros JSONB, cons JSONB,
  sentiment NUMERIC, themes JSONB, review_count INT, generated_at TIMESTAMPTZ);
CREATE TABLE moderation_queue (id BIGSERIAL PRIMARY KEY, entity_type TEXT, entity_id BIGINT,
  reason TEXT, score NUMERIC, ai_opinion JSONB, status TEXT DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE listing_faqs (id BIGSERIAL PRIMARY KEY, listing_id BIGINT REFERENCES listings(id) ON DELETE CASCADE,
  question TEXT, answer TEXT, source TEXT DEFAULT 'ai_v1');
```

---

## 14. API SURFACE (new endpoints)

| Method/Path | Purpose |
|---|---|
| `GET /api/search?q=&category=&city=&open_now=` | Hybrid search (§9.1) |
| `POST /api/concierge` (SSE) | AI concierge chat |
| `GET /api/listings/{id}/ai-summary` | Review summary block |
| `POST /api/claims` · `POST /api/claims/{id}/verify` | Claim flow (Tier 3) |
| `POST /api/onboarding/from-url` | AI onboarding: URL → draft listing |
| `GET /blog`, `GET /blog/{slug}`, `GET /blog/rss.xml` | Blog (Next.js) |
| `POST /admin/ai/jobs/{id}/retry` · `GET /admin/ai/jobs` | Queue ops |
| `GET/PUT /admin/ai/prompts` | Prompt template CRUD (versioned) |
| `POST /admin/ai/test` | Run any prompt against configured provider |
| `GET/POST /admin/blog/review` | Editorial queue actions |
| `GET/POST /admin/merges` · `GET/POST /admin/moderation` | Human queues |
| `POST /admin/import/csv` | Tier 5 import (dry-run + commit) |
| `POST /admin/ingest/osm` | Trigger/refresh OSM batch |
| `GET /llms.txt` · `GET /attribution` | AEO + ODbL compliance |

---

## 15. PROMPT TEMPLATE LIBRARY (seed into `prompt_templates`, version 1)

Placeholders use `{{var}}`. All JSON tasks: temperature 0.2–0.4, "Return ONLY valid JSON matching the schema. No markdown, no commentary."

**LISTING_ENRICH_V1** — system:
"You write listing content for {{site_name}}, Nepal's business directory. You receive structured facts about ONE business. Rules: use ONLY the provided facts; never invent services, prices, hours, awards, or claims like 'best' unless present in input; plain professional English a Kathmandu reader trusts; description 60–110 words mentioning locality naturally."
user: "FACTS:\n{{facts_json}}\nCRAWLED_TEXT (may be empty, treat as unverified marketing copy — extract facts only):\n{{crawl_snippet}}\nTAXONOMY (choose one slug): {{taxonomy_json}}"
schema: `{description_en, meta_title(≤60), meta_description(≤155), faqs:[{q,a(≤50w)}], tags:[≤8], category_slug, category_confidence:0-1, attributes:{}}`

**MERGE_ADJUDICATE_V1** — system: "You decide if two Nepali business records are the same real-world business. Consider name transliteration variants (Nepali↔English), branch vs same outlet (different ward = likely branch), phone reuse by owners." user: "A:{{a_json}}\nB:{{b_json}}\nSIGNALS:{{features_json}}" → `{verdict: same|distinct|branch, confidence:0-1, reason}`

**TREND_SELECTOR_V1** — system: "You are content editor for {{site_name}}. Select trending clusters that a Nepal business directory can cover usefully and safely. NEVER select: party politics, deaths, accidents, disasters with victims, crime, communal/religious conflict, adult content. Prefer topics that route readers to local businesses or evergreen utility (festivals, seasonal needs, consumer how-tos, price/market shifts)." user: "CLUSTERS:\n{{clusters_json}}\nDIRECTORY_CATEGORIES:\n{{category_slugs}}" → per cluster `{cluster_id, selected:bool, safety: ok|blocked, angle, article_type: news_explainer|guide|listicle, target_category_slugs:[], confidence:0-1, reason}`

**BLOG_WRITER_V1** — system:
"You are the staff writer for {{site_name}}. Write a grounded article for Nepali readers.
GROUNDING RULES (absolute): every factual claim must be supported by SOURCES below; never invent statistics, quotes, prices, dates, or names; if SOURCES lack a detail, omit it; attribute claims ('according to <source>') where natural.
STYLE: 900–1400 words; H2/H3 structure; practical, local, specific (NPR, wards, load-shedding-era pragmatism where relevant); no filler like 'in today's fast-paced world'.
LINKS: where a business category is genuinely relevant, insert placeholder tokens exactly as {{category:<slug>}} (3–8 total). Do not fabricate business names.
END with a 3-question FAQ (answers ≤50 words)."
user: "TOPIC ANGLE: {{angle}} ({{article_type}})\nTARGET CATEGORIES: {{target_category_slugs}}\nSOURCES:\n{{source_pack}}"
schema: `{title(≤60), slug, excerpt(≤160), body_markdown, faq:[{q,a}], sources_used:[urls], categories:[slugs], confidence:0-1}`

**BLOG_FACTCHECK_V1** — system: "You are a strict fact-checker. Compare DRAFT against SOURCES. List every factual claim (numbers, dates, names, events, prices) not directly supported by SOURCES. Style opinions are fine; unsupported facts are not." user: "SOURCES:\n{{source_pack}}\nDRAFT:\n{{body_markdown}}" → `{verdict: pass|revise, unsupported_claims:[{claim, why}]}`

**NL_QUERY_PARSER_V1** — system: "Parse a Nepal local-search query (may be English, Nepali, or romanized Nepali). Map to the taxonomy. 'pasal'=shop, 'chiya'=tea, 'thaau'=place, etc." user: "QUERY: {{q}}\nTAXONOMY: {{category_slugs}}\nKNOWN_PLACES: {{places_sample}}" → `{intent: find_business|question|other, category_hint, location:{city, area}, filters:{open_now:bool|null, price_level:1-4|null}, keywords:[], language: en|ne|romanized_ne}`

**CONCIERGE_V1** — system: "You are {{site_name}}'s local guide. You MUST call search_listings before recommending anything, and may recommend ONLY businesses returned by tools — never from memory. If results are empty: say so honestly, offer to widen the area/category, and ask if they'd like the request recorded so we can add such businesses. Keep replies ≤120 words + the listing cards. Never state hours/prices not present in tool results."

**REVIEW_SUMMARIZER_V1** — system: "Summarize customer reviews for one business. Neutral, balanced, no reviewer names, no quotes longer than 6 words, note sample size if <10 reviews." user: "REVIEWS ({{n}}):\n{{reviews_json}}" → `{summary(≤80w), pros:[≤4], cons:[≤4], sentiment:-1..1, themes:[]}`

**CATEGORY_INTRO_V1** — "Write a 120–180 word unique intro for the '{{category}}' in '{{city}}' page. Use ONLY: listing_count={{n}}, notable_localities={{localities}}, avg_rating={{avg}}. Practical guidance on choosing a provider of this type in this city; no invented businesses." → `{intro_md, meta_title, meta_description}`

---

## 16. TREND ENGINE — WORKED EXAMPLE (so Claude Code builds the right shape)

Input day: r/Nepal + OnlineKhabar + Setopati all spike on **monsoon flooding in Kathmandu Valley**.
- Cluster forms (item_count 9, 4 distinct sources → high diversity, high recency).
- **Brand-safety filter:** flooding-with-casualties framing is borderline → selector must choose a *service/preparedness* angle, NOT casualty reporting. If sources are purely disaster/victim news, cluster is BLOCKED.
- Selected angle: *"Monsoon-proofing your Kathmandu home: waterproofing, drainage & backup power — a practical 2026 guide."* article_type=`guide`. target_category_slugs=`[waterproofing, hardware-store, electrician, plumber, generator-inverter, home-insurance]`.
- Writer grounds seasonal facts in sources, invents nothing, drops `{{category:waterproofing}}` etc.
- Link injection resolves each to the real category page; related-listings widget surfaces top waterproofing businesses (quality_score ≥60).
- Reader lands → clicks a waterproofing business → (later) that business claims its listing. **The loop closes.**

Second example (evergreen, always safe): Dashain/Tihar → *"Where to shop for Dashain in Kathmandu"* → `[clothing, sweets-mithai, electronics, gift-shop, goat-market]`.

---

## 17. PHASED EXECUTION PLAN (build in this exact order)

**Phase 0 — Audit & scaffold (Day 0):** repo audit → `docs/PHASE0_AUDIT.md`; add pgvector+pg_trgm; create `ai-core` module skeleton; `MockAiProvider`; `ai_jobs` + worker + one no-op job type end-to-end with a test. Commit.

**Phase 1 — AI core + enrichment (Days 1–3):** provider chain (Gemini primary, OpenAI-compatible fallback, Ollama embeddings, Mock for tests) + cache + budget + usage log; `prompt_templates` seeded; `ENRICH_LISTING` + `EMBED_LISTING`; quality_score; run on existing listings behind flag. **Acceptance:** existing listings gain descriptions/FAQ/meta/embeddings; zero external calls in CI.

**Phase 2 — Acquisition + dedup (Days 4–7):** OSM importer + tag map + geography resolution + `/attribution`; entity resolution + merge queue + `MERGE_ADJUDICATE`; AI onboarding-from-URL + crawler (robots-respecting); CSV import. **Acceptance:** OSM seed imported for ≥3 districts, dedup demoed on planted duplicates, attribution live.

**Phase 3 — Trending blog engine (Days 8–12):** trend sources + fetchers + clustering + selector (brand-safety filter) + 5-pass generation + fact-check + link injection + editorial queue + Next.js `/blog` with ISR/schema/RSS/OG. **Acceptance:** end-to-end run produces ≥2 grounded drafts in REVIEW with sources + fact-check attached; manual publish renders with valid `Article` JSON-LD and ≥3 internal links; auto-publish OFF.

**Phase 4 — Semantic search + concierge (Days 13–16):** hybrid retrieval + synonyms + NL parser + SSE concierge (grounded, tool-loop) + demand signals + zero-result logging. **Acceptance:** NL queries (incl. romanized Nepali) return correct results; concierge never recommends a business absent from tool output (test with an empty-result query).

**Phase 5 — SEO/AEO + reviews + polish (Days 17–20):** schema map, category×city intros + evergreen pages (quality-gated), llms.txt, internal-link suggester, sitemaps; review summaries + spam moderation + owner reply drafter; Nepali (`TRANSLATE_NE`) + hreflang; alt-text. **Acceptance:** SEO skill audit (`/seo audit`) run against a staging build shows valid schema, no thin-content violations, working sitemaps; every AI pipeline has a kill switch in `/admin/ai`.

Run this after Phase 5 for grading: `/seo audit https://STAGING_URL` and `/seo geo https://STAGING_URL`.

---

## 18. ENVIRONMENT VARIABLES (`.env.example` — verify model names/limits at build time; these are placeholders)

```
# Feature master switches (all AI off until explicitly enabled)
AI_ENABLED=false
BLOG_ENGINE_ENABLED=false
BLOG_AUTOPUBLISH=false
CONCIERGE_ENABLED=false
CRAWLER_ENABLED=false

# Providers (user supplies keys). Verify current free-tier model IDs before use.
AI_PRIMARY=gemini
AI_FALLBACKS=groq,openrouter
GEMINI_API_KEY=
GEMINI_MODEL=            # e.g. a current free Gemini flash model — confirm at build
GEMINI_EMBED_MODEL=      # confirm current embedding model + its dimension
GROQ_API_KEY=
GROQ_MODEL=              # e.g. a current free Llama model on Groq
OPENROUTER_API_KEY=
OPENROUTER_MODEL=        # a current ':free' model
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_EMBED_MODEL=bge-m3     # local, free, strong on Nepali
EMBEDDING_DIM=768             # MUST match chosen embed model; migrations use this

# Budgets / limits (tune per real free-tier quotas)
GEMINI_DAILY_TOKEN_CAP=1000000
GROQ_DAILY_TOKEN_CAP=500000
ENRICH_DAILY_CAP=300
AI_CACHE_TTL_DAYS=30

# Data acquisition
OSM_PBF_URL=https://download.geofabrik.de/asia/nepal-latest.osm.pbf
GOOGLE_PLACES_API_KEY=        # OPTIONAL, on-demand only (claim/admin) — never batch
CRAWLER_USER_AGENT=NepaliDirectoryBot/1.0 (+https://SITE/bot)

# Trends
TREND_SCAN_CRON=0 0 6,16 * * *   # 06:00 & 16:00 NPT (set app TZ Asia/Kathmandu)
BLOG_MAX_PER_DAY=3
BRAND_SAFETY_BLOCKLIST=politics,election,accident,death,disaster,crime,murder,rape,communal,adult
YOUTUBE_API_KEY=             # optional
REDDIT_USER_AGENT=nepalidirectory/1.0 by u/yourname

SITE_NAME=NepaliDirectory
SITE_URL=https://SITE
APP_TIMEZONE=Asia/Kathmandu
```

---

## 19. FREE-TIER SURVIVAL & COST MATH (why this runs at ~$0 API)

- **Embeddings via Ollama `bge-m3` = $0** and handles Nepali/romanized well. Only completions touch paid-ish free tiers.
- **Cache-first** on enrichment (idempotent, repeated across re-runs) removes most redundant spend.
- **Batch enrichment respects `ENRICH_DAILY_CAP`** → naturally paces under daily free quotas; overflow re-queues to next day.
- **Blog = ~5 calls/article × ≤3/day** → trivially inside a free tier.
- **Search fast-path** (regex parse for `category in place`) avoids an AI call on the majority of queries; concierge is the only per-user AI cost and is session-rate-limited.
- Order-of-magnitude: seed-enriching a few thousand OSM listings once + daily blog + moderate search sits inside Gemini/Groq free tiers if paced; the caps + queue enforce that automatically. **Claude Code: confirm the exact current quotas and set caps to ~80% of them.**

---

## 20. HARD RULES — DO NOT VIOLATE (restate at top of every phase commit message body)

1. **No Google Maps/Places scraping or bulk storage.** On-demand only, store `place_id` + own flags. Places client exposes ONLY `findPlaceForClaim()` / `adminSpotCheck()`.
2. **AI never writes reviews.** Summaries only; reviews table has no AI provenance column by design.
3. **AI never invents business facts.** Hours/prices/phones/awards come only from structured input; enrichment prompt forbids fabrication; fact-check pass guards the blog.
4. **No blog auto-publish** until ≥20 posts have gone through human review; even then only fact-check `pass` + confidence ≥0.8, capped/day.
5. **Brand safety:** directory never publishes content monetizing politics, death, disaster, crime, or communal conflict.
6. **Provenance on every record** (`data_source`), OSM rows carry ODbL note + visible attribution.
7. **Robots.txt respected**, crawler only visits listing-attached URLs, never open-web discovery.
8. **Every AI pipeline behind a feature flag with a kill switch** in `/admin/ai`.
9. **CI makes zero external AI calls** (MockAiProvider).
10. **Human-in-the-loop** owns blog publish, merges (0.65–0.90 band), and moderation.
11. **Record decisions** in `docs/DECISIONS.md`; **verify all free-tier model names, limits, feed URLs, and Places caching policy at build time** — do not trust hardcoded values in this doc.

---

## 21. DELIVERABLES CHECKLIST (Claude Code must produce)

- [ ] `docs/PHASE0_AUDIT.md`, `docs/DECISIONS.md`, updated `README.md` (setup + how to enable each AI feature)
- [ ] Flyway migrations §13 applied; `.env.example` §18
- [ ] `ai-core` (provider chain, cache, budget, queue, worker, MockAiProvider) + tests
- [ ] `acquire` (OSM import, dedup+merge queue, onboarding-from-URL, crawler, CSV) + `/attribution`
- [ ] `enrich` (ENRICH/EMBED jobs, quality_score) + tests
- [ ] `blog` (trends → clustering → selector → 5-pass gen → fact-check → link injection → editorial queue) + Next.js `/blog` (ISR, `Article`/`FAQPage` JSON-LD, RSS, @vercel/og images) + `/editorial-policy`
- [ ] `discover` (hybrid search, NL parser, SSE concierge, demand signals)
- [ ] `reviews-ai` (summaries, moderation queue, reply drafter)
- [ ] `seo-auto` (schema map, category×city intros, evergreen pages gated, llms.txt, sitemaps, hreflang)
- [ ] `/admin/ai` console (jobs, spend, prompts, trend inbox, blog/merge/moderation queues, kill switches)
- [ ] `prompt_templates` seeded (§15), all behind flags OFF by default
- [ ] Green CI (no external calls); demo seed data; per-module conventional commits

**Begin with Phase 0. Do not ask questions — decide, record in DECISIONS.md, and proceed.**

# NepaliDirectory AI Automation Report

Updated: 2026-07-06

## What I changed

- Added a free public AI fallback in `lib/public-ai/` so search and chat work even when Vercel has no provider keys configured.
- Added a reusable `AiConcierge` component and placed it on the homepage and search page.
- Updated `/api/search` so it returns grounded local recommendations instead of `503` when `AI_ENABLED=false` and `PUBLIC_AI_FALLBACK=true`.
- Updated `/api/concierge` so it streams answers in both modes:
  - provider mode when `AI_ENABLED=true` and `CONCIERGE_ENABLED=true`
  - free local mode when provider AI is disabled or keys are missing
- Added AI Activity awareness for the free public autopilot capability.
- Added tests proving the local autopilot returns grounded business matches and infers locations from natural language.
- Documented `PUBLIC_AI_FALLBACK=true` in `.env.example`.

## Automation now covered

- Visitor discovery: AI chat/search recommends real businesses from directory data.
- Local fallback: works with no paid API calls and no provider keys.
- Provider upgrade path: the same UI switches to Gemini/Groq/OpenRouter/Ollama-backed AI when env keys and flags are set.
- Blog automation: existing Vercel cron route can scan trends, generate, de-duplicate and publish posts.
- Listing automation: existing enrichment pipeline can generate descriptions, FAQs, tags, meta and embeddings.
- SEO automation: existing evergreen page, sitemap, schema and internal-link systems remain wired.
- Review automation: existing summaries, spam checks and owner reply drafts remain wired.
- Admin visibility: AI Activity shows what each AI capability does and whether it is effectively on.

## Free tools already used or wired

- Local deterministic autopilot: zero external calls.
- Mock AI provider: free CI/development execution.
- Ollama: local free embeddings when available.
- OpenStreetMap: listing acquisition and attribution.
- RSS/reddit/youtube-style trend-source adapters: free trend inputs where available.
- Vercel Cron: serverless scheduled publishing.
- Supabase Postgres: persistence, queue, pgvector and activity metrics.
- Built-in caching, budget guards and rate limits to avoid wasting free-tier provider quotas.

## Vercel production checklist

The deployed site currently returns `404` for the AI API routes, which means Vercel is serving an older build or the latest code has not been redeployed.

Redeploy the current repo to Vercel, then set these environment variables in the Vercel project:

```env
PUBLIC_AI_FALLBACK=true
AI_ENABLED=true
CONCIERGE_ENABLED=true
BLOG_ENGINE_ENABLED=true
BLOG_AUTOPUBLISH=true
DATABASE_URL=postgresql://...
CRON_SECRET=<same secret used by Vercel Cron>
SITE_URL=https://nepalidirectory.vercel.app
```

Provider keys are optional for the free local mode, but required for full model-backed automation:

```env
AI_PRIMARY=groq
AI_FALLBACKS=gemini,openrouter
GROQ_API_KEY=...
GROQ_MODEL=...
GEMINI_API_KEY=...
GEMINI_MODEL=...
GEMINI_EMBED_MODEL=...
```

Keep `PUBLIC_AI_FALLBACK=true` so the public AI assistant still works if a provider quota is exhausted or a key is missing.

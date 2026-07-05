/**
 * Read-only aggregate of everything the AI has actually done on the platform, for the super-admin
 * "AI Activity" page. Reads straight from Postgres (the same tables the pipelines write to) when
 * `DATABASE_URL` is set; without a DB it returns the feature-flag catalog with zeroed metrics so the
 * page still renders. Every query is individually guarded so one missing table never blanks the page.
 */
import { NextResponse } from "next/server";
import { loadAiConfig } from "@/lib/ai-core";
import { createPgSqlExecutor } from "@/lib/ai-core/queue/pg-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Row = Record<string, unknown>;

function n(v: unknown): number {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

export async function GET() {
  const cfg = loadAiConfig();
  const { databaseUrl } = cfg;
  // Effective runtime switches come from env (loadAiConfig), which is what actually gates the
  // pipelines — the feature_flags table is a separate console layer and can read differently.
  const config = {
    enabled: cfg.enabled,
    blogEngineEnabled: cfg.blogEngineEnabled,
    blogAutopublish: cfg.blogAutopublish,
    conciergeEnabled: cfg.conciergeEnabled,
    crawlerEnabled: cfg.crawlerEnabled,
  };

  if (!databaseUrl) {
    return NextResponse.json({ db: false, config, metrics: null, flags: [], recentPosts: [], recentJobs: [] });
  }

  const sql = createPgSqlExecutor(databaseUrl);
  const q = async (text: string): Promise<Row[]> => {
    try {
      return await sql<Row>(text);
    } catch {
      return [];
    }
  };

  const [
    blog,
    listings,
    reviewSummaries,
    ownerReplies,
    seoIntros,
    linkSuggestions,
    jobsByStatus,
    usage,
    trends,
    moderation,
    flags,
    recentPosts,
    recentJobs,
  ] = await Promise.all([
    q(`SELECT count(*)::int total,
              count(*) FILTER (WHERE status='PUBLISHED')::int published,
              count(*) FILTER (WHERE status='REVIEW')::int review,
              count(*) FILTER (WHERE author_type='ai_assisted')::int ai_assisted,
              coalesce(sum(links_injected),0)::int links
         FROM blog_posts`),
    q(`SELECT count(*)::int total, count(*) FILTER (WHERE ai_enriched_at IS NOT NULL)::int enriched FROM listings`),
    q(`SELECT count(*)::int n FROM review_summaries`),
    q(`SELECT count(*)::int n FROM owner_reply_drafts`),
    q(`SELECT count(*)::int n FROM seo_page_intros`),
    q(`SELECT count(*)::int n FROM internal_link_suggestions`),
    q(`SELECT status, count(*)::int n FROM ai_jobs GROUP BY status`),
    q(`SELECT count(*)::int calls, coalesce(sum(input_tokens),0)::int in_tok,
              coalesce(sum(output_tokens),0)::int out_tok, count(*) FILTER (WHERE cache_hit)::int cache_hits
         FROM ai_usage_log`),
    q(`SELECT count(*)::int total, count(*) FILTER (WHERE status='selected')::int selected,
              count(*) FILTER (WHERE status='generated')::int generated FROM trend_clusters`),
    q(`SELECT count(*)::int total, count(*) FILTER (WHERE status='pending')::int pending FROM moderation_queue`),
    q(`SELECT key, enabled, note FROM feature_flags ORDER BY key`),
    q(`SELECT id, slug, title, status, author_type, links_injected, published_at, created_at
         FROM blog_posts ORDER BY id DESC LIMIT 8`),
    q(`SELECT id, type, status, attempts, updated_at FROM ai_jobs ORDER BY id DESC LIMIT 8`),
  ]);

  const b = blog[0] ?? {};
  const l = listings[0] ?? {};
  const u = usage[0] ?? {};
  const t = trends[0] ?? {};
  const m = moderation[0] ?? {};
  const jobs: Record<string, number> = {};
  for (const r of jobsByStatus) jobs[String(r.status)] = n(r.n);

  return NextResponse.json({
    db: true,
    config,
    metrics: {
      blog: { total: n(b.total), published: n(b.published), review: n(b.review), aiAssisted: n(b.ai_assisted), links: n(b.links) },
      listings: { total: n(l.total), enriched: n(l.enriched) },
      reviewSummaries: n(reviewSummaries[0]?.n),
      ownerReplies: n(ownerReplies[0]?.n),
      seoIntros: n(seoIntros[0]?.n),
      linkSuggestions: n(linkSuggestions[0]?.n),
      jobs,
      usage: { calls: n(u.calls), inTok: n(u.in_tok), outTok: n(u.out_tok), cacheHits: n(u.cache_hits) },
      trends: { total: n(t.total), selected: n(t.selected), generated: n(t.generated) },
      moderation: { total: n(m.total), pending: n(m.pending) },
    },
    flags: flags.map((f) => ({ key: String(f.key), enabled: Boolean(f.enabled), note: f.note ? String(f.note) : "" })),
    recentPosts: recentPosts.map((p) => ({
      id: n(p.id),
      slug: String(p.slug),
      title: String(p.title),
      status: String(p.status),
      authorType: p.author_type ? String(p.author_type) : "",
      links: n(p.links_injected),
      at: (p.published_at ?? p.created_at) ? new Date(String(p.published_at ?? p.created_at)).toISOString() : null,
    })),
    recentJobs: recentJobs.map((j) => ({
      id: n(j.id),
      type: String(j.type),
      status: String(j.status),
      attempts: n(j.attempts),
      at: j.updated_at ? new Date(String(j.updated_at)).toISOString() : null,
    })),
  });
}

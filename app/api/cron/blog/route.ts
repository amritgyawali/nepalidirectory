/**
 * Serverless cron entrypoint for the auto-blog publisher (prompt §8, TREND_SCAN_CRON).
 *
 * Vercel Cron issues a GET to this path on the schedule in `vercel.json`. Each hit runs exactly one
 * `runAutoBlogCycle()`: scan trends -> cluster -> select -> generate -> publish AT MOST ONE post,
 * skipping anything whose embedding duplicates an existing post (handlers/blog-generate.ts). That
 * "one dedup-guarded cycle per invocation" is the right primitive for serverless — unlike the
 * in-process interval timer in auto-publisher.ts, which cannot survive between function invocations.
 *
 * Auth: Vercel automatically sends `Authorization: Bearer $CRON_SECRET` when the CRON_SECRET env var
 * is set. We also accept `x-blog-auto-secret: $BLOG_AUTO_SECRET` so the same endpoint can be driven
 * by an external scheduler (GitHub Actions, cron-job.org). If neither secret is configured the route
 * only answers same-machine requests, so it can never be triggered anonymously in production.
 */
import { NextRequest, NextResponse } from "next/server";
import { loadAiConfig } from "@/lib/ai-core";
import { runAutoBlogCycle } from "@/lib/blog-engine";
import { siteUrl } from "@/lib/blog";
import { submitIndexNow } from "@/lib/indexnow";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Generation calls the AI provider several times; give the function room beyond the 10s default.
export const maxDuration = 300;

function isLocalRequest(request: NextRequest): boolean {
  const host = request.nextUrl.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function authorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get("authorization") === `Bearer ${cronSecret}`) return true;

  const blogSecret = process.env.BLOG_AUTO_SECRET;
  if (blogSecret && request.headers.get("x-blog-auto-secret") === blogSecret) return true;

  // No secret configured -> only allow local requests (dev), never anonymous production hits.
  if (!cronSecret && !blogSecret) return isLocalRequest(request);
  return false;
}

async function handle(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const config = loadAiConfig();
  if (!config.enabled || !config.blogEngineEnabled || !config.blogAutopublish) {
    return NextResponse.json(
      {
        skipped: true,
        reason: "AI_ENABLED, BLOG_ENGINE_ENABLED and BLOG_AUTOPUBLISH must all be true.",
        flags: {
          AI_ENABLED: config.enabled,
          BLOG_ENGINE_ENABLED: config.blogEngineEnabled,
          BLOG_AUTOPUBLISH: config.blogAutopublish,
        },
      },
      { status: 200 },
    );
  }

  const result = await runAutoBlogCycle();
  const indexNow = result.published && result.post
    ? await submitIndexNow([`${siteUrl}/blog/${result.post.slug}`])
    : { submitted: false, count: 0, reason: "No new public URL." };
  return NextResponse.json({ ranAt: new Date().toISOString(), result, indexNow }, { status: 200 });
}

// Vercel Cron uses GET; POST is accepted for manual/local triggering and external schedulers.
export const GET = handle;
export const POST = handle;

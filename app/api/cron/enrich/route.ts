/**
 * Serverless cron entrypoint for autonomous listing enrichment (prompt §7 nightly sweep).
 *
 * Vercel Cron issues a GET to this path on the schedule in `vercel.json`. Each hit runs exactly one
 * `runAutoEnrichCycle()`: enqueue ENRICH_LISTING for up to ENRICH_DAILY_CAP un-enriched listings,
 * then drain the queue (ENRICH → EMBED). Already-enriched and owner-authored listings are skipped,
 * so repeated hits converge instead of re-writing content.
 *
 * Auth mirrors the blog cron: Vercel automatically sends `Authorization: Bearer $CRON_SECRET` when
 * CRON_SECRET is set; we also accept `x-blog-auto-secret: $BLOG_AUTO_SECRET` for external
 * schedulers. With neither secret configured the route only answers same-machine (dev) requests, so
 * it can never be triggered anonymously in production.
 */
import { NextRequest, NextResponse } from "next/server";
import { loadAiConfig } from "@/lib/ai-core";
import { runAutoEnrichCycle } from "@/lib/enrich";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Enrichment calls the AI provider once per listing; give the function room beyond the 10s default.
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

  if (!cronSecret && !blogSecret) return isLocalRequest(request);
  return false;
}

async function handle(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const config = loadAiConfig();
  if (!config.enabled || !config.enrichEnabled) {
    return NextResponse.json(
      {
        skipped: true,
        reason: "AI_ENABLED and ENRICH_ENABLED must both be true.",
        flags: { AI_ENABLED: config.enabled, ENRICH_ENABLED: config.enrichEnabled },
      },
      { status: 200 },
    );
  }

  const result = await runAutoEnrichCycle();
  return NextResponse.json({ ranAt: new Date().toISOString(), result }, { status: 200 });
}

// Vercel Cron uses GET; POST is accepted for manual/local triggering and external schedulers.
export const GET = handle;
export const POST = handle;

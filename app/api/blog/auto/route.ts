import { NextRequest, NextResponse } from "next/server";
import {
  getAutoBlogPublisherStatus,
  getDefaultBlogEngineRuntime,
  runAutoBlogCycle,
  startAutoBlogPublisher,
  stopAutoBlogPublisher,
} from "@/lib/blog-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isLocalRequest(request: NextRequest): boolean {
  const host = request.nextUrl.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function authorized(request: NextRequest): boolean {
  const secret = process.env.BLOG_AUTO_SECRET;
  if (!secret) return isLocalRequest(request);
  return request.headers.get("x-blog-auto-secret") === secret;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const runtime = getDefaultBlogEngineRuntime();
  const reviewPosts = await runtime.blogPosts.list({ status: "REVIEW" });
  return NextResponse.json({
    status: getAutoBlogPublisherStatus(),
    providers: runtime.providers.adapters().map((provider) => provider.id()),
    reviewPosts: reviewPosts.slice(0, 5).map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      confidence: post.confidence,
      factcheck: post.factcheck?.verdict,
      unsupportedClaims: post.factcheck?.unsupportedClaims.length ?? 0,
    })),
  });
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { action?: unknown; delayMs?: unknown };
  const action = typeof body.action === "string" ? body.action : "start";

  if (action === "start") {
    const delayMs = typeof body.delayMs === "number" && Number.isFinite(body.delayMs) ? body.delayMs : undefined;
    return NextResponse.json({ status: startAutoBlogPublisher(delayMs) });
  }

  if (action === "stop") {
    return NextResponse.json({ status: stopAutoBlogPublisher() });
  }

  if (action === "run-now") {
    const result = await runAutoBlogCycle();
    return NextResponse.json({ result, status: getAutoBlogPublisherStatus() });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}

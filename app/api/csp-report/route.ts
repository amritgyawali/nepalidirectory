/**
 * CSP violation-report sink (Report-To / report-uri target). Lets the site collect real
 * Content-Security-Policy-Report-Only violation data before flipping the policy to enforcing —
 * see `next.config.ts`. Accepts both the legacy `application/csp-report` format and the newer
 * Reporting API `application/reports+json` batch format; logs to server console so violations are
 * visible in Vercel logs without requiring a separate ingestion service.
 */
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.warn("[csp-report]", JSON.stringify(body));
  } catch {
    // Malformed or empty report body; nothing to log.
  }
  return new NextResponse(null, { status: 204 });
}

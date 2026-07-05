import { NextResponse } from "next/server";
import { isKnownAiFeatureFlag, listAiFeatureFlags, setAiFeatureFlag } from "@/lib/admin-ai";

export async function GET() {
  const flags = await listAiFeatureFlags();
  return NextResponse.json({ flags });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { key?: unknown; enabled?: unknown };
  if (typeof body.key !== "string" || !isKnownAiFeatureFlag(body.key) || typeof body.enabled !== "boolean") {
    return NextResponse.json({ error: "invalid feature flag payload" }, { status: 400 });
  }
  return NextResponse.json({ flag: await setAiFeatureFlag(body.key, body.enabled) });
}

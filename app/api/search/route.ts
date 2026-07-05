/**
 * `GET /api/search?q=&category=&city=&open_now=` (prompt §14 / §9.1): hybrid retrieval, with the
 * category/city/open_now params layered on top of whatever the NL parser derives from `q`.
 */
import type { NextRequest } from "next/server";
import { loadAiConfig } from "@/lib/ai-core";
import { getDefaultDiscoverRuntime } from "@/lib/discover";

export async function GET(req: NextRequest) {
  if (!loadAiConfig().enabled) {
    return Response.json({ error: "AI search is not enabled" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return Response.json({ error: "q is required" }, { status: 400 });
  }
  const category = searchParams.get("category")?.trim() || undefined;
  const city = searchParams.get("city")?.trim() || undefined;
  const openNowParam = searchParams.get("open_now");
  const openNow = openNowParam === null ? undefined : openNowParam === "true" || openNowParam === "1";

  const runtime = getDefaultDiscoverRuntime();
  const { parsed, results } = await runtime.search(q, 20, { category, city, openNow });

  return Response.json({
    query: q,
    parsed,
    results: results.map((r) => ({
      id: r.listing.id,
      slug: r.listing.slug,
      name: r.listing.name,
      area: r.listing.area,
      neighborhood: r.listing.neighborhood,
      categories: r.listing.categories,
      qualityScore: r.listing.qualityScore,
      score: r.score,
    })),
  });
}

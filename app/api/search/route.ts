/**
 * `GET /api/search?q=&category=&city=&open_now=` (prompt §14 / §9.1): hybrid retrieval, with the
 * category/city/open_now params layered on top of whatever the NL parser derives from `q`.
 */
import type { NextRequest } from "next/server";
import { loadAiConfig } from "@/lib/ai-core";
import { getDefaultDiscoverRuntime } from "@/lib/discover";
import { localAutopilotSearch } from "@/lib/public-ai";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return Response.json({ error: "q is required" }, { status: 400 });
  }

  const config = loadAiConfig();
  if (!config.enabled) {
    if (!config.publicAiFallback) {
      return Response.json({ error: "AI search is not enabled" }, { status: 503 });
    }
    const location = searchParams.get("location")?.trim() || searchParams.get("city")?.trim() || undefined;
    const reply = localAutopilotSearch(q, location, 20);
    return Response.json({
      mode: reply.mode,
      query: q,
      parsed: reply.parsed,
      message: reply.message,
      results: reply.listings.map((listing) => ({
        id: listing.id,
        slug: listing.slug,
        name: listing.name,
        area: listing.area,
        neighborhood: listing.neighborhood,
        categories: listing.categories,
        qualityScore: listing.qualityScore,
        score: listing.score,
      })),
    });
  }

  const category = searchParams.get("category")?.trim() || undefined;
  const city = searchParams.get("city")?.trim() || undefined;
  const openNowParam = searchParams.get("open_now");
  const openNow = openNowParam === null ? undefined : openNowParam === "true" || openNowParam === "1";

  const runtime = getDefaultDiscoverRuntime();
  let parsed;
  let results;
  try {
    ({ parsed, results } = await runtime.search(q, 20, { category, city, openNow }));
  } catch (error) {
    // Surface the real provider failure in server logs (was silently swallowed, making
    // "why is live AI falling back to local?" undebuggable). Public response is unchanged.
    console.error("[api/search] provider path failed, using local fallback:", error);
    if (!config.publicAiFallback) throw error;
    const location = searchParams.get("location")?.trim() || city;
    const reply = localAutopilotSearch(q, location, 20);
    return Response.json({
      mode: reply.mode,
      providerFallback: true,
      query: q,
      parsed: reply.parsed,
      message: reply.message,
      results: reply.listings.map((listing) => ({
        id: listing.id,
        slug: listing.slug,
        name: listing.name,
        area: listing.area,
        neighborhood: listing.neighborhood,
        categories: listing.categories,
        qualityScore: listing.qualityScore,
        score: listing.score,
      })),
    });
  }

  return Response.json({
    mode: "provider",
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

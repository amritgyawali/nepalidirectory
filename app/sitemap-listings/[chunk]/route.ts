import { NextResponse, type NextRequest } from "next/server";
import { getListingSitemapChunk, getListingSitemapChunkCount, sitemapXml } from "@/lib/seo-auto";

// Public URL is /sitemap-listings-N.xml — next.config.ts rewrites that to this route, since
// Next.js App Router folder names can't mix literal text with a dynamic segment
// (a `sitemap-listings-[chunk].xml` folder is never registered as a route at all).
export const revalidate = 300;

type RouteContext = { params: Promise<{ chunk: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { chunk } = await params;
  const chunkNumber = Number(chunk);

  if (!Number.isInteger(chunkNumber) || chunkNumber < 1) {
    return NextResponse.json({ error: "Invalid sitemap chunk" }, { status: 404 });
  }

  const chunkCount = await getListingSitemapChunkCount();
  if (chunkNumber > chunkCount) {
    return NextResponse.json({ error: "Sitemap chunk not found" }, { status: 404 });
  }

  const entries = await getListingSitemapChunk(chunkNumber);
  return new Response(sitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

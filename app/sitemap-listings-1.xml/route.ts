import { getListingSitemapEntries, sitemapXml } from "@/lib/seo-auto";

export const dynamic = "force-static";

export function GET() {
  return new Response(sitemapXml(getListingSitemapEntries()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

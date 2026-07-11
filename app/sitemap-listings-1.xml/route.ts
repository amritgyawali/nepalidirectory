import { getListingSitemapEntries, sitemapXml } from "@/lib/seo-auto";

export const revalidate = 300;

export async function GET() {
  return new Response(sitemapXml(await getListingSitemapEntries()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

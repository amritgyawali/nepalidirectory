import { getCategorySitemapEntries, sitemapXml } from "@/lib/seo-auto";

export const dynamic = "force-static";

export function GET() {
  return new Response(sitemapXml(getCategorySitemapEntries()), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

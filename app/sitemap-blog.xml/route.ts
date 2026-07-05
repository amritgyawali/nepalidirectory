import { getBlogSitemapEntries, sitemapXml } from "@/lib/seo-auto";

export const dynamic = "force-static";

export function GET() {
  return new Response(sitemapXml(getBlogSitemapEntries()), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

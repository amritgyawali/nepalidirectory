import { siteUrl } from "@/lib/blog";
import { sitemapIndexXml } from "@/lib/seo-auto";

export const dynamic = "force-static";

const sitemapUrls = [
  `${siteUrl}/sitemap-pages.xml`,
  `${siteUrl}/sitemap-categories.xml`,
  `${siteUrl}/sitemap-blog.xml`,
  `${siteUrl}/sitemap-listings-1.xml`,
];

export function GET() {
  return new Response(
    sitemapIndexXml(sitemapUrls.map((url) => ({ url }))),
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}

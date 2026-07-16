import { siteUrl } from "@/lib/blog";
import { getListingSitemapChunkCount, sitemapIndexXml } from "@/lib/seo-auto";

// Listing chunk count depends on live listing data, so this can no longer be `force-static`.
export const revalidate = 300;

export async function GET() {
  const chunkCount = await getListingSitemapChunkCount();
  const sitemapUrls = [
    `${siteUrl}/sitemap-pages.xml`,
    `${siteUrl}/sitemap-categories.xml`,
    `${siteUrl}/sitemap-blog.xml`,
    ...Array.from({ length: chunkCount }, (_, index) => `${siteUrl}/sitemap-listings-${index + 1}.xml`),
  ];

  return new Response(
    sitemapIndexXml(sitemapUrls.map((url) => ({ url }))),
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
}

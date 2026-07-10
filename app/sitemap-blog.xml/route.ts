import { getBlogSitemapEntries, sitemapXml } from "@/lib/seo-auto";
import { getPublishedEnginePosts } from "@/lib/blog-engine";

export const revalidate = 300;

export async function GET() {
  let generatedPosts: Awaited<ReturnType<typeof getPublishedEnginePosts>> = [];
  try {
    generatedPosts = await getPublishedEnginePosts();
  } catch (error) {
    console.error("Unable to load generated posts for the blog sitemap", error);
  }

  return new Response(sitemapXml(getBlogSitemapEntries(generatedPosts)), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

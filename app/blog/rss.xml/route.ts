import { getBlogPostUrl, getSortedBlogPosts, siteUrl, type BlogPost } from "@/lib/blog";
import { getPublishedEnginePosts } from "@/lib/blog-engine";
import { removeRetiredDuplicatePosts } from "@/lib/blog-dedup";

export const revalidate = 300;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function itemXml(post: BlogPost): string {
  const url = getBlogPostUrl(post);
  const pubDate = new Date(post.publishedAt).toUTCString();
  return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${escapeXml(url)}</link>
    <guid isPermaLink="true">${escapeXml(url)}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${escapeXml(post.excerpt)}</description>
    <category>${escapeXml(post.category)}</category>
  </item>`;
}

export async function GET(): Promise<Response> {
  const enginePosts = await getPublishedEnginePosts();
  const posts = removeRetiredDuplicatePosts([...getSortedBlogPosts(), ...enginePosts]).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Nepali Directory Blog</title>
  <link>${siteUrl}/blog</link>
  <description>Practical Nepal guides for travel, restaurants, home services, healthcare and local business growth.</description>
  <language>en</language>
${posts.map(itemXml).join("\n")}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

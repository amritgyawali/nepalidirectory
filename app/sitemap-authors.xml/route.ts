import { siteUrl } from "@/lib/blog";
import { contentAuthors } from "@/lib/authors";

export const revalidate = 300;

export async function GET() {
  const authorEntries = contentAuthors.map((author) => ({
    url: `${siteUrl}/authors/${author.slug}`,
    lastModified: "2026-07-12",
  }));

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${authorEntries
  .map(
    (entry) =>
      `  <url>\n    <loc>${entry.url}</loc>\n    <lastmod>${entry.lastModified}</lastmod>\n  </url>`,
  )
  .join("\n")}
</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
}
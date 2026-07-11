import { contentAuthors } from "@/lib/authors";
import { blogPosts, getBlogCategories, siteUrl, type BlogPost } from "@/lib/blog";
import { removeRetiredDuplicatePosts } from "@/lib/blog-dedup";
import { cityDirectoryPages } from "@/lib/city-pages";
import { compareCategories } from "@/lib/compare";
import { getBusinessHref, routes } from "@/lib/routes";
import { getIndexableListings } from "@/lib/public-listings";
import { isIndexableRoute } from "@/lib/seo-config";
import { getEvergreenPages } from "./evergreen";

export type SitemapEntry = {
  url: string;
  /** Only set when the source exposes a real content-modification date. */
  lastModified?: Date | string;
  images?: string[];
};

export type SitemapIndexEntry = {
  url: string;
  lastModified?: Date | string;
};

const separatelyMappedRoutes = new Set<string>([
  routes.blogPost,
]);

export function getStaticSitemapEntries(): SitemapEntry[] {
  const staticRoutes = Array.from(new Set<string>(Object.values(routes))).filter(
    (route) =>
      !route.includes("?") &&
      !separatelyMappedRoutes.has(route) &&
      isIndexableRoute(route),
  );

  return staticRoutes.map((route) => ({ url: `${siteUrl}${route}` }));
}

export function getBlogSitemapEntries(additionalPosts: BlogPost[] = []): SitemapEntry[] {
  const posts = uniqueSitemapEntries(
    removeRetiredDuplicatePosts([...blogPosts, ...additionalPosts]).map((post) => ({
      url: `${siteUrl}${post.href}`,
      lastModified: post.modifiedAt,
    })),
  );

  const categories = getBlogCategories().map((category) => ({
    url: `${siteUrl}${category.href}`,
    lastModified: category.posts
      .map((post) => post.modifiedAt)
      .sort((a, b) => b.localeCompare(a))[0],
  }));

  return [...posts, ...categories];
}

export function getCategorySitemapEntries(): SitemapEntry[] {
  return [
    ...compareCategories.map((category) => ({
      url: `${siteUrl}${category.href}`,
      lastModified: category.updatedAt,
    })),
    ...cityDirectoryPages.map((city) => ({
      url: `${siteUrl}${city.href}`,
    })),
    ...getEvergreenPages().map((page) => ({
      url: `${siteUrl}${page.href}`,
    })),
  ];
}

export async function getListingSitemapEntries(): Promise<SitemapEntry[]> {
  return (await getIndexableListings()).map((listing) => ({
    url: `${siteUrl}${getBusinessHref(listing.slug)}`,
    lastModified: listing.updatedAt ?? listing.aiEnrichedAt ?? listing.createdAt ?? undefined,
    images: listing.image ? [listing.image] : undefined,
  }));
}

export function getAuthorSitemapEntries(): SitemapEntry[] {
  return contentAuthors.map((author) => ({
    url: `${siteUrl}/authors/${author.slug}`,
  }));
}

export function getPageSitemapEntries(): SitemapEntry[] {
  return uniqueSitemapEntries([
    ...getStaticSitemapEntries(),
    ...getAuthorSitemapEntries(),
  ]);
}

export async function allSitemapEntries(additionalBlogPosts: BlogPost[] = []): Promise<SitemapEntry[]> {
  return uniqueSitemapEntries([
    ...getPageSitemapEntries(),
    ...getBlogSitemapEntries(additionalBlogPosts),
    ...getCategorySitemapEntries(),
    ...(await getListingSitemapEntries()),
  ]);
}

export function uniqueSitemapEntries(entries: SitemapEntry[]): SitemapEntry[] {
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}

export function sitemapXml(entries: SitemapEntry[]): string {
  const uniqueEntries = uniqueSitemapEntries(entries);
  const hasImages = uniqueEntries.some((entry) => entry.images?.length);
  const imageNamespace = hasImages
    ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : "";
  const urls = uniqueEntries
    .map((entry) => {
      const images = (entry.images ?? [])
        .map((image) => `    <image:image><image:loc>${escapeXml(image)}</image:loc></image:image>\n`)
        .join("");
      const lastModified = lastModifiedXml(entry.lastModified, "    ");
      return `  <url>\n    <loc>${escapeXml(entry.url)}</loc>\n${lastModified}${images}  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${imageNamespace}>\n${urls}\n</urlset>\n`;
}

export function sitemapIndexXml(entries: SitemapIndexEntry[]): string {
  const sitemaps = [...new Map(entries.map((entry) => [entry.url, entry])).values()]
    .map((entry) => {
      const lastModified = lastModifiedXml(entry.lastModified, "    ");
      return `  <sitemap>\n    <loc>${escapeXml(entry.url)}</loc>\n${lastModified}  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>\n`;
}

function lastModifiedXml(value: Date | string | undefined, indentation: string): string {
  if (!value) return "";
  const formatted = formatLastModified(value);
  return formatted ? `${indentation}<lastmod>${formatted}</lastmod>\n` : "";
}

function formatLastModified(value: Date | string): string | null {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

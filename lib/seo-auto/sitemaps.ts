import { contentAuthors } from "@/lib/authors";
import { blogPosts, getBlogCategories, siteUrl } from "@/lib/blog";
import { cityDirectoryPages } from "@/lib/city-pages";
import { compareCategories } from "@/lib/compare";
import { routes } from "@/lib/routes";
import { noIndexRoutes } from "@/lib/seo-config";
import { getEvergreenPages } from "./evergreen";

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  images?: string[];
};

const now = () => new Date();

export function getStaticSitemapEntries(): SitemapEntry[] {
  const staticRoutes = Array.from(new Set(Object.values(routes))).filter(
    (route) => !route.includes("?") && route !== routes.blogPost && route !== routes.city && !noIndexRoutes.has(route),
  );
  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now(),
    changeFrequency: route === routes.home ? "daily" : "weekly",
    priority: route === routes.home ? 1 : route === routes.blog ? 0.9 : 0.7,
  }));
}

export function getBlogSitemapEntries(): SitemapEntry[] {
  return [
    ...blogPosts.map((post) => ({
      url: `${siteUrl}${post.href}`,
      lastModified: new Date(post.modifiedAt),
      changeFrequency: "monthly" as const,
      priority: 0.85,
      images: [post.image],
    })),
    ...getBlogCategories().map((category) => ({
      url: `${siteUrl}${category.href}`,
      lastModified: now(),
      changeFrequency: "weekly" as const,
      priority: 0.78,
    })),
  ];
}

export function getCategorySitemapEntries(): SitemapEntry[] {
  return [
    ...compareCategories.map((category) => ({
      url: `${siteUrl}${category.href}`,
      lastModified: new Date(category.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.85,
      images: [category.image],
    })),
    ...cityDirectoryPages.map((city) => ({
      url: `${siteUrl}${city.href}`,
      lastModified: now(),
      changeFrequency: "weekly" as const,
      priority: 0.86,
      images: [city.image],
    })),
    ...getEvergreenPages().map((page) => ({
      url: `${siteUrl}${page.href}`,
      lastModified: now(),
      changeFrequency: "weekly" as const,
      priority: 0.82,
    })),
  ];
}

export function getListingSitemapEntries(): SitemapEntry[] {
  return [
    {
      url: `${siteUrl}${routes.business}`,
      lastModified: now(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}

export function getAuthorSitemapEntries(): SitemapEntry[] {
  return contentAuthors.map((author) => ({
    url: `${siteUrl}/authors/${author.slug}`,
    lastModified: now(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
}

export function allSitemapEntries(): SitemapEntry[] {
  return [
    ...getStaticSitemapEntries(),
    ...getBlogSitemapEntries(),
    ...getCategorySitemapEntries(),
    ...getListingSitemapEntries(),
    ...getAuthorSitemapEntries(),
  ];
}

export function sitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const images =
        entry.images
          ?.map(
            (image) =>
              `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`,
          )
          .join("") ?? "";
      return `<url><loc>${escapeXml(entry.url)}</loc><lastmod>${entry.lastModified.toISOString()}</lastmod><changefreq>${entry.changeFrequency}</changefreq><priority>${entry.priority.toFixed(2)}</priority>${images}</url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>`;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

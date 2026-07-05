import type { MetadataRoute } from "next";
import { contentAuthors } from "@/lib/authors";
import { blogPosts, getBlogCategories, siteUrl } from "@/lib/blog";
import { cityDirectoryPages } from "@/lib/city-pages";
import { compareCategories } from "@/lib/compare";
import { routes } from "@/lib/routes";
import { noIndexRoutes } from "@/lib/seo-config";

const staticRoutes = Array.from(new Set(Object.values(routes))).filter(
  (route) => !route.includes("?") && route !== routes.blogPost && route !== routes.city && !noIndexRoutes.has(route)
);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === routes.home ? "daily" : "weekly",
    priority: route === routes.home ? 1 : route === routes.blog ? 0.9 : 0.7
  })) satisfies MetadataRoute.Sitemap;

  const blogEntries = blogPosts.map((post) => ({
    url: `${siteUrl}${post.href}`,
    lastModified: new Date(post.modifiedAt),
    changeFrequency: "monthly",
    priority: 0.85,
    images: [post.image]
  })) satisfies MetadataRoute.Sitemap;

  const compareEntries = compareCategories.map((category) => ({
    url: `${siteUrl}${category.href}`,
    lastModified: new Date(category.updatedAt),
    changeFrequency: "weekly",
    priority: 0.85,
    images: [category.image]
  })) satisfies MetadataRoute.Sitemap;

  const blogCategoryEntries = getBlogCategories().map((category) => ({
    url: `${siteUrl}${category.href}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.78
  })) satisfies MetadataRoute.Sitemap;

  const cityEntries = cityDirectoryPages.map((city) => ({
    url: `${siteUrl}${city.href}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.86,
    images: [city.image]
  })) satisfies MetadataRoute.Sitemap;

  const authorEntries = contentAuthors.map((author) => ({
    url: `${siteUrl}/authors/${author.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7
  })) satisfies MetadataRoute.Sitemap;

  return [...staticEntries, ...blogEntries, ...blogCategoryEntries, ...compareEntries, ...cityEntries, ...authorEntries];
}

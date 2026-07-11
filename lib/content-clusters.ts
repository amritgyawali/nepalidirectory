import { blogPosts, type BlogPost } from "@/lib/blog";

export function getGuidesForCity(citySlug: string, limit = 4): BlogPost[] {
  return blogPosts
    .filter((post) => post.citySlugs?.includes(citySlug))
    .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
    .slice(0, limit);
}

export function getGuidesForCategory(categorySlug: string, limit = 4): BlogPost[] {
  return blogPosts
    .filter((post) => post.categorySlugs?.includes(categorySlug))
    .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
    .slice(0, limit);
}

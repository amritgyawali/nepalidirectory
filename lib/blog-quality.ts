import type { BlogPost } from "@/lib/blog";

/**
 * A one-post archive repeats the same intent as its article and creates a weak crawl target.
 * Keep small archives usable for visitors, but index only categories with enough breadth to work
 * as genuine topic hubs.
 */
export const MIN_INDEXABLE_BLOG_CATEGORY_POSTS = 3;

export function isIndexableBlogCategory(posts: readonly BlogPost[]): boolean {
  return posts.length >= MIN_INDEXABLE_BLOG_CATEGORY_POSTS;
}

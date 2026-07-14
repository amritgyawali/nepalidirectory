import { describe, expect, it } from "vitest";
import { getBlogCategories } from "@/lib/blog";
import {
  MIN_INDEXABLE_BLOG_CATEGORY_POSTS,
  isIndexableBlogCategory,
} from "@/lib/blog-quality";
import { getBlogSitemapEntries } from "@/lib/seo-auto";

describe("blog archive quality gate", () => {
  it("withholds thin category archives while keeping substantive hubs", () => {
    const categories = getBlogCategories();
    const thin = categories.find((category) => category.posts.length === 1);
    const substantive = categories.find(
      (category) => category.posts.length >= MIN_INDEXABLE_BLOG_CATEGORY_POSTS,
    );

    expect(thin).toBeDefined();
    expect(substantive).toBeDefined();
    expect(isIndexableBlogCategory(thin!.posts)).toBe(false);
    expect(isIndexableBlogCategory(substantive!.posts)).toBe(true);

    const sitemapUrls = getBlogSitemapEntries().map((entry) => entry.url);
    expect(sitemapUrls.some((url) => url.endsWith(thin!.href))).toBe(false);
    expect(sitemapUrls.some((url) => url.endsWith(substantive!.href))).toBe(true);
  });
});

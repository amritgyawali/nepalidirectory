import { describe, expect, it } from "vitest";

import { blogPosts } from "./blog";
import { nationalDirectoryGuidePosts } from "./national-directory-guides";

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function visibleEditorialText(post: (typeof nationalDirectoryGuidePosts)[number]): string {
  return [
    post.title,
    post.excerpt,
    post.description,
    ...post.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...post.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ");
}

describe("national directory guides", () => {
  it("publishes exactly ten new, unique guides through the canonical blog collection", () => {
    expect(nationalDirectoryGuidePosts).toHaveLength(10);

    const slugs = blogPosts.map((post) => post.slug);
    const hrefs = blogPosts.map((post) => post.href);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);

    for (const post of nationalDirectoryGuidePosts) {
      expect(blogPosts).toContain(post);
      expect(post.href).toBe(`/blog/${post.slug}`);
    }
  });

  it("keeps each guide substantial, useful and internally connected", () => {
    for (const post of nationalDirectoryGuidePosts) {
      expect(post.sections.length).toBeGreaterThanOrEqual(6);
      expect(post.sections.every((section) => section.paragraphs.length >= 2)).toBe(true);
      expect(post.faqs.length).toBeGreaterThanOrEqual(3);
      expect(post.contextLinks?.length ?? 0).toBeGreaterThanOrEqual(3);
      expect(countWords(visibleEditorialText(post))).toBeGreaterThanOrEqual(650);
      expect(post.description.length).toBeGreaterThanOrEqual(120);
      expect(post.description.length).toBeLessThanOrEqual(170);
    }
  });

  it("uses focused keyword maps instead of stuffing every page", () => {
    for (const post of nationalDirectoryGuidePosts) {
      const normalizedKeywords = post.keywords.map((keyword) => keyword.toLowerCase());
      expect(post.keywords.length).toBeGreaterThanOrEqual(8);
      expect(post.keywords.length).toBeLessThanOrEqual(10);
      expect(new Set(normalizedKeywords).size).toBe(post.keywords.length);
    }
  });

  it("connects every priority category guide to its browse hub", () => {
    const expectedCategorySlugs = [
      "restaurants",
      "hotels",
      "hospitals",
      "schools",
      "it-companies",
      "shops",
    ];

    for (const categorySlug of expectedCategorySlugs) {
      const matchingPost = nationalDirectoryGuidePosts.find((post) =>
        post.categorySlugs?.includes(categorySlug),
      );

      expect(matchingPost, `missing ${categorySlug} guide`).toBeDefined();
      expect(
        matchingPost?.contextLinks?.some((link) => link.href === `/category/${categorySlug}`),
      ).toBe(true);
    }
  });
});

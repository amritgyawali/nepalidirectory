import { describe, expect, it } from "vitest";
import { blogPosts, getBlogCategory } from "./blog";
import { isIndexableBlogCategory } from "./blog-quality";
import { ownerSeoGuidePosts } from "./owner-seo-guides";

function editorialWordCount(post: (typeof ownerSeoGuidePosts)[number]): number {
  return [
    post.title,
    post.excerpt,
    ...post.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...post.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

describe("research-backed owner SEO guide cluster", () => {
  it("publishes four substantive and independently sourced guides", () => {
    expect(ownerSeoGuidePosts).toHaveLength(4);

    for (const post of ownerSeoGuidePosts) {
      expect(blogPosts).toContain(post);
      expect(post.category).toBe("SEO");
      expect(post.author).toBe("Nepali Directory SEO Desk");
      expect(post.publishedAt).toBe("2026-08-03");
      expect(post.modifiedAt).toBe("2026-08-03");
      expect(post.href).toBe(`/blog/${post.slug}`);
      expect(post.sections.length).toBeGreaterThanOrEqual(8);
      expect(post.faqs.length).toBeGreaterThanOrEqual(4);
      expect(post.contextLinks?.length).toBeGreaterThanOrEqual(4);
      expect(post.sources?.length).toBeGreaterThanOrEqual(3);
      expect(post.sources?.every((source) => source.url.startsWith("https://"))).toBe(true);
      expect(editorialWordCount(post)).toBeGreaterThanOrEqual(900);
      expect(post.seoTitle.length).toBeLessThanOrEqual(60);
      expect(post.description.length).toBeGreaterThanOrEqual(120);
      expect(post.description.length).toBeLessThanOrEqual(170);
      expect(post.disclaimer).toMatch(/guarantee/i);
    }
  });

  it("turns the SEO archive into an indexable topical hub without duplicate URLs", () => {
    const category = getBlogCategory("seo");
    expect(category).toBeDefined();
    expect(category?.posts.length).toBeGreaterThanOrEqual(5);
    expect(isIndexableBlogCategory(category?.posts ?? [])).toBe(true);

    const slugs = ownerSeoGuidePosts.map((post) => post.slug);
    const hrefs = ownerSeoGuidePosts.map((post) => post.href);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

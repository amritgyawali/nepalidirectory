import { describe, expect, it } from "vitest";

import { authorityGuidePosts } from "./authority-guides";
import { blogPosts } from "./blog";
import { cityDirectoryPages } from "./city-pages";
import { directoryCategories } from "./directory-categories";
import { parseInternalMarkdownLinks } from "./markdown-links";
import { routes } from "./routes";

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function visibleEditorialText(post: (typeof authorityGuidePosts)[number]): string {
  return [
    post.title,
    post.excerpt,
    post.description,
    ...post.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...post.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ");
}

const knownPaths = new Set<string>([
  ...Object.values(routes),
  ...blogPosts.map((post) => post.href),
  ...directoryCategories.map((category) => category.href),
  ...cityDirectoryPages.map((city) => city.href),
]);

describe("authority guides", () => {
  it("publishes fifteen unique guides through the canonical blog collection", () => {
    expect(authorityGuidePosts).toHaveLength(15);

    const slugs = blogPosts.map((post) => post.slug);
    const titles = blogPosts.map((post) => post.title.toLowerCase());
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);

    for (const post of authorityGuidePosts) {
      expect(blogPosts).toContain(post);
      expect(post.href).toBe(`/blog/${post.slug}`);
    }
  });

  it("keeps each guide substantial and snippet-ready", () => {
    for (const post of authorityGuidePosts) {
      expect(post.sections.length, post.slug).toBeGreaterThanOrEqual(6);
      expect(post.sections.every((section) => section.paragraphs.length >= 2), post.slug).toBe(true);
      expect(post.faqs.length, post.slug).toBeGreaterThanOrEqual(3);
      expect(post.contextLinks?.length ?? 0, post.slug).toBeGreaterThanOrEqual(3);
      expect(countWords(visibleEditorialText(post)), post.slug).toBeGreaterThanOrEqual(750);
      expect(post.description.length, post.slug).toBeGreaterThanOrEqual(120);
      expect(post.description.length, post.slug).toBeLessThanOrEqual(170);
      expect(post.seoTitle.length, post.slug).toBeLessThanOrEqual(70);
    }
  });

  it("uses focused, non-repeating keyword maps", () => {
    for (const post of authorityGuidePosts) {
      const normalized = post.keywords.map((keyword) => keyword.toLowerCase());
      expect(post.keywords.length, post.slug).toBeGreaterThanOrEqual(8);
      expect(post.keywords.length, post.slug).toBeLessThanOrEqual(10);
      expect(new Set(normalized).size, post.slug).toBe(post.keywords.length);
    }
  });

  it("links only to pages that exist", () => {
    for (const post of authorityGuidePosts) {
      const inlineLinks = post.sections
        .flatMap((section) => section.paragraphs)
        .flatMap(parseInternalMarkdownLinks)
        .flatMap((segment) => (segment.type === "link" ? [segment.href] : []));
      const links = [...(post.contextLinks ?? []).map((link) => link.href), ...inlineLinks];

      for (const href of links) {
        expect(knownPaths.has(href), `${post.slug} -> ${href}`).toBe(true);
      }
      for (const slug of post.citySlugs ?? []) {
        expect(cityDirectoryPages.some((city) => city.slug === slug), `${post.slug} city ${slug}`).toBe(true);
      }
      for (const slug of post.categorySlugs ?? []) {
        expect(directoryCategories.some((category) => category.slug === slug), `${post.slug} category ${slug}`).toBe(true);
      }
    }
  });

  it("builds the new consumer guide category into an indexable hub", () => {
    const consumerGuides = blogPosts.filter((post) => post.category === "Consumer Guides");
    expect(consumerGuides.length).toBeGreaterThanOrEqual(3);
  });
});

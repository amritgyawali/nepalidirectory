import { describe, expect, it } from "vitest";
import { blogPosts } from "@/lib/blog";
import { photographyGuidePosts } from "@/lib/photography-guides";

/**
 * These guides carry a paid featured placement. The disclosure is what separates them from the
 * deceptive "best of" listicles Google treats as scaled content abuse, so it is enforced here
 * rather than left to reviewer diligence.
 */
describe("photography guide cluster", () => {
  it("covers every sub-cluster, so the guards below cannot silently skip a new one", () => {
    // Core (Nepal + Butwal) + city guides + service guides. Update deliberately when adding a
    // cluster — a mismatch means new posts are bypassing the disclosure checks in this file.
    expect(photographyGuidePosts).toHaveLength(20);
    for (const slug of [
      "best-wedding-photographer-nepal",
      "best-wedding-photography-butwal",
      "best-wedding-photographer-kathmandu",
      "best-pre-wedding-photographer-pokhara",
      "wedding-videography-nepal",
      "wedding-photography-checklist-nepal",
    ]) {
      expect(photographyGuidePosts.map((post) => post.slug)).toContain(slug);
    }
  });

  it("discloses the paid featured placement on every post", () => {
    for (const post of photographyGuidePosts) {
      expect(post.disclaimer, `${post.slug} must carry a disclosure`).toBeDefined();
      expect(post.disclaimer).toContain("featured photography partner");
      expect(post.disclaimer).toContain("paid placement");
      expect(post.disclaimer).toContain("not an independent ranking");
    }
  });

  it("repeats the disclosure in a visible section heading, not only the footer", () => {
    for (const post of photographyGuidePosts) {
      const featured = post.sections.find((section) =>
        section.heading.startsWith("Featured partner:"),
      );
      expect(featured, `${post.slug} must show the partner block as its own section`).toBeDefined();
      expect(featured!.paragraphs[0]).toContain("commercial arrangement");
    }
  });

  it("never ranks or scores a named third-party studio", () => {
    // The cluster promotes one disclosed partner and teaches evaluation method. It must not
    // acquire ranked lists of other real businesses, which NepaliDirectory has not audited.
    const rankingClaim = /\b(?:#\s*1|no\.\s*1|number one|rank(?:ed|ing)?\s*(?:#\s*)?\d|top\s+\d+\s+(?:studio|photographer))/i;
    for (const post of photographyGuidePosts) {
      const prose = [
        post.title,
        post.excerpt,
        post.description,
        ...post.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
        ...post.faqs.flatMap((faq) => [faq.question, faq.answer]),
      ].join(" ");
      expect(prose, `${post.slug} must not assert a ranking`).not.toMatch(rankingClaim);
    }
  });

  it("does not assert a star rating or review count anywhere in the cluster", () => {
    // The site does not emit or repeat aggregateRating for reviews it cannot verify; see
    // buildListingLocalBusinessJsonLd and the published editorial policy.
    const ratingClaim = /\b\d(?:\.\d)?\s*\/\s*5|\b\d+\+?\s+(?:reviews|ratings)\b/i;
    for (const post of photographyGuidePosts) {
      const prose = [
        post.description,
        ...post.sections.flatMap((section) => section.paragraphs),
        ...post.faqs.map((faq) => faq.answer),
      ].join(" ");
      expect(prose, `${post.slug} must not assert ratings`).not.toMatch(ratingClaim);
    }
  });

  it("cites the source for the partner's published claims", () => {
    for (const post of photographyGuidePosts) {
      expect(post.sources?.length, `${post.slug} must cite sources`).toBeGreaterThan(0);
      expect(post.sources!.some((source) => source.url.includes("weddingstory.com.np"))).toBe(true);
    }
  });

  it("registers every guide in the canonical blog collection with a unique slug", () => {
    const allSlugs = blogPosts.map((post) => post.slug);
    expect(new Set(allSlugs).size).toBe(allSlugs.length);
    for (const post of photographyGuidePosts) {
      expect(allSlugs).toContain(post.slug);
      expect(post.href).toBe(`/blog/${post.slug}`);
    }
  });
});

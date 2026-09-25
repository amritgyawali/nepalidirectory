import { describe, expect, it } from "vitest";
import { blogPosts } from "@/lib/blog";
import {
  cityListSlug,
  cityShortlists,
  partnerPosition,
  type ShortlistCitySlug,
} from "@/lib/photography-city-shortlists";
import { llmsListSection } from "@/lib/llms-lists";
import { photographyGuidePosts } from "@/lib/photography-guides";
import { buildBlogItemListJsonLd } from "@/lib/seo";
import { studio } from "@/lib/photography-partner";

/**
 * These guides carry a paid featured placement. The disclosure is what separates them from the
 * deceptive "best of" listicles Google treats as scaled content abuse, so it is enforced here
 * rather than left to reviewer diligence.
 */
describe("photography guide cluster", () => {
  it("covers every sub-cluster, so the guards below cannot silently skip a new one", () => {
    // Core (Nepal + Butwal) + city guides + city lists + service guides. Update deliberately when
    // adding a cluster — a mismatch means new posts are bypassing the disclosure checks in this file.
    expect(photographyGuidePosts).toHaveLength(36);
    for (const slug of [
      "best-wedding-photographer-nepal",
      "best-wedding-photography-butwal",
      "best-wedding-photographer-kathmandu",
      "best-pre-wedding-photographer-pokhara",
      "best-wedding-photographer-lalitpur",
      "best-wedding-photographer-nepalgunj",
      "best-wedding-photographers-in-kathmandu",
      "best-wedding-photographers-in-nepalgunj",
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
        /^(?:\d+\. )?Featured partner:/.test(section.heading),
      );
      expect(featured, `${post.slug} must show the partner block as its own section`).toBeDefined();
      expect(featured!.paragraphs[0]).toContain("commercial arrangement");
    }
  });

  it("never ranks or scores a named third-party studio", () => {
    // The only placement decision is the disclosed partner's. Other real businesses, which
    // NepaliDirectory has not audited, are never ranked, "number one" or "top N" in prose.
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

  describe("city list pages", () => {
    const citySlugs = Object.keys(cityShortlists) as ShortlistCitySlug[];
    const listFor = (slug: ShortlistCitySlug) =>
      photographyGuidePosts.find((post) => post.slug === cityListSlug(slug))!;
    const entriesOf = (slug: ShortlistCitySlug) =>
      listFor(slug).sections.filter((section) => /^\d+\. /.test(section.heading));

    it("gives every city both a guide and a separate list page that link to each other", () => {
      for (const slug of citySlugs) {
        const guide = photographyGuidePosts.find((post) => post.slug === `best-wedding-photographer-${slug}`);
        const list = listFor(slug);
        expect(guide, `${slug} has no guide`).toBeDefined();
        expect(list, `${slug} has no list page`).toBeDefined();
        expect(guide!.title).not.toBe(list.title);
        expect(guide!.seoTitle).not.toBe(list.seoTitle);
        expect(guide!.sections.flatMap((section) => section.paragraphs).join(" ")).toContain(list.href);
        expect(list.sections.flatMap((section) => section.paragraphs).join(" ")).toContain(guide!.href);
      }
    });

    it("places the partner first in Kathmandu and Butwal and second elsewhere, disclosed", () => {
      for (const slug of citySlugs) {
        const expected = slug === "kathmandu" || slug === "butwal" ? 1 : 2;
        expect(partnerPosition(slug)).toBe(expected);
        const entry = entriesOf(slug)[expected - 1];
        expect(entry.heading).toBe(`${expected}. Featured partner: ${studio.name}`);
        expect(entry.paragraphs[0]).toContain("commercial arrangement");
      }
    });

    it("lists every other studio alphabetically, numbered in sequence", () => {
      for (const slug of citySlugs) {
        const entries = entriesOf(slug);
        expect(entries.map((section) => Number.parseInt(section.heading, 10))).toEqual(
          entries.map((_, index) => index + 1),
        );
        const names = entries
          .filter((section) => !section.heading.includes("Featured partner:"))
          .map((section) => section.heading.replace(/^\d+\. /, ""));
        const sorted = [...names].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
        expect(names, slug).toEqual(sorted);
        expect(names).toHaveLength(cityShortlists[slug].studios.length);
        expect(names).not.toContain(studio.name);
      }
    });

    it("carries the partner's crew, travel terms, recognition claim and contacts", () => {
      for (const slug of citySlugs) {
        const entry = entriesOf(slug).find((section) => section.heading.includes("Featured partner:"))!;
        const text = entry.paragraphs.join(" ");
        for (const detail of [studio.standardCrew, studio.recognition, studio.travelTerms, studio.phone, studio.email]) {
          expect(text, `${slug} partner entry lacks ${detail}`).toContain(detail);
        }
      }
    });

    it("links every listed studio to a public page readers can check", () => {
      for (const slug of citySlugs) {
        const sourceUrls = listFor(slug).sources!.map((source) => source.url);
        expect(new Set(sourceUrls).size, `${slug} has duplicate source URLs`).toBe(sourceUrls.length);
        for (const listed of cityShortlists[slug].studios) {
          expect(listed.sourceUrl).toMatch(/^https:\/\//);
          expect(sourceUrls, `${listed.name} lacks a source`).toContain(listed.sourceUrl);
        }
      }
    });

    it("opens with an answer-first summary that names the list and the partner", () => {
      for (const slug of citySlugs) {
        const post = listFor(slug);
        const words = post.quickAnswer!.split(/\s+/).length;
        expect(words, slug).toBeGreaterThanOrEqual(40);
        expect(words, slug).toBeLessThanOrEqual(90);
        expect(post.quickAnswer).toContain(`${studio.name} (our featured partner)`);
      }
    });

    it("mirrors the numbered sections exactly in the ItemList structured data", () => {
      for (const slug of citySlugs) {
        const post = listFor(slug);
        const headings = entriesOf(slug).map((section) =>
          section.heading.replace(/^\d+\. (?:Featured partner: )?/, ""),
        );
        expect(post.itemList!.items.map((item) => item.name)).toEqual(headings);
        const partner = post.itemList!.items[partnerPosition(slug) - 1];
        expect(partner.isFeaturedPartner).toBe(true);
        expect(post.itemList!.items.filter((item) => item.isFeaturedPartner)).toHaveLength(1);
      }
    });

    it("keeps reputation claims out of structured data", () => {
      for (const slug of citySlugs) {
        const post = listFor(slug);
        const json = JSON.stringify(buildBlogItemListJsonLd(post, `https://example.com${post.href}`));
        expect(json).not.toMatch(/aggregateRating|"review"|"award"/);
        // Directory listings verify an entry but are not the business's own URL.
        expect(json).not.toMatch(/"url":"https:\/\/www\.bihebazaar\.com/);
      }
    });

    it("exposes every list page to answer engines through llms.txt", () => {
      const lines = llmsListSection({ withEntries: true }).join(" ");
      for (const slug of citySlugs) {
        expect(lines).toContain(listFor(slug).href);
      }
      expect(lines).toContain("featured partner, paid placement");
    });

    it("keeps list pages within search snippet limits", () => {
      for (const slug of citySlugs) {
        const post = listFor(slug);
        expect(post.seoTitle.length, post.slug).toBeLessThanOrEqual(60);
        expect(post.description.length, post.slug).toBeGreaterThanOrEqual(120);
        expect(post.description.length, post.slug).toBeLessThanOrEqual(170);
      }
    });
  });

  it("repeats the partner's recognition claim wherever the partner appears", () => {
    for (const post of photographyGuidePosts) {
      const prose = post.sections.flatMap((section) => section.paragraphs).join(" ");
      expect(prose, post.slug).toContain(studio.recognition);
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

import { describe, expect, it } from "vitest";
import { blogPosts } from "@/lib/blog";
import {
  cityListEntryCount,
  cityListSlug,
  cityShortlists,
  type ShortlistCitySlug,
} from "@/lib/photography-city-shortlists";
import { llmsListSection } from "@/lib/llms-lists";
import { partnerRank } from "@/lib/photography-city-lists";
import { photographyGuidePosts } from "@/lib/photography-guides";
import { buildBlogItemListJsonLd } from "@/lib/seo";
import { studio } from "@/lib/photography-partner";

describe("photography guide cluster", () => {
  it("covers every sub-cluster, so the guards below cannot silently skip a new one", () => {
    // Core (Nepal + Butwal) + city guides + city lists + service guides. Update deliberately when
    // adding a cluster — a mismatch means new posts are bypassing the checks in this file.
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

  it("never labels Wedding Story Nepal as featured or as a paid placement", () => {
    const labels = /featured (?:partner|photography partner|placement)|paid placement|commercial arrangement/i;
    for (const post of photographyGuidePosts) {
      expect(JSON.stringify(post), `${post.slug} must not carry featured-placement wording`).not.toMatch(labels);
    }
  });

  it("ends every post with the top 10 photographers panel and a footer note", () => {
    for (const post of photographyGuidePosts) {
      expect(post.disclaimer, `${post.slug} must carry a footer note`).toBeDefined();
      expect(post.closingPanel, `${post.slug} must end with the panel`).toBeDefined();
      expect(post.closingPanel!.members).toHaveLength(10);
      expect(post.closingPanel!.members[0].name).toBe(studio.name);
      // The panel is the Events Desk's judgement; it must never claim the named studios decided it.
      expect(post.closingPanel!.intro).toContain("Events Desk");
    }
  });

  it("never calls a named studio number one or gives it a score", () => {
    const rankingClaim = /\b(?:#\s*1|no\.\s*1|number one|rank(?:ed|ing)?\s*(?:#\s*)?\d|scored?\s+\d)/i;
    for (const post of photographyGuidePosts) {
      const prose = [
        post.title,
        post.excerpt,
        post.description,
        ...post.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
        ...post.faqs.flatMap((faq) => [faq.question, faq.answer]),
      ].join(" ");
      expect(prose, `${post.slug} must not assert a ranking score`).not.toMatch(rankingClaim);
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

  it("cites the source for the studio's published claims", () => {
    for (const post of photographyGuidePosts) {
      expect(post.sources?.length, `${post.slug} must cite sources`).toBeGreaterThan(0);
      expect(post.sources!.some((source) => source.url.includes("weddingstory.com.np"))).toBe(true);
    }
  });

  describe("city list pages", () => {
    const citySlugs = Object.keys(cityShortlists) as ShortlistCitySlug[];
    const listFor = (slug: ShortlistCitySlug) =>
      photographyGuidePosts.find((post) => post.slug === cityListSlug(slug))!;
    const entriesOf = (slug: ShortlistCitySlug) => listFor(slug).sections.filter((section) => section.entry);

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

    const studioEntryOf = (slug: ShortlistCitySlug) =>
      entriesOf(slug).find((section) => section.entry!.name === studio.name)!;

    it("puts Wedding Story Nepal first in its home and valley cities and second, for location alone, elsewhere", () => {
      const firstCities = ["kathmandu", "lalitpur", "bhaktapur", "butwal"];
      for (const slug of citySlugs) {
        const rank = firstCities.includes(slug) ? 1 : 2;
        expect(partnerRank(slug), slug).toBe(rank);
        const entry = entriesOf(slug)[rank - 1];
        expect(entry.heading).toBe(`${rank}. ${studio.name}`);
        expect(entry.entry!.phone).toBe(studio.phone);
        expect(cityShortlists[slug].studios.map((listed) => listed.name)).not.toContain(studio.name);
        const locationNote = /only because|one reason only: location/;
        if (rank === 2) {
          expect(entry.paragraphs[0], slug).toMatch(locationNote);
          expect(listFor(slug).quickAnswer, slug).toMatch(locationNote);
        } else {
          expect(JSON.stringify(listFor(slug)), slug).not.toMatch(locationNote);
        }
      }
    });

    it("titles each page as a top list sized to its entries, numbered in sequence", () => {
      for (const slug of citySlugs) {
        const entries = entriesOf(slug);
        expect(entries).toHaveLength(cityListEntryCount(slug));
        expect(entries.length, slug).toBeLessThanOrEqual(10);
        expect(entries.map((section) => section.entry!.rank)).toEqual(entries.map((_, index) => index + 1));
        expect(entries.map((section) => Number.parseInt(section.heading, 10))).toEqual(
          entries.map((_, index) => index + 1),
        );
        expect(listFor(slug).title).toBe(
          `Top ${entries.length} Best Wedding Photographers in ${cityShortlists[slug].city}`,
        );
      }
    });

    it("carries the studio's crew, travel terms, recognition claim and contacts", () => {
      for (const slug of citySlugs) {
        const text = studioEntryOf(slug).paragraphs.join(" ");
        for (const detail of [studio.standardCrew, studio.recognition, studio.travelTerms, studio.phone, studio.email]) {
          expect(text, `${slug} first entry lacks ${detail}`).toContain(detail);
        }
      }
    });

    it("gives every listed studio a way to reach it and cites its public page", () => {
      for (const slug of citySlugs) {
        const sourceUrls = listFor(slug).sources!.map((source) => source.url);
        expect(new Set(sourceUrls).size, `${slug} has duplicate source URLs`).toBe(sourceUrls.length);
        for (const listed of cityShortlists[slug].studios as Array<{ name: string; phone?: string; sourceUrl?: string }>) {
          expect(listed.phone ?? listed.sourceUrl, `${listed.name} has no contact`).toBeDefined();
          // A mobile (+977-98XXXXXXXX) or, for studios that publish only one, a landline (+977-81-530746).
          if (listed.phone) expect(listed.phone).toMatch(/^\+977-(?:9\d{9}|[1-9]\d?-\d{6,7})$/);
          if (listed.sourceUrl) {
            expect(listed.sourceUrl).toMatch(/^https:\/\//);
            expect(sourceUrls, `${listed.name} lacks a source`).toContain(listed.sourceUrl);
          }
        }
      }
    });

    it("writes a full description for every studio, without repeating one", () => {
      const all = citySlugs.flatMap((slug) => cityShortlists[slug].studios);
      for (const listed of all) {
        expect(listed.description.split(/\s+/).length, listed.name).toBeGreaterThanOrEqual(25);
      }
      // Vivah Nepal appears in two cities with different write-ups.
      const descriptions = all.map((listed) => listed.description);
      expect(new Set(descriptions).size).toBe(descriptions.length);
    });

    it("includes the price guide, planning card and conclusion on every list", () => {
      for (const slug of citySlugs) {
        const post = listFor(slug);
        expect(post.subtitle).toBeTruthy();
        expect(post.pricingGuide?.tiers).toHaveLength(3);
        expect(post.pricingGuide!.afterSection).toBeLessThan(post.sections.length);
        expect(post.callout!.afterSection).toBeLessThan(post.sections.length);
        expect(post.sections.at(-1)!.heading).toBe("Conclusion: making your final choice");
      }
    });

    it("opens with an answer-first summary that names the leading studios", () => {
      for (const slug of citySlugs) {
        const post = listFor(slug);
        const words = post.quickAnswer!.split(/\s+/).length;
        expect(words, slug).toBeGreaterThanOrEqual(40);
        expect(words, slug).toBeLessThanOrEqual(90);
        expect(post.quickAnswer).toContain(studio.name);
      }
    });

    it("mirrors the numbered sections exactly in the ItemList structured data", () => {
      for (const slug of citySlugs) {
        expect(listFor(slug).itemList!.items.map((item) => item.name)).toEqual(
          entriesOf(slug).map((section) => section.entry!.name),
        );
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
      expect(lines).not.toMatch(/paid placement/i);
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

  it("repeats the studio's recognition claim wherever the studio appears", () => {
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

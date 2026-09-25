import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { COMPARE_RANKING_BASIS, MIN_COMPARABLE_PROVIDERS } from "@/lib/compare-listings";
import { compareCategories } from "@/lib/compare";

describe("comparison provider lists", () => {
  it("states the ranking basis without claiming it is review-derived", () => {
    // No listing carries a google_place_id, so the legacy rating columns have no verifiable
    // provenance. The page must not imply the order reflects Google or social review scores.
    expect(COMPARE_RANKING_BASIS).toContain("not by star ratings");
    expect(COMPARE_RANKING_BASIS).toMatch(/does not collect or republish/i);
    expect(COMPARE_RANKING_BASIS).not.toMatch(/\b\d(?:\.\d)?\s*\/\s*5\b/);
  });

  it("requires enough providers for a comparison to be meaningful", () => {
    expect(MIN_COMPARABLE_PROVIDERS).toBeGreaterThanOrEqual(10);
  });

  it("keeps every comparison guide's static business array empty", () => {
    // Providers are resolved at request time from reviewed listings. A hardcoded entry here
    // would be an invented business, which the directory does not publish.
    for (const category of compareCategories) {
      expect(category.businesses, `${category.slug} must not hardcode providers`).toHaveLength(0);
    }
  });

  it("exposes unique comparison slugs and hrefs", () => {
    const slugs = compareCategories.map((category) => category.slug);
    const hrefs = compareCategories.map((category) => category.href);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const category of compareCategories) {
      expect(category.href).toBe(`/compare-business/${category.slug}`);
    }
  });
});

describe("comparison page indexability", () => {
  it("keeps sitemap inclusion and meta robots driven by the same signal", () => {
    // Regression guard: comparison pages hardcoded `index: false` while the sitemap listed the
    // populated ones, so every populated guide was submitted for crawling and then told not to
    // index. Both must key off whether the guide actually resolves a provider list.
    const page = readFileSync("app/compare-business/[slug]/page.tsx", "utf8");
    expect(page).toContain("const indexable = (await getComparedBusinesses(category.slug)).length > 0");
    expect(page).toContain("index: indexable");
    expect(page).not.toMatch(/robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/);
  });
});

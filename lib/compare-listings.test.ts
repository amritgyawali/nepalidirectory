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

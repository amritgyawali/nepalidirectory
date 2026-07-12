import { describe, expect, it } from "vitest";
import {
  directoryCategories,
  directoryCategorySlugs,
  getDirectoryCategory,
  getDirectoryCategoryHref,
  listingMatchesDirectoryCategory,
} from "@/lib/directory-categories";

describe("directory category definitions", () => {
  it("publishes exactly the six requested category slugs with unique canonical hrefs", () => {
    expect(directoryCategorySlugs).toEqual([
      "restaurants",
      "hotels",
      "hospitals",
      "schools",
      "it-companies",
      "shops",
    ]);

    const slugs = directoryCategories.map((category) => category.slug);
    const hrefs = directoryCategories.map((category) => category.href);

    expect(new Set(slugs).size).toBe(directoryCategories.length);
    expect(new Set(hrefs).size).toBe(directoryCategories.length);
    expect(hrefs).toEqual(slugs.map(getDirectoryCategoryHref));
  });

  it("covers each exact priority phrase in its title, meta description and H1 data", () => {
    for (const category of directoryCategories) {
      expect(category.title).toContain(category.priorityKeyword);
      expect(category.metaDescription).toContain(category.priorityKeyword);
      expect(category.h1).toBe(category.priorityKeyword);
    }
  });

  it("resolves canonical slugs without depending on input case", () => {
    expect(getDirectoryCategory("restaurants")?.name).toBe("Restaurants");
    expect(getDirectoryCategory("IT-COMPANIES")?.name).toBe("IT Companies");
    expect(getDirectoryCategory("missing-category")).toBeUndefined();
  });
});

describe("listingMatchesDirectoryCategory", () => {
  it.each([
    ["restaurants", "Café"],
    ["restaurants", "Newari Fine Dining"],
    ["hotels", "Guest-house"],
    ["hospitals", "Teaching Hospital"],
    ["schools", "Montessori"],
    ["it-companies", "IT & Software"],
    ["it-companies", "Software Companies"],
    ["shops", "Sweet Shops"],
  ])("maps the %s alias %s", (slug, alias) => {
    expect(
      listingMatchesDirectoryCategory({ categories: [alias] }, slug),
    ).toBe(true);
  });

  it("accepts every declared alias for its own category", () => {
    for (const category of directoryCategories) {
      for (const alias of category.aliases) {
        expect(
          listingMatchesDirectoryCategory({ categories: [alias] }, category),
        ).toBe(true);
      }
    }
  });

  it("does not use broad substring matching or accept an unknown category", () => {
    expect(
      listingMatchesDirectoryCategory(
        { categories: ["Restaurant equipment supplier"] },
        "restaurants",
      ),
    ).toBe(false);
    expect(
      listingMatchesDirectoryCategory({ categories: ["Hotels"] }, "shops"),
    ).toBe(false);
    expect(
      listingMatchesDirectoryCategory({ categories: ["Retail"] }, "unknown"),
    ).toBe(false);
  });
});

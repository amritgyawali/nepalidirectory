import { describe, expect, it } from "vitest";
import { cityDirectoryPages } from "@/lib/city-pages";
import { directoryCategories } from "@/lib/directory-categories";
import { MIN_INDEXABLE_DIRECTORY_RESULTS } from "@/lib/directory-pagination";
import {
  countQualifiedInCategory,
  countQualifiedInCity,
  countQualifiedInCityCategory,
  meetsPublicationThreshold,
  selectQualifiedCategories,
  selectQualifiedCities,
  summarizeDirectoryCounts,
} from "@/lib/directory-counts";
import { makeNewListing, type Listing } from "@/lib/enrich";
import { isIndexableListing } from "@/lib/public-listings";

function qualifiedListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: 1,
    ...makeNewListing({
      name: "Qualified Example",
      slug: "qualified-example",
      area: "Kathmandu",
      address: "Putalisadak, Kathmandu",
      phone: "+977-1-5550100",
      categories: ["restaurants"],
      description:
        "Qualified Example serves food in Putalisadak and its identity, category, location and contact details were reviewed against a recorded source before publication.",
      claimed: true,
      verified: true,
      verificationStatus: "owner_verified",
      dataSource: "owner",
      sourceRef: "claim:qualified-example",
      sourceCheckedAt: new Date("2026-08-01T00:00:00.000Z"),
      contentReviewedAt: new Date("2026-08-01T00:00:00.000Z"),
      qualityScore: 80,
      ...overrides,
    }),
  } as Listing;
}

function unqualifiedListing(overrides: Partial<Listing> = {}): Listing {
  return qualifiedListing({ contentReviewedAt: null, ...overrides });
}

describe("the single count service", () => {
  it("never counts an unreviewed record as a qualified public profile", () => {
    const listings = [
      qualifiedListing({ slug: "one", name: "One" }),
      qualifiedListing({ slug: "two", name: "Two" }),
      unqualifiedListing({ slug: "three", name: "Three" }),
    ];

    const counts = summarizeDirectoryCounts(listings);

    expect(counts.discovered).toBe(3);
    expect(counts.qualified).toBe(2);
    expect(counts.qualified).toBe(listings.filter(isIndexableListing).length);
    expect(counts.qualified).toBeLessThanOrEqual(counts.discovered);
  });

  it("agrees with the per-city and per-category counts the pages render", () => {
    const listings = [
      qualifiedListing({ slug: "a", name: "A", area: "Kathmandu", categories: ["restaurants"] }),
      qualifiedListing({ slug: "b", name: "B", area: "Pokhara", categories: ["hotels"] }),
      unqualifiedListing({ slug: "c", name: "C", area: "Kathmandu", categories: ["restaurants"] }),
    ];
    const qualified = listings.filter(isIndexableListing);
    const restaurants = directoryCategories.find((category) => category.slug === "restaurants")!;

    expect(countQualifiedInCity(qualified, "kathmandu")).toBe(1);
    expect(countQualifiedInCity(qualified, "pokhara")).toBe(1);
    expect(countQualifiedInCategory(qualified, restaurants)).toBe(1);
    expect(countQualifiedInCityCategory(qualified, "kathmandu", restaurants)).toBe(1);
    expect(countQualifiedInCityCategory(qualified, "pokhara", restaurants)).toBe(0);
  });

  it("publishes a hub only once it clears the minimum qualified threshold", () => {
    const nine = Array.from({ length: MIN_INDEXABLE_DIRECTORY_RESULTS - 1 }, (_unused, index) =>
      qualifiedListing({ slug: `near-${index}`, name: `Near ${index}` }),
    );

    expect(meetsPublicationThreshold(nine.length)).toBe(false);
    expect(selectQualifiedCities(nine)).toEqual([]);
    expect(selectQualifiedCategories(nine)).toEqual([]);

    const enough = [
      ...nine,
      qualifiedListing({ slug: "final", name: "Final" }),
    ];

    expect(meetsPublicationThreshold(enough.length)).toBe(true);
    expect(selectQualifiedCities(enough).map((city) => city.slug)).toContain("kathmandu");
    expect(selectQualifiedCategories(enough).map((category) => category.slug)).toContain(
      "restaurants",
    );
  });

  it("keeps every hub selection inside the known city and category taxonomies", () => {
    const listings = Array.from({ length: MIN_INDEXABLE_DIRECTORY_RESULTS }, (_unused, index) =>
      qualifiedListing({ slug: `listing-${index}`, name: `Listing ${index}` }),
    );

    const citySlugs = new Set(cityDirectoryPages.map((city) => city.slug));
    const categorySlugs = new Set(directoryCategories.map((category) => category.slug));

    for (const city of selectQualifiedCities(listings)) expect(citySlugs.has(city.slug)).toBe(true);
    for (const category of selectQualifiedCategories(listings)) {
      expect(categorySlugs.has(category.slug)).toBe(true);
    }
  });
});

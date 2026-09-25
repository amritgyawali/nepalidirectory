import { describe, expect, it } from "vitest";
import type { Listing } from "@/lib/enrich";
import { MIN_INDEXABLE_DIRECTORY_RESULTS } from "@/lib/directory-pagination";
import { computeIndexableHubSlugs, isLiveHubHref, noIndexableHubs } from "@/lib/indexable-hubs";

function listings(count: number, fields: Partial<Listing>): Listing[] {
  return Array.from({ length: count }, () => ({ area: "", categories: [], ...fields }) as Listing);
}

describe("computeIndexableHubSlugs", () => {
  const hubs = computeIndexableHubSlugs([
    ...listings(MIN_INDEXABLE_DIRECTORY_RESULTS, { area: "Kathmandu", categories: ["restaurants"] }),
    // Dharan and hotels sit one listing below the threshold.
    ...listings(MIN_INDEXABLE_DIRECTORY_RESULTS - 1, { area: "Dharan", categories: ["hotels"] }),
  ]);

  it("publishes a hub only once it reaches the listing threshold", () => {
    expect(hubs.cities).toEqual(["kathmandu"]);
    expect(hubs.categories).toEqual(["restaurants"]);
    expect(hubs.cityCategories).toEqual(["kathmandu/restaurants"]);
  });

  it("links published hubs and withholds unpublished ones", () => {
    expect(isLiveHubHref("/city/kathmandu", hubs)).toBe(true);
    expect(isLiveHubHref("/city/kathmandu/restaurants?page=2", hubs)).toBe(true);
    expect(isLiveHubHref("/category/restaurants", hubs)).toBe(true);
    expect(isLiveHubHref("/city/dharan", hubs)).toBe(false);
    expect(isLiveHubHref("/city/dharan/hotels", hubs)).toBe(false);
    expect(isLiveHubHref("/category/hotels", hubs)).toBe(false);
  });

  it("leaves non-hub links alone, even with no published hubs", () => {
    expect(isLiveHubHref("/city", noIndexableHubs)).toBe(true);
    expect(isLiveHubHref("/near-me", noIndexableHubs)).toBe(true);
    expect(isLiveHubHref("/compare-business/beauty-salons", noIndexableHubs)).toBe(true);
    expect(isLiveHubHref("/city/kathmandu", noIndexableHubs)).toBe(false);
  });
});

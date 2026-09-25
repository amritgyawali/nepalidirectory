import { describe, expect, it } from "vitest";
import { cityDirectoryPages } from "@/lib/city-pages";
import { getDirectoryCategory } from "@/lib/directory-categories";
import type { Listing } from "@/lib/enrich";
import { selectRelatedListings } from "@/lib/related-listings";

function listing(slug: string, area: string, category: string): Listing {
  return { slug, name: slug, area, categories: [category] } as Listing;
}

const tailors = getDirectoryCategory("tailors")!;
const kathmandu = cityDirectoryPages.find((city) => city.slug === "kathmandu")!;
const context = { category: tailors, city: kathmandu };

describe("selectRelatedListings", () => {
  it("gives every profile in a group the same number of inbound links", () => {
    const group = ["a", "b", "c", "d", "e", "f", "g", "h"].map((slug) =>
      listing(slug, "Kathmandu", "tailors"),
    );
    const inbound = new Map(group.map((item) => [item.slug, 0]));
    for (const item of group) {
      for (const related of selectRelatedListings(item, group, context, 3)) {
        inbound.set(related.slug, inbound.get(related.slug)! + 1);
      }
    }
    expect([...inbound.values()]).toEqual(Array(group.length).fill(3));
  });

  it("wraps round from the current profile and never links to itself", () => {
    const group = ["a", "b", "c", "d"].map((slug) => listing(slug, "Kathmandu", "tailors"));
    expect(selectRelatedListings(group[3], group, context, 2).map((item) => item.slug)).toEqual([
      "a",
      "b",
    ]);
    expect(selectRelatedListings(group[0], group, context, 10).map((item) => item.slug)).toEqual([
      "b",
      "c",
      "d",
    ]);
  });

  it("prefers the same category and city, then widens the group", () => {
    const current = listing("m", "Kathmandu", "tailors");
    const pool = [
      current,
      listing("n", "Kathmandu", "tailors"),
      listing("o", "Pokhara", "tailors"),
      listing("p", "Kathmandu", "hotels"),
      listing("q", "Pokhara", "hotels"),
    ];
    expect(selectRelatedListings(current, pool, context).map((item) => item.slug)).toEqual([
      "n",
      "o",
      "p",
    ]);
  });
});

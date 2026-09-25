import { describe, expect, it } from "vitest";
import type { Listing } from "@/lib/enrich";
import { listingMatchesCity } from "@/lib/public-listings";

function listingAt(fields: Partial<Listing>): Listing {
  return { area: "", ...fields } as Listing;
}

describe("listingMatchesCity", () => {
  it("matches on the city name appearing in any location field", () => {
    expect(listingMatchesCity(listingAt({ area: "Kathmandu" }), "kathmandu")).toBe(true);
    expect(listingMatchesCity(listingAt({ area: "", municipality: "Pokhara" }), "pokhara")).toBe(true);
    expect(listingMatchesCity(listingAt({ area: "", district: "Bhaktapur" }), "bhaktapur")).toBe(true);
    // Containment, so a suffixed municipal name still resolves to its city page.
    expect(listingMatchesCity(listingAt({ area: "Butwal-7" }), "butwal")).toBe(true);
  });

  it("resolves localities published under a different name from the city page", () => {
    // Bharatpur is the metropolitan city and district HQ of Chitwan. Listings carry "Bharatpur",
    // the directory page is /city/chitwan, and nothing links them without the alias map.
    expect(listingMatchesCity(listingAt({ area: "Bharatpur" }), "chitwan")).toBe(true);
    expect(listingMatchesCity(listingAt({ area: "Narayangarh" }), "chitwan")).toBe(true);
    expect(listingMatchesCity(listingAt({ area: "Patan" }), "lalitpur")).toBe(true);
    expect(listingMatchesCity(listingAt({ area: "Thamel" }), "kathmandu")).toBe(true);
  });

  it("does not leak a listing into an unrelated city page", () => {
    expect(listingMatchesCity(listingAt({ area: "Bharatpur" }), "kathmandu")).toBe(false);
    expect(listingMatchesCity(listingAt({ area: "Biratnagar" }), "chitwan")).toBe(false);
    expect(listingMatchesCity(listingAt({ area: "Pokhara" }), "lalitpur")).toBe(false);
    // A city with no alias entry must fall through to containment alone rather than throwing.
    expect(listingMatchesCity(listingAt({ area: "Kathmandu" }), "dharan")).toBe(false);
  });
});

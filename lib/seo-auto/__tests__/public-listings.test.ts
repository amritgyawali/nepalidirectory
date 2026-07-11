import { describe, expect, it } from "vitest";
import { makeNewListing } from "@/lib/enrich";
import { isDemoListing, isIndexableListing } from "@/lib/public-listings";
import { buildListingLocalBusinessJsonLd, priceTierLabel } from "@/lib/seo-auto";

describe("public listing publication gate", () => {
  it("keeps bundled demo and placeholder records out of index surfaces", () => {
    const listing = {
      ...makeNewListing({
        name: "Preview Business",
        slug: "preview-business",
        area: "Kathmandu",
        address: "Kathmandu",
        categories: ["restaurants"],
        website: "https://example.com/preview",
        qualityScore: 90,
        verified: true,
        dataSource: "demo",
      }),
      id: 1,
      qualityScore: 90,
    };
    expect(isDemoListing(listing)).toBe(true);
    expect(isIndexableListing(listing)).toBe(false);
  });

  it("allows complete reviewed owner records and emits truthful schema fields", () => {
    const listing = {
      ...makeNewListing({
        name: "Owner Verified Service",
        slug: "owner-verified-service",
        area: "Lalitpur",
        address: "Pulchowk, Lalitpur",
        categories: ["electricians"],
        coordinates: { lat: 27.68, lng: 85.32 },
        claimed: true,
        verified: true,
        dataSource: "owner",
        active: true,
      }),
      id: 2,
      qualityScore: 80,
      price: 2,
    };
    expect(isIndexableListing(listing)).toBe(true);
    const schema = buildListingLocalBusinessJsonLd(
      listing,
      "https://www.nepalidirectory.com/business/owner-verified-service",
    );
    expect(schema["@id"]).toContain("/business/owner-verified-service#localbusiness");
    expect(schema.geo).toMatchObject({ latitude: 27.68, longitude: 85.32 });
    expect(schema.priceRange).toBe("₨₨");
    expect(priceTierLabel(3)).toBe("₨₨₨");
  });
});

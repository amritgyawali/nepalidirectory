import { describe, expect, it } from "vitest";
import { makeNewListing, type Listing } from "@/lib/enrich";
import {
  evaluateListingIndexEligibility,
  isDemoListing,
  isIndexableListing,
  listingFactsCheckedAt,
  listingVerificationLabel,
  publicListingImage,
} from "@/lib/public-listings";
import { buildListingLocalBusinessJsonLd } from "@/lib/seo-auto";

function eligibleListing(overrides: Partial<Listing> = {}): Listing {
  return {
    ...makeNewListing({
      name: "Owner Verified Service",
      slug: "owner-verified-service",
      area: "Lalitpur",
      address: "Pulchowk, Lalitpur",
      phone: "+977-1-5550100",
      categories: ["electricians"],
      description:
        "Owner Verified Service is an electrical service record in Lalitpur. Its identity, category, location and contact details were reviewed before publication.",
      descriptionSource: "owner",
      coordinates: { lat: 27.68, lng: 85.32 },
      claimed: true,
      verified: true,
      verificationStatus: "owner_verified",
      dataSource: "owner",
      sourceRef: "claim:owner-verified-service",
      sourceCheckedAt: new Date("2026-08-01T00:00:00.000Z"),
      contentReviewedAt: new Date("2026-08-01T00:00:00.000Z"),
      contentReviewedBy: "test-reviewer",
      lastMeaningfulUpdateAt: new Date("2026-08-01T00:00:00.000Z"),
      active: true,
      ...overrides,
    }),
    id: overrides.id ?? 2,
    qualityScore: overrides.qualityScore ?? 80,
    ...overrides,
  };
}

describe("public listing publication gate", () => {
  it("keeps bundled demo and placeholder records out of index surfaces", () => {
    const listing = eligibleListing({
      dataSource: "demo",
      website: "https://example.com/preview",
    });
    expect(isDemoListing(listing)).toBe(true);
    expect(isIndexableListing(listing)).toBe(false);
  });

  it("allows complete reviewed owner records and omits legacy rating and price schema", () => {
    const listing = eligibleListing({ rating: 4.9, reviews: 900, price: 3 });
    expect(isIndexableListing(listing)).toBe(true);
    const schema = buildListingLocalBusinessJsonLd(
      listing,
      "https://www.nepalidirectory.com/business/owner-verified-service",
    );
    expect(schema["@id"]).toContain("/business/owner-verified-service#localbusiness");
    expect(schema.geo).toMatchObject({ latitude: 27.68, longitude: 85.32 });
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema).not.toHaveProperty("review");
    expect(schema).not.toHaveProperty("priceRange");
  });

  it.each([
    ["INACTIVE", { active: false }],
    ["REJECTED", { verificationStatus: "rejected" as const }],
    ["CATEGORY_REVIEW_REQUIRED", { needsCategoryReview: true }],
    ["LOW_QUALITY_SCORE", { qualityScore: 54 }],
    ["MISSING_NAME", { name: "" }],
    ["MISSING_ADDRESS", { address: "" }],
    ["INSUFFICIENT_REVIEWED_DESCRIPTION", { description: "Too short" }],
    ["MISSING_CATEGORY", { categories: ["uncategorized"] }],
    ["MISSING_CONTACT", { phone: undefined, website: undefined }],
    ["CONTENT_NOT_REVIEWED", { contentReviewedAt: null }],
  ])("reports %s", (reason, overrides) => {
    expect(evaluateListingIndexEligibility(eligibleListing(overrides)).reasons).toContain(reason);
  });

  it("requires auditable source fields", () => {
    const result = evaluateListingIndexEligibility(
      eligibleListing({ sourceRef: undefined, sourceCheckedAt: null }),
    );
    expect(result.reasons).toContain("SOURCE_NOT_AUDITABLE");
  });

  it("does not treat an unclaimed owner record as owner verified", () => {
    const result = evaluateListingIndexEligibility(eligibleListing({ claimed: false }));
    expect(result.reasons).toContain("SOURCE_NOT_AUDITABLE");
  });

  it("accepts a reviewed official-source record without an ownership claim", () => {
    const listing = eligibleListing({
      claimed: false,
      dataSource: "official",
      verificationStatus: "source_verified",
      sourceRef: "https://official.example.gov.np/business/123",
    });
    expect(evaluateListingIndexEligibility(listing)).toEqual({ eligible: true, reasons: [] });
    expect(listingVerificationLabel(listing)).toBe("Source checked");
  });

  it("excludes unverified stock images from public output", () => {
    const listing = eligibleListing({
      image: "https://images.unsplash.com/photo-123",
      imageVerified: true,
    });
    expect(publicListingImage(listing)).toBeUndefined();
  });

  it("exposes the genuine source-check timestamp", () => {
    const listing = eligibleListing();
    expect(listingFactsCheckedAt(listing)).toBe("2026-08-01T00:00:00.000Z");
    expect(listingVerificationLabel(listing)).toBe("Ownership verified");
  });
});

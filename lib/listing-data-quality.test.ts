import { describe, expect, it } from "vitest";
import { getDirectionsUrl, getListingSourceUrl } from "@/lib/business-links";
import {
  descriptionTemplateFingerprint,
  selectDistinctlyDescribed,
  summarizeDescriptionTemplates,
} from "@/lib/description-uniqueness";
import { evaluateClusterReadiness, priorityClusters } from "@/lib/directory-clusters";
import { getDirectoryCategory } from "@/lib/directory-categories";
import { getCityDirectoryPage } from "@/lib/city-pages";
import { makeNewListing, type Listing } from "@/lib/enrich";
import { formatDirectoryDate, toIsoDate } from "@/lib/format-date";
import { evaluateListingFreshness, selectStaleListings } from "@/lib/freshness";
import { buildEligibilityReport } from "@/lib/listing-eligibility-report";
import { displayAddress, displayLocality, localityTrail, stripPostalArtefacts } from "@/lib/locality";
import { listingPublicationTier } from "@/lib/trust-vocabulary";

function listing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: 1,
    ...makeNewListing({
      name: "Example Business",
      slug: "example-business",
      area: "Kathmandu",
      address: "Putalisadak, Kathmandu",
      phone: "+977-1-5550100",
      categories: ["restaurants"],
      coordinates: { lat: 27.70169, lng: 85.3206 },
      description:
        "Example Business serves food in Putalisadak and its identity, category, location and contact details were reviewed against a recorded source before publication.",
      verified: true,
      verificationStatus: "source_verified",
      dataSource: "import",
      sourceRef: "https://example.org/batch/1",
      sourceCheckedAt: new Date("2026-08-01T00:00:00.000Z"),
      contentReviewedAt: new Date("2026-08-01T00:00:00.000Z"),
      qualityScore: 78,
      ...overrides,
    }),
  } as Listing;
}

describe("unambiguous dates", () => {
  it("spells the month out so 6 August is never read as 8 June", () => {
    expect(formatDirectoryDate("2026-08-06T00:00:00.000Z")).toBe("6 August 2026");
    expect(formatDirectoryDate(new Date("2026-01-02T00:00:00.000Z"))).toBe("2 January 2026");
  });

  it("returns nothing for a missing or unparseable value rather than 'Invalid Date'", () => {
    expect(formatDirectoryDate(undefined)).toBeUndefined();
    expect(formatDirectoryDate(null)).toBeUndefined();
    expect(formatDirectoryDate("not a date")).toBeUndefined();
    expect(toIsoDate("not a date")).toBeUndefined();
  });
});

describe("locality normalization", () => {
  it("strips postal artefacts that would otherwise display as a place name", () => {
    expect(stripPostalArtefacts("GPO: 8033, Thamel")).toBe("Thamel");
    expect(stripPostalArtefacts("P.O. Box 8975, Dillibazar")).toBe("Dillibazar");
    expect(stripPostalArtefacts("Post Box 1234")).toBe("");
    expect(displayAddress("Lazimpat, Kathmandu, P.O.Box 2340")).toBe("Lazimpat, Kathmandu");
  });

  it("leaves a real address untouched", () => {
    expect(displayAddress("Putalisadak Road, Ward 28, Kathmandu")).toBe(
      "Putalisadak Road, Ward 28, Kathmandu",
    );
  });

  it("falls through a postal-only neighbourhood to the next real place name", () => {
    const record = listing({ neighborhood: "GPO: 8033", municipality: "Kathmandu" });
    expect(displayLocality(record)).toBe("Kathmandu");
  });

  it("builds a locality trail without repeating the same place", () => {
    const record = listing({
      neighborhood: "Putalisadak",
      municipality: "Kathmandu",
      district: "Kathmandu",
      province: "Bagmati",
    });
    expect(localityTrail(record)).toEqual(["Putalisadak", "Kathmandu", "Bagmati"]);
  });
});

describe("business-specific links", () => {
  it("sends directions to the record's own coordinates when it has them", () => {
    const url = getDirectionsUrl(listing({ coordinates: { lat: 27.70169, lng: 85.3206 } }));
    expect(url).toContain("destination=27.70169%2C85.3206");
  });

  it("falls back to a name-and-address query rather than a generic map page", () => {
    const url = getDirectionsUrl(listing({ coordinates: undefined }));
    expect(url).toContain("Example%20Business");
    expect(url).toContain("Putalisadak");
  });

  it("only links a source a reader could actually open", () => {
    expect(getListingSourceUrl(listing())).toBe("https://example.org/batch/1");
    expect(getListingSourceUrl(listing({ sourceRef: "claim:internal-42" }))).toBeUndefined();
    expect(getListingSourceUrl(listing({ sourceRef: "osm", osmType: "node", osmId: 42 }))).toBe(
      "https://www.openstreetmap.org/node/42",
    );
  });
});

describe("description template detection", () => {
  const templated = [
    listing({
      slug: "abacus",
      name: "Abacus Computing",
      area: "Putalisadak",
      description:
        "Abacus Computing is an IT and software services company in Putalisadak delivering web development, software, networking and technical support.",
    }),
    listing({
      slug: "beta",
      name: "Beta Systems",
      area: "Baluwatar",
      description:
        "Beta Systems is an IT and software services company in Baluwatar delivering web development, software, networking and technical support.",
    }),
    listing({
      slug: "gamma",
      name: "Gamma Labs",
      area: "Naxal",
      description:
        "Gamma Labs publishes its founding year, its three named engineering certifications and the industries it has shipped projects for since 2014.",
    }),
  ];

  it("collapses name and locality so a shared template becomes visible", () => {
    expect(descriptionTemplateFingerprint(templated[0])).toBe(
      descriptionTemplateFingerprint(templated[1]),
    );
    expect(descriptionTemplateFingerprint(templated[2])).not.toBe(
      descriptionTemplateFingerprint(templated[0]),
    );
  });

  it("counts only the record whose facts are its own as distinctly described", () => {
    expect(selectDistinctlyDescribed(templated).map((item) => item.slug)).toEqual(["gamma"]);
  });

  it("ranks repeated templates for the rewrite queue", () => {
    const groups = summarizeDescriptionTemplates(templated);
    expect(groups).toHaveLength(1);
    expect(groups[0].records).toBe(2);
    expect(groups[0].sampleSlugs).toEqual(["abacus", "beta"]);
  });
});

describe("eligibility reporting", () => {
  it("attributes every failure to a reason, a city, a category and a source", () => {
    const report = buildEligibilityReport([
      listing({ slug: "ok" }),
      listing({ slug: "unreviewed", contentReviewedAt: null }),
      listing({ slug: "no-source", sourceRef: undefined, sourceCheckedAt: null }),
    ]);

    expect(report.counts.discovered).toBe(3);
    expect(report.counts.qualified).toBe(1);
    expect(report.qualificationRate).toBeCloseTo(1 / 3);

    const contentReview = report.failures.find((row) => row.reason === "CONTENT_NOT_REVIEWED");
    expect(contentReview?.records).toBe(1);
    expect(contentReview?.cities[0]).toEqual({ key: "kathmandu", records: 1 });
    expect(contentReview?.categories[0]).toEqual({ key: "restaurants", records: 1 });
    expect(contentReview?.sources[0]).toEqual({ key: "import", records: 1 });
  });

  it("separates records that a single fix would publish", () => {
    const report = buildEligibilityReport([
      listing({ slug: "one-fix", contentReviewedAt: null }),
      // Two independent failures: not a near miss.
      listing({ slug: "two-fixes", contentReviewedAt: null, phone: undefined, website: undefined }),
    ]);

    expect(report.nearMisses.map((record) => record.slug)).toEqual(["one-fix"]);
    const contentReview = report.failures.find((row) => row.reason === "CONTENT_NOT_REVIEWED");
    expect(contentReview?.records).toBe(2);
    expect(contentReview?.soleBlockerFor).toBe(1);
  });
});

describe("freshness scheduling", () => {
  const now = new Date("2026-08-06T00:00:00.000Z");

  it("treats a record checked within the primary interval as current", () => {
    const freshness = evaluateListingFreshness(
      listing({ sourceCheckedAt: new Date("2026-07-20T00:00:00.000Z") }),
      now,
    );
    expect(freshness.daysSinceCheck).toBe(17);
    expect(freshness.stale).toBe(false);
    expect(freshness.overdueFacts).toEqual([]);
  });

  it("flags the fastest-moving facts first as the record ages", () => {
    const freshness = evaluateListingFreshness(
      listing({ sourceCheckedAt: new Date("2026-05-01T00:00:00.000Z") }),
      now,
    );
    expect(freshness.stale).toBe(true);
    expect(freshness.overdueFacts.map((rule) => rule.factType)).toContain("openingHours");
    expect(freshness.overdueFacts.map((rule) => rule.factType)).not.toContain("address");
  });

  it("treats a never-checked record as stale in every fact type", () => {
    const freshness = evaluateListingFreshness(listing({ sourceCheckedAt: null }), now);
    expect(freshness.stale).toBe(true);
    expect(freshness.daysSinceCheck).toBeNull();
    expect(freshness.overdueFacts.length).toBeGreaterThan(0);
  });

  it("orders the re-check queue stalest first", () => {
    const queue = selectStaleListings(
      [
        listing({ slug: "recent", sourceCheckedAt: new Date("2026-07-20T00:00:00.000Z") }),
        listing({ slug: "old", sourceCheckedAt: new Date("2026-01-01T00:00:00.000Z") }),
        listing({ slug: "older", sourceCheckedAt: new Date("2025-06-01T00:00:00.000Z") }),
      ],
      now,
    );
    expect(queue.map((entry) => entry.listing.slug)).toEqual(["older", "old"]);
  });
});

describe("publication tiers", () => {
  it("keeps an unqualified record at tier 0", () => {
    expect(listingPublicationTier(listing({ contentReviewedAt: null })).tier).toBe(0);
  });

  it("publishes a source-checked record at tier 1 until it carries real evidence", () => {
    expect(listingPublicationTier(listing()).tier).toBe(1);
  });

  it("promotes an owner-maintained record with real media and detail to tier 3", () => {
    const record = listing({
      claimed: true,
      verificationStatus: "owner_verified",
      dataSource: "owner",
      image: "https://cdn.example.com/photos/example-business.jpg",
      imageVerified: true,
      coordinates: { lat: 27.70169, lng: 85.3206 },
      services: ["Dinner service", "Private events", "Takeaway"],
      hoursToday: "10:00 - 21:00",
    });
    expect(listingPublicationTier(record).tier).toBe(3);
  });
});

describe("priority cluster readiness", () => {
  it("names every cluster against a real city and category page", () => {
    for (const cluster of priorityClusters) {
      expect(getDirectoryCategory(cluster.categorySlug), cluster.categorySlug).toBeDefined();
      expect(getCityDirectoryPage(cluster.citySlug), cluster.citySlug).toBeDefined();
    }
  });

  it("blocks a cluster that has the count but not the evidence", () => {
    const members = Array.from({ length: 25 }, (_unused, index) =>
      listing({
        slug: `restaurant-${index}`,
        name: `Restaurant ${index}`,
        description:
          "This restaurant serves food in Kathmandu and its identity, category, location and contact details were reviewed against a recorded source before publication.",
      }),
    );
    const readiness = evaluateClusterReadiness(
      { citySlug: "kathmandu", categorySlug: "restaurants", minQualified: 25, extraRequirement: "Menu facts" },
      members,
    );

    expect(readiness.qualified).toBe(25);
    expect(readiness.ready).toBe(false);
    expect(readiness.blockers.join(" ")).toContain("verified image");
    expect(readiness.blockers.join(" ")).toContain("category template");
  });
});

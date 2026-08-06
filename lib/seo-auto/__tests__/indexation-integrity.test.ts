import { describe, expect, it } from "vitest";
import { siteUrl } from "@/lib/blog";
import { cityDirectoryPages } from "@/lib/city-pages";
import { directoryCategories } from "@/lib/directory-categories";
import {
  countQualifiedInCategory,
  countQualifiedInCity,
  meetsPublicationThreshold,
} from "@/lib/directory-counts";
import { makeNewListing, type Listing } from "@/lib/enrich";
import { getIndexableListings, isIndexableListing } from "@/lib/public-listings";
import { isIndexableRoute, robotsDisallowPaths } from "@/lib/seo-config";
import {
  buildListingLocalBusinessJsonLd,
  getCategorySitemapEntries,
  getListingSitemapEntries,
  getPageSitemapEntries,
} from "@/lib/seo-auto";

/**
 * Deployment guards for the indexation contract (audit sec. 23).
 *
 * The publication gate is only worth having if nothing can quietly route around it: a sitemap that
 * lists a noindex URL, a hub published below its threshold, a search-parameter page that becomes
 * a landing page, or business schema carrying a rating no visitor can see. Each of those is a
 * regression that ships silently and is expensive to unwind once crawled, so each gets a test.
 */
async function allPublishedEntries() {
  return [
    ...getPageSitemapEntries(),
    ...(await getCategorySitemapEntries()),
    ...(await getListingSitemapEntries()),
  ];
}

function pathnameOf(url: string): string {
  return new URL(url).pathname;
}

describe("sitemap and indexation integrity", () => {
  it("never lists a noindex or operational route in a sitemap", async () => {
    const offending = (await allPublishedEntries())
      .map((entry) => pathnameOf(entry.url))
      .filter((pathname) => !isIndexableRoute(pathname));

    expect(offending).toEqual([]);
  });

  it("only publishes absolute URLs on the canonical host", async () => {
    for (const entry of await allPublishedEntries()) {
      expect(entry.url.startsWith(`${siteUrl}/`) || entry.url === siteUrl).toBe(true);
      expect(new URL(entry.url).protocol).toBe("https:");
    }
  });

  it("keeps query-parameter URLs out of the sitemap so filters never become landing pages", async () => {
    const withQuery = (await allPublishedEntries()).filter((entry) => entry.url.includes("?"));
    expect(withQuery).toEqual([]);
  });

  it("publishes a listing URL only for a record that passes the publication gate", async () => {
    const qualified = await getIndexableListings();
    const qualifiedPaths = new Set(
      qualified.map((listing) => `/business/${encodeURIComponent(listing.slug)}`),
    );
    const entries = await getListingSitemapEntries();

    expect(entries).toHaveLength(qualified.length);
    for (const entry of entries) expect(qualifiedPaths.has(pathnameOf(entry.url))).toBe(true);
    for (const listing of qualified) expect(isIndexableListing(listing)).toBe(true);
  });

  it("publishes a city or category hub only once it clears the minimum qualified threshold", async () => {
    const qualified = await getIndexableListings();
    const published = new Set(
      (await getCategorySitemapEntries()).map((entry) => pathnameOf(entry.url)),
    );

    for (const city of cityDirectoryPages) {
      const meets = meetsPublicationThreshold(countQualifiedInCity(qualified, city.slug));
      expect(published.has(city.href)).toBe(meets);
    }

    for (const category of directoryCategories) {
      const meets = meetsPublicationThreshold(countQualifiedInCategory(qualified, category));
      expect(published.has(category.href)).toBe(meets);
    }
  });

  it("keeps rendering assets and public trust pages crawlable", () => {
    const mustStayCrawlable = [
      "/_next/",
      "/_next/static/chunks/main.js",
      "/icon.svg",
      "/nepali-directory-og.png",
      "/contact",
      "/about",
      "/directory-methodology",
      "/editorial-policy",
      "/attribution",
      // Crawlable on purpose: a crawler has to fetch /search to read its noindex directive.
      "/search",
    ];

    for (const pathname of mustStayCrawlable) {
      const blocked = robotsDisallowPaths.some(
        (rule) => pathname === rule || pathname.startsWith(rule),
      );
      expect(blocked, `${pathname} must not be blocked in robots.txt`).toBe(false);
    }
  });
});

describe("business structured data", () => {
  function listingWithLegacyAggregates(): Listing {
    return {
      id: 1,
      ...makeNewListing({
        name: "Legacy Aggregate Clinic",
        slug: "legacy-aggregate-clinic",
        area: "Kathmandu",
        address: "P.O. Box 8975, Dillibazar, Kathmandu",
        phone: "+977-1-5550190",
        categories: ["dentists"],
        description:
          "Legacy Aggregate Clinic is a dental record in Dillibazar whose identity, category and contact details were reviewed against a recorded source before publication.",
        // Imported columns that must never reach public markup without visible, first-party reviews.
        rating: 4.8,
        reviews: 214,
        verified: true,
        verificationStatus: "source_verified",
        dataSource: "import",
        sourceRef: "https://example.org/import-batch/12",
        sourceCheckedAt: new Date("2026-08-01T00:00:00.000Z"),
        contentReviewedAt: new Date("2026-08-01T00:00:00.000Z"),
        qualityScore: 78,
      }),
    } as Listing;
  }

  it("never emits a rating or review count that the profile does not display", () => {
    const json = JSON.stringify(
      buildListingLocalBusinessJsonLd(
        listingWithLegacyAggregates(),
        `${siteUrl}/business/legacy-aggregate-clinic`,
      ),
    );

    expect(json).not.toContain("aggregateRating");
    expect(json).not.toContain("ratingValue");
    expect(json).not.toContain("reviewCount");
    expect(json).not.toContain("4.8");
  });

  it("puts a place name in addressLocality rather than a postal box", () => {
    const schema = buildListingLocalBusinessJsonLd(
      listingWithLegacyAggregates(),
      `${siteUrl}/business/legacy-aggregate-clinic`,
    );

    expect(schema.address.streetAddress).toBe("Dillibazar, Kathmandu");
    expect(schema.address.addressLocality).not.toMatch(/box/i);
    expect(schema.address.addressLocality).toBe("Kathmandu");
  });
});

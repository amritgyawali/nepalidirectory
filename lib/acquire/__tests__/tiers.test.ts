/**
 * Acquisition tiers: OSM import (>=3 districts, idempotent), geography, Google Places on-demand,
 * the polite crawler, CSV import, claims, and onboarding-from-URL. Zero external calls.
 */
import { describe, it, expect } from "vitest";
import type { FetchFn } from "../../ai-core";
import { InMemoryListingRepository, makeNewListing } from "../../enrich";
import {
  createAcquisitionRuntime,
  GeographyResolver,
  SAMPLE_OSM_ELEMENTS,
  PlacesClient,
  Crawler,
  InMemoryCrawlCacheRepository,
  importCsvDryRun,
  importCsvCommit,
  onboardingFromUrl,
} from "../index";

function respond(body: unknown, status = 200): Response {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  return new Response(payload, { status, headers: { "content-type": "application/json" } });
}

describe("GeographyResolver (point-in-polygon)", () => {
  const geo = new GeographyResolver();
  it("resolves points to the right district", () => {
    expect(geo.resolve({ lat: 27.7108, lng: 85.3169 })?.district).toBe("Kathmandu");
    expect(geo.resolve({ lat: 27.665, lng: 85.325 })?.district).toBe("Lalitpur");
    expect(geo.resolve({ lat: 27.671, lng: 85.428 })?.district).toBe("Bhaktapur");
    expect(geo.resolve({ lat: 28.2096, lng: 83.956 })?.district).toBe("Kaski");
  });
  it("returns null outside known boundaries", () => {
    expect(geo.resolve({ lat: 0, lng: 0 })).toBeNull();
  });
});

describe("OSM importer (Tier 1)", () => {
  it("imports named commercial POIs across >=3 districts with ODbL provenance", async () => {
    const rt = createAcquisitionRuntime({ listings: new InMemoryListingRepository([]) });
    const res = await rt.osmImporter.import(SAMPLE_OSM_ELEMENTS);

    expect(res.skipped).toBe(2); // one unnamed, one non-commercial
    expect(res.imported).toBe(8);
    expect(res.inserted).toBe(8);

    const all = await rt.listings.all();
    const districts = new Set(all.map((l) => l.district).filter(Boolean));
    expect(districts.size).toBeGreaterThanOrEqual(3);
    expect(all.every((l) => l.dataSource === "osm" && l.licenseNote === "ODbL")).toBe(true);
    expect(all.every((l) => l.municipality)).toBe(true); // resolved to at least district+municipality
  });

  it("is idempotent on re-run (upsert by osm natural key)", async () => {
    const rt = createAcquisitionRuntime({ listings: new InMemoryListingRepository([]) });
    await rt.osmImporter.import(SAMPLE_OSM_ELEMENTS);
    const res2 = await rt.osmImporter.import(SAMPLE_OSM_ELEMENTS);
    expect(res2.updated).toBe(8);
    expect(res2.inserted).toBe(0);
    expect(await rt.listings.all()).toHaveLength(8);
  });
});

describe("Google Places on-demand client (Tier 2)", () => {
  const fetchFn = ((input: RequestInfo | URL) => {
    const u = String(input);
    if (u.includes("findplacefromtext")) {
      return Promise.resolve(
        respond({ candidates: [{ place_id: "PID1", name: "Newa Lahana", formatted_address: "Patan" }] }),
      );
    }
    if (u.includes("details")) {
      return Promise.resolve(
        respond({
          result: {
            name: "Newa Lahana",
            formatted_phone_number: "01-5540000",
            website: "https://x.example",
            opening_hours: { weekday_text: ["Mo-Su 10:00-21:00"] },
          },
        }),
      );
    }
    return Promise.resolve(respond({}, 404));
  }) as FetchFn;

  it("finds a place for a claim and spot-checks details", async () => {
    const places = new PlacesClient({ apiKey: "k", fetchFn });
    const match = await places.findPlaceForClaim({ phone: "01-5540000" });
    expect(match?.placeId).toBe("PID1");
    const details = await places.adminSpotCheck("PID1");
    expect(details.phone).toBe("01-5540000");
    expect(details.openingHours).toEqual(["Mo-Su 10:00-21:00"]);
  });

  it("exposes ONLY the two on-demand methods (HARD RULE 1)", () => {
    const names = Object.getOwnPropertyNames(PlacesClient.prototype).filter((n) => n !== "constructor");
    expect(names.sort()).toEqual(["adminSpotCheck", "findPlaceForClaim"]);
  });
});

describe("Crawler (Tier 4)", () => {
  const html =
    '<html><body><h1>Acme Hardware</h1><p>We sell tools.</p>' +
    '<script type="application/ld+json">{"@type":"LocalBusiness","telephone":"01-1"}</script></body></html>';
  const fetchFn = ((input: RequestInfo | URL) => {
    const u = String(input);
    if (u.endsWith("/robots.txt")) return Promise.resolve(respond("User-agent: *\nDisallow: /private\n", 200));
    return Promise.resolve(respond(html, 200));
  }) as FetchFn;

  it("respects robots, extracts text + JSON-LD, and caches", async () => {
    const crawler = new Crawler({
      cache: new InMemoryCrawlCacheRepository(),
      fetchFn,
      now: () => 0,
      sleep: async () => {},
    });

    const r = await crawler.fetchListingUrl("https://acme.example/about");
    expect(r.allowedByRobots).toBe(true);
    expect(r.fromCache).toBe(false);
    expect(r.text).toContain("Acme Hardware");
    expect(r.jsonLd).toHaveLength(1);

    const r2 = await crawler.fetchListingUrl("https://acme.example/about");
    expect(r2.fromCache).toBe(true);

    const blocked = await crawler.fetchListingUrl("https://acme.example/private/x");
    expect(blocked.allowedByRobots).toBe(false);
    expect(blocked.html).toBe("");
  });
});

describe("CSV import (Tier 5)", () => {
  const csv =
    "name,city,address,phone,category\n" +
    "Acme Cafe,Kathmandu,Thamel,01-1,cafes\n" +
    'Beta Hardware,Lalitpur,"Pulchowk, Rd",01-2,hardware-store\n';
  const mapping = { name: "name", area: "city", address: "address", phone: "phone", category: "category" };

  it("dry-runs without writing", () => {
    const dry = importCsvDryRun(csv, mapping, "batch-1");
    expect(dry.total).toBe(2);
    expect(dry.errors).toHaveLength(0);
    expect(dry.candidates[0].dataSource).toBe("import");
    expect(dry.candidates[1].address).toBe("Pulchowk, Rd"); // quoted comma preserved
  });

  it("commits through the dedup pipeline", async () => {
    const rt = createAcquisitionRuntime({ listings: new InMemoryListingRepository([]) });
    const result = await importCsvCommit(csv, mapping, "batch-1", rt.service);
    expect(result.imported).toBe(2);
    expect(await rt.listings.all()).toHaveLength(2);
  });
});

describe("Claims (Tier 3)", () => {
  it("verifies an OTP claim and marks the listing claimed", async () => {
    const rt = createAcquisitionRuntime({ listings: new InMemoryListingRepository([]) });
    const listing = await rt.listings.insert(
      makeNewListing({ name: "X Cafe", area: "Kathmandu", address: "A", categories: ["cafes"] }),
    );

    const claim = await rt.claims.createClaim({ listingId: listing.id, method: "otp", contact: "9812345678" });
    const code = claim.otp ?? "";
    expect(code).not.toBe("");
    expect((await rt.listings.get(listing.id))?.claimStatus).toBe("pending");

    expect((await rt.claims.verifyOtp(claim.id, "000000")).verified).toBe(false);
    expect((await rt.claims.verifyOtp(claim.id, code)).verified).toBe(true);

    const claimed = await rt.listings.get(listing.id);
    expect(claimed?.claimed).toBe(true);
    expect(claimed?.claimStatus).toBe("claimed");
  });
});

describe("Onboarding from URL (Tier 3)", () => {
  const html = "<html><body><h1>Owner Site</h1></body></html>";
  const fetchFn = ((input: RequestInfo | URL) => {
    const u = String(input);
    if (u.endsWith("/robots.txt")) return Promise.resolve(respond("User-agent: *\nAllow: /\n", 200));
    return Promise.resolve(respond(html, 200));
  }) as FetchFn;

  it("crawls the owner URL and extracts a draft via the mock", async () => {
    const rt = createAcquisitionRuntime({ listings: new InMemoryListingRepository([]), fetchFn });
    const draft = await onboardingFromUrl("https://biz.example/", {
      crawler: rt.crawler,
      prompts: rt.prompts,
      providers: rt.providers,
      siteName: rt.config.siteName,
    });
    expect(draft.allowed).toBe(true);
    expect(draft.services).toEqual(["mock-service"]);
    expect(draft.attributes).toMatchObject({ delivery: true });
  });
});

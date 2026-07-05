/**
 * Entity resolution / dedup (prompt sec. 6.6): similarity primitives, the three-band ingest
 * decision on planted duplicates, and the MERGE_ADJUDICATE handler. Zero external calls (mock).
 */
import { describe, it, expect } from "vitest";
import { InMemoryListingRepository, makeNewListing, type Listing } from "../../enrich";
import { createAcquisitionRuntime } from "../index";
import {
  normalizePhone,
  trigramSimilarity,
  haversineMeters,
  geohash,
} from "../index";

function seed(partial: Partial<Listing> & { name: string; area: string; address: string }, id: number): Listing {
  return { ...makeNewListing(partial), id };
}

describe("similarity primitives", () => {
  it("normalizes Nepal phone numbers to a comparable form", () => {
    expect(normalizePhone("+977 1-5540000")).toBe("15540000");
    expect(normalizePhone("01-5540000")).toBe("15540000");
    expect(normalizePhone("9779812345678")).toBe("9812345678");
  });

  it("computes trigram similarity", () => {
    expect(trigramSimilarity("Newa Lahana", "Newa Lahana")).toBe(1);
    expect(trigramSimilarity("Newa Lahana", "Everest Trekking")).toBeLessThan(0.2);
  });

  it("computes distance and geohash", () => {
    expect(haversineMeters({ lat: 27.66, lng: 85.33 }, { lat: 27.66, lng: 85.33 })).toBe(0);
    expect(geohash(27.7108, 85.3169)).toBe(geohash(27.7108, 85.3169));
  });
});

describe("AcquisitionService dedup bands (planted duplicates)", () => {
  const base = {
    name: "Newa Lahana",
    area: "Lalitpur",
    address: "Mangal Bazaar",
    phone: "+977 1-5540000",
    coordinates: { lat: 27.66, lng: 85.33 },
    categories: ["restaurants"],
  };

  it("auto-merges an exact duplicate (score >= 0.90)", async () => {
    const listings = new InMemoryListingRepository([seed(base, 1)]);
    const rt = createAcquisitionRuntime({ listings });

    const res = await rt.service.ingest(
      makeNewListing({ ...base }), // identical name/phone/coords/category
    );
    expect(res.action).toBe("merged");
    expect(res.listingId).toBe(1);
    expect(res.score).toBeGreaterThanOrEqual(0.9);

    const all = await rt.listings.all();
    expect(all).toHaveLength(1); // no new row
    expect((all[0].mergedFrom ?? []).length).toBe(1); // reversible snapshot kept
  });

  it("queues a near-duplicate for adjudication (0.65–0.90) and the AI verdict lands", async () => {
    const listings = new InMemoryListingRepository([seed(base, 1)]);
    const rt = createAcquisitionRuntime({ listings });

    const res = await rt.service.ingest(
      makeNewListing({ ...base, name: "Newa Lahana Restaurant" }),
    );
    expect(res.action).toBe("candidate");
    expect(res.score).toBeGreaterThanOrEqual(0.65);
    expect(res.score).toBeLessThan(0.9);
    expect(await rt.listings.all()).toHaveLength(2); // inserted, flagged

    const candidates = await rt.mergeCandidates.list();
    expect(candidates).toHaveLength(1);

    // The ingest enqueued a MERGE_ADJUDICATE job; run it.
    const job = await rt.worker.runOnce();
    expect(job?.type).toBe("MERGE_ADJUDICATE");
    expect(job?.status).toBe("DONE");
    const decided = await rt.mergeCandidates.get(candidates[0].id);
    expect(decided?.aiVerdict).toBe("same"); // mock canned verdict
    expect(decided?.decision).toBe("pending"); // human still decides (HARD RULE 10)
  });

  it("treats an unrelated business as distinct (< 0.65)", async () => {
    const listings = new InMemoryListingRepository([seed(base, 1)]);
    const rt = createAcquisitionRuntime({ listings });

    const res = await rt.service.ingest(
      makeNewListing({
        name: "Everest Trekking Agency",
        area: "Pokhara",
        address: "Lakeside",
        phone: "061-123456",
        coordinates: { lat: 28.21, lng: 83.96 },
        categories: ["travel-agencies"],
      }),
    );
    expect(res.action).toBe("inserted");
    expect(await rt.listings.all()).toHaveLength(2);
    expect(await rt.mergeCandidates.list()).toHaveLength(0);
  });
});

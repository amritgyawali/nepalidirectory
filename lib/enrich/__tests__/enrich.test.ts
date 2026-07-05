/**
 * Phase 1 acceptance (prompt §17): existing listings gain descriptions/FAQ/meta/embeddings via
 * the ENRICH_LISTING + EMBED_LISTING jobs, run against the MockAiProvider — zero external calls.
 * Also covers quality_score, the owner-never-overwritten rule, and the daily-capped sweep.
 */
import { describe, it, expect } from "vitest";
import {
  createEnrichmentRuntime,
  enqueueEnrichmentSweep,
  computeQualityScore,
  buildEmbeddingText,
  InMemoryListingRepository,
  type Listing,
} from "../index";

function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: 1,
    slug: "s",
    name: "Test",
    categories: ["restaurants"],
    area: "Kathmandu",
    address: "Somewhere",
    photosCount: 0,
    claimed: false,
    verified: false,
    amenities: [],
    tags: [],
    faqs: [],
    attributes: {},
    qualityScore: 0,
    aiEnrichedAt: null,
    dataSource: "user",
    ...overrides,
  };
}

describe("computeQualityScore (§6.7)", () => {
  it("scores a fully-complete listing at 100", () => {
    const full = makeListing({
      coordinates: { lat: 27.7, lng: 85.3 },
      phone: "+9771234567",
      hoursToday: "9am–6pm",
      description: "A complete description.",
      website: "https://x.test",
      photosCount: 3,
      claimed: true,
    });
    expect(computeQualityScore(full)).toBe(100);
  });

  it("omits weights for missing fields", () => {
    // name(10) + category(10) only
    expect(computeQualityScore(makeListing())).toBe(20);
  });
});

describe("ENRICH_LISTING + EMBED_LISTING end-to-end", () => {
  it("enriches a real seeded listing and embeds it", async () => {
    const rt = createEnrichmentRuntime();
    const before = await rt.listings.get(1);
    expect(before).not.toBeNull();
    expect(before?.description).toBeUndefined();
    const baseline = before!.qualityScore;

    await rt.repo.enqueue({ type: "ENRICH_LISTING", payload: { listingId: 1 } });
    const enrichJob = await rt.worker.runOnce();
    expect(enrichJob?.type).toBe("ENRICH_LISTING");
    expect(enrichJob?.status).toBe("DONE");

    const after = await rt.listings.get(1);
    expect(after?.descriptionSource).toBe("ai_v1");
    expect((after?.description ?? "").length).toBeGreaterThan(0);
    expect(after?.aiEnrichedAt).toBeTruthy();
    expect(after?.metaTitle).toBeTruthy();
    expect(after?.metaDescription).toBeTruthy();
    expect(after?.faqs.length).toBeGreaterThan(0);
    expect(after!.qualityScore).toBeGreaterThan(baseline); // description adds weight
    // mock canned confidence is 0.5 (<0.6) → category kept, flagged for review (§7)
    expect(after?.needsCategoryReview).toBe(true);

    // The ENRICH job enqueued a follow-up EMBED job.
    const embedJob = await rt.worker.runOnce();
    expect(embedJob?.type).toBe("EMBED_LISTING");
    expect(embedJob?.status).toBe("DONE");
    const emb = await rt.embeddings.get(1);
    expect(emb?.embedding.length).toBe(768);

    // Usage was logged (feeds the admin Spend page).
    expect((await rt.usage.all()).length).toBeGreaterThan(0);
  });

  it("never overwrites an owner-authored description (§7 / §20.3)", async () => {
    const owner = makeListing({ id: 99, description: "Hand written by the owner.", descriptionSource: "owner" });
    const listings = new InMemoryListingRepository([owner]);
    const rt = createEnrichmentRuntime({ listings });

    await rt.repo.enqueue({ type: "ENRICH_LISTING", payload: { listingId: 99 } });
    const job = await rt.worker.runOnce();
    expect(job?.status).toBe("DONE");
    expect(job?.result).toMatchObject({ skipped: "owner" });

    const after = await listings.get(99);
    expect(after?.description).toBe("Hand written by the owner.");
    expect(after?.descriptionSource).toBe("owner");
  });
});

describe("nightly sweep (§7, ENRICH_DAILY_CAP)", () => {
  it("enqueues up to the cap and processes enrich→embed for each", async () => {
    const rt = createEnrichmentRuntime();
    const total = (await rt.listings.all()).length;
    const cap = 3;

    const enqueued = await enqueueEnrichmentSweep(rt.repo, rt.listings, cap);
    expect(enqueued).toBe(Math.min(cap, total));

    let processed = 0;
    while (await rt.worker.runOnce()) processed += 1;
    expect(processed).toBe(enqueued * 2); // each ENRICH_LISTING spawns one EMBED_LISTING

    for (let id = 1; id <= enqueued; id++) {
      expect((await rt.listings.get(id))?.descriptionSource).toBe("ai_v1");
      expect((await rt.embeddings.get(id))?.embedding.length).toBe(768);
    }
  });
});

describe("buildEmbeddingText (§7)", () => {
  it("includes name, category, and locality", () => {
    const l = makeListing({ neighborhood: "Patan", tags: ["momo"], description: "desc" });
    const text = buildEmbeddingText(l);
    expect(text).toContain("Test");
    expect(text).toContain("restaurants");
    expect(text).toContain("Patan");
  });
});

/**
 * Semantic search + AI concierge (prompt Module E, §9): NL query parser fast path (incl.
 * romanized Nepali), hybrid retrieval ranking, and the concierge's grounding guarantee — it must
 * never "recommend" a business absent from the search tool's own output, proven with both a
 * matching and a zero-result query. Zero external calls (MockAiProvider only).
 */
import { describe, it, expect } from "vitest";
import { InMemoryListingRepository, makeNewListing } from "../../enrich";
import { parseQueryFastPath, parseQuery } from "../nl-query";
import { hybridSearch } from "../search";
import { createDiscoverRuntime } from "../runtime";
import { ZERO_RESULT_MESSAGE } from "../concierge";
import { SEED_CATEGORY_SYNONYMS } from "../synonyms/seed";

const TAXONOMY = ["restaurants", "cafes-bistros", "plumbers", "electricians"];
const KNOWN_PLACES = ["Lazimpat", "Thamel", "Boudha"];

describe("NL query parser fast path (prompt §9.2)", () => {
  it("resolves category + location without calling the AI, incl. romanized Nepali", () => {
    const result = parseQueryFastPath("chiya pasal thamel", {
      taxonomy: TAXONOMY,
      synonyms: SEED_CATEGORY_SYNONYMS,
      knownPlaces: KNOWN_PLACES,
    });
    expect(result).not.toBeNull();
    expect(result?.categoryHint).toBe("cafes-bistros");
    expect(result?.location.area).toBe("Thamel");
    expect(result?.language).toBe("romanized_ne");
    expect(result?.fastPath).toBe(true);
  });

  it("resolves a plain-English category + location query too", () => {
    const result = parseQueryFastPath("restaurants in lazimpat", {
      taxonomy: TAXONOMY,
      synonyms: SEED_CATEGORY_SYNONYMS,
      knownPlaces: KNOWN_PLACES,
    });
    expect(result?.categoryHint).toBe("restaurants");
    expect(result?.location.area).toBe("Lazimpat");
    expect(result?.language).toBe("en");
  });

  it("returns null (needs AI) when category or location is missing", () => {
    expect(
      parseQueryFastPath("good service", { taxonomy: TAXONOMY, synonyms: SEED_CATEGORY_SYNONYMS, knownPlaces: KNOWN_PLACES }),
    ).toBeNull();
    expect(
      parseQueryFastPath("restaurants somewhere unknown", {
        taxonomy: TAXONOMY,
        synonyms: SEED_CATEGORY_SYNONYMS,
        knownPlaces: KNOWN_PLACES,
      }),
    ).toBeNull();
  });
});

describe("hybridSearch (prompt §9.1)", () => {
  it("filters by category and ranks the closer embedding match first", async () => {
    const listings = new InMemoryListingRepository([]);
    const a = await listings.insert(
      makeNewListing({ name: "Momo House", area: "Thamel", address: "A", categories: ["restaurants"] }),
    );
    const b = await listings.insert(
      makeNewListing({ name: "Pipe Fix Co", area: "Thamel", address: "B", categories: ["plumbers"] }),
    );
    const c = await listings.insert(
      makeNewListing({ name: "Momo Corner", area: "Thamel", address: "C", categories: ["restaurants"] }),
    );

    const embeddings = new Map<number, number[]>([
      [a.id, [1, 0, 0]],
      [b.id, [0, 1, 0]],
      [c.id, [0.9, 0.1, 0]],
    ]);
    const embedRepo = {
      async get(id: number) {
        const e = embeddings.get(id);
        return e ? { embedding: e, model: "test" } : null;
      },
      async set() {},
      size: () => embeddings.size,
    };

    const parsed = parseQueryFastPath("restaurants in thamel", {
      taxonomy: TAXONOMY,
      synonyms: SEED_CATEGORY_SYNONYMS,
      knownPlaces: KNOWN_PLACES,
    })!;

    const results = await hybridSearch("momo", parsed, {
      listings,
      embeddings: embedRepo,
      embed: async () => [1, 0, 0], // closest to `a`
    });

    expect(results.map((r) => r.listing.id)).not.toContain(b.id); // wrong category, excluded
    expect(results[0].listing.id).toBe(a.id); // best cosine match ranks first
  });
});

describe("AI concierge grounding (prompt §9.3)", () => {
  it("recommends only listings the search tool actually returned", async () => {
    const rt = createDiscoverRuntime({ listings: new InMemoryListingRepository([]) });
    const listing = await rt.listings.insert(
      makeNewListing({ name: "Thamel Momo House", area: "Thamel", address: "JP Marg", categories: ["restaurants"] }),
    );

    const reply = await rt.concierge("session-1", "restaurants in thamel");

    expect(reply.demandSignalRecorded).toBe(false);
    expect(reply.listings.length).toBeGreaterThan(0);
    expect(reply.listings.every((l) => l.id === listing.id)).toBe(true);
  });

  it("never invents a business for a query with no supply — logs a demand signal instead", async () => {
    const rt = createDiscoverRuntime({ listings: new InMemoryListingRepository([]) });
    await rt.listings.insert(
      makeNewListing({ name: "Thamel Momo House", area: "Thamel", address: "JP Marg", categories: ["restaurants"] }),
    );

    const reply = await rt.concierge("session-2", "helicopter repair in a place that does not exist");

    expect(reply.listings).toHaveLength(0);
    expect(reply.message).toBe(ZERO_RESULT_MESSAGE);
    expect(reply.demandSignalRecorded).toBe(true);

    const signals = await rt.demandSignals.list();
    expect(signals).toHaveLength(1);
    expect(signals[0].query).toContain("helicopter repair");
  });
});

describe("NL query parser AI fallback (prompt §9.2)", () => {
  it("calls NL_QUERY_PARSER_V1 (mock) when the fast path can't resolve category+location", async () => {
    const rt = createDiscoverRuntime({ listings: new InMemoryListingRepository([]) });
    const parsed = await parseQuery("good service please", {
      taxonomy: rt.taxonomy,
      synonyms: await rt.categorySynonyms.all(),
      knownPlaces: await rt.knownPlaces(),
      prompts: rt.prompts,
      providers: rt.providers,
    });
    expect(parsed.fastPath).toBe(false);
    expect(parsed.intent).toBe("find_business"); // MockAiProvider's canned NL_QUERY_PARSER_V1
  });
});

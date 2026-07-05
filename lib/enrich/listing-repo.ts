/**
 * In-memory ListingRepository + a seeder that maps the static `lib/data.ts` businesses into
 * `Listing` records (Phase 1 has no DB — see docs/PHASE0_AUDIT.md). This is what "run enrichment
 * on existing listings" (prompt §17 Phase 1 acceptance) operates on.
 */
import { businesses, type Business } from "../data";
import type { EmbeddingRepository, Listing, ListingRepository, NewListing } from "./types";
import { computeQualityScore } from "./quality";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Map one static Business into a Listing (pre-enrichment, with a baseline quality score). */
export function businessToListing(b: Business, id: number): Listing {
  const listing: Listing = {
    id,
    slug: b.slug,
    name: b.name,
    categories: b.categories.map(slugify),
    area: b.area,
    neighborhood: b.neighborhood,
    address: b.address,
    phone: b.phone,
    website: b.website,
    hoursToday: b.hoursToday,
    photosCount: b.image ? 1 : 0,
    coordinates: b.coordinates,
    claimed: Boolean(b.claimed),
    verified: Boolean(b.verified),
    services: b.services,
    amenities: b.amenities ?? [],
    description: undefined,
    descriptionSource: undefined,
    tags: [],
    faqs: (b.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
    attributes: {},
    qualityScore: 0,
    aiEnrichedAt: null,
    dataSource: "user",
  };
  listing.qualityScore = computeQualityScore(listing);
  return listing;
}

/** Seed Listings from the bundled demo dataset. */
export function seedListingsFromData(): Listing[] {
  return businesses.map((b, i) => businessToListing(b, i + 1));
}

/**
 * Build a NewListing (no id) with sensible defaults, filling required fields. Used by the
 * acquisition importers (OSM, CSV, onboarding) which produce partial records.
 */
export function makeNewListing(
  partial: Partial<Listing> & { name: string; area: string; address: string },
): NewListing {
  const base: NewListing = {
    slug: partial.slug ?? slugify(partial.name),
    name: partial.name,
    categories: partial.categories ?? ["uncategorized"],
    area: partial.area,
    neighborhood: partial.neighborhood,
    address: partial.address,
    phone: partial.phone,
    website: partial.website,
    hoursToday: partial.hoursToday,
    photosCount: partial.photosCount ?? 0,
    coordinates: partial.coordinates,
    claimed: partial.claimed ?? false,
    verified: partial.verified ?? false,
    services: partial.services,
    amenities: partial.amenities ?? [],
    description: partial.description,
    descriptionSource: partial.descriptionSource,
    metaTitle: partial.metaTitle,
    metaDescription: partial.metaDescription,
    tags: partial.tags ?? [],
    faqs: partial.faqs ?? [],
    attributes: partial.attributes ?? {},
    categoryConfidence: partial.categoryConfidence,
    needsCategoryReview: partial.needsCategoryReview,
    qualityScore: 0,
    aiEnrichedAt: partial.aiEnrichedAt ?? null,
    dataSource: partial.dataSource ?? "user",
    sourceRef: partial.sourceRef,
    licenseNote: partial.licenseNote,
    osmType: partial.osmType,
    osmId: partial.osmId,
    googlePlaceId: partial.googlePlaceId,
    claimStatus: partial.claimStatus ?? "unclaimed",
    province: partial.province,
    district: partial.district,
    municipality: partial.municipality,
    ward: partial.ward,
    mergedFrom: partial.mergedFrom,
  };
  base.qualityScore = computeQualityScore({ ...base, id: 0 });
  return base;
}

export class InMemoryListingRepository implements ListingRepository {
  private readonly map = new Map<number, Listing>();
  private seq = 0;

  constructor(seed: Listing[] = seedListingsFromData()) {
    for (const l of seed) {
      this.map.set(l.id, l);
      this.seq = Math.max(this.seq, l.id);
    }
  }

  async insert(listing: NewListing): Promise<Listing> {
    const created: Listing = { ...structuredClone(listing), id: ++this.seq };
    this.map.set(created.id, created);
    return structuredClone(created);
  }

  async remove(id: number): Promise<void> {
    this.map.delete(id);
  }

  async upsertByOsm(
    osmType: string,
    osmId: number,
    make: () => NewListing,
  ): Promise<{ listing: Listing; created: boolean }> {
    const existing = [...this.map.values()].find(
      (l) => l.osmType === osmType && l.osmId === osmId,
    );
    if (existing) {
      const updated: Listing = { ...structuredClone(make()), id: existing.id };
      this.map.set(existing.id, updated);
      return { listing: structuredClone(updated), created: false };
    }
    return { listing: await this.insert(make()), created: true };
  }

  async get(id: number): Promise<Listing | null> {
    const l = this.map.get(id);
    return l ? structuredClone(l) : null;
  }

  async update(listing: Listing): Promise<void> {
    this.map.set(listing.id, structuredClone(listing));
  }

  async all(): Promise<Listing[]> {
    return [...this.map.values()].map((l) => structuredClone(l));
  }

  async needingEnrichment(limit: number): Promise<Listing[]> {
    return [...this.map.values()]
      .filter((l) => l.aiEnrichedAt == null && l.descriptionSource !== "owner")
      .sort((a, b) => a.id - b.id)
      .slice(0, Math.max(0, limit))
      .map((l) => structuredClone(l));
  }
}

export class InMemoryEmbeddingRepository implements EmbeddingRepository {
  private readonly map = new Map<number, { embedding: number[]; model: string }>();

  async set(listingId: number, embedding: number[], model: string): Promise<void> {
    this.map.set(listingId, { embedding: [...embedding], model });
  }

  async get(listingId: number): Promise<{ embedding: number[]; model: string } | null> {
    const e = this.map.get(listingId);
    return e ? { embedding: [...e.embedding], model: e.model } : null;
  }

  size(): number {
    return this.map.size;
  }
}

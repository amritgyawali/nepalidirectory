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
    email: b.email,
    hoursToday: b.hoursToday,
    rating: b.rating,
    reviews: b.reviews,
    price: b.price,
    status: b.status,
    image: b.image,
    photosCount: b.image ? 1 : 0,
    coordinates: b.coordinates,
    claimed: Boolean(b.claimed),
    verified: Boolean(b.verified),
    active: true,
    services: b.services,
    amenities: b.amenities ?? [],
    description: undefined,
    descriptionSource: undefined,
    descriptionNe: undefined,
    descriptionNeUpdatedAt: null,
    tags: [],
    faqs: (b.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
    attributes: {},
    qualityScore: 0,
    aiEnrichedAt: null,
    dataSource: "demo",
    createdAt: new Date("2026-06-28T00:00:00.000Z"),
    updatedAt: new Date("2026-06-28T00:00:00.000Z"),
  };
  listing.qualityScore = computeQualityScore(listing);
  return listing;
}

/** Seed Listings from the bundled demo dataset. */
export function seedListingsFromData(): Listing[] {
  return businesses.map((b, i) => businessToListing(b, i + 1));
}

/**
 * Round to 5 decimal places (~1.1m accuracy, Google's recommended minimum for local business
 * geo coordinates) so no import/entry path can silently carry lower-precision coordinates
 * (e.g. the 3-4 decimal / ~11m-accuracy values found in the bundled demo dataset) into
 * production listing data.
 */
function enforceGeoPrecision(
  coordinates: { lat: number; lng: number } | undefined,
): { lat: number; lng: number } | undefined {
  if (!coordinates) return coordinates;
  const round5 = (value: number) => Math.round(value * 1e5) / 1e5;
  return { lat: round5(coordinates.lat), lng: round5(coordinates.lng) };
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
    email: partial.email,
    hoursToday: partial.hoursToday,
    rating: partial.rating,
    reviews: partial.reviews,
    price: partial.price,
    status: partial.status,
    image: partial.image,
    photosCount: partial.photosCount ?? 0,
    coordinates: enforceGeoPrecision(partial.coordinates),
    claimed: partial.claimed ?? false,
    verified: partial.verified ?? false,
    active: partial.active ?? true,
    services: partial.services,
    amenities: partial.amenities ?? [],
    description: partial.description,
    descriptionSource: partial.descriptionSource,
    descriptionNe: partial.descriptionNe,
    descriptionNeUpdatedAt: partial.descriptionNeUpdatedAt ?? null,
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
    createdAt: partial.createdAt ?? null,
    updatedAt: partial.updatedAt ?? null,
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

  async getBySlug(slug: string): Promise<Listing | null> {
    const listing = [...this.map.values()].find((item) => item.slug === slug);
    return listing ? structuredClone(listing) : null;
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

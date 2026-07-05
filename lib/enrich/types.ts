/**
 * Enrichment domain (prompt Module C, §7). A `Listing` is the normalized business record the
 * pipeline reads/writes — it carries the §13 provenance/enrichment columns on top of the base
 * business fields. In Phase 1 listings live in an in-memory repo seeded from `lib/data.ts`; the
 * same interface backs Postgres once the DB exists.
 */

export type ListingFaq = { question: string; answer: string };

export type Listing = {
  id: number;
  slug: string;
  name: string;
  /** Category slugs; first is primary. */
  categories: string[];
  area: string;
  neighborhood?: string;
  address: string;
  phone?: string;
  website?: string;
  hoursToday?: string;
  photosCount: number;
  coordinates?: { lat: number; lng: number };
  claimed: boolean;
  verified: boolean;
  services?: string[];
  amenities: string[];

  // --- enrichment / provenance (§7, §13) ---
  description?: string;
  descriptionSource?: string; // 'owner' | 'ai_v1' | ...  (owner is never overwritten)
  /** Nepali translation of `description` (prompt sec. 10/11, job TRANSLATE_NE). Drives hreflang. */
  descriptionNe?: string;
  descriptionNeUpdatedAt?: Date | null;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  faqs: ListingFaq[];
  attributes: Record<string, unknown>;
  categoryConfidence?: number;
  needsCategoryReview?: boolean;
  qualityScore: number;
  aiEnrichedAt?: Date | null;
  dataSource: string; // osm|owner|user|crawler|import|google_ondemand_reviewed

  // --- acquisition provenance + geography (prompt sec. 6, sec. 13) ---
  sourceRef?: string;
  licenseNote?: string; // e.g. 'ODbL' for OSM rows
  osmType?: string; // node|way|relation
  osmId?: number;
  googlePlaceId?: string;
  claimStatus?: string; // unclaimed|pending|claimed
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  /** Reversible-merge snapshots of records merged into this one (prompt sec. 6.6). */
  mergedFrom?: unknown[];
};

/** A listing prior to persistence (no id yet). */
export type NewListing = Omit<Listing, "id">;

export interface ListingRepository {
  get(id: number): Promise<Listing | null>;
  update(listing: Listing): Promise<void>;
  all(): Promise<Listing[]>;
  /** Insert a new listing, assigning an id. */
  insert(listing: NewListing): Promise<Listing>;
  /** Remove a listing (used when auto-merging duplicates, prompt sec. 6.6). */
  remove(id: number): Promise<void>;
  /** Upsert on the OSM natural key so monthly re-imports are idempotent (prompt sec. 6.1). */
  upsertByOsm(
    osmType: string,
    osmId: number,
    make: () => NewListing,
  ): Promise<{ listing: Listing; created: boolean }>;
  /** Listings eligible for the nightly enrichment sweep (sec. 7): never enriched, not owner-authored. */
  needingEnrichment(limit: number): Promise<Listing[]>;
}

export interface EmbeddingRepository {
  set(listingId: number, embedding: number[], model: string): Promise<void>;
  get(listingId: number): Promise<{ embedding: number[]; model: string } | null>;
  size(): number;
}

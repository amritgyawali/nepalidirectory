/**
 * Postgres-backed ListingRepository + EmbeddingRepository (prompt §13 `listings` / `V2__embeddings`).
 * Runs against an injected `SqlExecutor` (see `lib/ai-core/queue/pg-repo.ts`), so it never imports
 * `pg` directly — only `lib/ai-core/queue/pg-client.ts` does. UI-only columns (rating, reviews,
 * price, status, image, email, active) belong to the marketing site's `Business` shape, not the
 * `Listing` model, so this repo never touches them; updates only ever SET the enrichment/
 * acquisition columns it owns.
 */
import type { SqlExecutor } from "../ai-core/queue/pg-repo";
import type {
  EmbeddingRepository,
  Listing,
  ListingFaq,
  ListingRepository,
  NewListing,
} from "./types";

type ListingRow = {
  id: number | string;
  slug: string;
  name: string;
  categories: string[] | null;
  area: string | null;
  neighborhood: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  hours_today: string | null;
  rating: number | string | null;
  reviews: number | null;
  price: number | null;
  status: string | null;
  image: string | null;
  photos_count: number | null;
  lat: number | string | null;
  lng: number | string | null;
  claimed: boolean | null;
  verified: boolean | null;
  active: boolean | null;
  services: string[] | null;
  amenities: string[] | null;
  description_en: string | null;
  description_source: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[] | null;
  attributes: Record<string, unknown> | null;
  category_confidence: number | string | null;
  needs_category_review: boolean | null;
  quality_score: number | null;
  ai_enriched_at: string | Date | null;
  data_source: string | null;
  source_ref: string | null;
  license_note: string | null;
  osm_type: string | null;
  osm_id: number | string | null;
  google_place_id: string | null;
  claim_status: string | null;
  province: string | null;
  district: string | null;
  municipality: string | null;
  ward: string | null;
  merged_from: unknown[] | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
};

function mapRow(r: ListingRow, faqs: ListingFaq[]): Listing {
  return {
    id: Number(r.id),
    slug: r.slug,
    name: r.name,
    categories: r.categories ?? [],
    area: r.area ?? "",
    neighborhood: r.neighborhood ?? undefined,
    address: r.address ?? "",
    phone: r.phone ?? undefined,
    website: r.website ?? undefined,
    email: r.email ?? undefined,
    hoursToday: r.hours_today ?? undefined,
    rating: r.rating != null ? Number(r.rating) : undefined,
    reviews: r.reviews ?? undefined,
    price: r.price ?? undefined,
    status: r.status === "open" || r.status === "closed" || r.status === "24h" ? r.status : undefined,
    image: r.image ?? undefined,
    photosCount: r.photos_count ?? 0,
    coordinates: r.lat != null && r.lng != null ? { lat: Number(r.lat), lng: Number(r.lng) } : undefined,
    claimed: Boolean(r.claimed),
    verified: Boolean(r.verified),
    active: r.active !== false,
    services: r.services ?? undefined,
    amenities: r.amenities ?? [],
    description: r.description_en ?? undefined,
    descriptionSource: r.description_source ?? undefined,
    metaTitle: r.meta_title ?? undefined,
    metaDescription: r.meta_description ?? undefined,
    tags: r.tags ?? [],
    faqs,
    attributes: r.attributes ?? {},
    categoryConfidence: r.category_confidence != null ? Number(r.category_confidence) : undefined,
    needsCategoryReview: r.needs_category_review ?? undefined,
    qualityScore: r.quality_score ?? 0,
    aiEnrichedAt: r.ai_enriched_at ? new Date(r.ai_enriched_at) : null,
    dataSource: r.data_source ?? "user",
    sourceRef: r.source_ref ?? undefined,
    licenseNote: r.license_note ?? undefined,
    osmType: r.osm_type ?? undefined,
    osmId: r.osm_id != null ? Number(r.osm_id) : undefined,
    googlePlaceId: r.google_place_id ?? undefined,
    claimStatus: r.claim_status ?? undefined,
    province: r.province ?? undefined,
    district: r.district ?? undefined,
    municipality: r.municipality ?? undefined,
    ward: r.ward ?? undefined,
    mergedFrom: r.merged_from ?? undefined,
    createdAt: r.created_at ? new Date(r.created_at) : null,
    updatedAt: r.updated_at ? new Date(r.updated_at) : null,
  };
}

export class PostgresListingRepository implements ListingRepository {
  private readonly sql: SqlExecutor;

  constructor(sql: SqlExecutor) {
    this.sql = sql;
  }

  private async faqsFor(ids: number[]): Promise<Map<number, ListingFaq[]>> {
    const byId = new Map<number, ListingFaq[]>();
    if (ids.length === 0) return byId;
    const rows = await this.sql<{ listing_id: number; question: string; answer: string }>(
      `SELECT listing_id, question, answer FROM listing_faqs WHERE listing_id = ANY($1) ORDER BY id`,
      [ids],
    );
    for (const r of rows) {
      const list = byId.get(r.listing_id) ?? [];
      list.push({ question: r.question, answer: r.answer });
      byId.set(r.listing_id, list);
    }
    return byId;
  }

  private async replaceFaqs(id: number, faqs: ListingFaq[]): Promise<void> {
    await this.sql(`DELETE FROM listing_faqs WHERE listing_id=$1`, [id]);
    for (const f of faqs) {
      await this.sql(
        `INSERT INTO listing_faqs (listing_id, question, answer) VALUES ($1, $2, $3)`,
        [id, f.question, f.answer],
      );
    }
  }

  async get(id: number): Promise<Listing | null> {
    const rows = await this.sql<ListingRow>(`SELECT * FROM listings WHERE id=$1`, [id]);
    if (!rows.length) return null;
    const faqs = (await this.faqsFor([id])).get(id) ?? [];
    return mapRow(rows[0], faqs);
  }

  async getBySlug(slug: string): Promise<Listing | null> {
    const rows = await this.sql<ListingRow>(`SELECT * FROM listings WHERE slug=$1 AND active=true`, [slug]);
    if (!rows.length) return null;
    const id = Number(rows[0].id);
    const faqs = (await this.faqsFor([id])).get(id) ?? [];
    return mapRow(rows[0], faqs);
  }

  async update(listing: Listing): Promise<void> {
    await this.sql(
      `UPDATE listings SET
         slug=$2, name=$3, categories=$4, area=$5, neighborhood=$6, address=$7, phone=$8,
         website=$9, hours_today=$10, photos_count=$11, lat=$12, lng=$13, claimed=$14,
         verified=$15, services=$16, amenities=$17, description_en=$18, description_source=$19,
         meta_title=$20, meta_description=$21, tags=$22::jsonb, attributes=$23::jsonb,
         category_confidence=$24, needs_category_review=$25, quality_score=$26,
         ai_enriched_at=$27, data_source=$28, source_ref=$29, license_note=$30, osm_type=$31,
         osm_id=$32, google_place_id=$33, claim_status=$34, province=$35, district=$36,
         municipality=$37, ward=$38, merged_from=$39::jsonb, updated_at=now()
       WHERE id=$1`,
      [
        listing.id, listing.slug, listing.name, listing.categories, listing.area,
        listing.neighborhood ?? null, listing.address, listing.phone ?? null,
        listing.website ?? null, listing.hoursToday ?? null, listing.photosCount,
        listing.coordinates?.lat ?? null, listing.coordinates?.lng ?? null, listing.claimed,
        listing.verified, listing.services ?? null, listing.amenities,
        listing.description ?? null, listing.descriptionSource ?? null, listing.metaTitle ?? null,
        listing.metaDescription ?? null, JSON.stringify(listing.tags),
        JSON.stringify(listing.attributes), listing.categoryConfidence ?? null,
        listing.needsCategoryReview ?? null, listing.qualityScore,
        listing.aiEnrichedAt ? listing.aiEnrichedAt.toISOString() : null, listing.dataSource,
        listing.sourceRef ?? null, listing.licenseNote ?? null, listing.osmType ?? null,
        listing.osmId ?? null, listing.googlePlaceId ?? null, listing.claimStatus ?? null,
        listing.province ?? null, listing.district ?? null, listing.municipality ?? null,
        listing.ward ?? null, JSON.stringify(listing.mergedFrom ?? null),
      ],
    );
    await this.replaceFaqs(listing.id, listing.faqs);
  }

  async all(): Promise<Listing[]> {
    const rows = await this.sql<ListingRow>(`SELECT * FROM listings ORDER BY id`);
    const faqsById = await this.faqsFor(rows.map((r) => Number(r.id)));
    return rows.map((r) => mapRow(r, faqsById.get(Number(r.id)) ?? []));
  }

  async insert(listing: NewListing): Promise<Listing> {
    const rows = await this.sql<ListingRow>(
      `INSERT INTO listings
         (slug, name, categories, area, neighborhood, address, phone, website, hours_today,
          photos_count, lat, lng, claimed, verified, services, amenities, description_en,
          description_source, meta_title, meta_description, tags, attributes,
          category_confidence, needs_category_review, quality_score, ai_enriched_at, data_source,
          source_ref, license_note, osm_type, osm_id, google_place_id, claim_status, province,
          district, municipality, ward, merged_from)
       VALUES
         ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21::jsonb,
          $22::jsonb,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38::jsonb)
       RETURNING *`,
      [
        listing.slug, listing.name, listing.categories, listing.area,
        listing.neighborhood ?? null, listing.address, listing.phone ?? null,
        listing.website ?? null, listing.hoursToday ?? null, listing.photosCount,
        listing.coordinates?.lat ?? null, listing.coordinates?.lng ?? null, listing.claimed,
        listing.verified, listing.services ?? null, listing.amenities,
        listing.description ?? null, listing.descriptionSource ?? null, listing.metaTitle ?? null,
        listing.metaDescription ?? null, JSON.stringify(listing.tags),
        JSON.stringify(listing.attributes), listing.categoryConfidence ?? null,
        listing.needsCategoryReview ?? null, listing.qualityScore,
        listing.aiEnrichedAt ? listing.aiEnrichedAt.toISOString() : null, listing.dataSource,
        listing.sourceRef ?? null, listing.licenseNote ?? null, listing.osmType ?? null,
        listing.osmId ?? null, listing.googlePlaceId ?? null, listing.claimStatus ?? null,
        listing.province ?? null, listing.district ?? null, listing.municipality ?? null,
        listing.ward ?? null, JSON.stringify(listing.mergedFrom ?? null),
      ],
    );
    const created = mapRow(rows[0], []);
    await this.replaceFaqs(created.id, listing.faqs);
    return { ...created, faqs: listing.faqs };
  }

  async remove(id: number): Promise<void> {
    await this.sql(`DELETE FROM listings WHERE id=$1`, [id]);
  }

  async upsertByOsm(
    osmType: string,
    osmId: number,
    make: () => NewListing,
  ): Promise<{ listing: Listing; created: boolean }> {
    const existing = await this.sql<{ id: number }>(
      `SELECT id FROM listings WHERE osm_type=$1 AND osm_id=$2`,
      [osmType, osmId],
    );
    if (existing.length) {
      const updated: Listing = { ...make(), id: existing[0].id };
      await this.update(updated);
      return { listing: updated, created: false };
    }
    return { listing: await this.insert(make()), created: true };
  }

  async needingEnrichment(limit: number): Promise<Listing[]> {
    const rows = await this.sql<ListingRow>(
      `SELECT * FROM listings
        WHERE ai_enriched_at IS NULL AND description_source IS DISTINCT FROM 'owner'
        ORDER BY id LIMIT $1`,
      [limit],
    );
    const faqsById = await this.faqsFor(rows.map((r) => Number(r.id)));
    return rows.map((r) => mapRow(r, faqsById.get(Number(r.id)) ?? []));
  }
}

export class PostgresEmbeddingRepository implements EmbeddingRepository {
  private readonly sql: SqlExecutor;
  private readonly knownIds = new Set<number>();

  constructor(sql: SqlExecutor) {
    this.sql = sql;
  }

  async set(listingId: number, embedding: number[], model: string): Promise<void> {
    const vec = `[${embedding.join(",")}]`;
    await this.sql(
      `INSERT INTO listing_embeddings (listing_id, embedding, model, updated_at)
       VALUES ($1, $2::vector, $3, now())
       ON CONFLICT (listing_id) DO UPDATE SET embedding=$2::vector, model=$3, updated_at=now()`,
      [listingId, vec, model],
    );
    this.knownIds.add(listingId);
  }

  async get(listingId: number): Promise<{ embedding: number[]; model: string } | null> {
    const rows = await this.sql<{ embedding: string; model: string }>(
      `SELECT embedding::text AS embedding, model FROM listing_embeddings WHERE listing_id=$1`,
      [listingId],
    );
    if (!rows.length) return null;
    this.knownIds.add(listingId);
    const embedding = rows[0].embedding
      .slice(1, -1)
      .split(",")
      .map(Number);
    return { embedding, model: rows[0].model };
  }

  /** Best-effort count of ids seen by this process (an accurate count needs an async query). */
  size(): number {
    return this.knownIds.size;
  }
}

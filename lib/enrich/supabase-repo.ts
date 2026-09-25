import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  Listing,
  ListingFaq,
  ListingRepository,
  NewListing,
} from "./types";
import { mapListingRow, type ListingRow } from "./postgres-repo";

type SupabaseListingRepositoryOptions = {
  url: string;
  secretKey: string;
};

function listingRow(listing: NewListing | Listing): Record<string, unknown> {
  return {
    slug: listing.slug,
    name: listing.name,
    categories: listing.categories,
    area: listing.area,
    neighborhood: listing.neighborhood ?? null,
    address: listing.address,
    phone: listing.phone ?? null,
    website: listing.website ?? null,
    email: listing.email ?? null,
    hours_today: listing.hoursToday ?? null,
    status: listing.status ?? null,
    image: listing.image ?? null,
    photos_count: listing.photosCount,
    lat: listing.coordinates?.lat ?? null,
    lng: listing.coordinates?.lng ?? null,
    claimed: listing.claimed,
    verified: listing.verified,
    active: listing.active !== false,
    services: listing.services ?? [],
    amenities: listing.amenities,
    description_en: listing.description ?? null,
    description_source: listing.descriptionSource ?? null,
    meta_title: listing.metaTitle ?? null,
    meta_description: listing.metaDescription ?? null,
    tags: listing.tags,
    attributes: listing.attributes,
    category_confidence: listing.categoryConfidence ?? null,
    needs_category_review: listing.needsCategoryReview ?? false,
    quality_score: listing.qualityScore,
    ai_enriched_at: listing.aiEnrichedAt?.toISOString() ?? null,
    data_source: listing.dataSource,
    source_ref: listing.sourceRef ?? null,
    license_note: listing.licenseNote ?? null,
    osm_type: listing.osmType ?? null,
    osm_id: listing.osmId ?? null,
    google_place_id: listing.googlePlaceId ?? null,
    claim_status: listing.claimStatus ?? "unclaimed",
    province: listing.province ?? null,
    district: listing.district ?? null,
    municipality: listing.municipality ?? null,
    ward: listing.ward ?? null,
    merged_from: listing.mergedFrom ?? null,
    verification_status: listing.verificationStatus,
    source_checked_at: listing.sourceCheckedAt?.toISOString() ?? null,
    content_reviewed_at: listing.contentReviewedAt?.toISOString() ?? null,
    content_reviewed_by: listing.contentReviewedBy ?? null,
    last_meaningful_update_at: listing.lastMeaningfulUpdateAt?.toISOString() ?? null,
    image_verified: listing.imageVerified,
  };
}

function fail(context: string, error: { message: string; code?: string } | null): never {
  throw new Error(`${context}: ${error?.message ?? "unknown Supabase error"}${error?.code ? ` (${error.code})` : ""}`);
}

export class SupabaseListingRepository implements ListingRepository {
  private readonly client: SupabaseClient;

  constructor(options: SupabaseListingRepositoryOptions) {
    this.client = createClient(options.url, options.secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  private async faqsFor(ids: number[]): Promise<Map<number, ListingFaq[]>> {
    const byId = new Map<number, ListingFaq[]>();
    for (let offset = 0; offset < ids.length; offset += 500) {
      const chunk = ids.slice(offset, offset + 500);
      const { data, error } = await this.client
        .from("listing_faqs")
        .select("listing_id,question,answer,id")
        .in("listing_id", chunk)
        .order("id");
      if (error) fail("Unable to load listing FAQs", error);
      for (const row of data ?? []) {
        const listingId = Number(row.listing_id);
        const list = byId.get(listingId) ?? [];
        list.push({ question: row.question ?? "", answer: row.answer ?? "" });
        byId.set(listingId, list);
      }
    }
    return byId;
  }

  private async replaceFaqs(id: number, faqs: ListingFaq[]): Promise<void> {
    const { error: deleteError } = await this.client.from("listing_faqs").delete().eq("listing_id", id);
    if (deleteError) fail("Unable to replace listing FAQs", deleteError);
    if (!faqs.length) return;
    const { error: insertError } = await this.client
      .from("listing_faqs")
      .insert(faqs.map((faq) => ({ listing_id: id, question: faq.question, answer: faq.answer })));
    if (insertError) fail("Unable to save listing FAQs", insertError);
  }

  async get(id: number): Promise<Listing | null> {
    const { data, error } = await this.client.from("listings").select("*").eq("id", id).maybeSingle();
    if (error) fail("Unable to load listing", error);
    if (!data) return null;
    const faqs = (await this.faqsFor([id])).get(id) ?? [];
    return mapListingRow(data as ListingRow, faqs);
  }

  async getBySlug(slug: string): Promise<Listing | null> {
    const { data, error } = await this.client
      .from("listings")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (error) fail("Unable to load listing by slug", error);
    if (!data) return null;
    const id = Number(data.id);
    const faqs = (await this.faqsFor([id])).get(id) ?? [];
    return mapListingRow(data as ListingRow, faqs);
  }

  async all(): Promise<Listing[]> {
    const rows: ListingRow[] = [];
    const pageSize = 1000;
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await this.client
        .from("listings")
        .select("*")
        .order("id")
        .range(from, from + pageSize - 1);
      if (error) fail("Unable to load listings", error);
      const page = (data ?? []) as ListingRow[];
      rows.push(...page);
      if (page.length < pageSize) break;
    }
    const faqsById = await this.faqsFor(rows.map((row) => Number(row.id)));
    return rows.map((row) => mapListingRow(row, faqsById.get(Number(row.id)) ?? []));
  }

  async insert(listing: NewListing): Promise<Listing> {
    const { data, error } = await this.client
      .from("listings")
      .insert(listingRow(listing))
      .select("*")
      .single();
    if (error) fail("Unable to insert listing", error);
    const created = mapListingRow(data as ListingRow, []);
    await this.replaceFaqs(created.id, listing.faqs);
    return { ...created, faqs: listing.faqs };
  }

  async update(listing: Listing): Promise<void> {
    const { error } = await this.client
      .from("listings")
      .update({ ...listingRow(listing), updated_at: new Date().toISOString() })
      .eq("id", listing.id);
    if (error) fail("Unable to update listing", error);
    await this.replaceFaqs(listing.id, listing.faqs);
  }

  async remove(id: number): Promise<void> {
    const { error } = await this.client.from("listings").delete().eq("id", id);
    if (error) fail("Unable to remove listing", error);
  }

  async upsertByOsm(
    osmType: string,
    osmId: number,
    make: () => NewListing,
  ): Promise<{ listing: Listing; created: boolean }> {
    const { data, error } = await this.client
      .from("listings")
      .select("id")
      .eq("osm_type", osmType)
      .eq("osm_id", osmId)
      .maybeSingle();
    if (error) fail("Unable to find OSM listing", error);
    if (data) {
      const updated = { ...make(), id: Number(data.id) };
      await this.update(updated);
      return { listing: updated, created: false };
    }
    return { listing: await this.insert(make()), created: true };
  }

  async needingEnrichment(limit: number): Promise<Listing[]> {
    const { data, error } = await this.client
      .from("listings")
      .select("*")
      .is("ai_enriched_at", null)
      .or("description_source.is.null,description_source.neq.owner")
      .order("id")
      .limit(Math.max(0, limit));
    if (error) fail("Unable to load listings needing enrichment", error);
    const rows = (data ?? []) as ListingRow[];
    const faqsById = await this.faqsFor(rows.map((row) => Number(row.id)));
    return rows.map((row) => mapListingRow(row, faqsById.get(Number(row.id)) ?? []));
  }
}

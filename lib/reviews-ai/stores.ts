import type {
  ModerationQueueItem,
  ModerationQueueRepository,
  OwnerReplyDraftRepository,
  OwnerReplyDrafts,
  ReviewSummary,
  ReviewSummaryRepository,
} from "./types";
import type { SqlExecutor } from "@/lib/ai-core/queue/pg-repo";

export class InMemoryReviewSummaryRepository implements ReviewSummaryRepository {
  private readonly summaries = new Map<string, ReviewSummary>();

  async get(listingSlug: string): Promise<ReviewSummary | null> {
    return this.summaries.get(listingSlug) ?? null;
  }

  async upsert(summary: ReviewSummary): Promise<void> {
    this.summaries.set(summary.listingSlug, summary);
  }

  async all(): Promise<ReviewSummary[]> {
    return [...this.summaries.values()];
  }
}

export class InMemoryModerationQueueRepository implements ModerationQueueRepository {
  private readonly items: ModerationQueueItem[] = [];
  private nextId = 1;

  async create(item: Omit<ModerationQueueItem, "id" | "createdAt">): Promise<ModerationQueueItem> {
    const created = { ...item, id: String(this.nextId++), createdAt: new Date() };
    this.items.push(created);
    return created;
  }

  async list(status?: ModerationQueueItem["status"]): Promise<ModerationQueueItem[]> {
    return status ? this.items.filter((item) => item.status === status) : [...this.items];
  }
}

export class InMemoryOwnerReplyDraftRepository implements OwnerReplyDraftRepository {
  private readonly drafts: Array<OwnerReplyDrafts & { listingSlug: string; createdAt: Date }> = [];

  async create(drafts: OwnerReplyDrafts & { listingSlug: string }): Promise<OwnerReplyDrafts> {
    this.drafts.push({ ...drafts, createdAt: new Date() });
    return drafts;
  }

  async list(): Promise<Array<OwnerReplyDrafts & { listingSlug: string; createdAt: Date }>> {
    return [...this.drafts];
  }
}

type ReviewSummaryRow = {
  listing_slug: string;
  summary: string;
  pros: string[] | string;
  cons: string[] | string;
  sentiment: number | string;
  themes: string[] | string;
  review_count: number;
  generated_at: Date | string;
};

function jsonArray(value: string[] | string): string[] {
  if (Array.isArray(value)) return value;
  const parsed = JSON.parse(value) as unknown;
  return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
}

function mapSummary(row: ReviewSummaryRow): ReviewSummary {
  return {
    listingSlug: row.listing_slug,
    summary: row.summary,
    pros: jsonArray(row.pros),
    cons: jsonArray(row.cons),
    sentiment: Number(row.sentiment),
    themes: jsonArray(row.themes),
    reviewCount: row.review_count,
    generatedAt: new Date(row.generated_at),
    aiGenerated: true,
  };
}

export class PostgresReviewSummaryRepository implements ReviewSummaryRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async get(listingSlug: string): Promise<ReviewSummary | null> {
    const rows = await this.sql<ReviewSummaryRow>(
      `SELECT l.slug AS listing_slug, rs.summary, rs.pros, rs.cons, rs.sentiment, rs.themes,
              rs.review_count, rs.generated_at
         FROM review_summaries rs
         JOIN listings l ON l.id = rs.listing_id
        WHERE l.slug = $1`,
      [listingSlug],
    );
    return rows.length ? mapSummary(rows[0]) : null;
  }

  async upsert(summary: ReviewSummary): Promise<void> {
    await this.sql(
      `INSERT INTO review_summaries
          (listing_id, summary, pros, cons, sentiment, themes, review_count, generated_at)
       SELECT id, $2, $3::jsonb, $4::jsonb, $5, $6::jsonb, $7, $8
         FROM listings WHERE slug = $1
       ON CONFLICT (listing_id) DO UPDATE SET
          summary = EXCLUDED.summary,
          pros = EXCLUDED.pros,
          cons = EXCLUDED.cons,
          sentiment = EXCLUDED.sentiment,
          themes = EXCLUDED.themes,
          review_count = EXCLUDED.review_count,
          generated_at = EXCLUDED.generated_at`,
      [
        summary.listingSlug,
        summary.summary,
        JSON.stringify(summary.pros),
        JSON.stringify(summary.cons),
        summary.sentiment,
        JSON.stringify(summary.themes),
        summary.reviewCount,
        summary.generatedAt,
      ],
    );
  }

  async all(): Promise<ReviewSummary[]> {
    const rows = await this.sql<ReviewSummaryRow>(
      `SELECT l.slug AS listing_slug, rs.summary, rs.pros, rs.cons, rs.sentiment, rs.themes,
              rs.review_count, rs.generated_at
         FROM review_summaries rs
         JOIN listings l ON l.id = rs.listing_id
        ORDER BY rs.generated_at DESC`,
    );
    return rows.map(mapSummary);
  }
}

type ModerationRow = {
  id: number;
  entity_type: "review";
  entity_ref: string | null;
  entity_id: number | null;
  reason: string;
  score: number | string;
  ai_opinion: Record<string, unknown> | string | null;
  status: ModerationQueueItem["status"];
  created_at: Date | string;
};

function mapModeration(row: ModerationRow): ModerationQueueItem {
  return {
    id: String(row.id),
    entityType: row.entity_type,
    entityId: row.entity_ref ?? String(row.entity_id ?? ""),
    reason: row.reason,
    score: Number(row.score),
    aiOpinion:
      typeof row.ai_opinion === "string"
        ? (JSON.parse(row.ai_opinion) as Record<string, unknown>)
        : row.ai_opinion,
    status: row.status,
    createdAt: new Date(row.created_at),
  };
}

export class PostgresModerationQueueRepository implements ModerationQueueRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async create(item: Omit<ModerationQueueItem, "id" | "createdAt">): Promise<ModerationQueueItem> {
    const rows = await this.sql<ModerationRow>(
      `INSERT INTO moderation_queue (entity_type, entity_ref, reason, score, ai_opinion, status)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)
       RETURNING id, entity_type, entity_ref, entity_id, reason, score, ai_opinion, status, created_at`,
      [
        item.entityType,
        item.entityId,
        item.reason,
        item.score,
        JSON.stringify(item.aiOpinion),
        item.status,
      ],
    );
    return mapModeration(rows[0]);
  }

  async list(status?: ModerationQueueItem["status"]): Promise<ModerationQueueItem[]> {
    const rows = await this.sql<ModerationRow>(
      `SELECT id, entity_type, entity_ref, entity_id, reason, score, ai_opinion, status, created_at
         FROM moderation_queue
        ${status ? "WHERE status = $1" : ""}
        ORDER BY id`,
      status ? [status] : [],
    );
    return rows.map(mapModeration);
  }
}

type OwnerReplyDraftRow = {
  review_ref: string | null;
  listing_slug: string;
  drafts: Record<string, unknown> | string;
  ai_draft: boolean;
  created_at: Date | string;
};

function mapOwnerReplyDraft(row: OwnerReplyDraftRow): OwnerReplyDrafts & { listingSlug: string; createdAt: Date } {
  const drafts = typeof row.drafts === "string" ? (JSON.parse(row.drafts) as Record<string, unknown>) : row.drafts;
  return {
    reviewId: row.review_ref ?? "",
    professional: typeof drafts.professional === "string" ? drafts.professional : "",
    warm: typeof drafts.warm === "string" ? drafts.warm : "",
    brief: typeof drafts.brief === "string" ? drafts.brief : "",
    aiDraft: true,
    listingSlug: row.listing_slug,
    createdAt: new Date(row.created_at),
  };
}

export class PostgresOwnerReplyDraftRepository implements OwnerReplyDraftRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async create(drafts: OwnerReplyDrafts & { listingSlug: string }): Promise<OwnerReplyDrafts> {
    await this.sql(
      `INSERT INTO owner_reply_drafts (review_ref, listing_id, drafts, ai_draft)
       SELECT $1, id, $2::jsonb, true FROM listings WHERE slug = $3`,
      [
        drafts.reviewId,
        JSON.stringify({
          professional: drafts.professional,
          warm: drafts.warm,
          brief: drafts.brief,
        }),
        drafts.listingSlug,
      ],
    );
    return drafts;
  }

  async list(): Promise<Array<OwnerReplyDrafts & { listingSlug: string; createdAt: Date }>> {
    const rows = await this.sql<OwnerReplyDraftRow>(
      `SELECT ord.review_ref, l.slug AS listing_slug, ord.drafts, ord.ai_draft, ord.created_at
         FROM owner_reply_drafts ord
         JOIN listings l ON l.id = ord.listing_id
        ORDER BY ord.id`,
    );
    return rows.map(mapOwnerReplyDraft);
  }
}

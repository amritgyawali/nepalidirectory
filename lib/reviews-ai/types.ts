export type Review = {
  id: string;
  listingSlug: string;
  reviewerId: string;
  reviewerAccountCreatedAt: Date;
  rating: number;
  body: string;
  createdAt: Date;
  ownerId?: string;
};

export type ReviewSummary = {
  listingSlug: string;
  summary: string;
  pros: string[];
  cons: string[];
  sentiment: number;
  themes: string[];
  reviewCount: number;
  generatedAt: Date;
  aiGenerated: true;
};

export type ModerationQueueItem = {
  id: string;
  entityType: "review";
  entityId: string;
  reason: string;
  score: number;
  aiOpinion: Record<string, unknown> | null;
  status: "pending" | "auto_hidden" | "approved" | "rejected";
  createdAt: Date;
};

export type OwnerReplyDrafts = {
  reviewId: string;
  professional: string;
  warm: string;
  brief: string;
  aiDraft: true;
};

export interface ReviewSummaryRepository {
  get(listingSlug: string): Promise<ReviewSummary | null>;
  upsert(summary: ReviewSummary): Promise<void>;
  all(): Promise<ReviewSummary[]>;
}

export interface ModerationQueueRepository {
  create(item: Omit<ModerationQueueItem, "id" | "createdAt">): Promise<ModerationQueueItem>;
  list(status?: ModerationQueueItem["status"]): Promise<ModerationQueueItem[]>;
}

export interface OwnerReplyDraftRepository {
  create(drafts: OwnerReplyDrafts & { listingSlug: string }): Promise<OwnerReplyDrafts>;
  list(): Promise<Array<OwnerReplyDrafts & { listingSlug: string; createdAt: Date }>>;
}

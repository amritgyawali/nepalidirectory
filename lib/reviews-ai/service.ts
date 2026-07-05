import type { ProviderRegistry } from "@/lib/ai-core";
import type { PromptRegistry } from "@/lib/ai-core";
import { parseJsonResponse } from "@/lib/ai-core";
import type {
  ModerationQueueRepository,
  OwnerReplyDraftRepository,
  OwnerReplyDrafts,
  Review,
  ReviewSummary,
  ReviewSummaryRepository,
} from "./types";

type ReviewIntelligenceOptions = {
  summaries: ReviewSummaryRepository;
  moderationQueue: ModerationQueueRepository;
  ownerReplyDrafts?: OwnerReplyDraftRepository;
  providers: ProviderRegistry;
  prompts: PromptRegistry;
  siteName: string;
};

type ReviewSummaryJson = {
  summary: string;
  pros: string[];
  cons: string[];
  sentiment: number;
  themes: string[];
};

function coerceSummaryJson(value: unknown): ReviewSummaryJson {
  const input = value as Partial<ReviewSummaryJson>;
  return {
    summary: typeof input.summary === "string" ? input.summary : "",
    pros: Array.isArray(input.pros) ? input.pros.filter((item): item is string => typeof item === "string").slice(0, 4) : [],
    cons: Array.isArray(input.cons) ? input.cons.filter((item): item is string => typeof item === "string").slice(0, 4) : [],
    sentiment: typeof input.sentiment === "number" ? Math.max(-1, Math.min(1, input.sentiment)) : 0,
    themes: Array.isArray(input.themes) ? input.themes.filter((item): item is string => typeof item === "string") : [],
  };
}

function words(value: string): string[] {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2);
}

function jaccard(a: string, b: string): number {
  const left = new Set(words(a));
  const right = new Set(words(b));
  let overlap = 0;
  for (const word of left) {
    if (right.has(word)) overlap++;
  }
  return overlap / (new Set([...left, ...right]).size || 1);
}

export class ReviewIntelligenceService {
  private readonly summaries: ReviewSummaryRepository;
  private readonly moderationQueue: ModerationQueueRepository;
  private readonly ownerReplyDrafts: OwnerReplyDraftRepository | null;
  private readonly providers: ProviderRegistry;
  private readonly prompts: PromptRegistry;
  private readonly siteName: string;

  constructor(options: ReviewIntelligenceOptions) {
    this.summaries = options.summaries;
    this.moderationQueue = options.moderationQueue;
    this.ownerReplyDrafts = options.ownerReplyDrafts ?? null;
    this.providers = options.providers;
    this.prompts = options.prompts;
    this.siteName = options.siteName;
  }

  async summarize(listingSlug: string, reviews: Review[]): Promise<ReviewSummary | null> {
    if (reviews.length < 3) return null;
    const rendered = this.prompts.render("REVIEW_SUMMARIZER_V1", {
      site_name: this.siteName,
      n: String(reviews.length),
      reviews_json: JSON.stringify(
        reviews.map((review) => ({
          rating: review.rating,
          body: review.body,
          created_at: review.createdAt.toISOString(),
        })),
      ),
    });
    const result = await this.providers.chain().completeJson(
      {
        taskKey: "REVIEW_SUMMARIZER_V1",
        system: rendered.system,
        user: rendered.user,
        temperature: rendered.template.temperature,
        maxTokens: 700,
      },
      rendered.template.jsonSchema ?? "{}",
    );
    const json = coerceSummaryJson(parseJsonResponse(result.text));
    const summary: ReviewSummary = {
      listingSlug,
      ...json,
      reviewCount: reviews.length,
      generatedAt: new Date(),
      aiGenerated: true,
    };
    await this.summaries.upsert(summary);
    return summary;
  }

  async getSummary(listingSlug: string): Promise<ReviewSummary | null> {
    return this.summaries.get(listingSlug);
  }

  async inspectSpam(review: Review, context: { listingReviews: Review[]; ownerListingSlugs?: string[] }): Promise<{ score: number; reasons: string[] }> {
    const reasons: string[] = [];
    let score = 0;
    const accountAgeHours = (review.createdAt.getTime() - review.reviewerAccountCreatedAt.getTime()) / 36e5;
    if (accountAgeHours < 24 && review.rating >= 5) {
      score += 0.25;
      reasons.push("new account with five-star review");
    }

    const sameDay = context.listingReviews.filter(
      (candidate) =>
        candidate.listingSlug === review.listingSlug &&
        Math.abs(candidate.createdAt.getTime() - review.createdAt.getTime()) < 24 * 36e5,
    );
    if (sameDay.length > 5) {
      score += 0.25;
      reasons.push("high review velocity for listing");
    }

    if (context.listingReviews.some((candidate) => candidate.id !== review.id && jaccard(candidate.body, review.body) > 0.8)) {
      score += 0.35;
      reasons.push("near-duplicate review text");
    }

    const ownerListings = context.ownerListingSlugs ?? [];
    if (ownerListings.length && ownerListings.every((slug) => slug === review.listingSlug)) {
      score += 0.15;
      reasons.push("reviewer only reviews one owner portfolio");
    }

    if (score >= 0.5) {
      await this.moderationQueue.create({
        entityType: "review",
        entityId: review.id,
        reason: reasons.join("; "),
        score,
        aiOpinion: score >= 0.9 ? { verdict: "extreme_confidence_hide" } : null,
        status: score >= 0.9 ? "auto_hidden" : "pending",
      });
    }

    return { score, reasons };
  }

  async draftOwnerReplies(review: Review, businessName: string): Promise<OwnerReplyDrafts> {
    const rendered = this.prompts.render("REVIEW_REPLY_DRAFTER_V1", {
      site_name: this.siteName,
      rating: String(review.rating),
      review_text: review.body,
      business_name: businessName,
    });
    const result = await this.providers.chain().completeJson(
      {
        taskKey: "REVIEW_REPLY_DRAFTER_V1",
        system: rendered.system,
        user: rendered.user,
        temperature: rendered.template.temperature,
        maxTokens: 500,
      },
      rendered.template.jsonSchema ?? "{}",
    );
    const json = parseJsonResponse(result.text) as Partial<OwnerReplyDrafts>;
    const drafts: OwnerReplyDrafts = {
      reviewId: review.id,
      professional: typeof json.professional === "string" ? json.professional : "",
      warm: typeof json.warm === "string" ? json.warm : "",
      brief: typeof json.brief === "string" ? json.brief : "",
      aiDraft: true,
    };
    await this.ownerReplyDrafts?.create({ ...drafts, listingSlug: review.listingSlug });
    return drafts;
  }
}

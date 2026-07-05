import { createDiscoverRuntime, type DiscoverRuntime, type DiscoverRuntimeOverrides } from "@/lib/discover";
import {
  createInternalLinkSuggestionRepository,
  createSeoPageIntroRepository,
  makeEvergreenPageHandler,
  makeTranslateNeHandler,
  suggestInternalLinks,
  type InternalLinkSuggestionRepository,
  type SeoPageIntroRepository,
} from "@/lib/seo-auto";
import { ReviewIntelligenceService } from "./service";
import { makeReviewSummaryHandler } from "./handlers";
import type { ModerationQueueRepository, OwnerReplyDraftRepository, ReviewSummaryRepository } from "./types";
import {
  createModerationQueueRepository,
  createOwnerReplyDraftRepository,
  createReviewSummaryRepository,
} from "./factory";

export type ReviewsAiRuntime = DiscoverRuntime & {
  reviewSummaries: ReviewSummaryRepository;
  moderationQueue: ModerationQueueRepository;
  ownerReplyDrafts: OwnerReplyDraftRepository;
  seoPageIntros: SeoPageIntroRepository;
  internalLinkSuggestions: InternalLinkSuggestionRepository;
  reviewIntelligence: ReviewIntelligenceService;
  runInternalLinkSuggestionSweep: () => Promise<{ suggestions: number }>;
};

export type ReviewsAiRuntimeOverrides = DiscoverRuntimeOverrides & {
  reviewSummaries?: ReviewSummaryRepository;
  moderationQueue?: ModerationQueueRepository;
  ownerReplyDrafts?: OwnerReplyDraftRepository;
  seoPageIntros?: SeoPageIntroRepository;
  internalLinkSuggestions?: InternalLinkSuggestionRepository;
};

export function createReviewsAiRuntime(overrides: ReviewsAiRuntimeOverrides = {}): ReviewsAiRuntime {
  const discover = createDiscoverRuntime(overrides);
  const reviewSummaries = overrides.reviewSummaries ?? createReviewSummaryRepository();
  const moderationQueue = overrides.moderationQueue ?? createModerationQueueRepository();
  const ownerReplyDrafts = overrides.ownerReplyDrafts ?? createOwnerReplyDraftRepository();
  const seoPageIntros = overrides.seoPageIntros ?? createSeoPageIntroRepository();
  const internalLinkSuggestions = overrides.internalLinkSuggestions ?? createInternalLinkSuggestionRepository();
  const reviewIntelligence = new ReviewIntelligenceService({
    summaries: reviewSummaries,
    moderationQueue,
    ownerReplyDrafts,
    providers: discover.providers,
    prompts: discover.prompts,
    siteName: discover.config.siteName,
  });

  discover.worker.register("REVIEW_SUMMARY", makeReviewSummaryHandler(reviewIntelligence));
  discover.worker
    .register(
      "EVERGREEN_PAGE",
      makeEvergreenPageHandler({
        prompts: discover.prompts,
        providers: discover.providers,
        siteName: discover.config.siteName,
        seoPageIntros,
      }),
    )
    .register(
      "TRANSLATE_NE",
      makeTranslateNeHandler({
        listings: discover.listings,
        prompts: discover.prompts,
        providers: discover.providers,
        siteName: discover.config.siteName,
      }),
    );

  async function runInternalLinkSuggestionSweep() {
    const suggestions = suggestInternalLinks();
    const saved = await internalLinkSuggestions.replacePending(suggestions);
    return { suggestions: saved };
  }

  return {
    ...discover,
    reviewSummaries,
    moderationQueue,
    ownerReplyDrafts,
    seoPageIntros,
    internalLinkSuggestions,
    reviewIntelligence,
    runInternalLinkSuggestionSweep,
  };
}

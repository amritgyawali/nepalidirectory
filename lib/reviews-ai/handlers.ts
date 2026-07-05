import type { JobHandler } from "@/lib/ai-core";
import { businesses } from "@/lib/data";
import { reviewsForListing } from "./sample-reviews";
import type { ReviewIntelligenceService } from "./service";

export function makeReviewSummaryHandler(service: ReviewIntelligenceService): JobHandler {
  return async ({ job }) => {
    const listingSlug = typeof job.payload.listingSlug === "string" ? job.payload.listingSlug : null;
    if (!listingSlug) throw new Error("REVIEW_SUMMARY requires listingSlug");
    const listing = businesses.find((business) => business.slug === listingSlug);
    if (!listing) throw new Error(`listing not found: ${listingSlug}`);
    const summary = await service.summarize(listingSlug, reviewsForListing(listingSlug));
    return { summaryCreated: Boolean(summary), listingSlug };
  };
}

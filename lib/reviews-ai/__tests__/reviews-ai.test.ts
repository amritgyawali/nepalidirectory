import { describe, expect, it } from "vitest";
import { InMemoryListingRepository, makeNewListing } from "@/lib/enrich";
import { createReviewsAiRuntime } from "../runtime";
import { reviewsForListing, sampleReviews } from "../sample-reviews";

describe("Review intelligence (prompt Module F)", () => {
  it("summarizes >=3 raw reviews and keeps aggregate rating sourced from raw listing data", async () => {
    const rt = createReviewsAiRuntime();
    const summary = await rt.reviewIntelligence.summarize("newa-lahana", reviewsForListing("newa-lahana"));

    expect(summary?.aiGenerated).toBe(true);
    expect(summary?.reviewCount).toBeGreaterThanOrEqual(3);
    expect(summary?.summary).toContain("Reviewers");
    expect("aiDraft" in sampleReviews[0]).toBe(false);
  });

  it("queues suspicious reviews using heuristics before any AI moderation decision", async () => {
    const rt = createReviewsAiRuntime();
    const suspicious = {
      ...sampleReviews[0],
      id: "suspicious-1",
      reviewerId: "new-user",
      reviewerAccountCreatedAt: new Date("2026-07-05T09:00:00+05:45"),
      createdAt: new Date("2026-07-05T10:00:00+05:45"),
      rating: 5,
      body: sampleReviews[1].body,
    };

    const result = await rt.reviewIntelligence.inspectSpam(suspicious, {
      listingReviews: [...sampleReviews, suspicious],
      ownerListingSlugs: ["newa-lahana"],
    });
    const queue = await rt.moderationQueue.list();

    expect(result.score).toBeGreaterThanOrEqual(0.5);
    expect(queue).toHaveLength(1);
    expect(queue[0].status).toBe("pending");
  });

  it("drafts owner replies separately from user review bodies", async () => {
    const rt = createReviewsAiRuntime();
    const drafts = await rt.reviewIntelligence.draftOwnerReplies(sampleReviews[0], "Newa Lahana");
    const stored = await rt.ownerReplyDrafts.list();

    expect(drafts.aiDraft).toBe(true);
    expect(drafts.reviewId).toBe(sampleReviews[0].id);
    expect(drafts.professional.length).toBeGreaterThan(20);
    expect(sampleReviews[0].body).not.toBe(drafts.professional);
    expect(stored).toHaveLength(1);
    expect(stored[0].listingSlug).toBe("newa-lahana");
  });

  it("runs REVIEW_SUMMARY and TRANSLATE_NE jobs through MockAiProvider", async () => {
    const listings = new InMemoryListingRepository([]);
    const listing = await listings.insert(
      makeNewListing({
        name: "Translated Test Listing",
        area: "Kathmandu",
        address: "Test Street",
        categories: ["restaurants"],
        description: "A factual English description for translation tests.",
        faqs: [{ question: "Do you take bookings?", answer: "Call before visiting." }],
      }),
    );
    const rt = createReviewsAiRuntime({ listings });

    await rt.repo.enqueue({ type: "REVIEW_SUMMARY", payload: { listingSlug: "newa-lahana" } });
    const summaryJob = await rt.worker.runOnce();
    expect(summaryJob?.status).toBe("DONE");

    await rt.repo.enqueue({ type: "TRANSLATE_NE", payload: { listingId: listing.id } });
    const translateJob = await rt.worker.runOnce();
    expect(translateJob?.status).toBe("DONE");

    const updated = await rt.listings.get(listing.id);
    expect(updated?.descriptionNe).toContain("नेपाली");
  });
});

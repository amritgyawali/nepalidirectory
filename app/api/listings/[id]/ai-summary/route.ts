import { NextResponse } from "next/server";
import { businesses } from "@/lib/data";
import { getReviewsAiRuntime, reviewsForListing } from "@/lib/reviews-ai";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const business = businesses.find((candidate) => candidate.slug === id || String(candidate.rank) === id);
  if (!business) {
    return NextResponse.json({ error: "listing not found" }, { status: 404 });
  }

  const runtime = getReviewsAiRuntime();
  const existing = await runtime.reviewIntelligence.getSummary(business.slug);
  const summary = existing ?? (await runtime.reviewIntelligence.summarize(business.slug, reviewsForListing(business.slug)));
  if (!summary) {
    return NextResponse.json({ summary: null, reason: "at least 3 published reviews required" }, { status: 200 });
  }

  return NextResponse.json({
    listingSlug: business.slug,
    aggregateRating: {
      ratingValue: business.rating,
      reviewCount: business.reviews,
      source: "raw_reviews",
    },
    summary,
  });
}

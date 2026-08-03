/**
 * Super-admin approval action (2026-07-16 SEO audit, Critical #1). Auth/role enforcement happens
 * in `utils/supabase/middleware.ts` (every `/api/admin/*` route requires an authenticated
 * super-admin/admin session).
 *
 * Applies review metadata and then runs the same publication gate used by public pages and
 * sitemaps. Incomplete or unsupported records remain unchanged and return a concrete checklist.
 */
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { computeQualityScore, createListingRepository } from "@/lib/enrich";
import { evaluateListingIndexEligibility } from "@/lib/public-listings";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const listingId = Number(id);
  if (!Number.isInteger(listingId)) {
    return NextResponse.json({ error: "Invalid listing id." }, { status: 400 });
  }

  const repository = createListingRepository();
  const listing = await repository.get(listingId);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  listing.needsCategoryReview = false;
  listing.active = true;
  listing.verified = true;
  listing.verificationStatus = listing.claimed && listing.claimStatus === "claimed"
    ? "owner_verified"
    : "source_verified";
  const reviewedAt = new Date();
  listing.sourceCheckedAt = reviewedAt;
  listing.contentReviewedAt = reviewedAt;
  listing.contentReviewedBy = user.id;
  listing.lastMeaningfulUpdateAt = reviewedAt;
  listing.qualityScore = computeQualityScore(listing);

  const eligibility = evaluateListingIndexEligibility(listing);
  if (!eligibility.eligible) {
    return NextResponse.json(
      {
        error: "Listing cannot be approved until every index-eligibility requirement is met.",
        reasons: eligibility.reasons,
      },
      { status: 422 },
    );
  }

  await repository.update(listing);

  return NextResponse.json({ id: listing.id, slug: listing.slug, status: "approved" });
}

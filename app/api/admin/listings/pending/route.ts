/**
 * Real pending-listing queue for super admins (2026-07-16 SEO audit, Critical #1). Auth/role
 * enforcement happens in `utils/supabase/middleware.ts`, which already gates every `/api/admin/*`
 * route behind an authenticated super-admin/admin session — this route only needs to read data.
 *
 * "Pending" = an active, non-demo record that still fails at least one publication rule.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createListingRepository, type Listing } from "@/lib/enrich";
import { evaluateListingIndexEligibility, isDemoListing } from "@/lib/public-listings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isPendingReview(listing: Listing): boolean {
  return (
    listing.active !== false &&
    listing.verificationStatus !== "rejected" &&
    !isDemoListing(listing) &&
    !evaluateListingIndexEligibility(listing).eligible
  );
}

function positiveInteger(value: string | null, fallback: number, maximum: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback;
}

export async function GET(request: NextRequest) {
  const page = positiveInteger(request.nextUrl.searchParams.get("page"), 1, 10_000);
  const limit = positiveInteger(request.nextUrl.searchParams.get("limit"), 50, 100);
  const repository = createListingRepository();
  const all = await repository.all();
  const pending = all
    .filter(isPendingReview)
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  const totalPages = Math.max(1, Math.ceil(pending.length / limit));
  const pageListings = pending.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    count: pending.length,
    page,
    limit,
    totalPages,
    listings: pageListings.map((listing) => ({
      id: listing.id,
      slug: listing.slug,
      name: listing.name,
      categories: listing.categories,
      area: listing.area,
      address: listing.address,
      phone: listing.phone,
      email: listing.email,
      dataSource: listing.dataSource,
      verificationStatus: listing.verificationStatus,
      qualityScore: listing.qualityScore,
      sourceRef: listing.sourceRef,
      createdAt: listing.createdAt,
      eligibilityReasons: evaluateListingIndexEligibility(listing).reasons,
    })),
  });
}

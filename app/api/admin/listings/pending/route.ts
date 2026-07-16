/**
 * Real pending-listing queue for super admins (2026-07-16 SEO audit, Critical #1). Auth/role
 * enforcement happens in `utils/supabase/middleware.ts`, which already gates every `/api/admin/*`
 * route behind an authenticated super-admin/admin session — this route only needs to read data.
 *
 * "Pending" = a real (non-demo) submission still behind the review gate
 * (`needsCategoryReview: true`, set unconditionally by `POST /api/listings` on every owner
 * submission, and by the OSM importer for any category it can't confidently map).
 */
import { NextResponse } from "next/server";
import { createListingRepository, type Listing } from "@/lib/enrich";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isPendingReview(listing: Listing): boolean {
  return listing.dataSource !== "demo" && listing.active !== false && listing.needsCategoryReview === true;
}

export async function GET() {
  const repository = createListingRepository();
  const all = await repository.all();
  const pending = all
    .filter(isPendingReview)
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));

  return NextResponse.json({
    count: pending.length,
    listings: pending.map((listing) => ({
      id: listing.id,
      slug: listing.slug,
      name: listing.name,
      categories: listing.categories,
      area: listing.area,
      address: listing.address,
      phone: listing.phone,
      email: listing.email,
      dataSource: listing.dataSource,
      qualityScore: listing.qualityScore,
      sourceRef: listing.sourceRef,
      createdAt: listing.createdAt,
    })),
  });
}

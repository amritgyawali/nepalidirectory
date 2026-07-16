/**
 * Super-admin rejection action (2026-07-16 SEO audit, Critical #1). Auth/role enforcement happens
 * in `utils/supabase/middleware.ts` (every `/api/admin/*` route requires an authenticated
 * super-admin/admin session).
 *
 * Soft-hides the listing (`active: false`) rather than deleting it, so a rejected submission
 * stays available for audit/appeal instead of disappearing outright.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createListingRepository } from "@/lib/enrich";

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

  listing.active = false;
  listing.claimStatus = "unclaimed";
  await repository.update(listing);

  return NextResponse.json({ id: listing.id, slug: listing.slug, status: "rejected" });
}

/**
 * Super-admin approval action (2026-07-16 SEO audit, Critical #1). Auth/role enforcement happens
 * in `utils/supabase/middleware.ts` (every `/api/admin/*` route requires an authenticated
 * super-admin/admin session).
 *
 * Clears the review gate so `isIndexableListing()` (`lib/public-listings.ts`) can return true for
 * this listing — it still also requires `qualityScore >= 55`, a real (non-"uncategorized")
 * category and a non-empty name/address, so approving an incomplete submission alone does not
 * force it into the public sitemap/schema output; the admin should fix categorization first if
 * `categories` is still `["uncategorized"]`.
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

  listing.needsCategoryReview = false;
  listing.verified = true;
  listing.claimed = true;
  listing.claimStatus = "claimed";
  await repository.update(listing);

  return NextResponse.json({ id: listing.id, slug: listing.slug, status: "approved" });
}

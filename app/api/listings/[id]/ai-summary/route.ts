import { NextResponse } from "next/server";
import { getDirectoryListing } from "@/lib/public-listings";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const listing = await getDirectoryListing(id);
  if (!listing) {
    return NextResponse.json({ error: "listing not found" }, { status: 404 });
  }

  return NextResponse.json({
    listingSlug: listing.slug,
    reviewsAvailable: false,
    summary: null,
    reason: "No approved first-party reviewer-level records are available for public summaries.",
  });
}

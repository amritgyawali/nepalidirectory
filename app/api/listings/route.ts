/**
 * Owner "add a business" submission (2026-07-16 SEO audit, Critical #1 / findings/sitemap.md
 * "VERDICT"). `app/claim-listing` previously only wrote a new listing into the browser's
 * localStorage via `DashboardProvider.addListing()` — nothing reached the real listing
 * repository, so no owner-submitted business could ever appear in the sitemap or schema output.
 *
 * This route is the real write path: it creates a `dataSource: "owner"` row via
 * `createListingRepository()`. `needsCategoryReview` is always forced `true` here regardless of
 * how complete the submission looks, so every new listing requires an explicit super-admin
 * approval (`POST /api/admin/listings/[id]/approve`) before `isIndexableListing()`
 * (`lib/public-listings.ts`) can ever return true for it — consistent with the site's existing
 * "never let unverified data near the index" gate, rather than letting a well-filled-out form
 * bypass human review on quality score alone.
 */
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createListingRepository, makeNewListing, slugify } from "@/lib/enrich";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SubmitListingBody = {
  name?: string;
  ownerName?: string;
  category?: string;
  area?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  image?: string;
  description?: string;
  amenities?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    urlSlug?: string;
  };
};

const REQUIRED_FIELDS: Array<keyof SubmitListingBody> = [
  "name",
  "category",
  "area",
  "address",
  "phone",
  "email",
  "description",
];

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Authentication service is not configured." }, { status: 503 });
  }

  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to submit a business listing." }, { status: 401 });
  }

  let body: SubmitListingBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const missing = REQUIRED_FIELDS.find((field) => !String(body[field] ?? "").trim());
  if (missing) {
    return NextResponse.json({ error: `Missing required field: ${missing}` }, { status: 400 });
  }

  const name = body.name!.trim();
  const slugSeed = body.seo?.urlSlug?.trim() || name;
  const slug = slugify(slugSeed);

  const repository = createListingRepository();
  const existing = await repository.getBySlug(slug);
  if (existing) {
    return NextResponse.json(
      { error: "A listing with this slug already exists. Choose a different name or URL slug." },
      { status: 409 },
    );
  }

  const listing = await repository.insert(
    makeNewListing({
      slug,
      name,
      area: body.area!.trim(),
      address: body.address!.trim(),
      phone: body.phone?.trim(),
      email: body.email?.trim(),
      website: body.website?.trim(),
      hoursToday: body.hours?.trim(),
      image: body.image?.trim() || undefined,
      description: body.description?.trim(),
      descriptionSource: "owner",
      categories: body.category ? [slugify(body.category)] : ["uncategorized"],
      amenities: (body.amenities ?? []).filter((item) => item.trim()),
      metaTitle: body.seo?.metaTitle?.trim(),
      metaDescription: body.seo?.metaDescription?.trim(),
      dataSource: "owner",
      claimStatus: "pending",
      claimed: false,
      verified: false,
      active: true,
      // Always gated pending explicit admin review — see file header.
      needsCategoryReview: true,
      sourceRef: `owner-submission:${user.id}`,
    }),
  );

  return NextResponse.json(
    {
      slug: listing.slug,
      status: "pending_review",
      message: "Listing submitted. It will appear in public search results once a super admin approves it.",
    },
    { status: 201 },
  );
}

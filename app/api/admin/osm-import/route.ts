/**
 * Admin-triggered OSM bulk import (2026-07-16 SEO audit, Critical #1 — second unlock path
 * alongside `POST /api/listings`). Auth/role enforcement happens in
 * `utils/supabase/middleware.ts` (every `/api/admin/*` route requires an authenticated
 * super-admin/admin session).
 *
 * Fetches real, ODbL-licensed business POIs from the public Overpass API for one city bounding
 * box, then runs them through the already-built `AcquisitionService` (entity resolution + dedup
 * against existing listings) via `OsmImporter`. Each imported row gets `dataSource: "osm"` —
 * already in `isIndexableListing()`'s trusted-source allowlist, so rows that clear the quality
 * bar (name, address, a mapped category, qualityScore >= 55) become indexable without a separate
 * manual claim.
 *
 * `dryRun: true` (the default) only fetches and reports what *would* be imported — no writes.
 * Set `dryRun: false` to actually import. This route can write real rows into whatever
 * `createListingRepository()` resolves to (Postgres in production once `DATABASE_URL` is set) —
 * treat a non-dry-run call as a real production data change, not a routine API request.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createAcquisitionRuntime } from "@/lib/acquire";
import { CITY_BOUNDING_BOXES, fetchOsmElements, isCommercial, mapTagsToCategory, type BoundingBox } from "@/lib/acquire";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

type ImportRequestBody = {
  city?: keyof typeof CITY_BOUNDING_BOXES;
  bbox?: BoundingBox;
  dryRun?: boolean;
  /** Safety cap so one call can't accidentally import an unbounded number of rows. */
  maxElements?: number;
};

export async function POST(request: NextRequest) {
  let body: ImportRequestBody = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is fine — defaults apply.
  }

  const bbox = body.bbox ?? (body.city ? CITY_BOUNDING_BOXES[body.city] : undefined) ?? CITY_BOUNDING_BOXES.kathmandu;
  const dryRun = body.dryRun !== false;
  const maxElements = Math.min(body.maxElements ?? 500, 2000);

  let elements;
  try {
    elements = await fetchOsmElements({ bbox });
  } catch (error) {
    return NextResponse.json(
      { error: `Overpass fetch failed: ${error instanceof Error ? error.message : String(error)}` },
      { status: 502 },
    );
  }

  const commercial = elements.filter((element) => isCommercial(element.tags)).slice(0, maxElements);

  if (dryRun) {
    const categoryCounts = commercial.reduce<Record<string, number>>((counts, element) => {
      const category = mapTagsToCategory(element.tags);
      counts[category] = (counts[category] ?? 0) + 1;
      return counts;
    }, {});
    return NextResponse.json({
      dryRun: true,
      bbox,
      totalElementsFetched: elements.length,
      commercialElementsFound: commercial.length,
      categoryCounts,
      sample: commercial.slice(0, 10).map((element) => ({
        name: element.tags.name,
        category: mapTagsToCategory(element.tags),
        lat: element.lat,
        lng: element.lng,
      })),
      note: "No data was written. Re-run with dryRun:false to actually import.",
    });
  }

  const runtime = createAcquisitionRuntime();
  const result = await runtime.osmImporter.import(commercial);

  return NextResponse.json({ dryRun: false, bbox, ...result });
}

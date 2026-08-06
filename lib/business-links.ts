import type { Listing } from "@/lib/enrich";
import { displayAddress } from "@/lib/locality";

/**
 * Business-specific outbound links (audit sec. 7).
 *
 * The profile previously sent every "Directions" click to the site-wide map page, which cannot
 * answer the question the button implies. Directions now resolve to the specific business: exact
 * coordinates when the record has them, otherwise a name-and-address query.
 */
export function getDirectionsUrl(listing: Listing): string {
  const destination = listing.coordinates
    ? `${listing.coordinates.lat},${listing.coordinates.lng}`
    : [listing.name, displayAddress(listing.address), listing.municipality ?? listing.area, "Nepal"]
        .filter((part) => Boolean(part && String(part).trim()))
        .join(", ");
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

/**
 * The auditable source behind a published record, when it is a linkable one. OSM rows carry a
 * type/id pair rather than a URL, so they are rebuilt into a permanent object link; anything that
 * is not an http(s) URL (an internal claim reference, an import batch id) stays unlinked because a
 * reader could not verify it anyway.
 */
export function getListingSourceUrl(listing: Listing): string | undefined {
  if (listing.osmType && typeof listing.osmId === "number") {
    return `https://www.openstreetmap.org/${listing.osmType}/${listing.osmId}`;
  }
  const ref = listing.sourceRef?.trim();
  if (!ref) return undefined;
  try {
    const url = new URL(ref);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Short human label for where a published record came from. */
export function getListingSourceLabel(listing: Listing): string {
  switch (listing.dataSource) {
    case "owner":
      return "Owner submission";
    case "osm":
      return "OpenStreetMap (ODbL)";
    case "import":
      return "Reviewed import";
    case "official":
      return "Official publication";
    case "google_ondemand_reviewed":
      return "Reviewed on-demand lookup";
    default:
      return "Reviewed source";
  }
}

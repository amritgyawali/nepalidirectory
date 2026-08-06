import type { Listing } from "@/lib/enrich";

/**
 * Address and locality normalization (audit sec. 7 and sec. 17).
 *
 * Imported Nepali addresses routinely carry postal artefacts — "P.O. Box 8975", "GPO: 8033",
 * "Post Box 1234" — in the same field as the neighbourhood. Rendered as-is, a mailbox number ends
 * up displayed as the place a business is located, which is wrong for users, wrong in
 * `addressLocality` schema and wrong for anything reading the page as local data.
 */
const postalArtefactPattern =
  /\b(?:g\.?p\.?o\.?|p\.?\s?o\.?|post(?:al)?)\s*(?:box|b\.?o\.?x)?\s*(?:no\.?|number|#|:)?\s*\d+\b/gi;

const bareBoxPattern = /\b(?:box|p\.?o\.?b\.?)\s*(?:no\.?|#|:)?\s*\d+\b/gi;

/** True when the whole value is a postal artefact rather than a place name. */
export function isPostalArtefact(value: string): boolean {
  const cleaned = stripPostalArtefacts(value);
  return Boolean(value.trim()) && cleaned.length === 0;
}

export function stripPostalArtefacts(value: string): string {
  return value
    .replace(postalArtefactPattern, " ")
    .replace(bareBoxPattern, " ")
    // Leftover separators from a removed segment: ", , " or a trailing comma/dash.
    .replace(/\s*[,;]\s*(?=[,;])/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s,;-]+|[\s,;-]+$/g, "")
    .trim();
}

/** Street address with postal-box segments removed but the real address preserved. */
export function displayAddress(address: string | undefined): string {
  return stripPostalArtefacts(address ?? "");
}

/**
 * The most specific real place name for a listing, skipping postal artefacts and values that
 * merely repeat the wider area.
 */
export function displayLocality(listing: Listing): string {
  const candidates = [listing.neighborhood, listing.ward, listing.municipality, listing.area];
  for (const candidate of candidates) {
    const cleaned = stripPostalArtefacts(candidate ?? "");
    if (cleaned && !/^\d+$/.test(cleaned)) return cleaned;
  }
  return stripPostalArtefacts(listing.area ?? "");
}

/** Ordered locality trail ("Putalisadak, Kathmandu, Bagmati") with duplicates collapsed. */
export function localityTrail(listing: Listing): string[] {
  const parts = [
    listing.neighborhood,
    listing.municipality ?? listing.area,
    listing.district,
    listing.province,
  ]
    .map((part) => stripPostalArtefacts(part ?? ""))
    .filter((part) => part.length > 0 && !/^\d+$/.test(part));

  const seen = new Set<string>();
  return parts.filter((part) => {
    const key = part.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

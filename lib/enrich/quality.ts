/**
 * Data-quality score (prompt §6.7): weighted completeness 0–100. Recomputed on every write and
 * used as a ranking factor (§9) and owner-dashboard nudge ("Add hours to reach 85").
 */
import type { Listing } from "./types";

const WEIGHTS = {
  name: 10,
  category: 10,
  geo: 10,
  phone: 15,
  hours: 10,
  description: 15,
  photos: 10,
  website: 5,
  claimed: 15,
} as const;

function has(v: string | undefined | null): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

export function computeQualityScore(l: Listing): number {
  let score = 0;
  if (has(l.name)) score += WEIGHTS.name;
  if (l.categories.length > 0) score += WEIGHTS.category;
  if (l.coordinates) score += WEIGHTS.geo;
  if (has(l.phone)) score += WEIGHTS.phone;
  if (has(l.hoursToday)) score += WEIGHTS.hours;
  if (has(l.description)) score += WEIGHTS.description;
  if (l.photosCount > 0) score += WEIGHTS.photos;
  if (has(l.website)) score += WEIGHTS.website;
  if (l.claimed) score += WEIGHTS.claimed;
  return score; // max 100
}

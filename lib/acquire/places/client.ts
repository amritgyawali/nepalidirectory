/**
 * Google Places — ON-DEMAND ONLY (prompt sec. 2, sec. 6.2, HARD RULE 1).
 *
 * POLICY (enforced by this class exposing ONLY the two methods below):
 *   - Google Maps Platform ToS: `place_id` may be stored indefinitely; nearly ALL other Places
 *     content may only be cached temporarily and MUST NOT be used to build a standalone dataset.
 *   - ALLOWED: (1) verify ONE listing at claim time; (2) admin spot-check ONE listing on demand.
 *   - FORBIDDEN: batch loops over Places endpoints; storing ratings/reviews/photos; any
 *     background harvesting. There is deliberately no method that iterates or bulk-fetches.
 *   - We persist only `google_place_id` + our own derived flags (e.g. verified=true).
 *   - Re-verify current caching windows before relying on any cached field:
 *     developers.google.com/maps/documentation/places/web-service/policies
 */
import type { FetchFn } from "../../ai-core";

export type PlaceMatch = {
  placeId: string;
  name: string;
  formattedAddress?: string;
};

/** Fresh Places data for admin side-by-side review — display only; do NOT bulk-store. */
export type PlaceSpotCheck = {
  placeId: string;
  name?: string;
  formattedAddress?: string;
  phone?: string;
  website?: string;
  openingHours?: string[];
};

export type PlacesConfig = {
  apiKey: string;
  baseUrl?: string;
  fetchFn?: FetchFn;
};

const DEFAULT_BASE = "https://maps.googleapis.com/maps/api/place";

export class PlacesClient {
  private readonly apiKey: string;
  private readonly base: string;
  private readonly fetchFn: FetchFn;

  constructor(cfg: PlacesConfig) {
    this.apiKey = cfg.apiKey;
    this.base = cfg.baseUrl ?? DEFAULT_BASE;
    this.fetchFn = cfg.fetchFn ?? fetch;
  }

  /**
   * Claim verification (Tier 2, prompt sec. 6.2): find the single place matching an owner's
   * name/phone. Returns the match (store only `place_id`) or null.
   */
  async findPlaceForClaim(query: { name?: string; phone?: string }): Promise<PlaceMatch | null> {
    const input = (query.phone ?? query.name ?? "").trim();
    if (!input) return null;
    const url =
      `${this.base}/findplacefromtext/json?input=${encodeURIComponent(input)}` +
      `&inputtype=textquery&fields=place_id,name,formatted_address&key=${this.apiKey}`;
    const res = await this.fetchFn(url);
    if (!res.ok) throw new Error(`places findplace HTTP ${res.status}`);
    const data = (await res.json()) as {
      candidates?: { place_id?: string; name?: string; formatted_address?: string }[];
    };
    const c = data.candidates?.[0];
    if (!c?.place_id) return null;
    return { placeId: c.place_id, name: c.name ?? "", formattedAddress: c.formatted_address };
  }

  /**
   * Admin spot-check (prompt sec. 6.2): fetch fresh details for ONE place so an admin can accept
   * field updates manually. Returned data is for display — persist only curated fields the admin
   * approves (provenance becomes `google_ondemand_reviewed`).
   */
  async adminSpotCheck(placeId: string): Promise<PlaceSpotCheck> {
    const url =
      `${this.base}/details/json?place_id=${encodeURIComponent(placeId)}` +
      `&fields=name,formatted_address,formatted_phone_number,website,opening_hours&key=${this.apiKey}`;
    const res = await this.fetchFn(url);
    if (!res.ok) throw new Error(`places details HTTP ${res.status}`);
    const data = (await res.json()) as {
      result?: {
        name?: string;
        formatted_address?: string;
        formatted_phone_number?: string;
        website?: string;
        opening_hours?: { weekday_text?: string[] };
      };
    };
    const r = data.result ?? {};
    return {
      placeId,
      name: r.name,
      formattedAddress: r.formatted_address,
      phone: r.formatted_phone_number,
      website: r.website,
      openingHours: r.opening_hours?.weekday_text,
    };
  }
}

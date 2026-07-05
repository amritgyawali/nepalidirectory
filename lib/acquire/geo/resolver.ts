/**
 * Geography resolver (prompt sec. 6.1): point-in-polygon lookup of province/district/municipality
 * (and ward when boundaries carry it). Every listing should resolve to at least district +
 * municipality; unresolved points return null and are flagged by the importer.
 */
import type { AdminArea } from "./boundaries";
import { SAMPLE_BOUNDARIES } from "./boundaries";

export type Geography = {
  province: string;
  district: string;
  municipality: string;
  ward?: string;
};

/** Ray-casting point-in-polygon on a [lng, lat] ring. */
export function pointInRing(lng: number, lat: number, ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

export class GeographyResolver {
  private readonly areas: AdminArea[];

  constructor(areas: AdminArea[] = SAMPLE_BOUNDARIES) {
    this.areas = areas;
  }

  resolve(coord: { lat: number; lng: number }): Geography | null {
    for (const a of this.areas) {
      if (pointInRing(coord.lng, coord.lat, a.ring)) {
        return { province: a.province, district: a.district, municipality: a.municipality, ward: a.ward };
      }
    }
    return null;
  }
}

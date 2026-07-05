/**
 * Sample Nepal admin boundaries for geography resolution (prompt sec. 6.1).
 *
 * These are DELIBERATELY simplified bounding polygons for a handful of districts so the resolver
 * and OSM importer are testable without shipping the full national ward GeoJSON. For production,
 * replace `SAMPLE_BOUNDARIES` with a committed Nepal admin GeoJSON (province/district/municipality/
 * ward) or resolve against imported OSM `boundary=administrative` polygons. See docs/DECISIONS.md.
 */

export type AdminArea = {
  province: string;
  district: string;
  municipality: string;
  ward?: string;
  /** Polygon ring as [lng, lat] pairs (closed or open; resolver treats it as closed). */
  ring: [number, number][];
};

/** Rectangle helper: [west, south, east, north] -> ring. */
function box(w: number, s: number, e: number, n: number): [number, number][] {
  return [
    [w, s],
    [e, s],
    [e, n],
    [w, n],
    [w, s],
  ];
}

// Non-overlapping boxes so a point resolves to exactly one district (see importer sample coords).
export const SAMPLE_BOUNDARIES: AdminArea[] = [
  {
    province: "Bagmati",
    district: "Kathmandu",
    municipality: "Kathmandu Metropolitan City",
    ring: box(85.28, 27.69, 85.4, 27.78),
  },
  {
    province: "Bagmati",
    district: "Lalitpur",
    municipality: "Lalitpur Metropolitan City",
    ring: box(85.3, 27.62, 85.36, 27.69),
  },
  {
    province: "Bagmati",
    district: "Bhaktapur",
    municipality: "Bhaktapur Municipality",
    ring: box(85.4, 27.66, 85.47, 27.71),
  },
  {
    province: "Gandaki",
    district: "Kaski",
    municipality: "Pokhara Metropolitan City",
    ring: box(83.9, 28.15, 84.05, 28.28),
  },
];

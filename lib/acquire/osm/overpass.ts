/**
 * Live Overpass API fetcher (2026-07-16 SEO audit, Critical #1 — the OSM importer at
 * `lib/acquire/osm/importer.ts` was fully built but had no live element source wired to it; the
 * doc comment there describes a `nepal-latest.osm.pbf` + `osmium` pipeline for full-country
 * volume, but standing that up is a separate infra task. This module is the lighter-weight path:
 * query the free, public Overpass API (https://overpass-api.de) directly for a bounding box, no
 * local `osmium` binary or PBF download required — enough to seed real, ODbL-licensed business
 * data for one city at a time.
 *
 * Overpass is a shared public resource with a fair-use policy: keep bounding boxes city-sized
 * (not nationwide), set a request timeout, and don't call this in a tight loop.
 */
import type { OsmElement } from "./importer";

export type BoundingBox = { south: number; west: number; north: number; east: number };

/** Rough, hand-checked bounding boxes for the cities NepaliDirectory currently publishes hub pages for. */
export const CITY_BOUNDING_BOXES: Record<string, BoundingBox> = {
  kathmandu: { south: 27.6, west: 85.2, north: 27.8, east: 85.45 }, // Kathmandu Valley: Kathmandu + Lalitpur + Bhaktapur
  lalitpur: { south: 27.6, west: 85.2, north: 27.8, east: 85.45 },
  bhaktapur: { south: 27.6, west: 85.2, north: 27.8, east: 85.45 },
  pokhara: { south: 28.15, west: 83.9, north: 28.3, east: 84.05 },
};

const COMMERCIAL_KEYS = ["shop", "amenity", "tourism", "office", "craft", "healthcare", "leisure"];

function buildQuery(bbox: BoundingBox, timeoutSeconds: number): string {
  const box = `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`;
  const clauses = COMMERCIAL_KEYS.map((key) => `  node["${key}"]["name"](${box});`).join("\n");
  return `[out:json][timeout:${timeoutSeconds}];\n(\n${clauses}\n);\nout body;`;
}

type OverpassElement = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
};

type OverpassResponse = { elements: OverpassElement[] };

export type FetchOsmElementsOptions = {
  bbox: BoundingBox;
  timeoutSeconds?: number;
  /** Injectable for tests; defaults to the global fetch. */
  fetchFn?: typeof fetch;
  endpoint?: string;
};

/** Fetch commercial POIs from the public Overpass API within a bounding box, as OsmElements. */
export async function fetchOsmElements({
  bbox,
  timeoutSeconds = 60,
  fetchFn = fetch,
  // The bare overpass-api.de host returns 406 Not Acceptable for some request paths/regions;
  // the lz4 load-balanced mirror (verified live 2026-07-16) is the reliable default.
  endpoint = "https://lz4.overpass-api.de/api/interpreter",
}: FetchOsmElementsOptions): Promise<OsmElement[]> {
  const query = buildQuery(bbox, timeoutSeconds);
  const response = await fetchFn(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Overpass API request failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as OverpassResponse;
  return data.elements
    .filter((element): element is OverpassElement & { type: "node" } => element.type === "node" && Boolean(element.tags?.name))
    .map((element) => ({
      type: "node" as const,
      id: element.id,
      lat: element.lat,
      lng: element.lon,
      tags: element.tags ?? {},
    }));
}

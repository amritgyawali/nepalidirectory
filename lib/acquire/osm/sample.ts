/**
 * Small sample of Nepal POIs spanning 4 districts (Kathmandu, Lalitpur, Bhaktapur, Kaski) for
 * testing the OSM importer without the full geofabrik extract (prompt sec. 6.1 acceptance:
 * "OSM seed imported for >=3 districts"). Coordinates fall inside the sample boundary boxes.
 * In production, `OsmImporter.import()` streams elements parsed from nepal-latest.osm.pbf.
 */
import type { OsmElement } from "./importer";

export const SAMPLE_OSM_ELEMENTS: OsmElement[] = [
  // Kathmandu
  {
    type: "node",
    id: 101,
    lat: 27.7108,
    lng: 85.3169,
    tags: {
      name: "Himalayan Java Coffee",
      amenity: "cafe",
      "addr:city": "Kathmandu",
      "addr:suburb": "Thamel",
      phone: "+977 1-4700000",
      website: "https://himalayanjava.example",
      opening_hours: "Mo-Su 07:00-21:00",
    },
  },
  {
    type: "node",
    id: 102,
    lat: 27.7045,
    lng: 85.3145,
    tags: { name: "Bir Hospital", amenity: "hospital", "addr:city": "Kathmandu" },
  },
  // Lalitpur
  {
    type: "node",
    id: 103,
    lat: 27.665,
    lng: 85.325,
    tags: {
      name: "Patan Hardware Suppliers",
      shop: "hardware",
      "addr:city": "Lalitpur",
      "addr:suburb": "Pulchowk",
      phone: "01-5540000",
    },
  },
  {
    type: "node",
    id: 104,
    lat: 27.66,
    lng: 85.33,
    tags: { name: "Newa Lahana", amenity: "restaurant", "addr:city": "Lalitpur" },
  },
  // Bhaktapur
  {
    type: "node",
    id: 105,
    lat: 27.671,
    lng: 85.428,
    tags: { name: "Bhaktapur Cafe", amenity: "cafe", "addr:city": "Bhaktapur" },
  },
  {
    type: "node",
    id: 106,
    lat: 27.672,
    lng: 85.43,
    tags: { name: "Thangka House", shop: "clothes", "addr:city": "Bhaktapur" },
  },
  // Kaski (Pokhara)
  {
    type: "node",
    id: 107,
    lat: 28.2096,
    lng: 83.956,
    tags: {
      name: "Lakeside Grand Hotel",
      tourism: "hotel",
      "addr:city": "Pokhara",
      website: "https://lakesidegrand.example",
    },
  },
  {
    type: "node",
    id: 108,
    lat: 28.21,
    lng: 83.96,
    tags: { name: "Pokhara Cycles", shop: "bicycle", "addr:city": "Pokhara" },
  },
  // Skipped: unnamed
  { type: "node", id: 109, lat: 27.71, lng: 85.32, tags: { shop: "kiosk" } },
  // Skipped: non-commercial
  { type: "node", id: 110, lat: 27.71, lng: 85.32, tags: { name: "Ratna Park Bench", amenity: "bench" } },
];

/**
 * OSM tag -> taxonomy mapping (prompt sec. 6.1, table `osm_tag_map`). ~120 rows covering the
 * commercial tags we import. Unmapped-but-commercial tags fall through to `uncategorized` for the
 * AI classifier to fix later (sec. 7). Slugs align with the Phase 1 taxonomy where possible.
 */

export type OsmTagMapRow = { osmKey: string; osmValue: string; categorySlug: string };

export const OSM_TAG_MAP: OsmTagMapRow[] = [
  // amenity (food & drink)
  { osmKey: "amenity", osmValue: "restaurant", categorySlug: "restaurants" },
  { osmKey: "amenity", osmValue: "cafe", categorySlug: "cafes" },
  { osmKey: "amenity", osmValue: "fast_food", categorySlug: "fast-food" },
  { osmKey: "amenity", osmValue: "bar", categorySlug: "bars" },
  { osmKey: "amenity", osmValue: "pub", categorySlug: "bars" },
  { osmKey: "amenity", osmValue: "ice_cream", categorySlug: "cafes" },
  { osmKey: "amenity", osmValue: "food_court", categorySlug: "restaurants" },
  // amenity (money)
  { osmKey: "amenity", osmValue: "bank", categorySlug: "banks" },
  { osmKey: "amenity", osmValue: "atm", categorySlug: "banks" },
  { osmKey: "amenity", osmValue: "bureau_de_change", categorySlug: "money-exchange" },
  // amenity (health)
  { osmKey: "amenity", osmValue: "pharmacy", categorySlug: "pharmacies" },
  { osmKey: "amenity", osmValue: "hospital", categorySlug: "hospitals" },
  { osmKey: "amenity", osmValue: "clinic", categorySlug: "clinics" },
  { osmKey: "amenity", osmValue: "doctors", categorySlug: "doctors" },
  { osmKey: "amenity", osmValue: "dentist", categorySlug: "dentists" },
  { osmKey: "amenity", osmValue: "veterinary", categorySlug: "veterinary" },
  // amenity (education)
  { osmKey: "amenity", osmValue: "school", categorySlug: "schools" },
  { osmKey: "amenity", osmValue: "college", categorySlug: "colleges" },
  { osmKey: "amenity", osmValue: "university", categorySlug: "colleges" },
  { osmKey: "amenity", osmValue: "kindergarten", categorySlug: "schools" },
  { osmKey: "amenity", osmValue: "language_school", categorySlug: "schools" },
  { osmKey: "amenity", osmValue: "driving_school", categorySlug: "driving-schools" },
  { osmKey: "amenity", osmValue: "library", categorySlug: "libraries" },
  // amenity (transport / vehicle)
  { osmKey: "amenity", osmValue: "fuel", categorySlug: "petrol-pumps" },
  { osmKey: "amenity", osmValue: "car_rental", categorySlug: "car-rental" },
  { osmKey: "amenity", osmValue: "car_wash", categorySlug: "car-wash" },
  { osmKey: "amenity", osmValue: "car_repair", categorySlug: "auto-repair" },
  { osmKey: "amenity", osmValue: "charging_station", categorySlug: "ev-charging" },
  // amenity (services / civic)
  { osmKey: "amenity", osmValue: "marketplace", categorySlug: "markets" },
  { osmKey: "amenity", osmValue: "post_office", categorySlug: "courier-services" },
  { osmKey: "amenity", osmValue: "police", categorySlug: "government" },
  { osmKey: "amenity", osmValue: "townhall", categorySlug: "government" },
  { osmKey: "amenity", osmValue: "courthouse", categorySlug: "government" },
  { osmKey: "amenity", osmValue: "place_of_worship", categorySlug: "temples" },
  { osmKey: "amenity", osmValue: "cinema", categorySlug: "cinemas" },
  { osmKey: "amenity", osmValue: "theatre", categorySlug: "event-venues" },
  { osmKey: "amenity", osmValue: "nightclub", categorySlug: "bars" },
  { osmKey: "amenity", osmValue: "spa", categorySlug: "beauty-salons" },

  // shop (food)
  { osmKey: "shop", osmValue: "supermarket", categorySlug: "supermarkets" },
  { osmKey: "shop", osmValue: "convenience", categorySlug: "grocery-stores" },
  { osmKey: "shop", osmValue: "grocery", categorySlug: "grocery-stores" },
  { osmKey: "shop", osmValue: "bakery", categorySlug: "bakeries" },
  { osmKey: "shop", osmValue: "butcher", categorySlug: "meat-shops" },
  { osmKey: "shop", osmValue: "greengrocer", categorySlug: "grocery-stores" },
  { osmKey: "shop", osmValue: "confectionery", categorySlug: "sweets-mithai" },
  { osmKey: "shop", osmValue: "pastry", categorySlug: "bakeries" },
  { osmKey: "shop", osmValue: "alcohol", categorySlug: "liquor-stores" },
  { osmKey: "shop", osmValue: "beverages", categorySlug: "liquor-stores" },
  { osmKey: "shop", osmValue: "dairy", categorySlug: "grocery-stores" },
  { osmKey: "shop", osmValue: "spices", categorySlug: "grocery-stores" },
  // shop (general / department)
  { osmKey: "shop", osmValue: "department_store", categorySlug: "department-stores" },
  { osmKey: "shop", osmValue: "general", categorySlug: "general-stores" },
  { osmKey: "shop", osmValue: "variety_store", categorySlug: "general-stores" },
  { osmKey: "shop", osmValue: "wholesale", categorySlug: "wholesale" },
  { osmKey: "shop", osmValue: "kiosk", categorySlug: "general-stores" },
  // shop (electronics / mobile)
  { osmKey: "shop", osmValue: "electronics", categorySlug: "electronics" },
  { osmKey: "shop", osmValue: "mobile_phone", categorySlug: "mobile-shops" },
  { osmKey: "shop", osmValue: "computer", categorySlug: "computer-shops" },
  { osmKey: "shop", osmValue: "hifi", categorySlug: "electronics" },
  { osmKey: "shop", osmValue: "camera", categorySlug: "electronics" },
  { osmKey: "shop", osmValue: "appliance", categorySlug: "electronics" },
  // shop (clothing / personal)
  { osmKey: "shop", osmValue: "clothes", categorySlug: "clothing" },
  { osmKey: "shop", osmValue: "shoes", categorySlug: "footwear" },
  { osmKey: "shop", osmValue: "jewelry", categorySlug: "jewellery" },
  { osmKey: "shop", osmValue: "bag", categorySlug: "clothing" },
  { osmKey: "shop", osmValue: "boutique", categorySlug: "clothing" },
  { osmKey: "shop", osmValue: "fabric", categorySlug: "clothing" },
  { osmKey: "shop", osmValue: "tailor", categorySlug: "tailors" },
  { osmKey: "shop", osmValue: "watches", categorySlug: "jewellery" },
  { osmKey: "shop", osmValue: "optician", categorySlug: "opticians" },
  { osmKey: "shop", osmValue: "cosmetics", categorySlug: "cosmetics" },
  { osmKey: "shop", osmValue: "beauty", categorySlug: "beauty-salons" },
  { osmKey: "shop", osmValue: "hairdresser", categorySlug: "beauty-salons" },
  { osmKey: "shop", osmValue: "chemist", categorySlug: "pharmacies" },
  // shop (home / hardware)
  { osmKey: "shop", osmValue: "hardware", categorySlug: "hardware-store" },
  { osmKey: "shop", osmValue: "doityourself", categorySlug: "hardware-store" },
  { osmKey: "shop", osmValue: "furniture", categorySlug: "furniture" },
  { osmKey: "shop", osmValue: "paint", categorySlug: "hardware-store" },
  { osmKey: "shop", osmValue: "electrical", categorySlug: "electricians" },
  { osmKey: "shop", osmValue: "trade", categorySlug: "hardware-store" },
  { osmKey: "shop", osmValue: "doors", categorySlug: "hardware-store" },
  { osmKey: "shop", osmValue: "flooring", categorySlug: "hardware-store" },
  { osmKey: "shop", osmValue: "bathroom_furnishing", categorySlug: "hardware-store" },
  { osmKey: "shop", osmValue: "kitchen", categorySlug: "furniture" },
  { osmKey: "shop", osmValue: "curtain", categorySlug: "furniture" },
  { osmKey: "shop", osmValue: "houseware", categorySlug: "general-stores" },
  { osmKey: "shop", osmValue: "florist", categorySlug: "florists" },
  { osmKey: "shop", osmValue: "garden_centre", categorySlug: "nurseries" },
  // shop (vehicle)
  { osmKey: "shop", osmValue: "car", categorySlug: "car-dealers" },
  { osmKey: "shop", osmValue: "car_repair", categorySlug: "auto-repair" },
  { osmKey: "shop", osmValue: "car_parts", categorySlug: "auto-parts" },
  { osmKey: "shop", osmValue: "motorcycle", categorySlug: "motorcycle-dealers" },
  { osmKey: "shop", osmValue: "bicycle", categorySlug: "bicycle-shops" },
  { osmKey: "shop", osmValue: "tyres", categorySlug: "auto-parts" },
  // shop (misc retail)
  { osmKey: "shop", osmValue: "books", categorySlug: "bookstores" },
  { osmKey: "shop", osmValue: "stationery", categorySlug: "stationery" },
  { osmKey: "shop", osmValue: "gift", categorySlug: "gift-shop" },
  { osmKey: "shop", osmValue: "toys", categorySlug: "toy-stores" },
  { osmKey: "shop", osmValue: "sports", categorySlug: "sports-shops" },
  { osmKey: "shop", osmValue: "musical_instrument", categorySlug: "music-shops" },
  { osmKey: "shop", osmValue: "pet", categorySlug: "pet-shops" },
  { osmKey: "shop", osmValue: "photo", categorySlug: "photo-studios" },
  { osmKey: "shop", osmValue: "travel_agency", categorySlug: "travel-agencies" },
  { osmKey: "shop", osmValue: "laundry", categorySlug: "laundry" },
  { osmKey: "shop", osmValue: "dry_cleaning", categorySlug: "laundry" },
  { osmKey: "shop", osmValue: "copyshop", categorySlug: "printing" },
  { osmKey: "shop", osmValue: "printing", categorySlug: "printing" },
  { osmKey: "shop", osmValue: "funeral_directors", categorySlug: "funeral-services" },

  // tourism (lodging / sights)
  { osmKey: "tourism", osmValue: "hotel", categorySlug: "hotels" },
  { osmKey: "tourism", osmValue: "guest_house", categorySlug: "guest-houses" },
  { osmKey: "tourism", osmValue: "hostel", categorySlug: "hostels" },
  { osmKey: "tourism", osmValue: "motel", categorySlug: "hotels" },
  { osmKey: "tourism", osmValue: "apartment", categorySlug: "hotels" },
  { osmKey: "tourism", osmValue: "attraction", categorySlug: "attractions" },
  { osmKey: "tourism", osmValue: "museum", categorySlug: "museums" },
  { osmKey: "tourism", osmValue: "gallery", categorySlug: "art-galleries" },

  // office (professional services)
  { osmKey: "office", osmValue: "lawyer", categorySlug: "lawyers" },
  { osmKey: "office", osmValue: "accountant", categorySlug: "accountants" },
  { osmKey: "office", osmValue: "estate_agent", categorySlug: "real-estate" },
  { osmKey: "office", osmValue: "insurance", categorySlug: "home-insurance" },
  { osmKey: "office", osmValue: "it", categorySlug: "it-services" },
  { osmKey: "office", osmValue: "travel_agent", categorySlug: "travel-agencies" },
  { osmKey: "office", osmValue: "employment_agency", categorySlug: "consultancies" },
  { osmKey: "office", osmValue: "educational_institution", categorySlug: "consultancies" },
  { osmKey: "office", osmValue: "financial", categorySlug: "financial-services" },
  { osmKey: "office", osmValue: "advertising_agency", categorySlug: "advertising" },
  { osmKey: "office", osmValue: "architect", categorySlug: "architects" },
  { osmKey: "office", osmValue: "company", categorySlug: "consultancies" },
  { osmKey: "office", osmValue: "government", categorySlug: "government" },
  { osmKey: "office", osmValue: "ngo", categorySlug: "ngos" },

  // craft (trades)
  { osmKey: "craft", osmValue: "electrician", categorySlug: "electricians" },
  { osmKey: "craft", osmValue: "plumber", categorySlug: "plumbers" },
  { osmKey: "craft", osmValue: "carpenter", categorySlug: "carpenters" },
  { osmKey: "craft", osmValue: "painter", categorySlug: "painters" },
  { osmKey: "craft", osmValue: "hvac", categorySlug: "ac-repair" },
  { osmKey: "craft", osmValue: "tailor", categorySlug: "tailors" },
  { osmKey: "craft", osmValue: "photographer", categorySlug: "photo-studios" },
  { osmKey: "craft", osmValue: "metal_construction", categorySlug: "contractors" },
  { osmKey: "craft", osmValue: "builder", categorySlug: "contractors" },
  { osmKey: "craft", osmValue: "electronics_repair", categorySlug: "electronics-repair" },

  // healthcare
  { osmKey: "healthcare", osmValue: "clinic", categorySlug: "clinics" },
  { osmKey: "healthcare", osmValue: "hospital", categorySlug: "hospitals" },
  { osmKey: "healthcare", osmValue: "doctor", categorySlug: "doctors" },
  { osmKey: "healthcare", osmValue: "dentist", categorySlug: "dentists" },
  { osmKey: "healthcare", osmValue: "physiotherapist", categorySlug: "physiotherapy" },
  { osmKey: "healthcare", osmValue: "laboratory", categorySlug: "diagnostic-labs" },
  { osmKey: "healthcare", osmValue: "pharmacy", categorySlug: "pharmacies" },
  { osmKey: "healthcare", osmValue: "optometrist", categorySlug: "opticians" },

  // leisure
  { osmKey: "leisure", osmValue: "fitness_centre", categorySlug: "gyms" },
  { osmKey: "leisure", osmValue: "sports_centre", categorySlug: "sports-centres" },
];

/** Keys we scan, in priority order, when classifying an element. */
const KEY_PRIORITY = ["shop", "amenity", "tourism", "healthcare", "office", "craft", "leisure"];

/** Commercial `amenity` values worth importing (prompt sec. 6.1 whitelist). */
const AMENITY_WHITELIST = new Set(
  OSM_TAG_MAP.filter((r) => r.osmKey === "amenity").map((r) => r.osmValue),
);

const TOURISM_WHITELIST = new Set(["hotel", "guest_house", "hostel", "attraction"]);
const LEISURE_WHITELIST = new Set(["fitness_centre", "sports_centre"]);

const LOOKUP = new Map(OSM_TAG_MAP.map((r) => [`${r.osmKey}=${r.osmValue}`, r.categorySlug]));

/** True if the element's tags make it a commercial POI we import (prompt sec. 6.1). */
export function isCommercial(tags: Record<string, string>): boolean {
  if (tags.shop || tags.office || tags.craft || tags.healthcare) return true;
  if (tags.amenity && AMENITY_WHITELIST.has(tags.amenity)) return true;
  if (tags.tourism && TOURISM_WHITELIST.has(tags.tourism)) return true;
  if (tags.leisure && LEISURE_WHITELIST.has(tags.leisure)) return true;
  return false;
}

/** Map an element's tags to a category slug; unmapped-but-commercial -> `uncategorized`. */
export function mapTagsToCategory(tags: Record<string, string>): string {
  for (const key of KEY_PRIORITY) {
    const value = tags[key];
    if (!value) continue;
    const slug = LOOKUP.get(`${key}=${value}`);
    if (slug) return slug;
  }
  return "uncategorized";
}

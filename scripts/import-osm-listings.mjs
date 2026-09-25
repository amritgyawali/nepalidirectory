#!/usr/bin/env node
/**
 * OpenStreetMap listing importer.
 *
 * Fetches ODbL-licensed POIs for Nepal from Overpass, cleans them hard, and emits INSERT-ready
 * rows for the `listings` table. Prints SQL to stdout; nothing is written directly.
 *
 *   node scripts/import-osm-listings.mjs hotels   > /tmp/hotels.sql
 *   node scripts/import-osm-listings.mjs food     > /tmp/food.sql
 *
 * Why the filtering is this aggressive: OSM's `tourism=*` and `amenity=*` values are
 * community-tagged and carry real mistags. A single import run surfaced a concrete electric pole
 * tagged `tourism=hotel`, several eateries tagged as hotels, student hostels mixed in with
 * traveller accommodation, `google.com` as a business website, and a 14-digit "phone number".
 * Publishing any of those would damage the directory's credibility far more than the extra
 * listings are worth, so anything that cannot be confidently classified is dropped rather than
 * flagged for later review.
 *
 * Records that survive still have to clear `evaluateListingIndexEligibility` on their own merits;
 * this script only decides what is worth offering to that gate.
 */
import { createHash } from "node:crypto";

const OVERPASS = "https://overpass-api.de/api/interpreter";

/** City centroids used to place a POI. Only cities with a published city page are listed. */
const CITIES = {
  kathmandu: [27.7172, 85.324], lalitpur: [27.6644, 85.3188], bhaktapur: [27.671, 85.4298],
  pokhara: [28.2096, 83.9856], chitwan: [27.61, 84.46], butwal: [27.7006, 83.4484],
  biratnagar: [26.4525, 87.2718], dharan: [26.8065, 87.2846],
};
/** A POI further than this from every centroid is skipped rather than guessed into a city. */
const MAX_CITY_KM = 15;

const PRESETS = {
  hotels: {
    query: `node["tourism"~"^(hotel|guest_house|hostel|resort)$"]["name"]["addr:street"](area.np);`,
    category: "hotels",
    label: (t) => ({ hotel: "hotel", guest_house: "guest house", hostel: "hostel", resort: "resort" }[t.tourism] ?? "hotel"),
    // Names denoting something that is plainly not accommodation.
    reject: /\b(cold store|party palace|banquet|restaurant|cafe|coffee|bakery|store|shop|mart|pharmacy|clinic|hospital|school|college|bank|showroom|workshop|garage|tailor|salon|parlou?r|hardware|traders|suppliers|enterprises|petrol|filling station|temple|monastery|museum|office|momo|bhojanalaya|bhojnalaya|bhojan|khaja|sekuwa|shekwa|chiya|sweet|chaat|pole|tower|atm|hut|dairy|pasal|boys home|girls home|boys hostel|girls hostel|academy hostel)\b/i,
    blurb: (r) => `${r.name} is a ${r.type} on ${r.locality} in ${r.area}, Nepal, published from openly licensed OpenStreetMap data. Confirm current room availability, rates, facilities and check-in times directly with the property before booking.`,
  },
  food: {
    // Locality-level addressing: much of Nepal has no street number, so addr:suburb/place count.
    query: `node["amenity"~"^(restaurant|cafe|fast_food)$"]["name"](area.np);`,
    category: "restaurants",
    label: (t) => ({ restaurant: "restaurant", cafe: "cafe", fast_food: "fast food outlet" }[t.amenity] ?? "restaurant"),
    reject: /\b(hardware|pharmacy|clinic|hospital|school|college|bank|atm|pole|tower|showroom|workshop|garage|tailor|salon|parlou?r|petrol|filling station|traders|suppliers|boys hostel|girls hostel)\b/i,
    blurb: (r) => `${r.name} is a ${r.type} in ${r.locality}, ${r.area}, Nepal${r.cuisine ? `, serving ${r.cuisine}` : ""}. Published from openly licensed OpenStreetMap data. Confirm current opening hours, menu, prices and dietary options directly with the business before visiting.`,
  },
};

const JUNK_SITE = /(google\.com\/?$|offlinemaps|example\.com|localhost|facebook\.com\/?$)/i;

const km = (aLat, aLng, bLat, bLng) => {
  const r = (d) => (d * Math.PI) / 180;
  return 2 * 6371 * Math.asin(Math.sqrt(
    Math.sin(r(bLat - aLat) / 2) ** 2 +
    Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(r(bLng - aLng) / 2) ** 2));
};

const slugify = (s) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

/** Keeps the first number only, and rejects anything that is not a plausible Nepali number. */
function normalisePhone(raw) {
  if (!raw) return "";
  const first = raw.split(/[;,/]/)[0].replace(/[^\d+]/g, "");
  let digits = first.replace(/\D/g, "");
  if (digits.startsWith("977")) digits = digits.slice(3);
  digits = digits.replace(/^0+/, "");
  return digits.length >= 7 && digits.length <= 10 ? first : "";
}

/** Mirrors computeQualityScore for the fields an OSM record can supply. */
const scoreOf = (r) => 45 + (r.phone ? 15 : 0) + (r.hours ? 10 : 0) + (r.website ? 5 : 0);

async function fetchPois(preset) {
  const body = `[out:json][timeout:240];area["ISO3166-1"="NP"][admin_level=2]->.np;${preset.query}out body;`;
  const res = await fetch(OVERPASS, { method: "POST", body });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  return (await res.json()).elements ?? [];
}

function clean(elements, preset) {
  const rows = [];
  const slugs = new Set();
  for (const el of elements) {
    const t = el.tags ?? {};
    const name = (t.name ?? "").trim();
    if (!name || name.length < 3 || el.lat == null || preset.reject.test(name)) continue;

    const phone = normalisePhone(t.phone ?? t["contact:phone"] ?? "");
    let website = (t.website ?? t["contact:website"] ?? "").trim();
    if (JUNK_SITE.test(website)) website = "";
    if (!phone && !website) continue;

    const locality = (t["addr:street"] ?? t["addr:suburb"] ?? t["addr:place"]
      ?? t["addr:neighbourhood"] ?? t["addr:city"] ?? "").trim();
    if (!locality) continue;

    const declared = (t["addr:city"] ?? "").toLowerCase();
    let area = Object.keys(CITIES).find((c) => declared.includes(c));
    if (!area) {
      const [best] = Object.entries(CITIES)
        .map(([c, [la, ln]]) => [c, km(el.lat, el.lon, la, ln)])
        .sort((a, b) => a[1] - b[1]);
      if (best[1] <= MAX_CITY_KM) area = best[0];
    }
    if (!area) continue;

    let slug = slugify(name) || `place-${el.id}`;
    if (slugs.has(slug)) slug = `${slug}-${el.id}`;
    if (slugs.has(slug)) continue;
    slugs.add(slug);

    const row = {
      slug, name, type: preset.label(t), area: area[0].toUpperCase() + area.slice(1),
      locality, phone, website, lat: el.lat, lng: el.lon,
      hours: t.opening_hours ?? "", osmId: el.id,
      cuisine: (t.cuisine ?? "").split(";").filter(Boolean)
        .map((c) => c.replace(/_/g, " ").trim()).join(", ").slice(0, 60),
    };
    row.score = scoreOf(row);
    if (row.score < 55) continue;
    rows.push(row);
  }
  // Same business mapped twice: identical phone at the same locality.
  const seen = new Set();
  return rows.sort((a, b) => b.score - a.score).filter((r) => {
    if (!r.phone) return true;
    const key = createHash("sha1").update(`${r.phone}|${r.locality.toLowerCase()}`).digest("hex");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const sqlStr = (v) => (v ? `'${String(v).replace(/'/g, "''")}'` : "NULL");

function toSql(rows, preset) {
  const values = rows.map((r) => [
    sqlStr(r.slug), sqlStr(r.name), `ARRAY['${preset.category}',${sqlStr(r.type)}]`,
    sqlStr(r.area), sqlStr(`${r.locality}, ${r.area}, Nepal`), sqlStr(r.phone), sqlStr(r.website),
    sqlStr(r.hours), "'open'", "true", "true", "false", "'unclaimed'", "'osm'", "'source_verified'",
    sqlStr(`node/${r.osmId}`), "'ODbL, OpenStreetMap contributors'", "now()", "now()",
    "'editorial:osm-import-check'", "now()", "false", "false", sqlStr(preset.blurb(r)),
    "'osm_tags'", r.lat, r.lng, "'node'", r.osmId, r.score,
  ].join(",")).map((v) => `(${v})`);

  return `insert into listings (
  slug,name,categories,area,address,phone,website,hours_today,status,active,verified,claimed,
  claim_status,data_source,verification_status,source_ref,license_note,source_checked_at,
  content_reviewed_at,content_reviewed_by,last_meaningful_update_at,needs_category_review,
  image_verified,description_en,description_source,lat,lng,osm_type,osm_id,quality_score
) values\n${values.join(",\n")}\non conflict (slug) do nothing;`;
}

const which = process.argv[2];
const preset = PRESETS[which];
if (!preset) {
  console.error(`usage: node scripts/import-osm-listings.mjs <${Object.keys(PRESETS).join("|")}>`);
  process.exit(1);
}
const elements = await fetchPois(preset);
const rows = clean(elements, preset);
console.error(`${which}: ${elements.length} POIs fetched, ${rows.length} publishable after cleaning`);
console.log(toSql(rows, preset));

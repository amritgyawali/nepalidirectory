/**
 * Bulk-loads the extracted OpenStreetMap Nepal commercial POIs into `listings` (Tier 1, prompt
 * sec. 6.1). Reads the NDJSON produced from `nepal-latest.osm.pbf` and upserts in batches.
 *
 *   DATABASE_URL="postgresql://…" node scripts/import-osm.mjs [path/to/osm-nepal.ndjson]
 *
 * Idempotent: conflicts resolve on the existing partial unique index `idx_listings_osm`
 * (osm_type, osm_id) so re-running after a monthly refresh updates rather than duplicates.
 * Claimed listings are never overwritten — a business owner's edits always win (HARD RULE 3
 * in spirit: we don't clobber first-party data with third-party data).
 *
 * OSM rows carry data_source='osm' + license_note='ODbL', keeping them separable from
 * first-party rows for the ODbL share-alike obligation (prompt sec. 2).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const DATA = process.argv[2] ?? join(import.meta.dirname, "..", "db", "imports", "osm-nepal.ndjson");
const BATCH = 1000;

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Supabase → Project Settings → Database → Connection string (URI).");
  process.exit(1);
}

const slugify = (s) =>
  s.toLowerCase().trim()
    .replace(/[^a-z0-9ऀ-ॿ]+/g, "-")   // keep Devanagari so Nepali names don't collapse to ""
    .replace(/^-+|-+$/g, "");

// OSM is crowd-tagged and fields land in the wrong keys (a real row in this extract had
// phone='https://www.ntc.net.np'). A blank field beats a wrong one in a directory.
const cleanPhone = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  if (/^https?:/i.test(s) || /@/.test(s)) return null;
  return (s.match(/\d/g) ?? []).length >= 6 ? s : null;
};
const cleanUrl = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  if (/\s/.test(s) || !/\./.test(s) || /^[\d\s+()-]+$/.test(s)) return null;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
};
const cleanEmail = (v) => {
  if (!v) return null;
  const first = String(v).split(/[;,]/)[0].trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(first) ? first : null;
};

const COLS = [
  "slug", "name", "categories", "area", "neighborhood", "address", "phone", "website", "email",
  "hours_today", "lat", "lng", "data_source", "license_note", "source_ref", "osm_type", "osm_id", "active",
];

const client = new pg.Client({ connectionString: url });
await client.connect();

// Seed the slug set from what's already there so we never trip the UNIQUE(slug) constraint.
const { rows: existing } = await client.query("select slug from listings");
const taken = new Set(existing.map((r) => r.slug));
console.log(`existing listings: ${taken.size}`);

const records = readFileSync(DATA, "utf8").trim().split("\n").map((l) => JSON.parse(l));
console.log(`extracted records: ${records.length}`);

const scrubbed = { phone: 0, website: 0, email: 0 };
let skipped = 0;
const rows = [];
for (const r of records) {
  if (!r.name?.trim() || r.lat == null || r.lng == null) { skipped++; continue; }

  let slug = slugify(r.name);
  if (!slug) { skipped++; continue; }
  if (taken.has(slug) && r.area) slug = `${slug}-${slugify(r.area)}`;
  if (taken.has(slug)) slug = `${slug}-${r.osmId}`;      // osm id is stable, so re-runs match
  if (taken.has(slug)) { skipped++; continue; }
  taken.add(slug);

  const phone = cleanPhone(r.phone);
  const website = cleanUrl(r.website);
  const email = cleanEmail(r.email);
  if (r.phone && !phone) scrubbed.phone++;
  if (r.website && !website) scrubbed.website++;
  if (r.email && !email) scrubbed.email++;

  rows.push([
    slug, r.name, [r.category], r.area, r.neighborhood, r.address, phone, website, email,
    r.hours, r.lat, r.lng, "osm", "ODbL", `${r.osmType}/${r.osmId}`, r.osmType, r.osmId, true,
  ]);
}
console.log(`ready: ${rows.length}  skipped: ${skipped}`);
console.log(`scrubbed bad values — phone ${scrubbed.phone}, website ${scrubbed.website}, email ${scrubbed.email}`);

const UPSERT = `
  ON CONFLICT (osm_type, osm_id) WHERE osm_id IS NOT NULL DO UPDATE SET
    name        = EXCLUDED.name,
    categories  = EXCLUDED.categories,
    area        = COALESCE(EXCLUDED.area, listings.area),
    address     = COALESCE(EXCLUDED.address, listings.address),
    phone       = COALESCE(EXCLUDED.phone, listings.phone),
    website     = COALESCE(EXCLUDED.website, listings.website),
    email       = COALESCE(EXCLUDED.email, listings.email),
    hours_today = COALESCE(EXCLUDED.hours_today, listings.hours_today),
    lat = EXCLUDED.lat, lng = EXCLUDED.lng, updated_at = now()
  WHERE listings.claimed IS NOT TRUE`;

let done = 0;
const started = Date.now();
for (let i = 0; i < rows.length; i += BATCH) {
  const chunk = rows.slice(i, i + BATCH);
  const params = [];
  const tuples = chunk.map((row) => {
    const ph = row.map((v) => { params.push(v); return `$${params.length}`; });
    return `(${ph.join(",")})`;
  });
  await client.query(
    `INSERT INTO listings (${COLS.join(",")}) VALUES ${tuples.join(",")}${UPSERT}`,
    params,
  );
  done += chunk.length;
  process.stdout.write(`\rimported ${done}/${rows.length}`);
}

const secs = ((Date.now() - started) / 1000).toFixed(1);
const { rows: [tally] } = await client.query(
  "select count(*) filter (where data_source='osm') osm, count(*) total from listings",
);
console.log(`\ndone in ${secs}s — listings now: ${tally.total} total, ${tally.osm} from OSM`);
await client.end();

/**
 * Generates db/seeds/osm_tag_map.sql from lib/acquire/osm/tag-map.ts so the SQL seed cannot drift
 * from the code seed. Run: `node scripts/gen-osm-seed.ts`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { OSM_TAG_MAP } from "../lib/acquire/osm/tag-map.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const values = OSM_TAG_MAP.map(
  (r) => `  ('${r.osmKey}', '${r.osmValue}', '${r.categorySlug}')`,
).join(",\n");

const sql = `-- Generated from lib/acquire/osm/tag-map.ts by scripts/gen-osm-seed.ts. Do not edit by hand.
-- ${OSM_TAG_MAP.length} rows. Prompt sec. 6.1 (table osm_tag_map).
INSERT INTO osm_tag_map (osm_key, osm_value, category_slug) VALUES
${values}
ON CONFLICT (osm_key, osm_value) DO NOTHING;
`;

mkdirSync(join(root, "db", "seeds"), { recursive: true });
writeFileSync(join(root, "db", "seeds", "osm_tag_map.sql"), sql);
console.log(`wrote db/seeds/osm_tag_map.sql (${OSM_TAG_MAP.length} rows)`);

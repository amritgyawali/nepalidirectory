#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";

const { Client } = pg;
const args = process.argv.slice(2);

function option(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

if (args.includes("--help")) {
  process.stdout.write(
    "Usage: npm run seo:audit-listings -- [--format json|csv] [--output path]\n" +
      "Runs a read-only duplicate/template audit. Existing output files are never overwritten.\n",
  );
  process.exit(0);
}

const format = option("--format") ?? "json";
if (!new Set(["json", "csv"]).has(format)) {
  throw new Error("--format must be json or csv");
}

const outputArg = option("--output");
const outputPath = outputArg ? resolve(process.cwd(), outputArg) : undefined;
if (outputPath && existsSync(outputPath)) {
  throw new Error(`Refusing to overwrite existing report: ${outputPath}`);
}

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. The value is never printed or written to the report.");
}

function fingerprint(value) {
  const normalized = String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  return normalized ? createHash("sha256").update(normalized).digest("hex").slice(0, 16) : "";
}

function normalizeText(value, row) {
  let normalized = String(value ?? "")
    .toLowerCase()
    .replace(/https?:\/\/\S+|\b[\w.+-]+@[\w.-]+\.\w+|\+?\d[\d\s()-]{6,}\d/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const variable of [row.name, row.area]) {
    const token = String(variable ?? "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").trim();
    if (token.length >= 3) normalized = normalized.replaceAll(token, " {variable} ");
  }
  return normalized.replace(/\b\d+\b/g, " {number} ").replace(/\s+/g, " ").trim();
}

function tokens(value) {
  return new Set(value.split(" ").filter((token) => token.length > 2));
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

function addToMap(map, key, id) {
  if (!key) return;
  const ids = map.get(key) ?? [];
  ids.push(id);
  map.set(key, ids);
}

function duplicateIds(map, key, currentId) {
  return (map.get(key) ?? []).filter((id) => id !== currentId);
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query("BEGIN TRANSACTION READ ONLY");
  const result = await client.query(`
    SELECT id, slug, name, area, categories, description_en, services, amenities,
           hours_today, rating, reviews, price, lat, lng, image, phone, website,
           email, address, attributes, verification_status, active
      FROM listings
     ORDER BY id
  `);

  const rows = result.rows.map((row) => ({
    ...row,
    id: Number(row.id),
    normalizedName: String(row.name ?? "").trim().toLowerCase().replace(/\s+/g, " "),
    descriptionTemplate: normalizeText(row.description_en, row),
    descriptionTokens: tokens(normalizeText(row.description_en, row)),
    phoneFingerprint: fingerprint(row.phone),
    domainFingerprint: fingerprint((() => {
      try {
        return row.website ? new URL(row.website).hostname.replace(/^www\./, "") : "";
      } catch {
        return row.website;
      }
    })()),
    emailFingerprint: fingerprint(row.email),
    addressFingerprint: fingerprint(row.address),
    imageFingerprint: fingerprint(row.image),
    attributeFingerprint: fingerprint(JSON.stringify({
      services: row.services ?? [],
      amenities: row.amenities ?? [],
      attributes: row.attributes ?? {},
    })),
    patternFingerprint: fingerprint(JSON.stringify({
      hours: row.hours_today,
      price: row.price,
      lat: row.lat == null ? null : Number(row.lat).toFixed(5),
      lng: row.lng == null ? null : Number(row.lng).toFixed(5),
      rating: row.rating,
      reviews: row.reviews,
    })),
  }));

  const maps = {
    name: new Map(),
    phone: new Map(),
    domain: new Map(),
    email: new Map(),
    address: new Map(),
    description: new Map(),
    image: new Map(),
    attributes: new Map(),
    pattern: new Map(),
  };

  for (const row of rows) {
    addToMap(maps.name, row.normalizedName, row.id);
    addToMap(maps.phone, row.phoneFingerprint, row.id);
    addToMap(maps.domain, row.domainFingerprint, row.id);
    addToMap(maps.email, row.emailFingerprint, row.id);
    addToMap(maps.address, row.addressFingerprint, row.id);
    addToMap(maps.description, fingerprint(row.descriptionTemplate), row.id);
    addToMap(maps.image, row.imageFingerprint, row.id);
    addToMap(maps.attributes, row.attributeFingerprint, row.id);
    addToMap(maps.pattern, row.patternFingerprint, row.id);
  }

  const similarityBuckets = new Map();
  for (const row of rows) {
    const key = [...row.descriptionTokens].sort().slice(0, 3).join("|");
    if (!key || row.descriptionTokens.size < 8) continue;
    const bucket = similarityBuckets.get(key) ?? [];
    bucket.push(row);
    similarityBuckets.set(key, bucket);
  }

  const similarById = new Map();
  for (const bucket of similarityBuckets.values()) {
    for (let left = 0; left < bucket.length; left += 1) {
      for (let right = left + 1; right < bucket.length; right += 1) {
        if (jaccard(bucket[left].descriptionTokens, bucket[right].descriptionTokens) < 0.9) continue;
        addToMap(similarById, bucket[left].id, bucket[right].id);
        addToMap(similarById, bucket[right].id, bucket[left].id);
      }
    }
  }

  const findings = rows.flatMap((row) => {
    const signals = [];
    const related = new Set();
    const collect = (signal, ids) => {
      if (!ids.length) return;
      signals.push(signal);
      ids.forEach((id) => related.add(id));
    };

    collect("DUPLICATE_NAME", duplicateIds(maps.name, row.normalizedName, row.id));
    collect("DUPLICATE_PHONE", duplicateIds(maps.phone, row.phoneFingerprint, row.id));
    collect("DUPLICATE_DOMAIN", duplicateIds(maps.domain, row.domainFingerprint, row.id));
    collect("DUPLICATE_EMAIL", duplicateIds(maps.email, row.emailFingerprint, row.id));
    collect("DUPLICATE_ADDRESS", duplicateIds(maps.address, row.addressFingerprint, row.id));
    collect("EXACT_DESCRIPTION_TEMPLATE", duplicateIds(maps.description, fingerprint(row.descriptionTemplate), row.id));
    collect("HIGH_SIMILARITY_DESCRIPTION", similarById.get(row.id) ?? []);
    collect("REPEATED_IMAGE", duplicateIds(maps.image, row.imageFingerprint, row.id));
    collect("REPEATED_ATTRIBUTES", duplicateIds(maps.attributes, row.attributeFingerprint, row.id));
    collect("REPEATED_HOURS_PRICE_COORDINATES_RATING", duplicateIds(maps.pattern, row.patternFingerprint, row.id));
    if (Number(row.rating ?? 0) > 0 || Number(row.reviews ?? 0) > 0 || Number(row.price ?? 0) > 0) {
      signals.push("LEGACY_RATING_OR_PRICE_VALUE");
    }
    if (!signals.length) return [];

    const duplicateEvidence = signals.some((signal) =>
      ["DUPLICATE_PHONE", "DUPLICATE_DOMAIN", "DUPLICATE_EMAIL", "DUPLICATE_ADDRESS"].includes(signal),
    );
    const templated = signals.some((signal) =>
      ["EXACT_DESCRIPTION_TEMPLATE", "HIGH_SIMILARITY_DESCRIPTION"].includes(signal),
    );
    return [{
      id: row.id,
      slug: row.slug,
      signals,
      relatedListingIds: [...related].sort((a, b) => a - b).slice(0, 50),
      recommendedStatus: duplicateEvidence
        ? "DUPLICATE_REVIEW"
        : templated
          ? "NOINDEX_PENDING_UNIQUE_REVIEW"
          : "MANUAL_EVIDENCE_REVIEW",
      contactFingerprints: {
        phone: row.phoneFingerprint || undefined,
        domain: row.domainFingerprint || undefined,
        email: row.emailFingerprint || undefined,
        address: row.addressFingerprint || undefined,
      },
      descriptionFingerprint: fingerprint(row.descriptionTemplate) || undefined,
    }];
  });

  const report = {
    generatedAt: new Date().toISOString(),
    transactionMode: "READ ONLY",
    privacy: "Contact values and addresses are represented only by truncated SHA-256 fingerprints.",
    listingCount: rows.length,
    findingCount: findings.length,
    findings,
  };

  let payload;
  if (format === "json") {
    payload = `${JSON.stringify(report, null, 2)}\n`;
  } else {
    const headers = ["id", "slug", "signals", "relatedListingIds", "recommendedStatus", "descriptionFingerprint"];
    const csvRows = findings.map((finding) =>
      [
        finding.id,
        finding.slug,
        finding.signals,
        finding.relatedListingIds,
        finding.recommendedStatus,
        finding.descriptionFingerprint,
      ].map(csvCell).join(","),
    );
    payload = `${headers.map(csvCell).join(",")}\n${csvRows.join("\n")}\n`;
  }

  await client.query("ROLLBACK");
  if (outputPath) {
    writeFileSync(outputPath, payload, { encoding: "utf8", flag: "wx", mode: 0o600 });
    process.stdout.write(`Wrote ${findings.length} findings to ${outputPath}\n`);
  } else {
    process.stdout.write(payload);
  }
} catch (error) {
  try {
    await client.query("ROLLBACK");
  } catch {
    // The connection or transaction may not have started.
  }
  throw error;
} finally {
  await client.end().catch(() => undefined);
}

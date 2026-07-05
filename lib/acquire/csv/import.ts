/**
 * CSV / official import (prompt sec. 6.5, Tier 5). Column-mapping -> dry-run preview -> commit
 * through the same AcquisitionService dedup pipeline, tagged data_source='import'.
 */
import { makeNewListing } from "../../enrich/listing-repo";
import type { NewListing } from "../../enrich/types";
import type { AcquisitionService, IngestResult } from "../service";

/** Maps a listing field name to the CSV header that supplies it. */
export type CsvColumnMapping = {
  name: string;
  area: string;
  address: string;
  phone?: string;
  website?: string;
  category?: string;
  lat?: string;
  lng?: string;
  neighborhood?: string;
};

export type ParsedCsv = { headers: string[]; rows: string[][] };
export type CsvRowError = { row: number; message: string };
export type CsvBuildResult = { candidates: NewListing[]; errors: CsvRowError[] };
export type CsvDryRun = CsvBuildResult & { total: number };

/** RFC-4180-ish CSV parser: handles quoted fields, escaped quotes, and commas/newlines. */
export function parseCsv(text: string): ParsedCsv {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  const src = text.replace(/\r\n?/g, "\n");

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const nonEmpty = rows.filter((r) => r.some((v) => v.trim() !== ""));
  const headers = nonEmpty.shift() ?? [];
  return { headers: headers.map((h) => h.trim()), rows: nonEmpty };
}

function value(headers: string[], row: string[], header?: string): string | undefined {
  if (!header) return undefined;
  const idx = headers.indexOf(header);
  if (idx < 0) return undefined;
  const v = row[idx]?.trim();
  return v ? v : undefined;
}

export function buildCandidates(
  parsed: ParsedCsv,
  mapping: CsvColumnMapping,
  sourceRef: string,
): CsvBuildResult {
  const candidates: NewListing[] = [];
  const errors: CsvRowError[] = [];

  parsed.rows.forEach((row, i) => {
    const name = value(parsed.headers, row, mapping.name);
    const area = value(parsed.headers, row, mapping.area) ?? "";
    const address = value(parsed.headers, row, mapping.address) ?? "";
    if (!name) {
      errors.push({ row: i + 2, message: "missing name" });
      return;
    }
    const lat = value(parsed.headers, row, mapping.lat);
    const lng = value(parsed.headers, row, mapping.lng);
    const coordinates =
      lat && lng && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
        ? { lat: Number(lat), lng: Number(lng) }
        : undefined;

    candidates.push(
      makeNewListing({
        name,
        area,
        address,
        neighborhood: value(parsed.headers, row, mapping.neighborhood),
        phone: value(parsed.headers, row, mapping.phone),
        website: value(parsed.headers, row, mapping.website),
        categories: [value(parsed.headers, row, mapping.category) ?? "uncategorized"],
        coordinates,
        dataSource: "import",
        sourceRef,
      }),
    );
  });

  return { candidates, errors };
}

/** Preview only — no writes (prompt sec. 6.5). */
export function importCsvDryRun(
  text: string,
  mapping: CsvColumnMapping,
  sourceRef: string,
): CsvDryRun {
  const built = buildCandidates(parseCsv(text), mapping, sourceRef);
  return { ...built, total: built.candidates.length };
}

/** Commit: each candidate goes through dedup (prompt sec. 6.5 / 6.6). */
export async function importCsvCommit(
  text: string,
  mapping: CsvColumnMapping,
  sourceRef: string,
  service: AcquisitionService,
): Promise<{ imported: number; errors: CsvRowError[]; results: IngestResult[] }> {
  const { candidates, errors } = buildCandidates(parseCsv(text), mapping, sourceRef);
  const results: IngestResult[] = [];
  for (const c of candidates) results.push(await service.ingest(c));
  return { imported: results.length, errors, results };
}

/**
 * OSM bulk importer (prompt sec. 6.1, Tier 1). Consumes a stream of OSM elements, keeps named
 * commercial POIs, maps tags to a category, tags rows with ODbL provenance + natural key, and
 * funnels each through the AcquisitionService (geography + dedup). Records an ingest_batches row.
 *
 * The element stream is injectable: tests use SAMPLE_OSM_ELEMENTS; production parses
 * nepal-latest.osm.pbf (config OSM_PBF_URL) via `osmium export --output-format=geojsonseq` piped
 * into a feature->OsmElement adapter (see docs/DECISIONS.md). Re-runnable monthly (idempotent
 * upsert on osm_type+osm_id).
 */
import { makeNewListing } from "../../enrich/listing-repo";
import type { IngestBatchRepository } from "../stores/ingest-batches";
import type { AcquisitionService, IngestAction } from "../service";
import { isCommercial, mapTagsToCategory } from "./tag-map";

export type OsmElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lng?: number;
  tags: Record<string, string>;
};

export type OsmImportStats = {
  total: number;
  imported: number;
  skipped: number;
  inserted: number;
  merged: number;
  candidate: number;
  updated: number;
};

export type OsmImportResult = OsmImportStats & { batchId: number };

function addressFromTags(tags: Record<string, string>): string {
  return [tags["addr:housenumber"], tags["addr:street"], tags["addr:suburb"], tags["addr:city"]]
    .filter(Boolean)
    .join(", ");
}

export class OsmImporter {
  private readonly service: AcquisitionService;
  private readonly batches: IngestBatchRepository;

  constructor(service: AcquisitionService, batches: IngestBatchRepository) {
    this.service = service;
    this.batches = batches;
  }

  async import(elements: Iterable<OsmElement>): Promise<OsmImportResult> {
    const batch = await this.batches.start("osm");
    const stats: OsmImportStats = {
      total: 0,
      imported: 0,
      skipped: 0,
      inserted: 0,
      merged: 0,
      candidate: 0,
      updated: 0,
    };

    for (const el of elements) {
      stats.total += 1;
      const name = el.tags.name;
      if (!name || !isCommercial(el.tags)) {
        stats.skipped += 1;
        continue;
      }
      const coord = el.lat != null && el.lng != null ? { lat: el.lat, lng: el.lng } : undefined;
      const candidate = makeNewListing({
        name,
        area: el.tags["addr:city"] ?? el.tags["addr:suburb"] ?? "",
        address: addressFromTags(el.tags),
        neighborhood: el.tags["addr:suburb"],
        categories: [mapTagsToCategory(el.tags)],
        phone: el.tags.phone ?? el.tags["contact:phone"],
        website: el.tags.website ?? el.tags["contact:website"],
        hoursToday: el.tags.opening_hours,
        coordinates: coord,
        dataSource: "osm",
        licenseNote: "ODbL",
        sourceRef: `${el.type}/${el.id}`,
        osmType: el.type,
        osmId: el.id,
      });

      const res = await this.service.ingest(candidate, { osm: true });
      stats.imported += 1;
      const action: IngestAction = res.action;
      stats[action] += 1;
    }

    const finished = await this.batches.finish(batch.id, { ...stats });
    return { batchId: finished.id, ...stats };
  }
}

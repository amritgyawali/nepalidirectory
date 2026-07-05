/**
 * ingest_batches store (prompt sec. 6.1, sec. 13): one row per import run with counts. In-memory
 * default; Postgres contract in the migration.
 */

export type IngestBatch = {
  id: number;
  source: string;
  stats: Record<string, number>;
  startedAt: Date;
  finishedAt?: Date;
};

export interface IngestBatchRepository {
  start(source: string): Promise<IngestBatch>;
  finish(id: number, stats: Record<string, number>): Promise<IngestBatch>;
  list(): Promise<IngestBatch[]>;
}

export class InMemoryIngestBatchRepository implements IngestBatchRepository {
  private seq = 0;
  private readonly map = new Map<number, IngestBatch>();

  async start(source: string): Promise<IngestBatch> {
    const batch: IngestBatch = { id: ++this.seq, source, stats: {}, startedAt: new Date() };
    this.map.set(batch.id, batch);
    return { ...batch };
  }

  async finish(id: number, stats: Record<string, number>): Promise<IngestBatch> {
    const batch = this.map.get(id);
    if (!batch) throw new Error(`ingest_batches: no batch ${id}`);
    const done: IngestBatch = { ...batch, stats, finishedAt: new Date() };
    this.map.set(id, done);
    return { ...done };
  }

  async list(): Promise<IngestBatch[]> {
    return [...this.map.values()].sort((a, b) => a.id - b.id).map((b) => ({ ...b }));
  }
}

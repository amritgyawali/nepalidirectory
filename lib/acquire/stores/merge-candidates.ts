/**
 * merge_candidates store (prompt sec. 6.6 / sec. 13): the 0.65–0.90 band awaiting AI adjudication
 * + human confirmation. In-memory default; Postgres contract in the migration.
 */

export type MergeCandidate = {
  id: number;
  aId: number;
  bId: number;
  score: number;
  features: Record<string, unknown>;
  aiVerdict?: string; // same|distinct|branch
  aiConfidence?: number;
  decision: string; // pending|confirmed|rejected
  decidedBy?: string;
  createdAt: Date;
};

export type NewMergeCandidate = Pick<MergeCandidate, "aId" | "bId" | "score" | "features">;

export interface MergeCandidateRepository {
  create(input: NewMergeCandidate): Promise<MergeCandidate>;
  get(id: number): Promise<MergeCandidate | null>;
  update(id: number, patch: Partial<MergeCandidate>): Promise<void>;
  list(filter?: { decision?: string }): Promise<MergeCandidate[]>;
}

export class InMemoryMergeCandidateRepository implements MergeCandidateRepository {
  private seq = 0;
  private readonly map = new Map<number, MergeCandidate>();

  async create(input: NewMergeCandidate): Promise<MergeCandidate> {
    const mc: MergeCandidate = {
      id: ++this.seq,
      aId: input.aId,
      bId: input.bId,
      score: input.score,
      features: input.features,
      decision: "pending",
      createdAt: new Date(),
    };
    this.map.set(mc.id, mc);
    return { ...mc };
  }

  async get(id: number): Promise<MergeCandidate | null> {
    const mc = this.map.get(id);
    return mc ? { ...mc } : null;
  }

  async update(id: number, patch: Partial<MergeCandidate>): Promise<void> {
    const mc = this.map.get(id);
    if (!mc) throw new Error(`merge_candidates: no candidate ${id}`);
    this.map.set(id, { ...mc, ...patch, id });
  }

  async list(filter?: { decision?: string }): Promise<MergeCandidate[]> {
    return [...this.map.values()]
      .filter((m) => (filter?.decision ? m.decision === filter.decision : true))
      .sort((a, b) => a.id - b.id)
      .map((m) => ({ ...m }));
  }
}

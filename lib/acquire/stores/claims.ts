/**
 * Claims store (prompt sec. 6.3, Tier 3). OTP-to-phone or document-upload -> admin queue.
 * In-memory default; Postgres contract in the migration.
 */

export type ClaimMethod = "otp" | "document";
export type ClaimStatus = "pending" | "verified" | "rejected";

export type Claim = {
  id: number;
  listingId: number;
  method: ClaimMethod;
  contact: string;
  otp?: string;
  documentUrl?: string;
  status: ClaimStatus;
  createdAt: Date;
};

export type NewClaim = Pick<Claim, "listingId" | "method" | "contact" | "otp" | "documentUrl">;

export interface ClaimRepository {
  create(input: NewClaim): Promise<Claim>;
  get(id: number): Promise<Claim | null>;
  update(id: number, patch: Partial<Claim>): Promise<void>;
  list(filter?: { status?: ClaimStatus; method?: ClaimMethod }): Promise<Claim[]>;
}

export class InMemoryClaimRepository implements ClaimRepository {
  private seq = 0;
  private readonly map = new Map<number, Claim>();

  async create(input: NewClaim): Promise<Claim> {
    const claim: Claim = { id: ++this.seq, status: "pending", createdAt: new Date(), ...input };
    this.map.set(claim.id, claim);
    return { ...claim };
  }

  async get(id: number): Promise<Claim | null> {
    const c = this.map.get(id);
    return c ? { ...c } : null;
  }

  async update(id: number, patch: Partial<Claim>): Promise<void> {
    const c = this.map.get(id);
    if (!c) throw new Error(`claims: no claim ${id}`);
    this.map.set(id, { ...c, ...patch, id });
  }

  async list(filter?: { status?: ClaimStatus; method?: ClaimMethod }): Promise<Claim[]> {
    return [...this.map.values()]
      .filter((c) => (filter?.status ? c.status === filter.status : true))
      .filter((c) => (filter?.method ? c.method === filter.method : true))
      .sort((a, b) => a.id - b.id)
      .map((c) => ({ ...c }));
  }
}

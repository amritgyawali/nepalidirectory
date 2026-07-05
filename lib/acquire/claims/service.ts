/**
 * Claim flow (prompt sec. 6.3, Tier 3 — the moat). OTP-to-phone or document-upload; document
 * claims land in an admin queue. On verification the listing becomes claimed/verified. The OTP is
 * returned here for local/test use; in production it is delivered by SMS and never returned.
 */
import type { ListingRepository } from "../../enrich/types";
import type { Claim, ClaimMethod, ClaimRepository } from "../stores/claims";

export type ClaimServiceDeps = {
  claims: ClaimRepository;
  listings: ListingRepository;
  otpGen?: () => string;
};

function sixDigits(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export class ClaimService {
  private readonly claims: ClaimRepository;
  private readonly listings: ListingRepository;
  private readonly otpGen: () => string;

  constructor(deps: ClaimServiceDeps) {
    this.claims = deps.claims;
    this.listings = deps.listings;
    this.otpGen = deps.otpGen ?? sixDigits;
  }

  async createClaim(input: {
    listingId: number;
    method: ClaimMethod;
    contact: string;
    documentUrl?: string;
  }): Promise<Claim> {
    const listing = await this.listings.get(input.listingId);
    if (!listing) throw new Error(`claim: listing ${input.listingId} not found`);

    const otp = input.method === "otp" ? this.otpGen() : undefined;
    const claim = await this.claims.create({
      listingId: input.listingId,
      method: input.method,
      contact: input.contact,
      otp,
      documentUrl: input.documentUrl,
    });

    listing.claimStatus = "pending";
    await this.listings.update(listing);
    return claim;
  }

  /** Verify an OTP claim; on success marks the listing claimed + verified. */
  async verifyOtp(claimId: number, code: string): Promise<{ verified: boolean }> {
    const claim = await this.claims.get(claimId);
    if (!claim || claim.method !== "otp") throw new Error(`claim: no OTP claim ${claimId}`);
    if (claim.status !== "pending") return { verified: claim.status === "verified" };
    if (claim.otp !== code) return { verified: false };

    await this.claims.update(claimId, { status: "verified" });
    await this.markClaimed(claim.listingId);
    return { verified: true };
  }

  /** Admin approves a document (or any pending) claim from the queue. */
  async approveClaim(claimId: number): Promise<void> {
    const claim = await this.claims.get(claimId);
    if (!claim) throw new Error(`claim: no claim ${claimId}`);
    await this.claims.update(claimId, { status: "verified" });
    await this.markClaimed(claim.listingId);
  }

  /** Admin queue: pending document claims (prompt sec. 6.3). */
  async pendingDocumentClaims(): Promise<Claim[]> {
    return this.claims.list({ status: "pending", method: "document" });
  }

  private async markClaimed(listingId: number): Promise<void> {
    const listing = await this.listings.get(listingId);
    if (!listing) return;
    listing.claimStatus = "claimed";
    listing.claimed = true;
    listing.verified = true;
    await this.listings.update(listing);
  }
}

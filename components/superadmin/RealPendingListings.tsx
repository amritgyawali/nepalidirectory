"use client";

/**
 * Real, database-backed pending-listing queue (2026-07-16 SEO audit, Critical #1). The rest of
 * `/super-admin/approvals` reads `SuperAdminProvider`, a localStorage-only mock — this panel is
 * additive, wired to the actual `/api/admin/listings/*` routes so owner submissions from
 * `/claim-listing` (`POST /api/listings`) have a real place to be reviewed and approved.
 */
import { CheckCircle2, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type PendingListing = {
  id: number;
  slug: string;
  name: string;
  categories: string[];
  area: string;
  address: string;
  phone?: string;
  email?: string;
  dataSource: string;
  verificationStatus: string;
  qualityScore: number;
  sourceRef?: string;
  createdAt?: string | null;
  eligibilityReasons: string[];
};

export function RealPendingListings() {
  const [listings, setListings] = useState<PendingListing[] | null>(null);
  const [error, setError] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/listings/pending?page=${page}&limit=50`);
      if (!response.ok) {
        setError("Could not load real pending submissions.");
        return;
      }
      const payload = (await response.json()) as {
        listings: PendingListing[];
        totalPages: number;
      };
      setListings(payload.listings);
      setTotalPages(payload.totalPages);
      setError("");
    } catch {
      setError("Could not load real pending submissions.");
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  async function decide(id: number, action: "approve" | "reject") {
    setBusySlug(String(id));
    try {
      const response = await fetch(`/api/admin/listings/${id}/${action}`, { method: "POST" });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string; reasons?: string[] }
          | null;
        setError(
          [payload?.error, payload?.reasons?.join(", ")].filter(Boolean).join(" ") ||
            `Could not ${action} this listing.`,
        );
        return;
      }
      setError("");
      await load();
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <article className="superadmin-panel">
      <div className="superadmin-panel__head">
        <h2>Real submissions (database)</h2>
        <span>{listings?.length ?? 0} listings</span>
      </div>
      {error ? <p className="superadmin-empty" role="alert">{error}</p> : null}
      <div className="superadmin-review-list">
        {(listings ?? []).map((listing) => (
          <article key={listing.slug}>
            <div>
              <strong>{listing.name}</strong>
              <span>{listing.categories.join(", ") || "Uncategorized"} - {listing.area || "Nepal"}</span>
              <small>{listing.address}</small>
              <small>
                Source: {listing.dataSource} - Quality score: {listing.qualityScore} - Email: {listing.email ?? "Missing"}
              </small>
              <small>Required fixes: {listing.eligibilityReasons.join(", ")}</small>
            </div>
            <div className="superadmin-actions">
              <button disabled={busySlug === String(listing.id)} onClick={() => decide(listing.id, "approve")} type="button">
                <CheckCircle2 size={14} aria-hidden />
                Approve
              </button>
              <button
                data-danger
                disabled={busySlug === String(listing.id)}
                onClick={() => decide(listing.id, "reject")}
                type="button"
              >
                <XCircle size={14} aria-hidden />
                Reject
              </button>
            </div>
          </article>
        ))}
        {listings && listings.length === 0 ? (
          <p className="superadmin-empty">No real submissions pending review.</p>
        ) : null}
      </div>
      {totalPages > 1 ? (
        <nav aria-label="Pending listing pages" className="superadmin-actions">
          <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} type="button">
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} type="button">
            Next
          </button>
        </nav>
      ) : null}
    </article>
  );
}

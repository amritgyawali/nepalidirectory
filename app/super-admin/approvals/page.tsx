"use client";

import { CheckCircle2, ClipboardCheck, ShieldAlert, XCircle } from "lucide-react";
import { useSuperAdminData } from "@/components/superadmin/SuperAdminProvider";
import { RealPendingListings } from "@/components/superadmin/RealPendingListings";

export default function SuperAdminApprovalsPage() {
  const { listings, approveListing, rejectListing, approveAllPending, rejectLowCompleteness } = useSuperAdminData();
  const pending = listings.filter((listing) => listing.approvalStatus === "Pending");
  const rejected = listings.filter((listing) => listing.approvalStatus === "Rejected");
  const incomplete = pending.filter((listing) => listing.completeness < 80);
  const missingContact = pending.filter((listing) => !listing.email || !listing.phone);

  return (
    <>
      <div className="superadmin-heading">
        <div>
          <span>Approval workflow</span>
          <h1>Review submitted businesses</h1>
          <p>Businesses created after signup stay pending until super admin approval. Reject incomplete, suspicious or duplicate submissions.</p>
        </div>
      </div>

      <section className="superadmin-metrics">
        <article>
          <ClipboardCheck size={20} aria-hidden />
          <span>Pending queue</span>
          <strong>{pending.length}</strong>
          <small>Waiting for decision</small>
        </article>
        <article>
          <ShieldAlert size={20} aria-hidden />
          <span>Low completeness</span>
          <strong>{incomplete.length}</strong>
          <small>Under 80% profile quality</small>
        </article>
        <article>
          <XCircle size={20} aria-hidden />
          <span>Missing contact</span>
          <strong>{missingContact.length}</strong>
          <small>Email or phone missing</small>
        </article>
      </section>

      <RealPendingListings />

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>Bulk approval tools</h2>
          <span>Apply decisions to the whole queue</span>
        </div>
        <div className="superadmin-actions">
          <button onClick={approveAllPending} type="button">
            <CheckCircle2 size={14} aria-hidden />
            Approve all pending
          </button>
          <button data-danger onClick={() => rejectLowCompleteness(80)} type="button">
            <ShieldAlert size={14} aria-hidden />
            Reject under 80%
          </button>
        </div>
      </section>

      <section className="superadmin-grid">
        <article className="superadmin-panel">
          <div className="superadmin-panel__head">
            <h2>Pending approval</h2>
            <span>{pending.length} listings</span>
          </div>
          <div className="superadmin-review-list">
            {pending.map((listing) => (
              <article key={listing.slug}>
                <div>
                  <strong>{listing.name}</strong>
                  <span>{listing.category} - {listing.area ?? "Nepal"}</span>
                  <small>{listing.description || "No description provided."}</small>
                  <small>Owner: {listing.ownerName ?? "Unknown"} - Email: {listing.email ?? "Missing"}</small>
                  <progress max={100} value={listing.completeness} />
                </div>
                <div className="superadmin-actions">
                  <button onClick={() => approveListing(listing.slug)} type="button">
                    <CheckCircle2 size={14} aria-hidden />
                    Approve
                  </button>
                  <button data-danger onClick={() => rejectListing(listing.slug)} type="button">
                    <XCircle size={14} aria-hidden />
                    Reject
                  </button>
                </div>
              </article>
            ))}
            {pending.length === 0 ? <p className="superadmin-empty">No pending businesses need approval.</p> : null}
          </div>
        </article>

        <article className="superadmin-panel">
          <div className="superadmin-panel__head">
            <h2>Rejected / blocked</h2>
            <span>{rejected.length} listings</span>
          </div>
          <div className="superadmin-review-list">
            {rejected.map((listing) => (
              <article key={listing.slug}>
                <div>
                  <strong>{listing.name}</strong>
                  <span>{listing.category} - {listing.area ?? "Nepal"}</span>
                  <small>Reason: rejected by super admin or failed listing quality check.</small>
                </div>
                <div className="superadmin-actions">
                  <button onClick={() => approveListing(listing.slug)} type="button">Approve now</button>
                </div>
              </article>
            ))}
            {rejected.length === 0 ? <p className="superadmin-empty">No rejected listings.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}

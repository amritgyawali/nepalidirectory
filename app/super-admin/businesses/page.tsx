"use client";

import { Download, Eye, Pause, RadioTower, RotateCcw, ShieldAlert, ShieldCheck, Trash2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useSuperAdminData } from "@/components/superadmin/SuperAdminProvider";

export default function SuperAdminBusinessesPage() {
  const {
    businessViews,
    approveListing,
    rejectListing,
    pauseListing,
    restoreListing,
    deleteListing,
    approveAllPending,
    pauseAllListings,
    restoreAllListings,
    recordAudit
  } = useSuperAdminData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();

    return businessViews.filter((business) => {
      const matchesQuery =
        !needle ||
        [business.name, business.category, business.area, business.owner, business.email]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesStatus =
        status === "all" ||
        business.approvalStatus === status ||
        business.visibility === status;

      return matchesQuery && matchesStatus;
    });
  }, [businessViews, query, status]);

  const riskCounts = useMemo(
    () => ({
      pending: businessViews.filter((business) => business.approvalStatus === "Pending").length,
      paused: businessViews.filter((business) => business.visibility === "Paused").length,
      missingContact: businessViews.filter((business) => !business.email || !business.phone).length,
      highDemand: businessViews.filter((business) => business.views > 10000).length
    }),
    [businessViews]
  );

  function exportBusinesses() {
    recordAudit("Exported business report", `${filtered.length} businesses`, "Super admin exported the currently filtered business list.", "Info");
  }

  return (
    <>
      <div className="superadmin-heading">
        <div>
          <span>Business control</span>
          <h1>All directory businesses</h1>
          <p>Inspect each listing, view demand, approve submissions, pause risky listings, restore good profiles or remove bad data.</p>
        </div>
      </div>

      <section className="superadmin-metrics">
        <article>
          <ShieldAlert size={20} aria-hidden />
          <span>Pending</span>
          <strong>{riskCounts.pending}</strong>
          <small>Need approval</small>
        </article>
        <article>
          <Pause size={20} aria-hidden />
          <span>Paused</span>
          <strong>{riskCounts.paused}</strong>
          <small>Hidden from live flow</small>
        </article>
        <article>
          <RadioTower size={20} aria-hidden />
          <span>Missing contact</span>
          <strong>{riskCounts.missingContact}</strong>
          <small>Email or phone gaps</small>
        </article>
        <article>
          <Eye size={20} aria-hidden />
          <span>High demand</span>
          <strong>{riskCounts.highDemand}</strong>
          <small>Over 10K views</small>
        </article>
      </section>

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>Business operations</h2>
          <span>Bulk tools and filtered listing management</span>
        </div>
        <div className="superadmin-actions">
          <button onClick={approveAllPending} type="button">
            <ShieldCheck size={14} aria-hidden />
            Approve pending
          </button>
          <button data-danger onClick={pauseAllListings} type="button">
            <Pause size={14} aria-hidden />
            Pause all
          </button>
          <button onClick={restoreAllListings} type="button">
            <RotateCcw size={14} aria-hidden />
            Restore all live
          </button>
          <button onClick={exportBusinesses} type="button">
            <Download size={14} aria-hidden />
            Export filtered
          </button>
        </div>
      </section>

      <section className="superadmin-panel">
        <div className="superadmin-filters">
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search business, owner, category, area..."
            value={query}
          />
          <select onChange={(event) => setStatus(event.target.value)} value={status}>
            <option value="all">All statuses</option>
            <option value="Pending">Pending approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Live">Live</option>
            <option value="Paused">Paused</option>
          </select>
        </div>
        <div className="superadmin-table superadmin-table--businesses">
          {filtered.map((business) => (
            <article key={business.slug}>
              <div>
                <strong>{business.name}</strong>
                <span>{business.category} - {business.area ?? "Nepal"} - {business.address}</span>
                <small>{business.owner} - {business.email ?? "No email"} - {business.phone ?? "No phone"}</small>
              </div>
              <span data-status={business.approvalStatus}>{business.approvalStatus ?? "Pending"}</span>
              <span>
                <Eye size={14} aria-hidden />
                {business.views.toLocaleString()} views
              </span>
              <span>{business.calls} calls / {business.directions} directions</span>
              <div className="superadmin-actions">
                <button onClick={() => approveListing(business.slug)} type="button">
                  <ShieldCheck size={14} aria-hidden />
                  Approve
                </button>
                <button onClick={() => pauseListing(business.slug)} type="button">
                  <Pause size={14} aria-hidden />
                  Pause
                </button>
                <button onClick={() => restoreListing(business.slug)} type="button">
                  <RotateCcw size={14} aria-hidden />
                  Restore
                </button>
                <button data-danger onClick={() => rejectListing(business.slug)} type="button">
                  <XCircle size={14} aria-hidden />
                  Reject
                </button>
                <button data-danger onClick={() => deleteListing(business.slug)} type="button">
                  <Trash2 size={14} aria-hidden />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

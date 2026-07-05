"use client";

import { ArrowRight, Building2, ClipboardList, Eye, GitPullRequestArrow, Pause, Search, Settings2, ShieldCheck, UsersRound } from "lucide-react";
import Link from "next/link";
import { useSuperAdminData } from "@/components/superadmin/SuperAdminProvider";
import { routes } from "@/lib/routes";

export default function SuperAdminOverviewPage() {
  const {
    totals,
    traffic,
    referrals,
    businessViews,
    listings,
    approveListing,
    rejectListing,
    approveAllPending,
    pauseAllListings,
    restoreAllListings,
    recordAudit
  } = useSuperAdminData();
  const pendingListings = listings.filter((listing) => listing.approvalStatus === "Pending").slice(0, 4);
  const topReferrer = referrals[0];

  return (
    <>
      <div className="superadmin-heading">
        <div>
          <span>Root platform overview</span>
          <h1>Nepali Directory control center</h1>
          <p>Monitor listings, approvals, users, referrers, traffic and per-business demand across the whole platform.</p>
        </div>
        <Link className="button button--primary" href={routes.superAdminApprovals}>
          Review approvals <ArrowRight size={16} aria-hidden />
        </Link>
      </div>

      <section className="superadmin-metrics">
        {[
          { label: "Total businesses", value: totals.businesses.toLocaleString(), icon: Building2, detail: `${totals.approved} approved` },
          { label: "Website visitors today", value: totals.visitorsToday.toLocaleString(), icon: Eye, detail: `${totals.searchesToday.toLocaleString()} searches` },
          { label: "Total users", value: totals.users.toLocaleString(), icon: UsersRound, detail: "owners, reviewers, editors" },
          { label: "Pending approvals", value: totals.pending.toLocaleString(), icon: GitPullRequestArrow, detail: `${totals.rejected} rejected` }
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label}>
              <Icon size={21} aria-hidden />
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
            </article>
          );
        })}
      </section>

      <section className="superadmin-grid">
        <article className="superadmin-panel superadmin-panel--wide">
          <div className="superadmin-panel__head">
            <h2>Traffic pulse</h2>
            <span>Visitors, searches and signups</span>
          </div>
          <div className="superadmin-chart">
            {traffic.map((day) => (
              <span key={day.label}>
                <i style={{ height: `${Math.max(24, day.visitors / 340)}%` }} />
                <small>{day.label}</small>
              </span>
            ))}
          </div>
          <div className="superadmin-inline-stats">
            <span>Top referrer: <strong>{topReferrer.source}</strong></span>
            <span>{topReferrer.visits.toLocaleString()} visits</span>
            <span>{topReferrer.conversion} conversion</span>
          </div>
        </article>

        <article className="superadmin-panel">
          <div className="superadmin-panel__head">
            <h2>Top business views</h2>
            <Link href={routes.superAdminBusinesses}>All businesses</Link>
          </div>
          <div className="superadmin-list">
            {businessViews.slice(0, 5).map((business) => (
              <div key={business.slug}>
                <strong>{business.name}</strong>
                <span>{business.views.toLocaleString()} views - {business.calls} calls</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>Executive command center</h2>
          <span>Fast actions across the platform</span>
        </div>
        <div className="superadmin-actions">
          <button onClick={approveAllPending} type="button">
            <ShieldCheck size={14} aria-hidden />
            Approve pending queue
          </button>
          <button data-danger onClick={pauseAllListings} type="button">
            <Pause size={14} aria-hidden />
            Emergency pause listings
          </button>
          <button onClick={restoreAllListings} type="button">
            <ArrowRight size={14} aria-hidden />
            Restore live listings
          </button>
          <button onClick={() => recordAudit("Generated executive snapshot", "Overview", "Super admin generated a platform health snapshot.", "Info")} type="button">
            <ClipboardList size={14} aria-hidden />
            Generate snapshot
          </button>
        </div>
      </section>

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>Business approval queue</h2>
          <Link href={routes.superAdminApprovals}>Open queue</Link>
        </div>
        <div className="superadmin-table">
          {pendingListings.map((listing) => (
            <article key={listing.slug}>
              <div>
                <strong>{listing.name}</strong>
                <span>{listing.category} - {listing.area ?? "Nepal"} - {listing.ownerName ?? "Owner submitted"}</span>
              </div>
              <span>{listing.completeness}% complete</span>
              <div className="superadmin-actions">
                <button onClick={() => approveListing(listing.slug)} type="button">Approve</button>
                <button data-danger onClick={() => rejectListing(listing.slug)} type="button">Reject</button>
              </div>
            </article>
          ))}
          {pendingListings.length === 0 ? <p className="superadmin-empty">No pending listings right now.</p> : null}
        </div>
      </section>

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>Power tools</h2>
          <span>High-control platform shortcuts</span>
        </div>
        <div className="superadmin-tool-grid">
          <Link href={routes.superAdminBusinesses}>
            <Building2 size={18} aria-hidden />
            <strong>Control every business</strong>
            <small>Approve, pause, restore, reject or delete listings.</small>
          </Link>
          <Link href={routes.superAdminUsers}>
            <UsersRound size={18} aria-hidden />
            <strong>User governance</strong>
            <small>Add, edit, suspend, restore and delete any user account.</small>
          </Link>
          <Link href={routes.superAdminReferrals}>
            <Search size={18} aria-hidden />
            <strong>Traffic intelligence</strong>
            <small>See where users are coming from and which sources convert.</small>
          </Link>
          <Link href={routes.superAdminAudit}>
            <ClipboardList size={18} aria-hidden />
            <strong>Audit log</strong>
            <small>Review sensitive user, listing and platform control actions.</small>
          </Link>
          <Link href={routes.superAdminSettings}>
            <Settings2 size={18} aria-hidden />
            <strong>System settings</strong>
            <small>Manage security switches, exports, alerts and emergency tools.</small>
          </Link>
        </div>
      </section>
    </>
  );
}

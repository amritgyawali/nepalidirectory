"use client";

import { Download, ExternalLink, Filter, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useSuperAdminData } from "@/components/superadmin/SuperAdminProvider";

export default function SuperAdminReferralsPage() {
  const { referrals, traffic, recordAudit } = useSuperAdminData();
  const [minimumSignups, setMinimumSignups] = useState(0);
  const totalVisits = referrals.reduce((total, item) => total + item.visits, 0);
  const totalSignups = referrals.reduce((total, item) => total + item.signups, 0);
  const filteredSources = useMemo(
    () => referrals.filter((source) => source.signups >= minimumSignups),
    [minimumSignups, referrals]
  );
  const projectedMonthlySignups = Math.round(totalSignups * 4.3);

  function exportReferrals() {
    recordAudit("Exported referral report", `${filteredSources.length} sources`, "Super admin exported filtered referral source performance.", "Info");
  }

  return (
    <>
      <div className="superadmin-heading">
        <div>
          <span>Referral intelligence</span>
          <h1>Where users come from</h1>
          <p>Track acquisition sources, signups, search demand and conversion by source before investing in marketing.</p>
        </div>
      </div>

      <section className="superadmin-metrics">
        <article>
          <TrendingUp size={21} aria-hidden />
          <span>Total referred visits</span>
          <strong>{totalVisits.toLocaleString()}</strong>
          <small>Last 7-day modeled view</small>
        </article>
        <article>
          <ExternalLink size={21} aria-hidden />
          <span>Referral signups</span>
          <strong>{totalSignups.toLocaleString()}</strong>
          <small>Owners and users</small>
        </article>
        <article>
          <TrendingUp size={21} aria-hidden />
          <span>Projected monthly</span>
          <strong>{projectedMonthlySignups.toLocaleString()}</strong>
          <small>Signup run rate</small>
        </article>
        <article>
          <Filter size={21} aria-hidden />
          <span>Best source</span>
          <strong>{referrals[0].source}</strong>
          <small>{referrals[0].conversion} conversion</small>
        </article>
      </section>

      <section className="superadmin-grid">
        <article className="superadmin-panel superadmin-panel--wide">
          <div className="superadmin-panel__head">
            <h2>Daily traffic</h2>
            <span>Visitors / searches / signups</span>
          </div>
          <div className="superadmin-traffic-table">
            {traffic.map((day) => (
              <div key={day.label}>
                <strong>{day.label}</strong>
                <span>{day.visitors.toLocaleString()} visitors</span>
                <span>{day.searches.toLocaleString()} searches</span>
                <span>{day.signups.toLocaleString()} signups</span>
              </div>
            ))}
          </div>
        </article>

        <article className="superadmin-panel">
          <div className="superadmin-panel__head">
            <h2>Referral sources</h2>
            <span>Conversion quality</span>
          </div>
          <div className="superadmin-filters">
            <select value={minimumSignups} onChange={(event) => setMinimumSignups(Number(event.target.value))}>
              <option value={0}>All sources</option>
              <option value={100}>100+ signups</option>
              <option value={250}>250+ signups</option>
              <option value={500}>500+ signups</option>
            </select>
            <button onClick={exportReferrals} type="button">
              <Download size={15} aria-hidden />
              Export sources
            </button>
          </div>
          <div className="superadmin-source-list">
            {filteredSources.map((source) => (
              <div key={source.source}>
                <strong>{source.source}</strong>
                <span>{source.visits.toLocaleString()} visits</span>
                <span>{source.signups.toLocaleString()} signups</span>
                <em>{source.conversion}</em>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

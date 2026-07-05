"use client";

import {
  ArrowUpRight,
  Calculator,
  Download,
  MousePointerClick,
  Phone,
  Route,
  Search,
  TrendingUp,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useState } from "react";
import { useDashboardData, type DashboardRange } from "@/components/dashboard/DashboardProvider";
import { routes } from "@/lib/routes";

const rangeFunnels: Record<DashboardRange, Array<[string, string, number, LucideIcon]>> = {
  "7": [
    ["Search impressions", "18,420", 100, Search],
    ["Profile visits", "1,240", 68, MousePointerClick],
    ["Phone calls", "86", 34, Phone],
    ["Direction requests", "42", 22, Route]
  ],
  "30": [
    ["Search impressions", "64,200", 100, Search],
    ["Profile visits", "4,920", 76, MousePointerClick],
    ["Phone calls", "314", 41, Phone],
    ["Direction requests", "176", 27, Route]
  ],
  "90": [
    ["Search impressions", "192,300", 100, Search],
    ["Profile visits", "14,680", 81, MousePointerClick],
    ["Phone calls", "908", 47, Phone],
    ["Direction requests", "521", 31, Route]
  ]
};

const rangeKeywords: Record<DashboardRange, Array<[string, string, string]>> = {
  "7": [
    ["newari restaurant bhaktapur", "3,420", "+18%"],
    ["best choila near me", "1,870", "+26%"],
    ["heritage restaurant kathmandu", "1,240", "+9%"],
    ["newa lahana menu", "840", "+31%"]
  ],
  "30": [
    ["newari restaurant bhaktapur", "12,980", "+14%"],
    ["bhaktapur heritage dining", "7,220", "+21%"],
    ["best choila near me", "6,840", "+17%"],
    ["newa lahana menu", "3,160", "+28%"]
  ],
  "90": [
    ["newari restaurant bhaktapur", "38,200", "+22%"],
    ["bhaktapur heritage dining", "22,500", "+24%"],
    ["best choila near me", "18,440", "+19%"],
    ["newa lahana menu", "9,780", "+34%"]
  ]
};

export default function DashboardAnalyticsPage() {
  const { state, setSelectedRange } = useDashboardData();
  const [targetCalls, setTargetCalls] = useState(120);
  const [conversionRate, setConversionRate] = useState(7);
  const liveListings = useMemo(
    () => state.listings.filter((listing) => listing.visibility === "Live").length,
    [state.listings]
  );
  const funnels = rangeFunnels[state.selectedRange];
  const keywords = rangeKeywords[state.selectedRange];
  const neededVisits = Math.ceil(targetCalls / Math.max(0.01, conversionRate / 100));

  function exportAnalytics() {
    const rows = [
      "Metric,Value,Percent",
      ...funnels.map(([label, value, percent]) => `${label},${value},${percent}%`),
      "",
      "Keyword,Searches,Change",
      ...keywords.map(([term, volume, change]) => `${term},${volume},${change}`)
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${state.selectedRange}-days.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="admin-subpage">
      <div className="container">
        <div className="admin-subpage__head">
          <div>
            <Link href={routes.dashboard}>Dashboard</Link>
            <h1>Analytics</h1>
            <p>Understand how people find, compare, and contact your listings.</p>
          </div>
          <div className="dashboard-head-actions">
            <select
              onChange={(event) => setSelectedRange(event.target.value as DashboardRange)}
              value={state.selectedRange}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <Link className="button button--dark" href={routes.advertise}>
              Promote listing
              <ArrowUpRight size={16} aria-hidden />
            </Link>
            <button className="button button--outline" onClick={exportAnalytics} type="button">
              <Download size={16} aria-hidden />
              Export CSV
            </button>
          </div>
        </div>

        <section className="analytics-grid">
          {funnels.map(([label, value, percent, Icon]) => (
            <article key={label}>
              <Icon size={22} aria-hidden />
              <span>{label}</span>
              <strong>{value}</strong>
              <progress value={percent} max={100} />
            </article>
          ))}
        </section>

        <section className="dashboard-panel analytics-summary-strip">
          <div>
            <strong>{liveListings}</strong>
            <span>Live listings in rotation</span>
          </div>
          <div>
            <strong>{state.reviews.filter((review) => !review.reply.trim()).length}</strong>
            <span>Reviews still awaiting reply</span>
          </div>
          <div>
            <strong>{state.gallery.length}</strong>
            <span>Gallery assets available</span>
          </div>
        </section>

        <section className="dashboard-panel analytics-calculator">
          <div className="dashboard-panel__head">
            <h2>Lead goal calculator</h2>
            <span>
              <Calculator size={15} aria-hidden />
              Planning tool
            </span>
          </div>
          <div className="analytics-calculator__grid">
            <label>
              <span>Target calls</span>
              <input
                min={1}
                onChange={(event) => setTargetCalls(Number(event.target.value))}
                type="number"
                value={targetCalls}
              />
            </label>
            <label>
              <span>Visit-to-call rate (%)</span>
              <input
                min={1}
                max={100}
                onChange={(event) => setConversionRate(Number(event.target.value))}
                type="number"
                value={conversionRate}
              />
            </label>
            <div>
              <strong>{neededVisits.toLocaleString()}</strong>
              <span>profile visits needed</span>
            </div>
          </div>
        </section>

        <section className="dashboard-panel analytics-keywords">
          <div className="dashboard-panel__head">
            <h2>Top discovery keywords</h2>
            <span>
              <TrendingUp size={15} aria-hidden />
              Growing this period
            </span>
          </div>
          {keywords.map(([term, volume, change]) => (
            <div key={term}>
              <strong>{term}</strong>
              <span>{volume} searches</span>
              <small>{change}</small>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

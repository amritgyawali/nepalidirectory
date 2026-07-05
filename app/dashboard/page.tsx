"use client";

import { Camera, CheckCircle2, Clipboard, Download, ExternalLink, MessageSquareText, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { useDashboardData, type DashboardRange } from "@/components/dashboard/DashboardProvider";
import { FillImage } from "@/components/ui/FillImage";
import { Stars } from "@/components/ui/Stars";
import { routes } from "@/lib/routes";

const rangeMetrics: Record<
  DashboardRange,
  {
    metrics: Array<{ value: string; label: string; change: string }>;
    chartBars: number[];
  }
> = {
  "7": {
    metrics: [
      { value: "1,240", label: "Profile views", change: "+32% vs last week" },
      { value: "86", label: "Phone calls", change: "+24% vs last week" },
      { value: "42", label: "Direction requests", change: "+18% vs last week" },
      { value: "7", label: "New reviews", change: "2 awaiting reply" }
    ],
    chartBars: [42, 58, 50, 74, 68, 88, 96]
  },
  "30": {
    metrics: [
      { value: "4,920", label: "Profile views", change: "+18% vs last month" },
      { value: "314", label: "Phone calls", change: "+16% vs last month" },
      { value: "176", label: "Direction requests", change: "+12% vs last month" },
      { value: "24", label: "New reviews", change: "4 awaiting reply" }
    ],
    chartBars: [56, 64, 72, 78, 84, 76, 88]
  },
  "90": {
    metrics: [
      { value: "14,680", label: "Profile views", change: "+22% vs previous quarter" },
      { value: "908", label: "Phone calls", change: "+19% vs previous quarter" },
      { value: "521", label: "Direction requests", change: "+15% vs previous quarter" },
      { value: "68", label: "New reviews", change: "6 awaiting reply" }
    ],
    chartBars: [48, 62, 70, 82, 86, 92, 98]
  }
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DashboardPage() {
  const { state, setSelectedRange, saveReviewReply } = useDashboardData();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [toolMessage, setToolMessage] = useState("");
  const listing =
    state.listings.find((item) => item.slug === state.selectedListingSlug) ?? state.listings[0];
  const pendingReviews = state.reviews.filter((review) => !review.reply.trim());
  const overviewReviews = pendingReviews.slice(0, 2);
  const metricsSet = rangeMetrics[state.selectedRange];
  const metrics = metricsSet.metrics.map((metric) =>
    metric.label === "New reviews"
      ? {
          ...metric,
          value: String(state.reviews.length),
          change: `${pendingReviews.length} awaiting reply`
        }
      : metric
  );

  const activityFeed = useMemo(
    () => [
      ["New 5-star review", `${state.reviews[0]?.author ?? "A customer"} reviewed your listing ${state.reviews[0]?.dateLabel ?? "today"}`],
      ["Phone leads", `${metrics[1]?.value ?? "0"} customer calls came from search discovery`],
      ["Direction requests", `${metrics[2]?.value ?? "0"} people asked for directions this period`],
      ["Profile health", `${listing.completeness}% completeness with ${listing.visibility.toLowerCase()} visibility`]
    ],
    [listing.completeness, listing.visibility, metrics, state.reviews]
  );

  const seoTasks = [
    { label: "SEO title", done: Boolean(listing.seo?.metaTitle) },
    { label: "Meta description", done: Boolean(listing.seo?.metaDescription) },
    { label: "Target keyword", done: Boolean(listing.seo?.primaryKeyword) },
    { label: "Image alt text", done: Boolean(listing.seo?.imageAlt) }
  ];
  const completedSeoTasks = seoTasks.filter((task) => task.done).length;

  function copyPublicLink() {
    const path = listing.slug === "newa-lahana" ? routes.business : `${routes.search}?q=${encodeURIComponent(listing.name)}`;
    const url = `${window.location.origin}${path}`;
    void navigator.clipboard?.writeText(url);
    setToolMessage("Public listing link copied.");
  }

  function downloadReport() {
    const report = [
      "Metric,Value",
      ...metrics.map((metric) => `${metric.label},${metric.value}`),
      `Live listings,${state.listings.filter((item) => item.visibility === "Live").length}`,
      `Pending reviews,${pendingReviews.length}`,
      `SEO tasks complete,${completedSeoTasks}/${seoTasks.length}`
    ].join("\n");
    const blob = new Blob([report], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${listing.slug}-dashboard-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setToolMessage("Dashboard report exported.");
  }

  return (
    <section className="dashboard-main">
      <div className="dashboard-heading">
        <div>
          <h1>Good morning, {state.profile.fullName || "Admin"}</h1>
          <p>
            Here is how <strong>{listing.name}</strong> performed in the last {state.selectedRange} days.
          </p>
        </div>
        <div>
          <select
            onChange={(event) => setSelectedRange(event.target.value as DashboardRange)}
            value={state.selectedRange}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <Link className="button button--dark" href={routes.business}>
            View public listing <ExternalLink size={15} aria-hidden />
          </Link>
        </div>
      </div>

      <article className="listing-status">
        <span className="listing-status__image">
          <FillImage src={listing.image} alt={listing.name} sizes="64px" priority />
        </span>
        <div>
          <div>
            <strong>{listing.name}</strong>
            <span>{listing.visibility}</span>
            {listing.verified ? <span>Verified</span> : <span>Needs review</span>}
          </div>
          <p>
            {listing.address} - {listing.category} - Profile {listing.completeness}% complete
          </p>
          <progress value={listing.completeness} max={100} />
        </div>
        <Link href={`${routes.account}?section=profile&listing=${listing.slug}`}>Complete profile</Link>
      </article>

      <section className="dashboard-metrics">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small data-warning={metric.label === "New reviews"}>{metric.change}</small>
          </article>
        ))}
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel__head">
          <h2>Quick tools</h2>
          {toolMessage ? <span>{toolMessage}</span> : null}
        </div>
        <div className="dashboard-tool-grid">
          <button className="dashboard-tool-card" onClick={copyPublicLink} type="button">
            <Clipboard size={18} aria-hidden />
            <strong>Copy listing link</strong>
            <small>Share the public profile with customers.</small>
          </button>
          <button className="dashboard-tool-card" onClick={downloadReport} type="button">
            <Download size={18} aria-hidden />
            <strong>Export report</strong>
            <small>Download this period metrics.</small>
          </button>
          <Link className="dashboard-tool-card" href={routes.claimListing}>
            <Plus size={18} aria-hidden />
            <strong>Add listing</strong>
            <small>Create another business profile.</small>
          </Link>
          <Link className="dashboard-tool-card" href={routes.gallery}>
            <Camera size={18} aria-hidden />
            <strong>Manage photos</strong>
            <small>Refresh the gallery and cover image.</small>
          </Link>
          <Link className="dashboard-tool-card" href={routes.dashboardReviews}>
            <MessageSquareText size={18} aria-hidden />
            <strong>Reply queue</strong>
            <small>{pendingReviews.length} review replies still open.</small>
          </Link>
          <Link className="dashboard-tool-card" href={`${routes.search}?q=${encodeURIComponent(listing.category)}`}>
            <Search size={18} aria-hidden />
            <strong>Check search</strong>
            <small>Inspect category visibility.</small>
          </Link>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel__head">
          <h2>SEO readiness</h2>
          <span>{completedSeoTasks}/{seoTasks.length} complete</span>
        </div>
        <div className="dashboard-checklist">
          {seoTasks.map((task) => (
            <span className={task.done ? "is-done" : ""} key={task.label}>
              <CheckCircle2 size={16} aria-hidden />
              {task.label}
            </span>
          ))}
        </div>
      </section>

      <section className="dashboard-content-grid">
        <article className="dashboard-panel dashboard-chart">
          <div className="dashboard-panel__head">
            <h2>Views and calls over time</h2>
            <div>
              <span data-color="yellow">Views</span>
              <span data-color="blue">Calls</span>
            </div>
          </div>
          <div className="bar-chart" aria-label="Weekly views bar chart">
            {metricsSet.chartBars.map((value, index) => (
              <span key={`${state.selectedRange}-${weekdays[index]}`} style={{ "--bar-height": `${value}%` } as CSSProperties}>
                <i />
                <small>{weekdays[index]}</small>
              </span>
            ))}
          </div>
        </article>

        <article className="dashboard-panel activity-feed">
          <h2>Recent activity</h2>
          {activityFeed.map(([title, text]) => (
            <div key={title}>
              <CheckCircle2 size={18} aria-hidden />
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            </div>
          ))}
        </article>
      </section>

      <section className="dashboard-panel review-workbench">
        <div className="dashboard-panel__head">
          <h2>
            Reviews awaiting your reply <span>{pendingReviews.length}</span>
          </h2>
          <Link href={routes.dashboardReviews}>View all reviews</Link>
        </div>
        {overviewReviews.length > 0 ? (
          overviewReviews.map((review) => (
            <article key={review.id}>
              <div className="review-workbench__author">
                <span>{review.author.split(" ").map((part) => part[0]).join("")}</span>
                <div>
                  <strong>{review.author}</strong>
                  <Stars rating={review.rating} />
                </div>
              </div>
              <p>{review.text}</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const draft = drafts[review.id] ?? "";
                  saveReviewReply(review.id, draft);
                  setDrafts((current) => ({ ...current, [review.id]: "" }));
                }}
              >
                <input
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [review.id]: event.target.value
                    }))
                  }
                  placeholder="Write a public reply..."
                  value={drafts[review.id] ?? ""}
                />
                <button type="submit">Reply</button>
              </form>
            </article>
          ))
        ) : (
          <div className="success-note">Everything is replied. New reviews will appear here automatically.</div>
        )}
      </section>

      <section className="dashboard-cta">
        <div>
          <span>Unlock more customers</span>
          <h2>Featured listings get stronger profile views.</h2>
          <p>Top placement in search, verified badge, promotions and full analytics.</p>
        </div>
        <Link href={routes.pricing}>Start 14-day trial</Link>
      </section>
    </section>
  );
}

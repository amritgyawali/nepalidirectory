import Link from "next/link";
import { evaluatePriorityClusters, type ClusterReadiness } from "@/lib/directory-clusters";
import { formatDirectoryDate } from "@/lib/format-date";
import { selectStaleListings } from "@/lib/freshness";
import {
  buildEligibilityReport,
  type EligibilityReport,
} from "@/lib/listing-eligibility-report";
import { getAllDirectoryListings, isIndexableListing } from "@/lib/public-listings";
import { getBusinessHref } from "@/lib/routes";

/**
 * The indexability dashboard the 2026-08-06 audit asked for (sec. 5.4, P0).
 *
 * It answers, from live data, the questions that decide what the review team does next: which
 * publication check fails most often, where those failures cluster, which records are one fix from
 * qualifying, which priority clusters are close to publishable, and which published records are
 * overdue for a re-check.
 *
 * Operational route: noindex via the admin layout and disallowed in robots.txt.
 */
export const dynamic = "force-dynamic";

const percent = (value: number) => `${(value * 100).toFixed(1)}%`;

function dimensionSummary(items: Array<{ key: string; records: number }>): string {
  return items.length
    ? items.map((item) => `${item.key} (${item.records})`).join(", ")
    : "--";
}

function ClusterRow({ readiness }: { readiness: ClusterReadiness }) {
  return (
    <tr>
      <td>
        <Link href={readiness.href}>{readiness.label}</Link>
      </td>
      <td>
        {readiness.qualified}/{readiness.cluster.minQualified}
      </td>
      <td>{readiness.withVerifiedImage}</td>
      <td>{readiness.distinctlyDescribed}</td>
      <td>{readiness.ready ? "Ready to promote" : readiness.blockers.join("; ")}</td>
      <td>{readiness.cluster.extraRequirement}</td>
    </tr>
  );
}

function ReportView({ report, clusters, stale }: {
  report: EligibilityReport;
  clusters: ClusterReadiness[];
  stale: Array<{ slug: string; name: string; daysSinceCheck: number | null }>;
}) {
  const { counts } = report;
  return (
    <>
      <section className="indexability-panel">
        <h2>Directory counts</h2>
        <p>
          Every number below comes from <code>lib/directory-counts.ts</code>, the same service the
          public pages and sitemaps read. Generated {formatDirectoryDate(report.generatedAt)}.
        </p>
        <div className="indexability-stat-grid">
          <div>
            <strong>{counts.discovered}</strong>
            <span>Discovered records</span>
          </div>
          <div>
            <strong>{counts.sourceChecked}</strong>
            <span>Source checked</span>
          </div>
          <div>
            <strong>{counts.qualified}</strong>
            <span>Qualified public profiles</span>
          </div>
          <div>
            <strong>{percent(report.qualificationRate)}</strong>
            <span>Qualification rate</span>
          </div>
          <div>
            <strong>{counts.ownershipVerified}</strong>
            <span>Ownership verified</span>
          </div>
          <div>
            <strong>{counts.withVerifiedImage}</strong>
            <span>With a verified image</span>
          </div>
          <div>
            <strong>{counts.qualifiedCities}</strong>
            <span>Publishable city hubs</span>
          </div>
          <div>
            <strong>{counts.qualifiedCategories}</strong>
            <span>Publishable category hubs</span>
          </div>
        </div>
      </section>

      <section className="indexability-panel">
        <h2>Why records fail the publication gate</h2>
        <p>
          Sorted by volume. &ldquo;Sole blocker&rdquo; counts records that would publish the moment
          this one check passes — the cheapest inventory in the directory.
        </p>
        <div className="indexability-scroll">
          <table className="indexability-table">
            <thead>
              <tr>
                <th>Failure reason</th>
                <th>Records</th>
                <th>Share</th>
                <th>Sole blocker</th>
                <th>Top categories</th>
                <th>Top cities</th>
                <th>Top sources</th>
              </tr>
            </thead>
            <tbody>
              {report.failures.length ? (
                report.failures.map((failure) => (
                  <tr key={failure.reason}>
                    <td>{failure.reason}</td>
                    <td>{failure.records}</td>
                    <td>{percent(failure.share)}</td>
                    <td>{failure.soleBlockerFor}</td>
                    <td>{dimensionSummary(failure.categories)}</td>
                    <td>{dimensionSummary(failure.cities)}</td>
                    <td>{dimensionSummary(failure.sources)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>Every discovered record currently qualifies.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="indexability-panel">
        <h2>Priority cluster readiness</h2>
        <p>
          Cluster-first repair queue. A hub is only worth promoting when it has enough qualified
          profiles, enough real images and enough profiles whose facts are not the category
          template with the name swapped.
        </p>
        <div className="indexability-scroll">
          <table className="indexability-table">
            <thead>
              <tr>
                <th>Cluster</th>
                <th>Qualified</th>
                <th>Verified images</th>
                <th>Distinct descriptions</th>
                <th>Status</th>
                <th>Extra requirement</th>
              </tr>
            </thead>
            <tbody>
              {clusters.map((readiness) => (
                <ClusterRow key={readiness.href} readiness={readiness} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="indexability-panel">
        <h2>One fix from publication ({report.nearMisses.length})</h2>
        <div className="indexability-scroll">
          <table className="indexability-table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Area</th>
                <th>Blocking check</th>
                <th>Source</th>
                <th>Days since acquisition</th>
              </tr>
            </thead>
            <tbody>
              {report.nearMisses.length ? (
                report.nearMisses.slice(0, 100).map((record) => (
                  <tr key={record.slug}>
                    <td>
                      <Link href={getBusinessHref(record.slug)}>{record.name}</Link>
                    </td>
                    <td>{record.area}</td>
                    <td>{record.reason}</td>
                    <td>{record.dataSource}</td>
                    <td>{record.daysSinceAcquisition ?? "--"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No record is currently blocked by a single check.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="indexability-panel">
        <h2>Repeated description templates ({report.templateGroups.length})</h2>
        <p>
          Published profiles sharing one template once names, localities and numbers are removed.
          These are unique pages carrying commodity information — the rewrite queue.
        </p>
        <div className="indexability-scroll">
          <table className="indexability-table">
            <thead>
              <tr>
                <th>Records</th>
                <th>Sample profiles</th>
                <th>Template</th>
              </tr>
            </thead>
            <tbody>
              {report.templateGroups.length ? (
                report.templateGroups.slice(0, 25).map((group) => (
                  <tr key={group.fingerprint}>
                    <td>{group.records}</td>
                    <td>{group.sampleSlugs.join(", ")}</td>
                    <td>{group.fingerprint.slice(0, 140)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No repeated description template detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="indexability-panel">
        <h2>Overdue re-checks ({stale.length})</h2>
        <p>
          Qualified profiles whose fastest-moving facts — phone, closure status, hours — are past
          their review interval.
        </p>
        <div className="indexability-scroll">
          <table className="indexability-table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Days since last source check</th>
              </tr>
            </thead>
            <tbody>
              {stale.length ? (
                stale.slice(0, 100).map((record) => (
                  <tr key={record.slug}>
                    <td>
                      <Link href={getBusinessHref(record.slug)}>{record.name}</Link>
                    </td>
                    <td>{record.daysSinceCheck ?? "Never checked"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2}>Every qualified profile is inside its review interval.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default async function IndexabilityDashboardPage() {
  let report: EligibilityReport | null = null;
  let clusters: ClusterReadiness[] = [];
  let stale: Array<{ slug: string; name: string; daysSinceCheck: number | null }> = [];
  let error: string | null = null;

  try {
    const listings = await getAllDirectoryListings();
    report = buildEligibilityReport(listings);
    const qualified = listings.filter(isIndexableListing);
    clusters = evaluatePriorityClusters(qualified);
    stale = selectStaleListings(qualified).map((entry) => ({
      slug: entry.listing.slug,
      name: entry.listing.name,
      daysSinceCheck: entry.freshness.daysSinceCheck,
    }));
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Listing repository unavailable.";
  }

  return (
    <main className="indexability-page">
      <header className="indexability-page__head">
        <h1>Indexability and data quality</h1>
        <p>
          Live view of the publication gate in <code>lib/public-listings.ts</code>. Use it to pick
          the next repair batch rather than reviewing records in acquisition order.
        </p>
      </header>

      {error ? (
        <section className="indexability-panel">
          <h2>Report unavailable</h2>
          <p>{error}</p>
        </section>
      ) : report ? (
        <ReportView report={report} clusters={clusters} stale={stale} />
      ) : null}
    </main>
  );
}

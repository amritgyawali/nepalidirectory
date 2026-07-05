import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Attribution & Licensing | Nepali Directory",
  description:
    "Sources and licenses behind Nepali Directory listings, including © OpenStreetMap contributors (ODbL).",
  alternates: { canonical: "/attribution" }
};

export default function AttributionPage() {
  return (
    <main className="container" style={{ padding: "2.5rem 0", maxWidth: 820 }}>
      <h1>Data Attribution &amp; Licensing</h1>
      <p>
        Nepali Directory combines several data sources to build a comprehensive, accurate view of
        businesses across Nepal. We credit each source and honor its license below.
      </p>

      <h2>OpenStreetMap</h2>
      <p>
        Portions of our location data are derived from OpenStreetMap and are available under the{" "}
        <a href="https://opendatacommons.org/licenses/odbl/" rel="nofollow noopener" target="_blank">
          Open Database License (ODbL)
        </a>
        . Map data is{" "}
        <strong>© OpenStreetMap contributors</strong>. Where we distribute derived data from
        OpenStreetMap, the derived database remains available under the ODbL. Listings sourced from
        OpenStreetMap are internally flagged (<code>data_source=&quot;osm&quot;</code>) so the
        OpenStreetMap-derived portions remain separable.
      </p>
      <p>
        Learn more at{" "}
        <a href="https://www.openstreetmap.org/copyright" rel="nofollow noopener" target="_blank">
          openstreetmap.org/copyright
        </a>
        .
      </p>

      <h2>Business owners &amp; user submissions</h2>
      <p>
        Much of our richest data comes directly from business owners who claim and complete their
        listings, and from community submissions. This first-party data is owned and curated by
        Nepali Directory and the businesses themselves.
      </p>

      <h2>Google Places</h2>
      <p>
        We use the Google Places API only on demand — to help a business owner verify a claim, or
        for an administrator to spot-check a single listing. We do not bulk-store Google content;
        we retain only a place identifier plus our own verification flags, per the Google Maps
        Platform Terms of Service.
      </p>

      <h2>Official &amp; licensed records</h2>
      <p>
        Some listings are imported from public records and licensed datasets (for example municipal
        or chamber-of-commerce business lists). Each carries its own source reference.
      </p>

      <p style={{ marginTop: "2rem" }}>
        Questions about our data or a correction request? <Link href="/contact">Contact us</Link>.
      </p>
    </main>
  );
}

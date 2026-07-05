"use client";

import { CheckCircle2, Clock, Edit3, Eye, Plus, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useState } from "react";
import { useDashboardData } from "@/components/dashboard/DashboardProvider";
import { FillImage } from "@/components/ui/FillImage";
import { routes } from "@/lib/routes";

export default function DashboardListingsPage() {
  const { state, improveListing, selectListing, toggleListingVisibility } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "paused">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const liveCount = useMemo(
    () => state.listings.filter((listing) => listing.visibility === "Live").length,
    [state.listings]
  );
  const categories = useMemo(
    () => ["all", ...Array.from(new Set(state.listings.map((listing) => listing.category)))],
    [state.listings]
  );
  const filteredListings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return state.listings.filter((listing) => {
      const matchesQuery =
        !query ||
        [listing.name, listing.address, listing.category, listing.seo?.primaryKeyword]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(query));
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "live" && listing.visibility === "Live") ||
        (statusFilter === "paused" && listing.visibility === "Paused");
      const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter;

      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [categoryFilter, searchTerm, state.listings, statusFilter]);

  function publishVisibleListings() {
    filteredListings.forEach((listing) => {
      if (listing.visibility === "Paused") {
        toggleListingVisibility(listing.slug);
      }
    });
  }

  function pauseVisibleListings() {
    filteredListings.forEach((listing) => {
      if (listing.visibility === "Live") {
        toggleListingVisibility(listing.slug);
      }
    });
  }

  function improveVisibleListings() {
    filteredListings.forEach((listing) => improveListing(listing.slug));
  }

  return (
    <main className="admin-subpage">
      <div className="container">
        <div className="admin-subpage__head">
          <div>
            <Link href={routes.dashboard}>Dashboard</Link>
            <h1>My listings</h1>
            <p>
              {liveCount} live listings across profile completeness, hours, and public visibility controls.
            </p>
          </div>
          <Link className="button button--primary" href={routes.claimListing}>
            <Plus size={16} aria-hidden />
            Add listing
          </Link>
        </div>

        <section className="dashboard-panel dashboard-listing-tools">
          <div className="dashboard-search-field">
            <Search size={16} aria-hidden />
            <input
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search listings, categories, SEO keywords..."
              value={searchTerm}
            />
          </div>
          <select onChange={(event) => setStatusFilter(event.target.value as "all" | "live" | "paused")} value={statusFilter}>
            <option value="all">All statuses</option>
            <option value="live">Live only</option>
            <option value="paused">Paused only</option>
          </select>
          <select onChange={(event) => setCategoryFilter(event.target.value)} value={categoryFilter}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All categories" : category}
              </option>
            ))}
          </select>
          <div className="dashboard-action-row">
            <button className="button button--outline" onClick={publishVisibleListings} type="button">
              Publish visible
            </button>
            <button className="button button--outline" onClick={pauseVisibleListings} type="button">
              Pause visible
            </button>
            <button className="button button--primary" onClick={improveVisibleListings} type="button">
              Improve visible
            </button>
          </div>
        </section>

        <section className="admin-table">
          {filteredListings.map((listing) => (
            <article key={listing.slug}>
              <span className="admin-table__image">
                <FillImage src={listing.image} alt={listing.name} sizes="74px" />
              </span>
              <div>
                <strong>{listing.name}</strong>
                <small>{listing.address}</small>
                {listing.seo?.primaryKeyword ? <small>SEO target: {listing.seo.primaryKeyword}</small> : null}
                <span>
                  <CheckCircle2 size={14} aria-hidden />
                  {listing.verified ? "Verified" : "Pending verification"}
                </span>
              </div>
              <div>
                <small>Status</small>
                <strong>{listing.visibility}</strong>
                <small>{listing.operatingStatus}</small>
              </div>
              <div>
                <small>Completeness</small>
                <progress value={listing.completeness} max={100} />
                <small>{listing.completeness}% complete</small>
              </div>
              <div className="admin-table__actions">
                <Link
                  href={`${routes.search}?query=${encodeURIComponent(listing.name)}`}
                  aria-label={`View ${listing.name}`}
                  onClick={() => selectListing(listing.slug)}
                >
                  <Eye size={16} aria-hidden />
                </Link>
                <Link
                  href={`${routes.account}?section=profile&listing=${listing.slug}`}
                  aria-label={`Edit ${listing.name}`}
                  onClick={() => selectListing(listing.slug)}
                >
                  <Edit3 size={16} aria-hidden />
                </Link>
                <Link
                  href={`${routes.account}?section=hours&listing=${listing.slug}`}
                  aria-label={`Update hours for ${listing.name}`}
                  onClick={() => selectListing(listing.slug)}
                >
                  <Clock size={16} aria-hidden />
                </Link>
                <button
                  aria-label={`Improve ${listing.name}`}
                  className="admin-table__icon-button"
                  onClick={() => improveListing(listing.slug)}
                  type="button"
                >
                  <Sparkles size={16} aria-hidden />
                </button>
              </div>
              <div className="admin-table__controls">
                <button
                  className="button button--outline"
                  onClick={() => toggleListingVisibility(listing.slug)}
                  type="button"
                >
                  {listing.visibility === "Live" ? "Pause listing" : "Publish listing"}
                </button>
                <button
                  className="button button--primary"
                  onClick={() => improveListing(listing.slug)}
                  type="button"
                >
                  Improve profile
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

"use client";

import {
  ArrowUpDown,
  Building2,
  Clock,
  DollarSign,
  FileText,
  HelpCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  Star
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { BusinessCard } from "@/components/directory/BusinessCard";
import { Stars } from "@/components/ui/Stars";
import { businesses, categories, cityLinks, popularSearches } from "@/lib/data";
import { routes } from "@/lib/routes";
import { searchRecords, type SearchKind } from "@/lib/search";

const kinds: Array<{ label: string; value: SearchKind | "all" }> = [
  { label: "All", value: "all" },
  { label: "Businesses", value: "business" },
  { label: "Categories", value: "category" },
  { label: "Cities", value: "city" },
  { label: "Guides", value: "guide" },
  { label: "Q&A", value: "question" },
  { label: "Pages", value: "page" }
];

const quickFilters = [
  "Open Now",
  "Open 24 Hours",
  "Verified",
  "Offers",
  "Request Quote",
  "Delivery",
  "Restaurants",
  "Thakali",
  "Newari",
  "Pizza",
  "Wi-Fi"
];

type SearchExperienceProps = {
  initialQuery: string;
  initialLocation: string;
};

const businessBySlug = new Map(businesses.map((business) => [business.slug, business]));

const businessFromRecord = (id: string) => businessBySlug.get(id.replace("business-", ""));

function iconForKind(kind: SearchKind) {
  if (kind === "business") return Building2;
  if (kind === "city") return MapPin;
  if (kind === "question") return HelpCircle;
  return FileText;
}

export function SearchExperience({ initialQuery, initialLocation }: SearchExperienceProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation || "Kathmandu, Bagmati");
  const [kind, setKind] = useState<SearchKind | "all">("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sort, setSort] = useState("relevance");
  const [minRating, setMinRating] = useState("0");
  const [price, setPrice] = useState("all");

  const results = useMemo(() => {
    const specialFilters = new Set(["Open Now", "Open 24 Hours", "Verified", "Offers", "Request Quote", "Delivery"]);
    const filterQuery = [query, ...activeFilters.filter((filter) => !specialFilters.has(filter))]
      .filter(Boolean)
      .join(" ");
    let records = searchRecords(filterQuery, location, kind);

    if (activeFilters.includes("Open Now")) {
      records = records.filter((record) => record.kind !== "business" || record.status === "open" || record.status === "24h");
    }
    if (activeFilters.includes("Open 24 Hours")) {
      records = records.filter((record) => record.kind !== "business" || record.status === "24h");
    }
    if (activeFilters.includes("Verified")) {
      records = records.filter((record) => record.kind !== "business" || Boolean(businessFromRecord(record.id)?.verified));
    }
    if (activeFilters.includes("Offers")) {
      records = records.filter((record) => record.kind !== "business" || Boolean(businessFromRecord(record.id)?.coupons?.length));
    }
    if (activeFilters.includes("Request Quote")) {
      records = records.filter((record) => record.kind !== "business" || Boolean(businessFromRecord(record.id)?.services?.length));
    }
    if (activeFilters.includes("Delivery")) {
      records = records.filter((record) => record.kind !== "business" || Boolean(businessFromRecord(record.id)?.delivery));
    }
    if (minRating !== "0") {
      const ratingFloor = Number(minRating);
      records = records.filter((record) => record.kind !== "business" || (record.rating ?? 0) >= ratingFloor);
    }
    if (price !== "all") {
      const priceLevel = Number(price);
      records = records.filter((record) => record.kind !== "business" || businessFromRecord(record.id)?.price === priceLevel);
    }

    return records.sort((a, b) => {
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "reviews") return (b.reviews ?? 0) - (a.reviews ?? 0);
      if (sort === "distance") return (businessFromRecord(a.id)?.distanceKm ?? 9999) - (businessFromRecord(b.id)?.distanceKm ?? 9999);
      if (sort === "name") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [activeFilters, kind, location, minRating, price, query, sort]);

  const businessResults = results.filter((record) => record.kind === "business");
  const otherResults = results.filter((record) => record.kind !== "business");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("location", location.trim());
    router.replace(`${routes.search}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  function toggleFilter(filter: string) {
    setActiveFilters((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]
    );
  }

  return (
    <main>
      <section className="search-command">
        <div className="container search-command__grid">
          <div>
            <h1>Search Nepali Directory</h1>
            <p>
              Search businesses, categories, city guides and Q&A.
            </p>
          </div>
          <form className="search-command__form" onSubmit={submitSearch} role="search">
            <label>
              <Search size={18} aria-hidden />
              <span className="sr-only">Search term</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="restaurants, plumbers, doctors" />
            </label>
            <label>
              <MapPin size={18} aria-hidden />
              <span className="sr-only">Location</span>
              <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Kathmandu, Pokhara, Nepal" />
            </label>
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="search-toolbar">
        <div className="container">
          <div className="search-tabs" role="tablist" aria-label="Search result type">
            {kinds.map((item) => (
              <button
                key={item.value}
                className={kind === item.value ? "search-tab search-tab--active" : "search-tab"}
                onClick={() => setKind(item.value)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="filter-row filter-row--top">
            <button className="chip chip--active" type="button">
              <SlidersHorizontal size={13} aria-hidden />
              Filters
            </button>
            {quickFilters.map((filter) => (
              <button
                className={activeFilters.includes(filter) ? "chip chip--active" : "chip"}
                onClick={() => toggleFilter(filter)}
                type="button"
                key={filter}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container section two-col">
        <section className="search-results">
          <div className="search-results__head">
            <div>
              <strong>{results.length} results</strong>
              <span>
                {query ? ` for "${query}"` : " across the directory"}
                {location ? ` in ${location}` : ""}
              </span>
            </div>
            <label className="sort-control sort-control--inline">
              <ArrowUpDown size={14} aria-hidden />
              Sort
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="distance">Nearest</option>
                <option value="rating">Rating</option>
                <option value="reviews">Most reviews</option>
                <option value="name">Name A-Z</option>
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
              <h2>No exact matches found</h2>
              <p>Try a broader category, remove filters, or search all Nepal instead of one city.</p>
            <button className="button button--primary" onClick={() => setActiveFilters([])} type="button">
              Clear filters
            </button>
          </div>
          ) : null}

          {businessResults.map((record, index) => {
            const slug = record.id.replace("business-", "");
            const business = businessBySlug.get(slug);
            return business ? <BusinessCard key={record.id} business={business} sponsored={index === 0 && kind !== "business"} /> : null;
          })}

          {otherResults.length ? (
            <div className="universal-results">
              {otherResults.map((record, index) => {
                const Icon = iconForKind(record.kind);
                return (
                  <Link className="universal-result" href={record.href} key={`${record.id}-${index}`}>
                    <span className="universal-result__icon">
                      <Icon size={18} aria-hidden />
                    </span>
                    <span className="universal-result__body">
                      <span>{record.kind}</span>
                      <strong>{record.title}</strong>
                      <small>{record.description}</small>
                    </span>
                    <span className="universal-result__meta">
                      {record.rating ? (
                        <>
                          <Stars rating={record.rating} />
                          {record.rating.toFixed(1)}
                        </>
                      ) : (
                        record.location
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </section>

        <aside className="sidebar">
          <section className="map-card">
            <div>Map view</div>
            <p>Open businesses and city pages from your current search location.</p>
            <Link className="button button--primary" href={routes.map}>
              Open map
            </Link>
          </section>
          <section className="filter-card search-insights">
            <h2>Search coverage</h2>
            <p>
              Results include verified listings, category landing pages, city pages, guides,
              community questions and support pages.
            </p>
            <div>
              <span>
                <Star size={14} aria-hidden fill="currentColor" /> {businessResults.length} businesses
              </span>
              <span>
                <FileText size={14} aria-hidden /> {otherResults.length} other results
              </span>
              <span>
                <Clock size={14} aria-hidden /> {businessResults.filter((item) => item.status === "open").length} open now
              </span>
            </div>
          </section>
          <section className="filter-card">
            <h2>Refine business results</h2>
            <label className="stacked-control">
              <span>Minimum rating</span>
              <select value={minRating} onChange={(event) => setMinRating(event.target.value)}>
                <option value="0">Any rating</option>
                <option value="4.5">4.5 stars and up</option>
                <option value="4">4 stars and up</option>
                <option value="3.5">3.5 stars and up</option>
              </select>
            </label>
            <label className="stacked-control">
              <span>Price level</span>
              <select value={price} onChange={(event) => setPrice(event.target.value)}>
                <option value="all">Any price</option>
                <option value="1">Rs</option>
                <option value="2">Rs Rs</option>
                <option value="3">Rs Rs Rs</option>
                <option value="4">Rs Rs Rs Rs</option>
              </select>
            </label>
            <div className="filter-card__mini">
              <DollarSign size={15} aria-hidden />
              Prices are approximate and vary by service, menu item or booking date.
            </div>
          </section>
          <section className="filter-card">
            <h2>Popular searches</h2>
            {popularSearches.slice(0, 6).map((search) => (
              <button
                className="text-action"
                key={search}
                onClick={() => setQuery(search)}
                type="button"
              >
                {search}
              </button>
            ))}
          </section>
          <section className="filter-card">
            <h2>Browse categories</h2>
            {categories.slice(0, 8).map((category) => (
              <button
                className="text-action"
                key={category.name}
                onClick={() => setQuery(category.name)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </section>
          <section className="filter-card">
            <h2>Popular cities</h2>
            {cityLinks.slice(0, 8).map((city) => (
              <button
                className="text-action"
                key={city}
                onClick={() => setLocation(city)}
                type="button"
              >
                {city}
              </button>
            ))}
          </section>
        </aside>
      </div>
    </main>
  );
}

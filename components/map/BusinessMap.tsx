"use client";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Crosshair,
  ExternalLink,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  GeoJSONSource,
  LngLatBoundsLike,
  Map as MapLibreMap,
} from "maplibre-gl";

export type MapBusiness = {
  slug: string;
  name: string;
  categories: string[];
  area: string;
  neighborhood?: string;
  address: string;
  phone: string;
  status: "open" | "closed" | "24h";
  verified: boolean;
  lat: number;
  lng: number;
};

type BusinessMapProps = {
  businesses: MapBusiness[];
};

type BusinessFeatureProperties = {
  slug: string;
};

const MAP_SOURCE = "directory-businesses";
const CLUSTER_LAYER = "business-clusters";
const CLUSTER_COUNT_LAYER = "business-cluster-count";
const POINT_LAYER = "business-points";
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const MAP_WORKER =
  "https://cdn.jsdelivr.net/npm/maplibre-gl@6.0.0/dist/maplibre-gl-worker.mjs";
const LIST_LIMIT = 80;

function toFeatureCollection(
  businesses: MapBusiness[],
): GeoJSON.FeatureCollection<GeoJSON.Point, BusinessFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: businesses.map((business) => ({
      type: "Feature",
      id: business.slug,
      geometry: {
        type: "Point",
        coordinates: [business.lng, business.lat],
      },
      properties: {
        slug: business.slug,
      },
    })),
  };
}

function fitBusinesses(map: MapLibreMap, businesses: MapBusiness[]) {
  if (businesses.length === 0) return;
  if (businesses.length === 1) {
    map.easeTo({
      center: [businesses[0].lng, businesses[0].lat],
      zoom: 15,
      duration: 850,
    });
    return;
  }

  let west = businesses[0].lng;
  let east = businesses[0].lng;
  let south = businesses[0].lat;
  let north = businesses[0].lat;

  for (const business of businesses.slice(1)) {
    west = Math.min(west, business.lng);
    east = Math.max(east, business.lng);
    south = Math.min(south, business.lat);
    north = Math.max(north, business.lat);
  }

  map.fitBounds(
    [
      [west, south],
      [east, north],
    ] as LngLatBoundsLike,
    {
      padding: { top: 72, right: 72, bottom: 72, left: 72 },
      maxZoom: 14,
      duration: 900,
    },
  );
}

function normalized(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function BusinessMap({ businesses }: BusinessMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const filteredBusinessesRef = useRef(businesses);
  const selectedSlugRef = useRef<string | null>(null);
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const [category, setCategory] = useState("all");
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [visibleBusinesses, setVisibleBusinesses] = useState(
    businesses.slice(0, LIST_LIMIT),
  );
  const deferredQuery = useDeferredValue(query);

  const businessBySlug = useMemo(
    () => new Map(businesses.map((business) => [business.slug, business])),
    [businesses],
  );

  const areas = useMemo(
    () =>
      [...new Set(businesses.map((business) => business.area).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b))
        .slice(0, 200),
    [businesses],
  );

  const categories = useMemo(
    () =>
      [...new Set(businesses.flatMap((business) => business.categories))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [businesses],
  );

  const filteredBusinesses = useMemo(() => {
    const needle = normalized(deferredQuery);
    return businesses.filter((business) => {
      if (area !== "all" && business.area !== area) return false;
      if (category !== "all" && !business.categories.includes(category)) {
        return false;
      }
      if (!needle) return true;

      return [
        business.name,
        business.address,
        business.area,
        business.neighborhood ?? "",
        ...business.categories,
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(needle);
    });
  }, [area, businesses, category, deferredQuery]);

  const selectedBusiness = selectedSlug
    ? businessBySlug.get(selectedSlug)
    : undefined;

  function updateVisibleBusinesses() {
    const map = mapRef.current;
    if (!map) return;
    const bounds = map.getBounds();
    const visible = filteredBusinessesRef.current
      .filter((business) => bounds.contains([business.lng, business.lat]))
      .slice(0, LIST_LIMIT);
    setVisibleBusinesses(visible);
  }

  function selectBusiness(business: MapBusiness, moveMap = true) {
    const map = mapRef.current;
    if (map && selectedSlugRef.current) {
      map.setFeatureState(
        { source: MAP_SOURCE, id: selectedSlugRef.current },
        { selected: false },
      );
    }
    if (map) {
      map.setFeatureState(
        { source: MAP_SOURCE, id: business.slug },
        { selected: true },
      );
      if (moveMap) {
        map.easeTo({
          center: [business.lng, business.lat],
          zoom: Math.max(map.getZoom(), 15),
          duration: 750,
        });
      }
    }
    selectedSlugRef.current = business.slug;
    setSelectedSlug(business.slug);
  }

  function clearSelection() {
    const map = mapRef.current;
    if (map && selectedSlugRef.current) {
      map.setFeatureState(
        { source: MAP_SOURCE, id: selectedSlugRef.current },
        { selected: false },
      );
    }
    selectedSlugRef.current = null;
    setSelectedSlug(null);
  }

  function resetFilters() {
    setQuery("");
    setArea("all");
    setCategory("all");
    clearSelection();
  }

  useEffect(() => {
    filteredBusinessesRef.current = filteredBusinesses;
  }, [filteredBusinesses]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let disposed = false;
    let map: MapLibreMap | null = null;
    let loadTimeout: number | undefined;

    async function initialiseMap() {
      try {
        const maplibregl = await import("maplibre-gl");
        if (disposed || !mapContainerRef.current) return;

        // Next bundles MapLibre's import.meta.url as a build-machine file URL. An explicit
        // browser-safe worker URL prevents production from resolving the worker to /map HTML.
        maplibregl.setWorkerUrl(MAP_WORKER);
        map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: MAP_STYLE,
          center: [84.1, 28.25],
          zoom: 6.3,
          minZoom: 5,
          maxZoom: 19,
          cooperativeGestures: true,
        });
        mapRef.current = map;

        map.addControl(
          new maplibregl.NavigationControl({ visualizePitch: true }),
          "top-right",
        );
        map.addControl(new maplibregl.FullscreenControl(), "top-right");
        map.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
          }),
          "top-right",
        );
        map.addControl(
          new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }),
          "bottom-left",
        );

        loadTimeout = window.setTimeout(() => {
          if (!disposed) {
            setMapError(
              "The map is taking longer than expected to load. You can still browse every mapped business in the list.",
            );
          }
        }, 15000);

        map.once("load", () => {
          if (!map || disposed) return;
          window.clearTimeout(loadTimeout);
          setMapError("");

          map.addSource(MAP_SOURCE, {
            type: "geojson",
            data: toFeatureCollection(filteredBusinessesRef.current),
            cluster: true,
            clusterMaxZoom: 13,
            clusterRadius: 46,
          });

          map.addLayer({
            id: CLUSTER_LAYER,
            type: "circle",
            source: MAP_SOURCE,
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#ffd400",
                50,
                "#ffb800",
                200,
                "#f28b00",
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                19,
                50,
                25,
                200,
                32,
              ],
              "circle-stroke-width": 3,
              "circle-stroke-color": "#181713",
              "circle-opacity": 0.94,
            },
          });

          map.addLayer({
            id: CLUSTER_COUNT_LAYER,
            type: "symbol",
            source: MAP_SOURCE,
            filter: ["has", "point_count"],
            layout: {
              "text-field": ["get", "point_count_abbreviated"],
              "text-size": 12,
              "text-font": ["Noto Sans Regular"],
            },
            paint: {
              "text-color": "#181713",
            },
          });

          map.addLayer({
            id: POINT_LAYER,
            type: "circle",
            source: MAP_SOURCE,
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                "#181713",
                "#ffd400",
              ],
              "circle-radius": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                11,
                7,
              ],
              "circle-stroke-width": 3,
              "circle-stroke-color": "#ffffff",
            },
          });

          map.on("click", CLUSTER_LAYER, async (event) => {
            if (!map) return;
            const feature = map.queryRenderedFeatures(event.point, {
              layers: [CLUSTER_LAYER],
            })[0];
            const clusterId = Number(feature?.properties?.cluster_id);
            if (!feature || !Number.isFinite(clusterId)) return;
            const source = map.getSource(MAP_SOURCE) as GeoJSONSource;
            const zoom = await source.getClusterExpansionZoom(clusterId);
            const coordinates = (
              feature.geometry as GeoJSON.Point
            ).coordinates as [number, number];
            map.easeTo({ center: coordinates, zoom, duration: 600 });
          });

          map.on("click", POINT_LAYER, (event) => {
            const slug = String(event.features?.[0]?.properties?.slug ?? "");
            const business = businessBySlug.get(slug);
            if (business) selectBusiness(business, false);
          });

          const showPointer = () => {
            if (map) map.getCanvas().style.cursor = "pointer";
          };
          const hidePointer = () => {
            if (map) map.getCanvas().style.cursor = "";
          };
          map.on("mouseenter", CLUSTER_LAYER, showPointer);
          map.on("mouseleave", CLUSTER_LAYER, hidePointer);
          map.on("mouseenter", POINT_LAYER, showPointer);
          map.on("mouseleave", POINT_LAYER, hidePointer);
          map.on("moveend", updateVisibleBusinesses);

          setMapReady(true);
          fitBusinesses(map, filteredBusinessesRef.current);
          window.setTimeout(updateVisibleBusinesses, 950);
        });
      } catch {
        if (!disposed) {
          setMapError(
            "The interactive map could not load. You can still browse every mapped business in the list.",
          );
        }
      }
    }

    void initialiseMap();
    return () => {
      disposed = true;
      window.clearTimeout(loadTimeout);
      setMapReady(false);
      mapRef.current = null;
      map?.remove();
    };
  }, [businessBySlug]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) {
      setVisibleBusinesses(filteredBusinesses.slice(0, LIST_LIMIT));
      return;
    }

    clearSelection();
    const source = map.getSource(MAP_SOURCE) as GeoJSONSource | undefined;
    void source?.setData(toFeatureCollection(filteredBusinesses));
    fitBusinesses(map, filteredBusinesses);
    window.setTimeout(updateVisibleBusinesses, 950);
  }, [filteredBusinesses, mapReady]);

  return (
    <section className="map-page">
      <div className="container">
        <header className="directory-map__hero">
          <div>
            <span className="directory-map__eyebrow">
              <MapPin size={15} aria-hidden />
              Explore Nepal
            </span>
            <h1>Find businesses on the map</h1>
            <p>
              Search and explore {businesses.length.toLocaleString()} directory
              locations on a fast, open map. Select a marker for business
              details and directions.
            </p>
          </div>
          <div className="directory-map__hero-stat" aria-label={`${businesses.length} mapped businesses`}>
            <strong>{businesses.length.toLocaleString()}</strong>
            <span>mapped businesses</span>
          </div>
        </header>

        <div className="directory-map__filters" role="search" aria-label="Filter map businesses">
          <label className="directory-map__search">
            <Search size={18} aria-hidden />
            <span className="sr-only">Search map businesses</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a business, service or address"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={17} aria-hidden />
              </button>
            ) : null}
          </label>
          <label>
            <span className="sr-only">Filter by area</span>
            <select value={area} onChange={(event) => setArea(event.target.value)}>
              <option value="all">All areas</option>
              {areas.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <button
            className="directory-map__reset"
            type="button"
            onClick={resetFilters}
            disabled={!query && area === "all" && category === "all"}
          >
            <RotateCcw size={16} aria-hidden />
            Reset
          </button>
        </div>

        <div className="directory-map__summary" aria-live="polite">
          <span>
            <Building2 size={16} aria-hidden />
            <strong>{filteredBusinesses.length.toLocaleString()}</strong>{" "}
            {filteredBusinesses.length === 1 ? "match" : "matches"}
          </span>
          <button
            type="button"
            onClick={() => {
              const map = mapRef.current;
              if (map) fitBusinesses(map, filteredBusinesses);
            }}
            disabled={!mapReady || filteredBusinesses.length === 0}
          >
            <Crosshair size={15} aria-hidden />
            Fit results on map
          </button>
        </div>

        <div className="directory-map__workspace">
          <div className="directory-map__map-shell">
            <div
              className="directory-map__canvas"
              ref={mapContainerRef}
              aria-label={`Interactive map with ${filteredBusinesses.length} business locations`}
            />
            {!mapReady && !mapError ? (
              <div className="directory-map__loading" role="status">
                <span />
                <strong>Loading the business map…</strong>
              </div>
            ) : null}
            {mapError ? (
              <div className="directory-map__error" role="alert">
                <MapPin size={28} aria-hidden />
                <strong>Map temporarily unavailable</strong>
                <span>{mapError}</span>
              </div>
            ) : null}
            {mapReady ? (
              <div className="directory-map__tip">
                <LocateFixed size={14} aria-hidden />
                Click a cluster to zoom in
              </div>
            ) : null}

            {selectedBusiness ? (
              <article className="directory-map__selection">
                <button
                  className="directory-map__selection-close"
                  type="button"
                  onClick={clearSelection}
                  aria-label="Close business details"
                >
                  <X size={18} aria-hidden />
                </button>
                <span className="directory-map__selection-category">
                  {selectedBusiness.categories[0] ?? "Local business"}
                </span>
                <h2>{selectedBusiness.name}</h2>
                <p>
                  <MapPin size={15} aria-hidden />
                  {selectedBusiness.address}
                </p>
                <div className="directory-map__selection-meta">
                  {selectedBusiness.verified ? (
                    <span className="directory-map__verified">
                      <CheckCircle2 size={14} aria-hidden />
                      Verified
                    </span>
                  ) : null}
                </div>
                <div className="directory-map__selection-actions">
                  <Link
                    className="button button--primary"
                    href={`/business/${selectedBusiness.slug}`}
                  >
                    View profile
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                  <a
                    className="button button--outline"
                    href={`https://www.openstreetmap.org/directions?from=&to=${selectedBusiness.lat}%2C${selectedBusiness.lng}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Navigation size={15} aria-hidden />
                    Directions
                    <ExternalLink size={12} aria-hidden />
                  </a>
                </div>
              </article>
            ) : null}
          </div>

          <aside className="directory-map__list" aria-label="Businesses in the visible map area">
            <div className="directory-map__list-head">
              <div>
                <strong>In this map area</strong>
                <span>
                  {visibleBusinesses.length === LIST_LIMIT
                    ? `First ${LIST_LIMIT} shown`
                    : `${visibleBusinesses.length} visible`}
                </span>
              </div>
              <MapPin size={20} aria-hidden />
            </div>

            <div className="directory-map__list-scroll">
              {visibleBusinesses.map((business) => (
                <button
                  className={
                    selectedSlug === business.slug
                      ? "directory-map__listing directory-map__listing--active"
                      : "directory-map__listing"
                  }
                  type="button"
                  key={business.slug}
                  onClick={() => selectBusiness(business)}
                  aria-pressed={selectedSlug === business.slug}
                >
                  <span className="directory-map__listing-pin">
                    <MapPin size={17} fill="currentColor" aria-hidden />
                  </span>
                  <span className="directory-map__listing-body">
                    <span className="directory-map__listing-topline">
                      <strong>{business.name}</strong>
                      {business.verified ? (
                        <CheckCircle2
                          size={14}
                          aria-label="Verified business"
                        />
                      ) : null}
                    </span>
                    <small>{business.categories[0] ?? "Local business"}</small>
                    <span>{business.address}</span>
                    <span className="directory-map__listing-meta">
                      <span className={`directory-map__status directory-map__status--${business.status}`}>
                        {business.status === "24h"
                          ? "Open 24 hours"
                          : business.status === "open"
                            ? "Open now"
                            : "Check hours"}
                      </span>
                      {business.phone ? (
                        <span>
                          <Phone size={12} aria-hidden />
                          Phone listed
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              ))}

              {visibleBusinesses.length === 0 ? (
                <div className="directory-map__empty">
                  <MapPin size={28} aria-hidden />
                  <strong>
                    {filteredBusinesses.length === 0
                      ? "No businesses match these filters"
                      : "No matching businesses in this map area"}
                  </strong>
                  <p>
                    {filteredBusinesses.length === 0
                      ? "Try a broader search, area or category."
                      : "Move the map or fit all matching results."}
                  </p>
                  <button
                    className="button button--outline"
                    type="button"
                    onClick={
                      filteredBusinesses.length === 0
                        ? resetFilters
                        : () => {
                            const map = mapRef.current;
                            if (map) fitBusinesses(map, filteredBusinesses);
                          }
                    }
                  >
                    {filteredBusinesses.length === 0
                      ? "Clear filters"
                      : "Fit map to results"}
                  </button>
                </div>
              ) : null}
            </div>
          </aside>
        </div>

        <footer className="directory-map__footer">
          <span>
            Map data © OpenStreetMap contributors, served by OpenFreeMap.
          </span>
          <span>
            Business locations are directory data; confirm the exact address
            before travelling.
          </span>
        </footer>
      </div>
    </section>
  );
}

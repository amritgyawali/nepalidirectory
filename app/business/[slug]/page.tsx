import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  BadgeCheck,
  Clock3,
  ExternalLink,
  Globe2,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { siteUrl } from "@/lib/blog";
import {
  getDirectionsUrl,
  getListingSourceLabel,
  getListingSourceUrl,
} from "@/lib/business-links";
import { cityDirectoryPages } from "@/lib/city-pages";
import { getDirectoryCategory, listingMatchesDirectoryCategory } from "@/lib/directory-categories";
import { MIN_INDEXABLE_DIRECTORY_RESULTS } from "@/lib/directory-pagination";
import { formatDirectoryDate } from "@/lib/format-date";
import { evaluateListingFreshness } from "@/lib/freshness";
import { displayAddress, displayLocality, localityTrail } from "@/lib/locality";
import {
  canPreviewListing,
  getDirectoryListing,
  getIndexableListings,
  isDemoListing,
  isIndexableListing,
  listingDescription,
  listingFactsCheckedAt,
  listingMatchesCity,
  listingVerificationLabel,
  publicListingImage,
} from "@/lib/public-listings";
import { listingPublicationTier } from "@/lib/trust-vocabulary";
import { getBusinessHref, getCityCategoryHref, getSearchHref, routes } from "@/lib/routes";
import { buildWebPageJsonLd, serializeJsonLd, uniqueKeywords } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildListingLocalBusinessJsonLd } from "@/lib/seo-auto";

type BusinessPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamicParams = true;

const loadListing = cache(getDirectoryListing);
const loadIndexableListings = cache(getIndexableListings);

function titleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export async function generateStaticParams() {
  return (await getIndexableListings()).map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await loadListing(slug);
  if (!listing || !canPreviewListing(listing)) {
    return { title: "Business profile not found", robots: { index: false, follow: false } };
  }

  const href = getBusinessHref(listing.slug);
  const indexable = isIndexableListing(listing);
  const description = indexable
    ? listing.metaDescription ?? listingDescription(listing)
    : `${listing.name} is awaiting source and content review before public publication.`;
  const title = indexable ? listing.metaTitle ?? `${listing.name} in ${listing.area}` : listing.name;
  const verifiedImage = publicListingImage(listing);

  return {
    title,
    description,
    alternates: { canonical: href },
    robots: {
      index: indexable,
      follow: true,
      googleBot: indexable
        ? { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
        : { index: false, follow: true },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${href}`,
      siteName: "NepaliDirectory",
      type: "website",
      images: verifiedImage
        ? [{ url: verifiedImage, width: 1200, height: 1200, alt: `${listing.name} profile` }]
        : [{ url: "/nepali-directory-og.png", width: 1729, height: 909, alt: "Nepali Directory" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [verifiedImage ?? "/nepali-directory-og.png"],
    },
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const listing = await loadListing(slug);
  if (!listing || !canPreviewListing(listing)) notFound();

  const href = getBusinessHref(listing.slug);
  const url = `${siteUrl}${href}`;
  const indexable = isIndexableListing(listing);
  const demo = isDemoListing(listing);
  const description = indexable
    ? listingDescription(listing)
    : "This profile is awaiting source and content review. Business details are withheld until the record passes publication checks.";
  const factsCheckedAt = listingFactsCheckedAt(listing);
  const categories = listing.categories.map(titleCase);
  const primaryCategory = getDirectoryCategory(listing.categories[0] ?? "");
  const cityPage = cityDirectoryPages.find((city) => listingMatchesCity(listing, city.slug));
  const locationHref = cityPage?.href ?? routes.city;
  const indexableListings = await loadIndexableListings();
  const hasExactDirectoryParent = Boolean(
    indexable &&
    primaryCategory &&
    cityPage &&
    indexableListings.filter(
      (candidate) =>
        listingMatchesCity(candidate, cityPage.slug) &&
        listingMatchesDirectoryCategory(candidate, primaryCategory),
    ).length >= MIN_INDEXABLE_DIRECTORY_RESULTS,
  );
  const primaryCategoryHref = hasExactDirectoryParent && primaryCategory && cityPage
    ? getCityCategoryHref(cityPage.slug, primaryCategory.slug)
    : primaryCategory?.href ?? routes.categories;
  const keywords = uniqueKeywords([listing.name, listing.area, listing.neighborhood ?? "", ...categories]);
  const webPageJsonLd = buildWebPageJsonLd({
    name: `${listing.name} in ${listing.area}`,
    description,
    url,
    keywords,
    dateModified: factsCheckedAt,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: cityPage?.name ?? listing.area, url: `${siteUrl}${locationHref}` },
    { name: primaryCategory?.name ?? categories[0] ?? "Businesses", url: `${siteUrl}${primaryCategoryHref}` },
    { name: listing.name, url },
  ]);
  const localBusinessJsonLd = indexable ? buildListingLocalBusinessJsonLd(listing, url) : null;
  const safeWebsite = indexable ? listing.website : undefined;
  const safeEmail = indexable ? listing.email : undefined;
  const safePhone = indexable ? listing.phone : undefined;
  const verifiedImage = publicListingImage(listing);
  const verificationLabel = listingVerificationLabel(listing);
  const locality = displayLocality(listing);
  const postalSafeAddress = displayAddress(listing.address);
  const localityParts = localityTrail(listing);
  const freshness = evaluateListingFreshness(listing);
  const checkedOnLabel = formatDirectoryDate(factsCheckedAt);
  const publicationTier = listingPublicationTier(listing);
  const sourceUrl = indexable ? getListingSourceUrl(listing) : undefined;
  const sourceLabel = getListingSourceLabel(listing);
  const directionsUrl = indexable ? getDirectionsUrl(listing) : undefined;
  // Nearby qualified profiles give the visitor a real alternative and give the hub an internal
  // link back, instead of the profile being a dead end (audit sec. 14).
  const relatedListings = indexable
    ? indexableListings
        .filter(
          (candidate) =>
            candidate.slug !== listing.slug &&
            (cityPage
              ? listingMatchesCity(candidate, cityPage.slug)
              : candidate.area.toLowerCase() === listing.area.toLowerCase()),
        )
        .sort((a, b) => {
          const sameCategory = (candidate: typeof a) =>
            primaryCategory && listingMatchesDirectoryCategory(candidate, primaryCategory) ? 0 : 1;
          return sameCategory(a) - sameCategory(b) || a.name.localeCompare(b.name, "en");
        })
        .slice(0, 6)
    : [];
  const profileFacts: Array<{ term: string; value: string; href?: string; external?: boolean }> = indexable
    ? [
        { term: "Category", value: primaryCategory?.name ?? categories[0] ?? "Business", href: primaryCategoryHref },
        ...(localityParts.length ? [{ term: "Locality", value: localityParts.join(", ") }] : []),
        ...(postalSafeAddress ? [{ term: "Address", value: postalSafeAddress }] : []),
        ...(safePhone ? [{ term: "Phone", value: safePhone }] : []),
        ...(safeWebsite ? [{ term: "Official website", value: safeWebsite, href: safeWebsite, external: true }] : []),
        ...(listing.services?.length ? [{ term: "Published services", value: String(listing.services.length) }] : []),
        {
          term: "Source",
          value: sourceLabel,
          ...(sourceUrl ? { href: sourceUrl, external: true } : {}),
        },
        ...(checkedOnLabel ? [{ term: "Facts last checked", value: checkedOnLabel }] : []),
        { term: "Publication tier", value: publicationTier.name },
      ]
    : [];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([webPageJsonLd, breadcrumbJsonLd, localBusinessJsonLd].filter(Boolean)),
        }}
      />
      <Breadcrumbs
        items={[
          { label: cityPage?.name ?? listing.area, href: locationHref },
          { label: primaryCategory?.name ?? categories[0] ?? "Businesses", href: primaryCategoryHref },
          { label: listing.name },
        ]}
      />

      {!indexable ? (
        <section className="listing-data-notice" aria-label="Profile publication status">
          <div className="container">
            <ShieldAlert size={18} aria-hidden />
            <p>
              <strong>{demo ? "Preview profile" : "Verification pending"}.</strong>{" "}
              This record is available for product review but is excluded from search indexing,
              sitemaps and business ranking schema until its source and public details pass review.
            </p>
          </div>
        </section>
      ) : null}

      <section className="business-hero">
        <div className="container business-hero__grid">
          <div className="business-hero__photo">
            <FillImage
              src={verifiedImage ?? "/icon.svg"}
              alt={`${listing.name} in ${listing.area}`}
              sizes="(max-width: 980px) 100vw, 300px"
              priority
            />
          </div>
          <div className="business-hero__info">
            <p className="eyebrow">
              <MapPin size={13} aria-hidden /> {locality || listing.area}
            </p>
            <div className="badge-row">
              {indexable ? (
                <span className="badge badge--success">
                  <ShieldCheck size={13} aria-hidden /> {verificationLabel}
                </span>
              ) : null}
              {listing.claimed && indexable ? (
                <span className="badge badge--yellow">
                  <BadgeCheck size={13} aria-hidden /> Owner managed
                </span>
              ) : null}
            </div>
            <h1>{listing.name}</h1>
            <p>
              {categories.map((category, index) => (
                <span key={category}>
                  {index ? " / " : ""}
                  <Link href={index === 0 ? primaryCategoryHref : getDirectoryCategory(listing.categories[index])?.href ?? getSearchHref(category, listing.area)}>{category}</Link>
                </span>
              ))}
            </p>
            <div className="business-hero__rating">
              {indexable ? <span>No approved first-party reviews yet</span> : null}
              {indexable && listing.status ? <em>{listing.status === "24h" ? "Open 24 hours" : `${titleCase(listing.status)} now`}</em> : null}
            </div>
            <p>{description}</p>
          </div>
          <aside className="business-actions">
            {safePhone ? (
              <a className="button button--primary" href={`tel:${safePhone.replace(/[^0-9+]/g, "")}`}>
                <Phone size={16} aria-hidden /> Call business
              </a>
            ) : null}
            {safeWebsite ? (
              <a className="button button--outline" href={safeWebsite} rel="noopener noreferrer" target="_blank">
                <Globe2 size={16} aria-hidden /> Visit website <ExternalLink size={13} aria-hidden />
              </a>
            ) : null}
            {directionsUrl ? (
              <a
                className="button button--outline"
                href={directionsUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MapPin size={16} aria-hidden /> Directions to {listing.name}
              </a>
            ) : null}
            <Link className="button button--outline" href={`${routes.requestCallback}?business=${encodeURIComponent(listing.name)}`}>
              Request details
            </Link>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div className="detail-main">
            <section id="about">
              <h2>About {listing.name}</h2>
              <p>{description}</p>
              <p>
                Directory profiles help with discovery, but hours, prices, availability,
                credentials and service coverage can change. Confirm important details directly
                before travelling, booking or paying.
              </p>
            </section>

            {profileFacts.length ? (
              // Structured facts rather than templated prose: the part of the profile that is
              // specific to this business, in a shape a reader or an AI system can cite
              // (audit sec. 7 and sec. 18.3).
              <section id="profile-facts">
                <h2>Published facts</h2>
                <dl className="listing-fact-list">
                  {profileFacts.map((fact) => (
                    <div key={fact.term}>
                      <dt>{fact.term}</dt>
                      <dd>
                        {fact.href ? (
                          fact.external ? (
                            <a href={fact.href} rel="noopener noreferrer" target="_blank">
                              {fact.value}
                            </a>
                          ) : (
                            <Link href={fact.href}>{fact.value}</Link>
                          )
                        ) : (
                          fact.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="compact-copy">
                  Facts not listed here have not been reviewed for this business and are
                  deliberately left blank rather than filled with a category assumption.
                </p>
              </section>
            ) : null}

            {indexable && listing.services?.length ? (
              <section id="services">
                <h2>Services</h2>
                <ul className="listing-detail-list">
                  {listing.services.map((service) => <li key={service}>{service}</li>)}
                </ul>
              </section>
            ) : null}

            {indexable && listing.amenities.length ? (
              <section>
                <h2>Published amenities</h2>
                <div className="business-card__amenities">
                  {listing.amenities.map((amenity) => <span key={amenity}>{amenity}</span>)}
                </div>
              </section>
            ) : null}

            {indexable && listing.hoursToday ? (
              <section>
                <h2>Current hours note</h2>
                <p>{listing.hoursToday}</p>
              </section>
            ) : null}

            {indexable && listing.faqs.length ? (
              <section className="article-faq">
                <h2>Frequently asked questions</h2>
                {listing.faqs.map((faq) => (
                  <details key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </section>
            ) : null}
          </div>

          <aside className="sidebar">
            <section className="filter-card" id="contact">
              <h2>Contact and location</h2>
              <p><MapPin size={15} aria-hidden /> {indexable ? postalSafeAddress || listing.area : locality || listing.area}</p>
              {safePhone ? <p><Phone size={15} aria-hidden /> {safePhone}</p> : null}
              {safeEmail ? <p>{safeEmail}</p> : null}
              {indexable && listing.hoursToday ? <p><Clock3 size={15} aria-hidden /> {listing.hoursToday}</p> : null}
              {directionsUrl ? (
                <p>
                  <a href={directionsUrl} rel="noopener noreferrer" target="_blank">
                    Open directions to this address
                  </a>
                </p>
              ) : null}
            </section>
            <section className="filter-card" id="data-status">
              <h2>Data status</h2>
              <p>{indexable ? verificationLabel : "Not eligible for search indexing"}</p>
              {indexable ? <p>{publicationTier.summary}</p> : null}
              {factsCheckedAt && checkedOnLabel ? (
                <p>
                  Facts last checked:{" "}
                  <time dateTime={factsCheckedAt}>{checkedOnLabel}</time>
                </p>
              ) : null}
              {indexable && freshness.stale ? (
                <p>
                  This record is due for a re-check, so treat hours, prices and availability as
                  unconfirmed until you contact the business.
                </p>
              ) : null}
              {sourceUrl ? (
                <p>
                  Source:{" "}
                  <a href={sourceUrl} rel="noopener noreferrer nofollow" target="_blank">
                    {sourceLabel}
                  </a>
                </p>
              ) : indexable ? (
                <p>Source: {sourceLabel}</p>
              ) : null}
              <Link href={routes.directoryMethodology}>What these checks cover</Link>
              <Link href={routes.claimListing}>Claim or correct this listing</Link>
            </section>
          </aside>
        </div>
      </section>

      {relatedListings.length ? (
        <section className="section section--soft" id="nearby">
          <div className="container">
            <h2 className="compact-title">
              Other qualified profiles in {cityPage?.name ?? listing.area}
            </h2>
            <p className="compact-copy">
              Listed alphabetically within the same city, closest categories first. This is not a
              ranking.
            </p>
            <div className="seo-link-strip" aria-label="Nearby qualified business profiles">
              {relatedListings.map((candidate) => (
                <Link key={candidate.slug} href={getBusinessHref(candidate.slug)}>
                  {candidate.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

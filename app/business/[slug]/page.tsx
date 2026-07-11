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
import { cityDirectoryPages } from "@/lib/city-pages";
import {
  canPreviewListing,
  getAllDirectoryListings,
  getDirectoryListing,
  getSeedBusiness,
  isDemoListing,
  isIndexableListing,
  listingDescription,
  listingFactsCheckedAt,
  listingMatchesCity,
} from "@/lib/public-listings";
import { getBusinessHref, getSearchHref, routes } from "@/lib/routes";
import { buildWebPageJsonLd, uniqueKeywords } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildListingLocalBusinessJsonLd, priceTierLabel } from "@/lib/seo-auto";

type BusinessPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamicParams = true;

const loadListing = cache(getDirectoryListing);

function titleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export async function generateStaticParams() {
  return (await getAllDirectoryListings()).map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await loadListing(slug);
  if (!listing || !canPreviewListing(listing)) {
    return { title: "Business profile not found", robots: { index: false, follow: false } };
  }

  const href = getBusinessHref(listing.slug);
  const description = listing.metaDescription ?? listingDescription(listing);
  const title = listing.metaTitle ?? `${listing.name} in ${listing.area}`;
  const indexable = isIndexableListing(listing);

  return {
    title,
    description,
    alternates: { canonical: href },
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: indexable
        ? { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
        : { index: false, follow: false },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${href}`,
      siteName: "Nepali Directory",
      type: "website",
      images: listing.image
        ? [{ url: listing.image, width: 1200, height: 1200, alt: `${listing.name} profile` }]
        : [{ url: "/nepali-directory-og.png", width: 1729, height: 909, alt: "Nepali Directory" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [listing.image ?? "/nepali-directory-og.png"],
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
  const seed = demo ? getSeedBusiness(listing.slug) : undefined;
  const description = listingDescription(listing);
  const factsCheckedAt = listingFactsCheckedAt(listing);
  const categories = listing.categories.map(titleCase);
  const cityPage = cityDirectoryPages.find((city) => listingMatchesCity(listing, city.slug));
  const locationHref = cityPage?.href ?? routes.city;
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
    { name: listing.name, url },
  ]);
  const localBusinessJsonLd = indexable ? buildListingLocalBusinessJsonLd(listing, url) : null;
  const weeklyHours = seed?.weeklyHours;
  const safeWebsite = !demo ? listing.website : undefined;
  const safeEmail = !demo ? listing.email : undefined;
  const safePhone = !demo ? listing.phone : undefined;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webPageJsonLd, breadcrumbJsonLd, localBusinessJsonLd].filter(Boolean)),
        }}
      />
      <Breadcrumbs
        items={[
          { label: cityPage?.name ?? listing.area, href: locationHref },
          { label: categories[0] ?? "Business", href: routes.compareBusiness },
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
              src={listing.image ?? "/icon.svg"}
              alt={`${listing.name} in ${listing.area}`}
              sizes="(max-width: 980px) 100vw, 300px"
              priority
            />
          </div>
          <div className="business-hero__info">
            <div className="badge-row">
              {listing.verified && indexable ? (
                <span className="badge badge--success">
                  <ShieldCheck size={13} aria-hidden /> Verified public record
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
                  <Link href={getSearchHref(category, listing.area)}>{category}</Link>
                </span>
              ))}
            </p>
            <div className="business-hero__rating">
              {indexable && listing.rating != null && listing.reviews ? (
                <>
                  <strong>{listing.rating.toFixed(1)}</strong>
                  <span>{listing.reviews} published reviews</span>
                </>
              ) : null}
              {indexable && priceTierLabel(listing.price) ? <span>{priceTierLabel(listing.price)}</span> : null}
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
            <Link className="button button--outline" href={routes.map}>
              <MapPin size={16} aria-hidden /> Directions
            </Link>
            <Link className="button button--outline" href={`${routes.requestCallback}?business=${encodeURIComponent(listing.name)}`}>
              Request details
            </Link>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div className="detail-main">
            <section>
              <h2>About {listing.name}</h2>
              <p>{description}</p>
              <p>
                Directory profiles help with discovery, but hours, prices, availability,
                credentials and service coverage can change. Confirm important details directly
                before travelling, booking or paying.
              </p>
            </section>

            {listing.services?.length ? (
              <section>
                <h2>Services</h2>
                <ul className="listing-detail-list">
                  {listing.services.map((service) => <li key={service}>{service}</li>)}
                </ul>
              </section>
            ) : null}

            {listing.amenities.length ? (
              <section>
                <h2>Published amenities</h2>
                <div className="business-card__amenities">
                  {listing.amenities.map((amenity) => <span key={amenity}>{amenity}</span>)}
                </div>
              </section>
            ) : null}

            {weeklyHours?.length ? (
              <section>
                <h2>Weekly hours</h2>
                <div className="hours-table">
                  {weeklyHours.map((hours) => (
                    <div key={hours.dayOfWeek}>
                      <span>{hours.dayOfWeek}</span>
                      <strong>{hours.closed ? "Closed" : `${hours.opens}–${hours.closes}`}</strong>
                    </div>
                  ))}
                </div>
              </section>
            ) : listing.hoursToday ? (
              <section>
                <h2>Current hours note</h2>
                <p>{listing.hoursToday}</p>
              </section>
            ) : null}

            {listing.faqs.length ? (
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
            <section className="filter-card">
              <h2>Contact and location</h2>
              <p><MapPin size={15} aria-hidden /> {listing.address}</p>
              {safePhone ? <p><Phone size={15} aria-hidden /> {safePhone}</p> : null}
              {safeEmail ? <p>{safeEmail}</p> : null}
              {listing.hoursToday ? <p><Clock3 size={15} aria-hidden /> {listing.hoursToday}</p> : null}
            </section>
            <section className="filter-card">
              <h2>Data status</h2>
              <p>{indexable ? "Qualified public listing" : "Not eligible for search indexing"}</p>
              {factsCheckedAt ? (
                <p>Facts last checked: <time dateTime={factsCheckedAt}>{new Date(factsCheckedAt).toLocaleDateString("en-NP")}</time></p>
              ) : null}
              <Link href={routes.claimListing}>Claim or correct this listing</Link>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

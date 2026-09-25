import { BadgeCheck, Clock, Globe2, MapPin, Phone, Tag } from "lucide-react";
import Link from "next/link";
import { FillImage } from "@/components/ui/FillImage";
import { isDemoBusiness, type Business } from "@/lib/data";
import { getBusinessHref, routes } from "@/lib/routes";

type BusinessCardProps = {
  business: Business;
  sponsored?: boolean;
};

export function BusinessCard({ business, sponsored = false }: BusinessCardProps) {
  const href = getBusinessHref(business.slug);
  const demo = isDemoBusiness(business);
  const showSponsored = !demo && (sponsored || business.sponsored);

  return (
    <article className={showSponsored ? "business-card business-card--sponsored" : "business-card"}>
      <Link className="business-card__image" href={href}>
        <FillImage src={business.image} alt={business.name} sizes="(max-width: 820px) 100vw, 138px" />
      </Link>
      <div className="business-card__body">
        <div className="business-card__top">
          <div>
            <div className="business-card__title-row">
              <h3><Link href={href}>{business.name}</Link></h3>
              {demo ? (
                <em className="business-card__verified">Preview</em>
              ) : business.verified ? (
                <em className="business-card__verified">
                  <BadgeCheck size={14} aria-hidden />
                  Reviewed profile
                </em>
              ) : null}
            </div>
            <p className="business-card__categories">
              {business.categories.join(", ")}
              {business.neighborhood ? ` · ${business.neighborhood}` : ""}
            </p>
          </div>
          {showSponsored ? <span className="business-card__ad">AD</span> : null}
        </div>
        <div className="business-card__rating">
          <strong>{demo ? "Preview profile" : "Source-checked profile"}</strong>
          <span>{demo ? "Excluded from public results" : "No approved first-party reviews yet"}</span>
          {!demo && business.years ? <em>{business.years} years in business</em> : null}
        </div>
        <div className="business-card__meta">
          {!demo ? <span><Phone size={14} aria-hidden />{business.phone}</span> : null}
          <span>
            <MapPin size={14} aria-hidden />
            {business.address}
          </span>
          <span data-status={business.status}>
            <Clock size={14} aria-hidden />
            {business.status === "open" ? "Open now" : business.status === "24h" ? "Open 24 hours" : "Closed now"}
          </span>
          {typeof business.distanceKm === "number" ? (
            <span>
              <MapPin size={14} aria-hidden />
              {business.distanceKm.toFixed(business.distanceKm > 20 ? 0 : 1)} km away
            </span>
          ) : null}
        </div>
        <p className="business-card__quote">{business.quote}</p>
        <div className="business-card__amenities">
          {business.coupons?.length ? (
            <span className="business-card__offer">
              <Tag size={12} aria-hidden />
              Offer available
            </span>
          ) : null}
          {business.amenities.map((amenity) => (
            <span key={amenity}>{amenity}</span>
          ))}
          {business.serviceAreas?.slice(0, 2).map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
        <div className="business-card__actions">
          {business.website && !demo ? (
            <a className="button button--dark" href={business.website} rel="noreferrer" target="_blank">
              <Globe2 size={14} aria-hidden />
              Website
            </a>
          ) : null}
          <Link className="button button--outline" href={href}>
            {demo ? "View preview" : business.categories.includes("Restaurants") ? "View Menu" : "Services"}
          </Link>
          {!demo ? <Link className="button button--outline" href={routes.map}>Directions</Link> : null}
          {business.delivery && !demo ? (
            <Link className="button button--primary" href={href}>
              Order Online
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

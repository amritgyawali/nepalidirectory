import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { businesses, isDemoBusiness } from "@/lib/data";
import { getBusinessHref, routes } from "@/lib/routes";

export default function DealsPage() {
  const offers = businesses.filter((business) => !isDemoBusiness(business)).flatMap((business) =>
    (business.coupons ?? []).map((coupon) => ({
      ...coupon,
      business: business.name,
      area: business.area,
      category: business.categories[0],
      href: getBusinessHref(business.slug)
    }))
  );

  return (
    <main>
      <Breadcrumbs items={[{ label: "Deals & Offers" }]} />
      <PageHero
        title="Deals and offers"
        subtitle="Current coupons and seasonal offers from qualified public business profiles."
        cta={{ label: "Search offers", href: `${routes.search}?q=offers` }}
        secondary={{ label: "Advertise an offer", href: routes.advertise }}
      />
      <section className="section">
        <div className="container">
          <div className="deal-toolbar">
            {["All", "Restaurants", "Home Services", "Hotels", "Near Me"].map((filter) => (
              <a className={filter === "All" ? "chip chip--active" : "chip"} href={filter === "All" ? routes.deals : `${routes.search}?q=${encodeURIComponent(filter)} offers`} key={filter}>
                {filter}
              </a>
            ))}
          </div>
          <div className="pricing-grid">
            {offers.length === 0 ? (
              <article className="answer-summary">
                <h2>No reviewed public offers right now</h2>
                <p>Preview coupons are not published as live deals. Check again after business ownership and offer terms have been reviewed.</p>
              </article>
            ) : null}
            {offers.map((offer) => (
              <article className="price-card offer-card" key={`${offer.business}-${offer.title}`}>
                <span>{offer.category} · {offer.area}</span>
                <h2>{offer.title}</h2>
                <p>{offer.description}</p>
                {offer.code ? <strong>{offer.code}</strong> : null}
                <small>Expires {offer.expires}</small>
                <a className="button button--primary" href={offer.href}>
                  View business
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

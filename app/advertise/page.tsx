import Link from "next/link";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { plans, stats } from "@/lib/data";
import { routes } from "@/lib/routes";

export default function AdvertisePage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Advertise" }]} />
      <PageHero
        title="Advertise with Nepali Directory"
        subtitle="Put your business in front of high-intent local customers searching by service, city and neighborhood."
        cta={{ label: "View plans", href: routes.pricing }}
        secondary={{ label: "Request callback", href: routes.requestCallback }}
      />
      <section className="section">
        <div className="container">
          <div className="stats-grid">
            {stats.map(([value, label]) => (
              <div className="metric-card" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className={plan.highlighted ? "price-card price-card--hot" : "price-card"} key={plan.name}>
                <h2>{plan.name}</h2>
                <strong>{plan.price}</strong>
                <p>{plan.description}</p>
                {plan.features.map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
                <Link className="button button--primary" href={routes.requestCallback}>
                  Start now
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { BadgeCheck, Clock, CreditCard, Globe2, Languages, MapPin, MessageSquareQuote, Phone, ShieldCheck, Tag } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { InfoCard } from "@/components/ui/InfoCard";
import { Stars } from "@/components/ui/Stars";
import { featuredBusiness, menuSections } from "@/lib/data";
import { routes } from "@/lib/routes";
import { siteUrl } from "@/lib/blog";
import { buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";
import { reviewsForListing } from "@/lib/reviews-ai";

const gallery = [
  "photo-1547592180-85f173990554",
  "photo-1567188040759-fb8a883dc6d8",
  "photo-1565557623262-b51c2513a641",
  "photo-1514933651103-005eec06c04b"
].map((id) => `https://images.unsplash.com/${id}?w=700&h=520&fit=crop&auto=format`);

export const metadata: Metadata = {
  title: "Newa Lahana Bhaktapur: Newari Restaurant, Menu, Hours and Reviews",
  description:
    "View Newa Lahana in Bhaktapur with phone, address, hours, menu notes, reviews, photos and local Newari restaurant details.",
  keywords: [
    "Newa Lahana",
    "Newa Lahana Bhaktapur",
    "Newari restaurant Bhaktapur",
    "Bhaktapur restaurants",
    "samay baji Bhaktapur"
  ],
  alternates: {
    canonical: routes.business
  },
  openGraph: {
    title: "Newa Lahana Bhaktapur: Newari Restaurant Details",
    description:
      "Phone, address, hours, menu notes, reviews and photos for Newa Lahana in Bhaktapur.",
    url: `${siteUrl}${routes.business}`,
    siteName: "Nepali Directory",
    type: "website",
    images: [
      {
        url: featuredBusiness.image,
        width: 1200,
        height: 1200,
        alt: "Traditional Newari food at Newa Lahana"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Newa Lahana Bhaktapur",
    description:
      "Phone, address, hours, menu notes, reviews and photos for Newa Lahana in Bhaktapur.",
    images: [featuredBusiness.image]
  }
};

export default function BusinessDetailPage() {
  const business = featuredBusiness;
  const sampleReviews = reviewsForListing(business.slug);
  const keywords = uniqueKeywords([
    business.name,
    ...business.categories,
    business.area,
    "Newari restaurant Bhaktapur",
    "Bhaktapur restaurant directory",
    "Nepali Directory business listing"
  ]);
  const businessUrl = `${siteUrl}${routes.business}`;
  const webPageJsonLd = buildWebPageJsonLd({
    name: metadata.title as string,
    description: metadata.description as string,
    url: businessUrl,
    keywords,
    dateModified: "2026-06-28"
  });
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Bhaktapur", item: `${siteUrl}/city/bhaktapur` },
      { "@type": "ListItem", position: 3, name: "Restaurants", item: `${siteUrl}${routes.search}?q=restaurants` },
      { "@type": "ListItem", position: 4, name: business.name, item: businessUrl }
    ]
  };
  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${businessUrl}#restaurant`,
    name: business.name,
    url: businessUrl,
    image: [business.image, ...gallery],
    description:
      "Heritage Newari restaurant in Bhaktapur known for samay baji, choila, tasting menus and courtyard seating.",
    telephone: business.phone,
    priceRange: "Rs Rs Rs",
    servesCuisine: ["Newari", "Nepali", "Traditional"],
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.area,
      addressRegion: "Bagmati Province",
      addressCountry: "NP"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviews,
      bestRating: 5,
      worstRating: 1
    },
    openingHoursSpecification: [
      "Monday",
      "Wednesday",
      "Thursday",
      "Sunday"
    ].map((dayOfWeek) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek,
      opens: "11:30",
      closes: "21:00"
    })),
    amenityFeature: business.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true
    })),
    hasMenu: {
      "@type": "Menu",
      name: `${business.name} menu`,
      hasMenuSection: menuSections.map((section) => ({
        "@type": "MenuSection",
        name: section.title,
        hasMenuItem: section.items.map(([name, description, price]) => ({
          "@type": "MenuItem",
          name,
          description,
          offers: {
            "@type": "Offer",
            price: price.replace(/\D/g, ""),
            priceCurrency: "NPR"
          }
        }))
      }))
    },
    publisher
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([webPageJsonLd, breadcrumbJsonLd, restaurantJsonLd]) }}
      />
      <Breadcrumbs
        items={[
          { label: "Bagmati Province", href: routes.province },
          { label: "Bhaktapur", href: "/city/bhaktapur" },
          { label: "Restaurants", href: routes.search },
          { label: business.name }
        ]}
      />
      <section className="business-hero">
        <div className="container business-hero__grid">
          <Link className="business-hero__photo" href={routes.gallery}>
            <FillImage src={business.image} alt={business.name} sizes="(max-width: 980px) 360px, 300px" priority />
            <span>24 photos</span>
          </Link>
          <div className="business-hero__info">
            <div className="badge-row">
              <span className="badge badge--success">
                <ShieldCheck size={13} aria-hidden />
                Verified Listing
              </span>
              <span className="badge badge--yellow">18 years in business</span>
            </div>
            <h1>{business.name}</h1>
            <p>
              {business.categories.map((category, index) => (
                <span key={category}>
                  {index > 0 ? " / " : null}
                  <Link href={routes.search}>{category}</Link>
                </span>
              ))}
            </p>
            <div className="business-hero__rating">
              <strong>{business.rating.toFixed(1)}</strong>
              <Stars rating={business.rating} size={18} />
              <Link href="#reviews">({business.reviews} reviews)</Link>
              <span>Rs Rs Rs</span>
              <em>Closed now</em>
            </div>
            <div className="business-hero__hours">
              <span>Today: Closed</span>
              <span>Tomorrow: 11:30 am - 9:00 pm</span>
            </div>
            <div className="business-card__amenities">
              {business.amenities.map((amenity) => (
                <span key={amenity}>{amenity}</span>
              ))}
            </div>
          </div>
          <aside className="business-actions">
            <a className="button button--primary" href="tel:016611945">
              <Phone size={16} aria-hidden />
              {business.phone}
            </a>
            <a className="button button--outline" href={business.website} rel="noreferrer" target="_blank">
              <Globe2 size={16} aria-hidden />
              Visit Website
            </a>
            <Link className="button button--outline" href={routes.map}>
              <MapPin size={16} aria-hidden />
              Directions
            </Link>
            <Link className="button button--outline" href={`${routes.requestCallback}?business=${encodeURIComponent(business.name)}`}>
              <MessageSquareQuote size={16} aria-hidden />
              Request Quote
            </Link>
            <Link className="button button--outline" href={routes.writeReview}>
              Write a Review
            </Link>
          </aside>
        </div>
      </section>

      <div className="container section two-col">
        <div className="detail-main">
          <section>
            <h2>About {business.name}</h2>
            <p>
              Newa Lahana is a heritage Newari restaurant set inside an 18th-century Malla-era
              courtyard in Bhaktapur Durbar Square. Founded by chef Sumesh Maharjan, the restaurant
              serves traditional Newari fine dining with an emphasis on samay baji, choila and
              seasonal Newari festivals.
            </p>
          </section>
          {business.coupons?.length ? (
            <section>
              <h2>Deals and Coupons</h2>
              <div className="offer-list">
                {business.coupons.map((coupon) => (
                  <article key={coupon.title}>
                    <Tag size={19} aria-hidden />
                    <div>
                      <strong>{coupon.title}</strong>
                      <p>{coupon.description}</p>
                      <span>
                        {coupon.code ? `Code: ${coupon.code} · ` : ""}
                        Expires {coupon.expires}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          <section>
            <h2>Services and Specialties</h2>
            <div className="profile-feature-grid">
              <article>
                <BadgeCheck size={20} aria-hidden />
                <strong>Services</strong>
                <p>{business.services?.join(", ")}</p>
              </article>
              <article>
                <ShieldCheck size={20} aria-hidden />
                <strong>Specialties</strong>
                <p>{business.specialties?.join(", ")}</p>
              </article>
              <article>
                <MapPin size={20} aria-hidden />
                <strong>Service areas</strong>
                <p>{business.serviceAreas?.join(", ")}</p>
              </article>
              <article>
                <CreditCard size={20} aria-hidden />
                <strong>Payment methods</strong>
                <p>{business.paymentMethods?.join(", ")}</p>
              </article>
              <article>
                <Languages size={20} aria-hidden />
                <strong>Languages</strong>
                <p>{business.languages?.join(", ")}</p>
              </article>
              <article>
                <BadgeCheck size={20} aria-hidden />
                <strong>Credentials</strong>
                <p>{business.credentials?.join(", ")}</p>
              </article>
            </div>
          </section>
          <section>
            <h2>Regular Hours</h2>
            <div className="hours-table">
              {[
                ["Monday", "11:30 am - 9:00 pm"],
                ["Tuesday (Today)", "Closed"],
                ["Wednesday", "11:30 am - 9:00 pm"],
                ["Thursday", "11:30 am - 9:00 pm"],
                ["Friday", "11:30 am - 10:30 pm"],
                ["Saturday", "11:30 am - 10:30 pm"],
                ["Sunday", "11:30 am - 9:00 pm"]
              ].map(([day, hours]) => (
                <div key={day} data-today={day.includes("Today")}>
                  <span>{day}</span>
                  <strong>{hours}</strong>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2>Menu</h2>
            <p className="compact-copy">Menu items and prices may change. Confirm with the restaurant.</p>
            <div className="menu-list">
              {menuSections.map((section) => (
                <details key={section.title} open>
                  <summary>{section.title}</summary>
                  {section.items.map(([name, description, price]) => (
                    <div className="menu-item" key={name}>
                      <div>
                        <strong>{name}</strong>
                        <p>{description}</p>
                      </div>
                      <span>{price}</span>
                    </div>
                  ))}
                </details>
              ))}
            </div>
          </section>
          <section id="gallery">
            <h2>Gallery</h2>
            <div className="gallery-grid">
              {gallery.map((src, index) => (
                <span className="gallery-frame" key={src}>
                  <FillImage src={src} alt={`${business.name} gallery ${index + 1}`} sizes="(max-width: 980px) 50vw, 180px" />
                </span>
              ))}
            </div>
          </section>
          <section id="reviews">
            <h2>Reviews</h2>
            <div className="review-summary-card">
              <strong>{business.rating.toFixed(1)}</strong>
              <Stars rating={business.rating} size={18} />
              <p>{business.reviews} verified and community reviews. Review moderation follows Nepali Directory editorial standards.</p>
              <Link className="button button--primary" href={routes.writeReview}>
                Write a Review
              </Link>
            </div>
            {sampleReviews.length >= 3 ? (
              <div className="review-summary-card review-summary-card--ai">
                <span className="badge badge--yellow">AI-generated summary</span>
                <h3>What people say</h3>
                <p>
                  Guests often mention the Newari food experience, helpful staff and group-friendly
                  courtyard setting. The common cautions are busy weekend timing and nearby parking,
                  so reservations are useful for groups.
                </p>
                <div className="business-card__amenities">
                  {["Food quality", "Group seating", "Reservations", "Parking"].map((theme) => (
                    <span key={theme}>{theme}</span>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="review-list">
              {[
                ["Srijana K.", 5, "Beautiful courtyard and a properly explained Newari tasting menu."],
                ["Amit R.", 4.5, "Helpful staff, quick phone confirmation, and great group seating."],
                ["Maya T.", 4.5, "The samay baji set was fresh and the service felt very local."]
              ].map(([name, rating, text]) => (
                <article key={name as string}>
                  <div>
                    <strong>{name}</strong>
                    <Stars rating={rating as number} />
                  </div>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>
          {business.faqs?.length ? (
            <section>
              <h2>Frequently Asked Questions</h2>
              <div className="article-faq">
                {business.faqs.map((faq) => (
                  <details key={faq.question} open>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>
        <aside className="sidebar">
          <InfoCard title="Contact" icon={Phone}>
            <strong>{business.phone}</strong>
            <br />
            {business.address}
            {business.email ? (
              <>
                <br />
                {business.email}
              </>
            ) : null}
          </InfoCard>
          <InfoCard title="Best known for" icon={Clock}>
            Samay baji, choila, heritage courtyard seating, Newari tasting menus and group dinners.
          </InfoCard>
          <InfoCard title="Owner profile" icon={ShieldCheck}>
            {business.owner?.name}
            <br />
            {business.owner?.role}
            <br />
            {business.claimed ? "Claimed and owner-managed listing." : "Public directory listing."}
          </InfoCard>
        </aside>
      </div>
      <PageHero
        title="Own this business?"
        subtitle="Claim your listing to update hours, add photos, respond to reviews and publish offers."
        cta={{ label: "Claim listing", href: routes.claimListing }}
        secondary={{ label: "Advertise", href: routes.advertise }}
      />
    </main>
  );
}

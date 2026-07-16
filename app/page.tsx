import type { Metadata } from "next";
import { BadgeCheck, Building2, Grid3X3, MapPin, Search, Star, Tag } from "lucide-react";
import Link from "next/link";
import { LazyAiConcierge } from "@/components/ai/LazyAiConcierge";
import { GuideCard } from "@/components/content/GuideCard";
import { AppPromo } from "@/components/directory/AppPromo";
import { BusinessCard } from "@/components/directory/BusinessCard";
import { CategoryTile } from "@/components/directory/CategoryTile";
import { CityCard } from "@/components/directory/CityCard";
import { FillImage } from "@/components/ui/FillImage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCityHref } from "@/lib/city-pages";
import { businesses, categories, cities, cityLinks, directoryFeatureChecklist, popularSearches, questions, stats } from "@/lib/data";
import { directoryCategories } from "@/lib/directory-categories";
import { getSortedBlogPosts, siteUrl } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";

const nationalDirectoryKeywords = [
  "NepaliDirectory",
  "Nepali Directory",
  "Nepal Directory",
  "Business Directory Nepal",
  "Nepal Business Directory",
  "Local Businesses Nepal",
  "Nepal Yellow Pages",
  "Nepal Business Listing",
  "Business Listings Nepal",
  "Find Businesses in Nepal",
  "Nepal Online Directory",
  "Nepal Services Directory",
  "Nepal Local Directory",
  "Companies in Nepal",
  "Nepal Companies",
];

export const metadata: Metadata = {
  keywords: nationalDirectoryKeywords,
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const latestBlogPosts = getSortedBlogPosts().slice(0, 3);
  const keywords = uniqueKeywords([
    ...nationalDirectoryKeywords,
    "Nepal business directory",
    "local businesses Nepal",
    "restaurants Nepal",
    "doctors Nepal",
    "hotels Nepal",
    "home services Nepal",
    ...categories.map((category) => category.name),
    ...cities.map((city) => city.name)
  ]);
  const homeJsonLd = {
    ...buildWebPageJsonLd({
      name: "Nepali Directory: Nepal Business Directory & Local Listings",
      description:
        "Find businesses and local services across Nepal with category pages, city guides and review-gated public profiles.",
      url: siteUrl,
      keywords,
      dateModified: "2026-07-12"
    }),
    "@type": "CollectionPage",
    publisher,
    mainEntity: [
      {
        "@type": "ItemList",
        name: "Popular business categories",
        itemListElement: directoryCategories.map((category, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: category.name,
          url: `${siteUrl}${category.href}`
        }))
      },
      {
        "@type": "ItemList",
        name: "Popular Nepal city directories",
        itemListElement: cities.map((city, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: city.name,
          url: `${siteUrl}${city.href}`
        }))
      },
      {
        "@type": "ItemList",
        name: "Featured local guides",
        itemListElement: latestBlogPosts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: post.title,
          url: `${siteUrl}${post.href}`
        }))
      }
    ]
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <section className="home-hero">
        <div className="home-hero__media" aria-hidden>
          <FillImage
            src="https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=2000&h=980&fit=crop&auto=format&q=60"
            alt=""
            sizes="100vw"
            priority
          />
        </div>
        <div className="container home-hero__content">
          <h1>
            Nepali Directory: find <mark>trusted</mark> local businesses across Nepal.
          </h1>
          <span>
            Search Nepal&apos;s business directory by category and city, then compare current profiles,
            practical local guides and service research.
          </span>
          <form className="hero-search" action={routes.search}>
            <label>
              <span>What are you looking for?</span>
              <Search size={20} aria-hidden />
              <input name="q" placeholder="Find a business (e.g. restaurants, plumbers)" />
            </label>
            <label>
              <span>Where?</span>
              <MapPin size={20} aria-hidden />
              <input name="location" defaultValue="Kathmandu, Bagmati" />
            </label>
            <label>
              <span>Category</span>
              <Grid3X3 size={20} aria-hidden />
              <select name="category" defaultValue="">
                <option value="">All categories</option>
                {categories.slice(0, 8).map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">Find</button>
          </form>
          <div className="home-hero__actions" aria-label="Quick directory actions">
            <Link href={routes.deals}>
              <Tag size={19} aria-hidden />
              <span>
                <strong>Explore deals</strong>
                Save with local offers
              </span>
            </Link>
            <Link href={routes.claimListing}>
              <Building2 size={19} aria-hidden />
              <span>
                <strong>Add your business</strong>
                Grow your local reach
              </span>
            </Link>
            <Link href={routes.writeReview}>
              <Star size={19} aria-hidden />
              <span>
                <strong>Write a review</strong>
                Share your experience
              </span>
            </Link>
          </div>
          <div className="home-hero__links">
            <Link href={routes.search}>Use my location</Link>
            <span>Popular:</span>
            {popularSearches.slice(0, 4).map((item) => (
              <Link key={item} href={`${routes.search}?q=${encodeURIComponent(item)}&location=Kathmandu%2C+Bagmati`}>
                {item}
              </Link>
            ))}
          </div>
          <div className="home-hero__trust">
            <BadgeCheck size={17} aria-hidden />
            City guides, category research, owner submissions and publication checks in one directory.
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="national-directory-title">
        <div className="container">
          <p className="eyebrow">Nepal online business directory</p>
          <h2 className="compact-title" id="national-directory-title">
            A Nepal business directory for useful local decisions
          </h2>
          <p className="compact-copy">
            Nepali Directory brings crawlable category pages, practical city guides and
            review-gated business profiles into one Nepal local directory. It is a modern online
            alternative to a paper Nepal Yellow Pages: browse local businesses and services, then
            confirm current hours, prices, availability and credentials directly.
          </p>
          <div className="seo-link-strip" aria-label="Popular Nepal directory categories">
            {directoryCategories.map((category) => (
              <Link key={category.slug} href={category.href}>{category.priorityKeyword}</Link>
            ))}
          </div>
          <div className="seo-answer-grid">
            <article className="answer-summary">
              <h2>Find businesses in Nepal</h2>
              <p>
                Start with an indexable category or city guide, then open a qualified profile when
                one is available. Unreviewed preview records stay outside public rankings.
              </p>
              <p>
                People looking for companies in Nepal can use the same industry and city path.
                Nepal companies, independent professionals and neighborhood businesses enter
                public results only after their records pass review.
              </p>
              <Link href={routes.categories}>Browse the Nepal services directory</Link>
            </article>
            <article className="answer-summary">
              <h2>Add a Nepal business listing</h2>
              <p>
                Owners can submit or claim a profile and provide the location, services and
                contact details needed for publication review.
              </p>
              <Link href={routes.claimListing}>Add or claim your business</Link>
            </article>
            <article className="answer-summary">
              <h2>Browse businesses by city</h2>
              <p>
                Use locally specific pages for Kathmandu, Pokhara, Lalitpur, Bhaktapur, Chitwan,
                Biratnagar, Butwal and Dharan instead of a generic national result.
              </p>
              <Link href={routes.city}>Open Nepal city directories</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="directory-method-title">
        <div className="container">
          <p className="eyebrow">Transparent directory method</p>
          <h2 className="compact-title" id="directory-method-title">
            How a business profile qualifies for publication
          </h2>
          <p className="compact-copy">
            Nepali Directory separates product previews from public evidence. A named profile must
            identify a real business, match a relevant category, provide usable location data and
            carry documented provenance before it can enter sitemaps, city results or business
            structured data.
          </p>
          <div className="seo-answer-grid">
            <article className="answer-summary">
              <h3>Source before scale</h3>
              <p>
                Owner submissions, appropriately licensed OpenStreetMap records and reviewed
                imports keep their source context. Placeholder contacts never count as publication
                evidence.
              </p>
            </article>
            <article className="answer-summary">
              <h3>Quality gate before indexing</h3>
              <p>
                Demo, inactive, incomplete and unresolved records remain outside XML sitemaps,
                public rankings, aggregate ratings and LocalBusiness schema.
              </p>
            </article>
            <article className="answer-summary">
              <h3>Confirmation before decisions</h3>
              <p>
                Hours, prices, availability, staff and service areas change. Directory pages help
                build a shortlist; users should confirm important current details directly.
              </p>
            </article>
          </div>
          <div className="directory-package__actions">
            <Link className="button button--primary" href={routes.directoryMethodology}>
              Read the full methodology
            </Link>
            <Link className="button button--outline" href={routes.editorialPolicy}>
              Editorial standards
            </Link>
          </div>
        </div>
      </section>

      <section className="section ai-home-band">
        <div className="container ai-home-band__grid">
          <div>
            <p className="eyebrow">AI Autopilot</p>
            <h2>Let AI handle local discovery, matching and follow-up.</h2>
            <p>
              The assistant searches directory data and explains its matches. Calls, websites and
              named recommendations appear only when a qualified public profile is available.
            </p>
          </div>
          <LazyAiConcierge />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            title="Browse by category"
            action={{ label: "View all categories", href: routes.categories }}
          />
          <div className="home-category-grid">
            {categories.map((category) => (
              <CategoryTile key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeader
            title="Popular cities"
            description="Browse listings in Nepal's largest cities and tourist destinations."
            action={{ label: "View all cities", href: routes.city }}
          />
          <div className="home-city-grid">
            {cities.map((city) => (
              <CityCard key={city.name} {...city} />
            ))}
          </div>
          <div className="city-link-grid">
            {cityLinks.map((city) => (
              <Link key={city} href={getCityHref(city)}>
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            title="Directory profile previews"
            description="Preview records demonstrate the profile experience but remain outside rankings and public business schema until reviewed."
            action={{ label: "Search all businesses", href: routes.search }}
          />
          <div className="home-featured">
            {businesses.slice(0, 3).map((business) => (
              <BusinessCard key={business.slug} business={business} />
            ))}
          </div>
        </div>
      </section>

      <section className="section directory-package">
        <div className="container directory-package__grid">
          <div>
            <SectionHeader
              title="Complete local directory toolkit"
              description="Search, compare, contact, claim, advertise and manage local business profiles from one directory system."
              action={{ label: "Explore search", href: routes.search }}
            />
            <div className="directory-package__actions">
              <Link className="button button--primary" href={routes.claimListing}>
                Add or claim a business
              </Link>
              <Link className="button button--outline" href={routes.deals}>
                Browse coupons
              </Link>
              <Link className="button button--outline" href={routes.map}>
                Open map
              </Link>
            </div>
          </div>
          <div className="directory-feature-list">
            {directoryFeatureChecklist.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section business-growth">
        <div className="container business-growth__grid">
          <div>
            <p className="eyebrow">For local businesses</p>
            <h2>Reach people who are already searching for what you do.</h2>
            <p>
              Claim your profile, publish photos, answer reviews and promote your services in the
              categories and cities that matter most.
            </p>
            <div className="stats-grid">
              {stats.map(([value, label]) => (
                <div key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <Link className="button button--dark" href={routes.advertise}>
              Learn More
            </Link>
          </div>
          <div className="business-growth__image">
            <FillImage
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=800&fit=crop&auto=format"
              alt="Business owners working together"
              sizes="(max-width: 1040px) 100vw, 520px"
            />
          </div>
        </div>
      </section>

      <AppPromo />

      <section className="section">
        <div className="container home-bottom-grid">
          <div>
            <SectionHeader title="Local guides" action={{ label: "Read the blog", href: routes.blog }} />
            <div className="article-grid">
              {latestBlogPosts.map((post) => (
                <GuideCard
                  key={post.slug}
                  href={post.href}
                  title={post.title}
                  category={post.category}
                  excerpt={post.excerpt}
                  image={post.image}
                  imageAlt={post.imageAlt}
                  sizes="(max-width: 1040px) 100vw, 280px"
                />
              ))}
            </div>
          </div>
          <aside className="qa-panel">
            <SectionHeader title="Community Q&A" action={{ label: "Ask", href: routes.askQuestion }} />
            {questions.map((question) => (
              <Link key={question.title} href={question.href}>
                <span>{question.topic}</span>
                <strong>{question.title}</strong>
                <small>{question.answerLabel}</small>
              </Link>
            ))}
          </aside>
        </div>
      </section>
    </main>
  );
}

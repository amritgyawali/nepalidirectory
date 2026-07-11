import type { Metadata } from "next";
import { BadgeCheck, Building2, Grid3X3, MapPin, Search, Star, Tag } from "lucide-react";
import Link from "next/link";
import { AiConcierge } from "@/components/ai/AiConcierge";
import { GuideCard } from "@/components/content/GuideCard";
import { AppPromo } from "@/components/directory/AppPromo";
import { BusinessCard } from "@/components/directory/BusinessCard";
import { CategoryTile } from "@/components/directory/CategoryTile";
import { CityCard } from "@/components/directory/CityCard";
import { FillImage } from "@/components/ui/FillImage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCityHref } from "@/lib/city-pages";
import { businesses, categories, cities, cityLinks, directoryFeatureChecklist, popularSearches, questions, stats } from "@/lib/data";
import { getSortedBlogPosts, siteUrl } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const latestBlogPosts = getSortedBlogPosts().slice(0, 3);
  const keywords = uniqueKeywords([
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
      name: "Nepali Directory | Nepal's trusted local business directory",
      description:
        "Find and compare local business profiles, restaurants, doctors, hotels, services and city guides across Nepal.",
      url: siteUrl,
      keywords,
      dateModified: "2026-06-28"
    }),
    "@type": "CollectionPage",
    publisher,
    mainEntity: [
      {
        "@type": "ItemList",
        name: "Popular business categories",
        itemListElement: categories.map((category, index) => ({
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
        <div className="home-hero__media" />
        <div className="container home-hero__content">
          <h1>
            Find <mark>trusted</mark> local businesses across Nepal.
          </h1>
          <span>
            Compare current directory profiles, practical city guides and local service research across Nepal.
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
            Verified profiles, real contact details, city pages, offers and owner tools in one directory.
          </div>
        </div>
      </section>

      <section className="section ai-home-band">
        <div className="container ai-home-band__grid">
          <div>
            <p className="eyebrow">AI Autopilot</p>
            <h2>Let AI handle local discovery, matching and follow-up.</h2>
            <p>
              The assistant searches grounded directory data, ranks options, writes useful answers and hands visitors straight to calls,
              websites and verified profiles.
            </p>
          </div>
          <AiConcierge />
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
                <small>{question.answers} answers</small>
              </Link>
            ))}
          </aside>
        </div>
      </section>
    </main>
  );
}

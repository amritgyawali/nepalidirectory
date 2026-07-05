import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Phone, Star } from "lucide-react";
import { BusinessComparisonTool } from "@/components/compare/BusinessComparisonTool";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { compareCategories, getCompareCategory, getSortedCompareCategories } from "@/lib/compare";
import { siteUrl } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { buildCompareKeywords, buildWebPageJsonLd, getCompareQuickAnswer, publisher } from "@/lib/seo";

type CompareCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return compareCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CompareCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCompareCategory(slug);

  if (!category) {
    return {
      title: "Comparison not found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const keywords = buildCompareKeywords(category);

  return {
    title: category.seoTitle,
    description: category.description,
    keywords,
    category: category.category,
    alternates: {
      canonical: category.href
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    openGraph: {
      title: category.seoTitle,
      description: category.description,
      url: `${siteUrl}${category.href}`,
      siteName: "Nepali Directory",
      locale: "en_US",
      type: "article",
      modifiedTime: category.updatedAt,
      images: [
        {
          url: category.image,
          width: 1200,
          height: 675,
          alt: category.imageAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: category.seoTitle,
      description: category.description,
      images: [category.image]
    },
    other: {
      "article:section": category.category,
      "article:tag": keywords.join(", "),
      "content-language": "en",
      "geo.region": "NP",
      "geo.placename": "Nepal",
      "search-intent": "commercial investigation, local comparison"
    }
  };
}

export default async function CompareCategoryPage({ params }: CompareCategoryPageProps) {
  const { slug } = await params;
  const category = getCompareCategory(slug);

  if (!category) {
    notFound();
  }

  const keywords = buildCompareKeywords(category);
  const quickAnswer = getCompareQuickAnswer(category);
  const bestBusiness = category.businesses[0];
  const otherCategories = getSortedCompareCategories().filter((candidate) => candidate.slug !== category.slug);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.title,
    itemListElement: category.businesses.map((business, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: business.name,
        description: business.verdict,
        areaServed: business.area,
        telephone: business.phone,
        image: business.image,
        priceRange: business.price,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: business.rating,
          reviewCount: business.reviews
        }
      }
    }))
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: category.title,
    alternativeHeadline: category.seoTitle,
    description: category.description,
    abstract: quickAnswer,
    image: category.image,
    datePublished: category.updatedAt,
    dateModified: category.updatedAt,
    inLanguage: "en",
    isAccessibleForFree: true,
    author: publisher,
    publisher,
    reviewedBy: publisher,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}${category.href}`
    },
    articleSection: category.category,
    keywords: keywords.join(", "),
    about: category.criteria.map((criterion) => ({
      "@type": "Thing",
      name: criterion
    })),
    mentions: category.businesses.map((business) => ({
      "@type": "LocalBusiness",
      name: business.name,
      areaServed: business.area
    }))
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the best ${category.category.toLowerCase()} option in this comparison?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: quickAnswer
        }
      },
      {
        "@type": "Question",
        name: `How were these ${category.category.toLowerCase()} businesses compared?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Nepali Directory compared ${category.category.toLowerCase()} businesses using ${category.criteria.join(", ").toLowerCase()}, ratings, review counts, price notes and best-fit use cases.`
        }
      }
    ]
  };

  const webPageJsonLd = buildWebPageJsonLd({
    name: category.seoTitle,
    description: category.description,
    url: `${siteUrl}${category.href}`,
    keywords,
    dateModified: category.updatedAt
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Compare Business",
        item: `${siteUrl}${routes.compareBusiness}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.category,
        item: `${siteUrl}${category.href}`
      }
    ]
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webPageJsonLd, articleJsonLd, itemListJsonLd, breadcrumbJsonLd, faqJsonLd])
        }}
      />
      <Breadcrumbs
        items={[
          { label: "Compare Business", href: routes.compareBusiness },
          { label: category.category }
        ]}
      />
      <section className="compare-hero">
        <div className="container compare-hero__grid">
          <div>
            <Link className="article-back" href={routes.compareBusiness}>
              <ArrowLeft size={16} aria-hidden />
              Compare Business
            </Link>
            <span>{category.category}</span>
            <h1>{category.title}</h1>
            <p>{category.description}</p>
            <div className="answer-summary answer-summary--compact" aria-label="Quick answer">
              <h2>Quick answer</h2>
              <p>{quickAnswer}</p>
            </div>
            <div className="compare-criteria" aria-label="Comparison criteria">
              {category.criteria.map((criterion) => (
                <span key={criterion}>
                  <CheckCircle2 size={14} aria-hidden />
                  {criterion}
                </span>
              ))}
            </div>
          </div>
          <div className="compare-hero__image">
            <FillImage src={category.image} alt={category.imageAlt} sizes="(max-width: 980px) 100vw, 420px" priority />
          </div>
        </div>
      </section>

      <BusinessComparisonTool
        businesses={category.businesses}
        category={category.category}
        criteria={category.criteria}
      />

      <section className="section">
        <div className="container compare-layout">
          <div className="compare-list">
            {category.businesses.map((business) => (
              <article className="compare-business-card" key={business.name}>
                <div className="compare-business-card__image">
                  <FillImage src={business.image} alt={business.imageAlt} sizes="(max-width: 720px) 100vw, 220px" />
                  <span>#{business.rank}</span>
                </div>
                <div className="compare-business-card__body">
                  <div className="compare-business-card__top">
                    <div>
                      <h2>{business.name}</h2>
                      <p>{business.area}</p>
                    </div>
                    <div className="compare-rating">
                      <Star size={15} fill="#FFD400" aria-hidden />
                      <strong>{business.rating}</strong>
                      <span>{business.reviews} reviews</span>
                    </div>
                  </div>
                  <div className="compare-facts">
                    <span>{business.price}</span>
                    <span>{business.bestFor}</span>
                    <span>
                      <Phone size={13} aria-hidden />
                      {business.phone}
                    </span>
                  </div>
                  <p>{business.verdict}</p>
                  <div className="compare-strengths">
                    {business.strengths.map((strength) => (
                      <span key={strength}>{strength}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="sidebar">
            <section className="filter-card">
              <h2>Compare other categories</h2>
              {otherCategories.map((candidate) => (
                <Link key={candidate.slug} href={candidate.href}>
                  {candidate.category}
                </Link>
              ))}
            </section>
          </aside>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <h2 className="compact-title">Best overall pick</h2>
          <p className="compact-copy">
            {bestBusiness.name} is the top-ranked {category.category.toLowerCase()} option in this
            comparison because it combines a {bestBusiness.rating}/5 rating, {bestBusiness.reviews}{" "}
            reviews, clear pricing at {bestBusiness.price}, and a strong fit for{" "}
            {bestBusiness.bestFor.toLowerCase()}.
          </p>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <h2 className="compact-title">Side-by-side comparison</h2>
          <p className="compact-copy">
            Use this quick table to shortlist the businesses that match your budget, location and use case.
          </p>
          <div className="responsive-table compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Area</th>
                  <th>Rating</th>
                  <th>Price</th>
                  <th>Best for</th>
                </tr>
              </thead>
              <tbody>
                {category.businesses.map((business) => (
                  <tr key={business.name}>
                    <td>{business.name}</td>
                    <td>{business.area}</td>
                    <td>{business.rating} / 5</td>
                    <td>{business.price}</td>
                    <td>{business.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container fact-panel">
          <h2>Comparison method and fact notes</h2>
          <p>
            This comparison is maintained by Nepali Directory and was last reviewed on{" "}
            <time dateTime={category.updatedAt}>{category.updatedAt}</time>. Rankings use visible
            directory signals including rating, review count, price notes, category fit, location,
            strengths and practical user intent.
          </p>
        </div>
      </section>
    </main>
  );
}

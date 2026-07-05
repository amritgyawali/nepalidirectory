import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { GuideCard } from "@/components/content/GuideCard";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { getBlogCategories, getBlogPostUrl, getLatestBlogModifiedAt, getSortedBlogPosts, siteUrl } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { buildBlogKeywords, buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";

const sortedBlogPosts = getSortedBlogPosts();
const categories = getBlogCategories();
const blogKeywords = uniqueKeywords([
  "Nepal blog",
  "Nepal travel guide",
  "Kathmandu restaurants",
  "Nepal business directory",
  "local services Nepal",
  "Nepal local SEO",
  "Nepal hotels guide",
  "Kathmandu home services",
  ...sortedBlogPosts.flatMap((post) => buildBlogKeywords(post))
]);

export const metadata: Metadata = {
  title: "Nepal Blog: Travel, Restaurants, Local Services, Hotels and SEO Guides",
  description:
    "Read Nepal guides for travel, restaurants, hotels, healthcare, home services, business listings and local SEO with practical answers and FAQs.",
  keywords: blogKeywords,
  alternates: {
    canonical: "/blog"
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
    title: "Nepal Blog: Travel, Restaurants, Local Services, Hotels and SEO Guides",
    description:
      "Practical Nepal guides with quick answers, FAQs and local decision help.",
    url: `${siteUrl}/blog`,
    siteName: "Nepali Directory",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: sortedBlogPosts[0].image,
        width: 1200,
        height: 675,
        alt: "Nepali Directory local guide articles"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepal Blog: Local Guides and Business Advice",
    description: "Practical Nepal guides for travel, food, services, hotels and business growth.",
    images: [sortedBlogPosts[0].image]
  },
  other: {
    "content-language": "en",
    "geo.region": "NP",
    "geo.placename": "Nepal",
    "search-intent": "informational, local, answer engine"
  }
};

export default function BlogPage() {
  const [featuredPost, ...remainingPosts] = sortedBlogPosts;
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nepali Directory Blog Posts",
    itemListElement: sortedBlogPosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getBlogPostUrl(post),
      name: post.title
    }))
  };
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Nepali Directory Blog",
    url: `${siteUrl}/blog`,
    description:
      "Practical Nepal guides for travel, restaurants, home services, healthcare and local business growth.",
    publisher,
    keywords: blogKeywords.join(", "),
    blogPost: sortedBlogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: getBlogPostUrl(post),
      datePublished: post.publishedAt,
      dateModified: post.modifiedAt
    }))
  };
  const collectionJsonLd = {
    ...buildWebPageJsonLd({
      name: "Nepal Blog: Travel, Restaurants, Local Services, Hotels and SEO Guides",
      description:
        "Read Nepal guides for travel, restaurants, hotels, healthcare, home services, business listings and local SEO.",
      url: `${siteUrl}/blog`,
      keywords: blogKeywords,
      dateModified: getLatestBlogModifiedAt()
    }),
    "@type": "CollectionPage",
    mainEntity: itemListJsonLd
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionJsonLd, blogJsonLd, itemListJsonLd]) }}
      />
      <Breadcrumbs items={[{ label: "Blog" }]} />
      <PageHero
        title="Nepal local guides and business advice"
        subtitle="Travel notes, restaurant roundups, service checklists, city guides and local SEO advice written for people searching in Nepal."
        cta={{ label: "Ask a question", href: routes.askQuestion }}
      />

      <section className="section blog-index">
        <div className="container">
          <article className="blog-featured">
            <Link className="blog-featured__image" href={featuredPost.href}>
              <FillImage
                src={featuredPost.image}
                alt={featuredPost.imageAlt}
                sizes="(max-width: 980px) 100vw, 560px"
                priority
              />
            </Link>
            <div className="blog-featured__content">
              <span>{featuredPost.category}</span>
              <h2>
                <Link href={featuredPost.href}>{featuredPost.title}</Link>
              </h2>
              <p>{featuredPost.excerpt}</p>
              <div className="blog-meta">
                <time dateTime={featuredPost.publishedAt}>{featuredPost.date}</time>
                <span>
                  <Clock size={14} aria-hidden />
                  {featuredPost.readTime}
                </span>
              </div>
              <Link className="button button--primary" href={featuredPost.href}>
                Read guide <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </article>

          <nav className="blog-category-nav" aria-label="Blog categories">
            <Link href="/blog">All guides</Link>
            {categories.map((category) => (
              <Link key={category.slug} href={category.href}>
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="blog-grid" aria-label="Latest blog posts">
            {remainingPosts.map((post) => (
              <GuideCard
                key={post.slug}
                href={post.href}
                title={post.title}
                category={post.category}
                excerpt={post.excerpt}
                image={post.image}
                imageAlt={post.imageAlt}
                meta={`${post.date} / ${post.readTime}`}
                dateTime={post.publishedAt}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

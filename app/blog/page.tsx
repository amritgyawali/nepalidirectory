import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { GuideCard } from "@/components/content/GuideCard";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { getBlogCategories, getBlogPostUrl, getLatestBlogModifiedAt, getSortedBlogPosts, siteUrl } from "@/lib/blog";
import { getPublishedEnginePosts } from "@/lib/blog-engine";
import { removeRetiredDuplicatePosts } from "@/lib/blog-dedup";
import { isIndexableBlogCategory } from "@/lib/blog-quality";
import { routes } from "@/lib/routes";
import { buildWebPageJsonLd, publisher, serializeJsonLd, uniqueKeywords } from "@/lib/seo";

// AI-generated posts publish after a human editorial review (prompt §8.5); revalidate
// periodically so a freshly-published post appears in the index without a full redeploy.
export const revalidate = 300;

const curatedPosts = getSortedBlogPosts();
// Only categories with enough posts to be indexed; thinner ones are noindex and not worth a crawl.
const categories = getBlogCategories().filter((category) => isIndexableBlogCategory(category.posts));
/** Cards with images; older guides follow as a compact text list so the page stays light. */
const IMAGE_CARD_COUNT = 18;
const blogKeywords = uniqueKeywords([
  "Nepal blog",
  "Nepal travel guide",
  "Kathmandu restaurants",
  "Nepal business directory",
  "local services Nepal",
  "Nepal local SEO",
  "Nepal hotels guide",
  "Kathmandu home services",
  // Topic-level terms only: every post's keyword list here added ~200 KB of JSON-LD to /blog.
  ...categories.map((category) => `${category.name} guides Nepal`)
]);

export const metadata: Metadata = {
  title: "Nepal Local Guides and Business Advice",
  description:
    "Read Nepal guides for travel, restaurants, hotels, healthcare, home services, business listings and local SEO with practical answers and FAQs.",
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
    title: "Nepal Local Guides and Business Advice",
    description:
      "Practical Nepal guides with quick answers, FAQs and local decision help.",
    url: `${siteUrl}/blog`,
    siteName: "NepaliDirectory",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: curatedPosts[0].image,
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
    images: [curatedPosts[0].image]
  },
  other: {
    "content-language": "en",
    "geo.region": "NP",
    "geo.placename": "Nepal",
    "search-intent": "informational, local, answer engine"
  }
};

export default async function BlogPage() {
  const enginePosts = await getPublishedEnginePosts();
  const allPosts = removeRetiredDuplicatePosts([...curatedPosts, ...enginePosts])
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const [featuredPost, ...remainingPosts] = allPosts;
  const cardPosts = remainingPosts.slice(0, IMAGE_CARD_COUNT);
  const archivePosts = remainingPosts.slice(IMAGE_CARD_COUNT);
  // Each post appears once in structured data (this ItemList); the Blog and CollectionPage nodes
  // reference it by @id instead of repeating 140 entries, which had pushed the page past 1 MB.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/blog#posts`,
    name: "Nepali Directory Blog Posts",
    itemListElement: allPosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getBlogPostUrl(post),
      name: post.title
    }))
  };
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl}/blog#blog`,
    name: "Nepali Directory Blog",
    url: `${siteUrl}/blog`,
    description:
      "Practical Nepal guides for travel, restaurants, home services, healthcare and local business growth.",
    publisher,
    keywords: blogKeywords.join(", "),
    mainEntityOfPage: { "@id": `${siteUrl}/blog#webpage` }
  };
  const collectionJsonLd = {
    ...buildWebPageJsonLd({
      name: "Nepal Local Guides and Business Advice",
      description:
        "Read Nepal guides for travel, restaurants, hotels, healthcare, home services, business listings and local SEO.",
      url: `${siteUrl}/blog`,
      breadcrumb: true,
      keywords: blogKeywords,
      dateModified: getLatestBlogModifiedAt()
    }),
    "@type": "CollectionPage",
    mainEntity: { "@id": itemListJsonLd["@id"] }
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([collectionJsonLd, blogJsonLd, itemListJsonLd]) }}
      />
      <Breadcrumbs items={[{ label: "Blog" }]} currentPath={routes.blog} />
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
            {cardPosts.map((post) => (
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

          {archivePosts.length ? (
            <section className="blog-archive" aria-labelledby="blog-archive-title">
              <h2 id="blog-archive-title">More Nepal guides</h2>
              <ul>
                {archivePosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={post.href}>{post.title}</Link>
                    <span>
                      {post.category} · <time dateTime={post.publishedAt}>{post.date}</time>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}

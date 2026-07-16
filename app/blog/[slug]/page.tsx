import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { GuideCard } from "@/components/content/GuideCard";
import { SafeRichParagraph } from "@/components/content/SafeRichParagraph";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { getAuthorByName, getAuthorUrl } from "@/lib/authors";
import { blogPosts, getBlogPost, getBlogPostUrl, getSortedBlogPosts, siteUrl, type BlogPost } from "@/lib/blog";
import { ENGINE_AUTHOR, getPublishedEnginePost, getPublishedEnginePosts } from "@/lib/blog-engine";
import { removeRetiredDuplicatePosts } from "@/lib/blog-dedup";
import { cityDirectoryPages } from "@/lib/city-pages";
import { getDirectoryCategory } from "@/lib/directory-categories";
import { routes } from "@/lib/routes";
import { relatedCompareHubsForPost } from "@/lib/seo-auto";
import {
  buildBlogKeywords,
  buildWebPageJsonLd,
  estimateWordCount,
  getBlogQuickAnswer,
  publisher
} from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

// AI-generated posts publish after a human editorial review (prompt §8.5); revalidate periodically
// so a freshly-published post shows up without a full redeploy.
export const revalidate = 300;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

async function getPost(slug: string): Promise<BlogPost | null> {
  return getBlogPost(slug) ?? (await getPublishedEnginePost(slug));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Blog post not found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const keywords = buildBlogKeywords(post);

  return {
    title: post.seoTitle,
    description: post.description,
    keywords,
    authors: [{ name: post.author }],
    category: post.category,
    alternates: {
      canonical: post.href
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
      title: post.seoTitle,
      description: post.description,
      url: getBlogPostUrl(post),
      siteName: "Nepali Directory",
      locale: "en_US",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt,
      authors: [post.author],
      tags: keywords,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 675,
          alt: post.imageAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.description,
      images: [post.image]
    },
    other: {
      "article:section": post.category,
      "article:tag": keywords.join(", "),
      "content-language": "en",
      "geo.region": "NP",
      "geo.placename": "Nepal",
      "search-intent": "informational, local, commercial investigation"
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const keywords = buildBlogKeywords(post);
  const quickAnswer = getBlogQuickAnswer(post);
  const author = getAuthorByName(post.author);
  const isEngineAuthored = post.author === ENGINE_AUTHOR;
  const enginePosts = await getPublishedEnginePosts();
  const relatedPosts = removeRetiredDuplicatePosts([...getSortedBlogPosts(), ...enginePosts])
    .filter((candidate) => candidate.slug !== post.slug)
    .filter((candidate) => candidate.category === post.category || candidate.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);
  const relatedResearchLinks = [...new Map([
    ...(post.contextLinks ?? []),
    ...(post.categorySlugs ?? []).flatMap((categorySlug) => {
      const category = getDirectoryCategory(categorySlug);
      return category ? [{ href: category.href, label: `Browse ${category.name} in Nepal` }] : [];
    }),
    // City hubs (2026-07-16 SEO audit / cluster.md: blog posts and their topically-matching
    // city/compare-business hubs had zero bidirectional links, unlike category hubs above).
    ...(post.citySlugs ?? []).flatMap((citySlug) => {
      const city = cityDirectoryPages.find((candidate) => candidate.slug === citySlug);
      return city ? [{ href: city.href, label: `Browse businesses in ${city.name}` }] : [];
    }),
    ...relatedCompareHubsForPost(post, 2).map((hub) => ({ href: hub.href, label: hub.title })),
  ].map((link) => [link.href, link] as const)).values()];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    alternativeHeadline: post.seoTitle,
    description: post.description,
    abstract: quickAnswer,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
    inLanguage: "en",
    isAccessibleForFree: true,
    author: {
      "@type": "Organization",
      name: author.name,
      url: getAuthorUrl(author),
      description: author.description,
      knowsAbout: author.knowsAbout,
      parentOrganization: publisher
    },
    publisher,
    reviewedBy: publisher,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getBlogPostUrl(post)
    },
    keywords: keywords.join(", "),
    articleSection: post.category,
    wordCount: estimateWordCount(post),
    timeRequired: `PT${post.readTime.replace(/\D/g, "") || "5"}M`,
    about: post.tags.map((tag) => ({
      "@type": "Thing",
      name: tag
    })),
    mentions: post.sections.map((section) => ({
      "@type": "Thing",
      name: section.heading
    })),
    citation: post.sources?.map((source) => source.url)
  };

  const webPageJsonLd = buildWebPageJsonLd({
    name: post.seoTitle,
    description: post.description,
    url: getBlogPostUrl(post),
    keywords,
    dateModified: post.modifiedAt
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
        name: "Blog",
        item: `${siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: getBlogPostUrl(post)
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webPageJsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd])
        }}
      />
      <Breadcrumbs items={[{ label: "Blog", href: routes.blog }, { label: post.title }]} />
      <article className="article-page">
        <div className="container">
          <Link className="article-back" href={routes.blog}>
            <ArrowLeft size={16} aria-hidden />
            Blog
          </Link>
          <span>{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="article-meta">
            <Link href={isEngineAuthored ? routes.editorialPolicy : `/authors/${author.slug}`}>{post.author}</Link>
            <time dateTime={post.publishedAt}>{post.date}</time>
            <span>
              <Clock size={14} aria-hidden />
              {post.readTime}
            </span>
          </div>
          <div className="article-page__image">
            <FillImage src={post.image} alt={post.imageAlt} sizes="(max-width: 900px) 100vw, 900px" priority />
          </div>
          <section className="answer-summary" aria-labelledby="quick-answer-title">
            <h2 id="quick-answer-title">Quick answer</h2>
            <p>{quickAnswer}</p>
            <ul>
              {post.sections.map((section) => (
                <li key={section.heading}>{section.heading}</li>
              ))}
            </ul>
          </section>
          {relatedResearchLinks.length ? (
            <section className="answer-summary" aria-labelledby="local-research-links-title">
              <h2 id="local-research-links-title">Related city and category research</h2>
              <p>Use these directory hubs alongside this guide to continue with the same local intent.</p>
              <div className="article-tags article-tags--inline">
                {relatedResearchLinks.map((link) => (
                  <Link href={link.href} key={link.href}>{link.label}</Link>
                ))}
              </div>
            </section>
          ) : null}
          <div className="article-body">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <SafeRichParagraph key={paragraph}>{paragraph}</SafeRichParagraph>
                ))}
              </section>
            ))}
          </div>
          <section className="article-faq" aria-labelledby="article-faq-title">
            <h2 id="article-faq-title">Frequently asked questions</h2>
            {post.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </section>
          <section className="fact-panel" aria-labelledby="fact-panel-title">
            <h2 id="fact-panel-title">Source and fact notes</h2>
            <p>
              This guide is maintained by{" "}
              <Link href={isEngineAuthored ? routes.editorialPolicy : `/authors/${author.slug}`}>
                {post.author}
              </Link>
              . It was last reviewed on{" "}
              <time dateTime={post.modifiedAt}>{post.modifiedAt}</time> for local search clarity,
              answer accuracy and practical Nepal context.
              {isEngineAuthored ? (
                <>
                  {" "}
                  This article is AI-assisted and human-reviewed — see the{" "}
                  <Link href={routes.editorialPolicy}>editorial policy</Link>.
                </>
              ) : null}
            </p>
            {post.disclaimer ? <p><strong>Important:</strong> {post.disclaimer}</p> : null}
            {post.sources?.length ? (
              <>
                <h3>Primary sources and verification links</h3>
                <ul>
                  {post.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} rel="noopener noreferrer" target="_blank">{source.label}</a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </section>
          {isEngineAuthored ? (
            <section className="answer-summary" aria-labelledby="ai-page-metadata-title">
              <h2 id="ai-page-metadata-title">AI page metadata</h2>
              <p>{post.description}</p>
              <dl className="metadata-list">
                <div>
                  <dt>SEO title</dt>
                  <dd>{post.seoTitle}</dd>
                </div>
                <div>
                  <dt>Meta description</dt>
                  <dd>{post.description}</dd>
                </div>
                <div>
                  <dt>Primary keywords</dt>
                  <dd>{post.keywords.join(", ")}</dd>
                </div>
                <div>
                  <dt>Page sections</dt>
                  <dd>{post.sections.map((section) => section.heading).join(", ")}</dd>
                </div>
              </dl>
            </section>
          ) : null}
          <section className="answer-summary" aria-labelledby="continue-research-title">
            <h2 id="continue-research-title">Continue researching</h2>
            <p>
              Compare providers, browse related categories or ask the community before making a local decision.
            </p>
            <div className="article-tags article-tags--inline">
              <Link href={routes.compareBusiness}>Compare businesses</Link>
              <Link href={routes.categories}>Browse categories</Link>
              <Link href={routes.askQuestion}>Ask a question</Link>
              <Link href={routes.editorialPolicy}>Editorial policy</Link>
            </div>
          </section>
          <footer className="article-tags" aria-label="Article tags">
            {post.tags.map((tag) => (
              <Link key={tag} href={`${routes.blog}?tag=${encodeURIComponent(tag)}`}>
                {tag}
              </Link>
            ))}
          </footer>
        </div>
      </article>
      {relatedPosts.length > 0 ? (
        <section className="section section--soft">
          <div className="container">
            <h2 className="compact-title">Related guides</h2>
            <div className="article-grid article-grid--related">
              {relatedPosts.map((relatedPost) => (
                <GuideCard
                  key={relatedPost.slug}
                  href={relatedPost.href}
                  title={relatedPost.title}
                  category={relatedPost.category}
                  excerpt={relatedPost.excerpt}
                  image={relatedPost.image}
                  imageAlt={relatedPost.imageAlt}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

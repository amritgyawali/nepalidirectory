import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Globe, MapPin, MessageCircle, Phone } from "lucide-react";
import { GuideCard } from "@/components/content/GuideCard";
import { SafeRichParagraph } from "@/components/content/SafeRichParagraph";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { getAuthorByName, getAuthorUrl } from "@/lib/authors";
import {
  blogPosts,
  getBlogPost,
  getBlogPostUrl,
  getSortedBlogPosts,
  siteUrl,
  type BlogCallout,
  type BlogClosingPanel,
  type BlogPost,
  type BlogPricingGuide,
  type BlogSection
} from "@/lib/blog";
import { ENGINE_AUTHOR, getPublishedEnginePost, getPublishedEnginePosts } from "@/lib/blog-engine";
import { removeRetiredDuplicatePosts } from "@/lib/blog-dedup";
import { cityDirectoryPages } from "@/lib/city-pages";
import { getIndexableHubSlugsOrNone, isLiveHubHref } from "@/lib/indexable-hubs";
import { getDirectoryCategory } from "@/lib/directory-categories";
import { routes } from "@/lib/routes";
import { relatedCompareHubsForPost } from "@/lib/seo-auto";
import {
  buildBlogItemListJsonLd,
  buildBlogKeywords,
  buildWebPageJsonLd,
  estimateWordCount,
  getBlogQuickAnswer,
  publisher,
  serializeJsonLd
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
      siteName: "NepaliDirectory",
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
  // Guide content links to hubs by URL; drop any hub that is not published (it would 404).
  const hubs = await getIndexableHubSlugsOrNone();
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
  ].filter((link) => isLiveHubHref(link.href, hubs))
    .map((link) => [link.href, link] as const)).values()];

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
    citation: post.sources?.map((source) => source.url),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#quick-answer-title", ".answer-summary p", ".article-faq summary"],
    },
  };

  const itemListJsonLd = buildBlogItemListJsonLd(post, getBlogPostUrl(post));
  const webPageJsonLd = {
    ...buildWebPageJsonLd({
      name: post.seoTitle,
      description: post.description,
      url: getBlogPostUrl(post),
      keywords,
      dateModified: post.modifiedAt
    }),
    // List posts are "about" their list, which lets answer engines lift the entries directly.
    ...(itemListJsonLd ? { mainEntity: { "@id": itemListJsonLd["@id"] } } : {})
  };

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
          __html: serializeJsonLd([
            webPageJsonLd,
            articleJsonLd,
            breadcrumbJsonLd,
            faqJsonLd,
            ...(itemListJsonLd ? [itemListJsonLd] : [])
          ])
        }}
      />
      <Breadcrumbs items={[{ label: "Blog", href: routes.blog }, { label: post.title }]} />
      <article className="article-page">
        <header className="article-hero">
          <div className="container">
            <Link className="article-back" href={routes.blog}>
              <ArrowLeft size={16} aria-hidden />
              Blog
            </Link>
            <span className="article-kicker">{post.category}</span>
            <h1>{post.title}</h1>
            {post.subtitle ? <p className="article-subtitle">{post.subtitle}</p> : null}
            <p className="article-standfirst">{post.excerpt}</p>
            <div className="article-meta">
              <Link href={isEngineAuthored ? routes.editorialPolicy : `/authors/${author.slug}`}>{post.author}</Link>
              <time dateTime={post.publishedAt}>{post.date}</time>
              {post.modifiedAt !== post.publishedAt ? (
                <span>
                  Updated <time dateTime={post.modifiedAt}>{post.modifiedAt}</time>
                </span>
              ) : null}
              <span>
                <Clock size={14} aria-hidden />
                {post.readTime}
              </span>
            </div>
          </div>
        </header>
        <div className="container">
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
          {post.itemList ? (
            <section className="answer-summary" aria-labelledby="at-a-glance-title">
              <h2 id="at-a-glance-title">{post.itemList.name} at a glance</h2>
              <div className="responsive-table compare-table-wrap">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Studio</th>
                      <th scope="col">Based in</th>
                      <th scope="col">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {post.itemList.items.map((item, index) => (
                      <tr key={item.name}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>{item.area}</td>
                        <td>
                          {item.telephone ? (
                            <a href={telHref(item.telephone)}>{item.telephone}</a>
                          ) : item.url ? (
                            <a href={item.url} rel="noopener noreferrer nofollow" target="_blank">Public page</a>
                          ) : "See sources below"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
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
            {post.sections.map((section, index) => (
              <Fragment key={section.heading}>
                {section.entry ? (
                  <ListEntry section={section} />
                ) : (
                  <section>
                    <h2>{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <SafeRichParagraph key={paragraph}>{paragraph}</SafeRichParagraph>
                    ))}
                  </section>
                )}
                {post.callout?.afterSection === index ? <ArticleCallout callout={post.callout} /> : null}
                {post.pricingGuide?.afterSection === index ? <PricingGuide guide={post.pricingGuide} /> : null}
              </Fragment>
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
          {post.closingPanel ? <ClosingPanel panel={post.closingPanel} /> : null}
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
          {/* Tags are plain labels, not links: /blog has no tag filter, so /blog?tag=X URLs were
              duplicates of /blog that Search Console reported as "Alternative page with proper
              canonical tag". Middleware 301s any legacy ?tag= URL back to the clean path. */}
          <footer className="article-tags" aria-label="Article tags">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
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

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** A numbered studio on a list post: rank badge, name, area, description and contact row. */
function ListEntry({ section }: { section: BlogSection }) {
  const entry = section.entry!;
  const headingId = `list-entry-${entry.rank}`;
  return (
    <section className="list-entry" aria-labelledby={headingId}>
      <div className="list-entry__head">
        <span className="list-entry__rank" aria-hidden>
          {entry.rank}
        </span>
        <div>
          <h2 id={headingId}>
            <span className="visually-hidden">{entry.rank}. </span>
            {entry.name}
          </h2>
          <p className="list-entry__area">
            <MapPin size={14} aria-hidden />
            {entry.area}
          </p>
        </div>
      </div>
      {section.paragraphs.map((paragraph) => (
        <SafeRichParagraph key={paragraph}>{paragraph}</SafeRichParagraph>
      ))}
      <div className="list-entry__contact">
        {entry.phone ? (
          <a href={telHref(entry.phone)}>
            <Phone size={15} aria-hidden />
            Contact Number: <strong>{entry.phone}</strong>
          </a>
        ) : null}
        {entry.url ? (
          <a href={entry.url} rel="noopener noreferrer nofollow" target="_blank">
            <Globe size={15} aria-hidden />
            {entry.phone ? "See their work" : "Contact via their official page"}
          </a>
        ) : null}
      </div>
    </section>
  );
}

function ArticleCallout({ callout }: { callout: BlogCallout }) {
  return (
    <aside className="article-callout" aria-label={callout.heading}>
      <span className="article-callout__eyebrow">{callout.eyebrow}</span>
      <h2>{callout.heading}</h2>
      <p>{callout.text}</p>
      <div className="article-callout__links">
        {callout.links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
            <ArrowRight size={15} aria-hidden />
          </Link>
        ))}
      </div>
    </aside>
  );
}

function PricingGuide({ guide }: { guide: BlogPricingGuide }) {
  return (
    <section className="price-guide" aria-labelledby="price-guide-title">
      <h2 id="price-guide-title">{guide.heading}</h2>
      <p>{guide.intro}</p>
      <div className="price-guide__grid">
        {guide.tiers.map((tier) => (
          <div className={`price-tier${tier.highlight ? " price-tier--highlight" : ""}`} key={tier.name}>
            {tier.highlight ? <span className="price-tier__badge">Best balance</span> : null}
            <h3>{tier.name}</h3>
            <p className="price-tier__price">
              {tier.price}
              <small>{tier.unit}</small>
            </p>
            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>
                  <Check size={15} aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="price-tier__ideal">{tier.idealFor}</p>
            <p className="price-tier__extra">{tier.extraDay}</p>
          </div>
        ))}
      </div>
      <p className="price-guide__note">{guide.note}</p>
      {guide.cta ? (
        <a className="price-guide__cta" href={guide.cta.href} rel="noopener noreferrer" target="_blank">
          <MessageCircle size={17} aria-hidden />
          {guide.cta.label}
        </a>
      ) : null}
    </section>
  );
}

function ClosingPanel({ panel }: { panel: BlogClosingPanel }) {
  return (
    <section className="closing-panel" aria-labelledby="closing-panel-title">
      <span className="closing-panel__eyebrow">About this report</span>
      <h2 id="closing-panel-title">{panel.heading}</h2>
      <p>{panel.intro}</p>
      <ol className="closing-panel__list">
        {panel.members.map((member) => (
          <li key={member.name}>
            <strong>{member.name}</strong>
            <span>{member.base}</span>
          </li>
        ))}
      </ol>
      <p className="closing-panel__footnote">{panel.footnote}</p>
    </section>
  );
}

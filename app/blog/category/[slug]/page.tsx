import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideCard } from "@/components/content/GuideCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/directory/PageHero";
import { getBlogCategories, getBlogCategory, getBlogPostUrl, siteUrl } from "@/lib/blog";
import { isIndexableBlogCategory } from "@/lib/blog-quality";
import { routes } from "@/lib/routes";
import { buildBlogKeywords, buildWebPageJsonLd, serializeJsonLd, uniqueKeywords } from "@/lib/seo";

type BlogCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getBlogCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getBlogCategory(slug);

  if (!category) {
    return { title: "Blog category not found", robots: { index: false, follow: false } };
  }

  const title = `${category.name} Guides in Nepal`;
  const description = `Read ${category.name.toLowerCase()} guides from Nepali Directory, including practical answers, FAQs and local decision help for Nepal.`;
  const indexable = isIndexableBlogCategory(category.posts);

  return {
    title,
    description,
    alternates: { canonical: category.href },
    robots: {
      index: indexable,
      follow: true,
      googleBot: { index: indexable, follow: true },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${category.href}`,
      siteName: "NepaliDirectory",
      type: "website",
      images: [{ url: category.posts[0].image, width: 1200, height: 675, alt: category.posts[0].imageAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [category.posts[0].image]
    }
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { slug } = await params;
  const category = getBlogCategory(slug);

  if (!category) {
    notFound();
  }

  const keywords = uniqueKeywords(category.posts.flatMap((post) => buildBlogKeywords(post))).slice(0, 30);
  const title = `${category.name} guides`;
  const description = `Browse ${category.posts.length} ${category.name.toLowerCase()} guides with quick answers, practical local context and related Nepal directory links.`;
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}${category.href}#posts`,
    name: `${category.name} guides`,
    itemListElement: category.posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getBlogPostUrl(post),
      name: post.title
    }))
  };
  const collectionJsonLd = {
    ...buildWebPageJsonLd({
      name: title,
      description,
      url: `${siteUrl}${category.href}`,
      breadcrumb: true,
      keywords,
      dateModified: category.posts[0].modifiedAt
    }),
    "@type": "CollectionPage",
    mainEntity: { "@id": itemListJsonLd["@id"] }
  };
  // Real questions the guides answer, each linking to the guide: gives the hub its own
  // substance beyond a card grid and sends readers straight to the matching answer.
  const answeredQuestions = category.posts
    .flatMap((post) => (post.faqs ?? []).slice(0, 2).map((faq) => ({ question: faq.question, post })))
    .slice(0, 12);
  const latestUpdate = category.posts.reduce(
    (latest, post) => (post.modifiedAt > latest ? post.modifiedAt : latest),
    category.posts[0].modifiedAt,
  );

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([collectionJsonLd, itemListJsonLd]) }}
      />
      <Breadcrumbs items={[{ label: "Blog", href: routes.blog }, { label: category.name }]} currentPath={category.href} />
      <PageHero title={title} subtitle={description} cta={{ label: "All guides", href: routes.blog }} />
      <section className="section">
        <div className="container blog-grid">
          {category.posts.map((post) => (
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
      </section>
      {answeredQuestions.length ? (
        <section className="section section--soft">
          <div className="container blog-archive">
            <h2>Questions these {category.name.toLowerCase()} guides answer</h2>
            <p>
              {category.posts.length} guides in this collection, last updated{" "}
              <time dateTime={latestUpdate}>{latestUpdate.slice(0, 10)}</time>. Each answer links to the
              guide that explains it in full.
            </p>
            <ul>
              {answeredQuestions.map(({ question, post }) => (
                <li key={`${post.slug}-${question}`}>
                  <Link href={post.href}>{question}</Link>
                  <span>{post.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  );
}

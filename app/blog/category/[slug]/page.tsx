import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideCard } from "@/components/content/GuideCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/directory/PageHero";
import { getBlogCategories, getBlogCategory, getBlogPostUrl, siteUrl } from "@/lib/blog";
import { isIndexableBlogCategory } from "@/lib/blog-quality";
import { routes } from "@/lib/routes";
import { buildBlogKeywords, buildWebPageJsonLd, uniqueKeywords } from "@/lib/seo";

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

  const keywords = uniqueKeywords([
    `${category.name} Nepal`,
    `${category.name} guide Nepal`,
    `Nepal ${category.name.toLowerCase()} blog`,
    ...category.posts.flatMap((post) => buildBlogKeywords(post))
  ]);
  const title = `${category.name} Guides in Nepal`;
  const description = `Read ${category.name.toLowerCase()} guides from Nepali Directory, including practical answers, FAQs and local decision help for Nepal.`;
  const indexable = isIndexableBlogCategory(category.posts);

  return {
    title,
    description,
    keywords,
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
      siteName: "Nepali Directory",
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

  const keywords = uniqueKeywords(category.posts.flatMap((post) => buildBlogKeywords(post)));
  const title = `${category.name} guides`;
  const description = `Browse ${category.posts.length} ${category.name.toLowerCase()} guides with quick answers, practical local context and related Nepal directory links.`;
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
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
      keywords,
      dateModified: category.posts[0].modifiedAt
    }),
    "@type": "CollectionPage",
    mainEntity: itemListJsonLd
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionJsonLd, itemListJsonLd]) }}
      />
      <Breadcrumbs items={[{ label: "Blog", href: routes.blog }, { label: category.name }]} />
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
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideCard } from "@/components/content/GuideCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/directory/PageHero";
import { contentAuthors, getAuthorBySlug, getAuthorUrl, getPostsByAuthor } from "@/lib/authors";
import { routes } from "@/lib/routes";
import { buildBlogKeywords, buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return contentAuthors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    return { title: "Author not found", robots: { index: false, follow: false } };
  }

  return {
    title: `${author.name}: ${author.role}`,
    description: author.description,
    alternates: { canonical: `/authors/${author.slug}` },
    openGraph: {
      title: `${author.name}: ${author.role}`,
      description: author.description,
      url: getAuthorUrl(author),
      siteName: "Nepali Directory",
      type: "profile"
    }
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const posts = getPostsByAuthor(author);
  const keywords = uniqueKeywords([...author.knowsAbout, ...posts.flatMap((post) => buildBlogKeywords(post))]);
  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: author.name,
    url: getAuthorUrl(author),
    description: author.description,
    dateModified: "2026-06-28",
    publisher,
    mainEntity: {
      "@type": "Organization",
      name: author.name,
      url: getAuthorUrl(author),
      parentOrganization: publisher,
      description: author.description,
      knowsAbout: author.knowsAbout
    }
  };
  const webPageJsonLd = buildWebPageJsonLd({
    name: `${author.name}: ${author.role}`,
    description: author.description,
    url: getAuthorUrl(author),
    keywords,
    dateModified: "2026-06-28"
  });

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([webPageJsonLd, profileJsonLd]) }}
      />
      <Breadcrumbs items={[{ label: "Authors", href: "/authors" }, { label: author.name }]} />
      <PageHero title={author.name} subtitle={author.description} cta={{ label: "Editorial policy", href: routes.editorialPolicy }} />
      <section className="section">
        <div className="container author-profile">
          <section className="fact-panel">
            <h2>Review scope</h2>
            <p>{author.role}. This desk focuses on practical local decision support, current directory signals and transparent review notes.</p>
            <div className="article-tags" aria-label="Author expertise">
              {author.knowsAbout.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
          </section>
          {posts.length > 0 ? (
            <section>
              <h2 className="compact-title">Guides by this desk</h2>
              <div className="article-grid article-grid--related">
                {posts.map((post) => (
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
          ) : null}
        </div>
      </section>
    </main>
  );
}

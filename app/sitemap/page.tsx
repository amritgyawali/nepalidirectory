import Link from "next/link";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { contentAuthors } from "@/lib/authors";
import { blogPosts, getBlogCategories, siteUrl } from "@/lib/blog";
import { getPublishedEnginePosts } from "@/lib/blog-engine";
import { removeRetiredDuplicatePosts } from "@/lib/blog-dedup";
import { isIndexableBlogCategory } from "@/lib/blog-quality";
import { cityDirectoryPages } from "@/lib/city-pages";
import { compareCategories } from "@/lib/compare";
import { directoryCategories } from "@/lib/directory-categories";
import { computeIndexableHubSlugs } from "@/lib/indexable-hubs";
import { getIndexableListings } from "@/lib/public-listings";
import { getBusinessHref, routes } from "@/lib/routes";
import { buildWebPageJsonLd } from "@/lib/seo";
import { isIndexableRoute } from "@/lib/seo-config";
import { getEvergreenPages } from "@/lib/seo-auto";

const pages = Object.entries(routes).filter(
  ([key, href]) =>
    key !== "home" &&
    key !== "blogPost" &&
    key !== "city" &&
    isIndexableRoute(href),
);
const blogCategories = getBlogCategories().filter((category) =>
  isIndexableBlogCategory(category.posts),
);
const evergreenPages = getEvergreenPages();

export const revalidate = 300;

export default async function SitemapPage() {
  let generatedPosts: Awaited<ReturnType<typeof getPublishedEnginePosts>> = [];
  let listings: Awaited<ReturnType<typeof getIndexableListings>> = [];
  try {
    [generatedPosts, listings] = await Promise.all([
      getPublishedEnginePosts(),
      getIndexableListings(),
    ]);
  } catch (error) {
    console.error("Unable to load dynamic records for the human sitemap", error);
  }
  const publicPosts = removeRetiredDuplicatePosts([...blogPosts, ...generatedPosts]);
  // Unpublished hubs 404, so only link those that currently qualify.
  const hubs = computeIndexableHubSlugs(listings);

  const label = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  // Grouped, headed sections give people and crawlers a scannable map of every public hub.
  const groups: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
    { title: "Main pages", links: pages.map(([key, href]) => ({ href, label: label(key) })) },
    {
      title: "Business categories",
      links: directoryCategories
        .filter((category) => hubs.categories.includes(category.slug))
        .map((category) => ({ href: category.href, label: category.priorityKeyword })),
    },
    {
      title: "Cities",
      links: cityDirectoryPages
        .filter((city) => hubs.cities.includes(city.slug))
        .map((city) => ({ href: city.href, label: city.name })),
    },
    {
      title: "Business comparisons",
      links: compareCategories
        .filter((category) => category.businesses.length > 0)
        .map((category) => ({ href: category.href, label: category.category })),
    },
    {
      title: "Local answers",
      links: evergreenPages.map((page) => ({ href: page.href, label: page.title })),
    },
    {
      title: "Guide categories",
      links: blogCategories.map((category) => ({ href: category.href, label: category.name })),
    },
    { title: "Guides", links: publicPosts.map((post) => ({ href: post.href, label: post.title })) },
    {
      title: "Business profiles",
      links: listings.map((listing) => ({ href: getBusinessHref(listing.slug), label: listing.name })),
    },
    {
      title: "Authors",
      links: contentAuthors.map((author) => ({ href: `/authors/${author.slug}`, label: author.name })),
    },
  ].filter((group) => group.links.length > 0);
  const url = `${siteUrl}${routes.sitemap}`;
  const jsonLd = {
    ...buildWebPageJsonLd({
      name: "Nepali Directory sitemap",
      description: "Every public Nepali Directory page grouped by section: categories, cities, guides, comparisons and business profiles.",
      url,
      keywords: ["Nepali Directory sitemap", ...groups.map((group) => group.title)],
      breadcrumb: true,
      speakable: null,
    }),
    "@type": "CollectionPage",
    hasPart: groups.map((group) => ({
      "@type": "SiteNavigationElement",
      name: group.title,
      hasPart: group.links.slice(0, 50).map((link) => ({
        "@type": "WebPage",
        name: link.label,
        url: `${siteUrl}${link.href}`,
      })),
    })),
  };

  return (
    <main>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: "Sitemap" }]} currentPath={routes.sitemap} />
      <PageHero title="Sitemap" subtitle="All major Nepali Directory routes in one clean index." />
      {groups.map((group) => {
        const headingId = `sitemap-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        return (
          <section className="section" key={group.title} aria-labelledby={headingId}>
            <div className="container">
              <h2 className="compact-title" id={headingId}>{group.title}</h2>
              <div className="sitemap-grid">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}

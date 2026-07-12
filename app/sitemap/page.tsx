import Link from "next/link";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { contentAuthors } from "@/lib/authors";
import { blogPosts, getBlogCategories } from "@/lib/blog";
import { getPublishedEnginePosts } from "@/lib/blog-engine";
import { removeRetiredDuplicatePosts } from "@/lib/blog-dedup";
import { cityDirectoryPages } from "@/lib/city-pages";
import { compareCategories } from "@/lib/compare";
import { directoryCategories } from "@/lib/directory-categories";
import { getIndexableListings } from "@/lib/public-listings";
import { getBusinessHref, routes } from "@/lib/routes";
import { isIndexableRoute } from "@/lib/seo-config";
import { getEvergreenPages } from "@/lib/seo-auto";

const pages = Object.entries(routes).filter(
  ([key, href]) =>
    key !== "home" &&
    key !== "blogPost" &&
    key !== "city" &&
    key !== "topRated" &&
    isIndexableRoute(href),
);
const blogCategories = getBlogCategories();
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

  return (
    <main>
      <Breadcrumbs items={[{ label: "Sitemap" }]} />
      <PageHero title="Sitemap" subtitle="All major Nepali Directory routes in one clean index." />
      <section className="section">
        <div className="container sitemap-grid">
          {pages.map(([key, href]) => (
            <Link key={key} href={href}>
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}
            </Link>
          ))}
          {publicPosts.map((post) => (
            <Link key={post.slug} href={post.href}>
              Blog: {post.title}
            </Link>
          ))}
          {listings.map((listing) => (
            <Link key={listing.slug} href={getBusinessHref(listing.slug)}>
              Business: {listing.name}
            </Link>
          ))}
          {blogCategories.map((category) => (
            <Link key={category.slug} href={category.href}>
              Blog Category: {category.name}
            </Link>
          ))}
          {compareCategories.filter((category) => category.businesses.length > 0).map((category) => (
            <Link key={category.slug} href={category.href}>
              Compare: {category.category}
            </Link>
          ))}
          {directoryCategories.map((category) => (
            <Link key={`directory-${category.slug}`} href={category.href}>
              Category: {category.priorityKeyword}
            </Link>
          ))}
          {contentAuthors.map((author) => (
            <Link key={author.slug} href={`/authors/${author.slug}`}>
              Author: {author.name}
            </Link>
          ))}
          {cityDirectoryPages.map((city) => (
            <Link key={city.slug} href={city.href}>
              City: {city.name}
            </Link>
          ))}
          {evergreenPages.map((page) => (
            <Link key={`${page.categorySlug}-${page.citySlug}`} href={page.href}>
              Local answer: {page.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

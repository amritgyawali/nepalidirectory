import Link from "next/link";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { contentAuthors } from "@/lib/authors";
import { blogPosts, getBlogCategories } from "@/lib/blog";
import { cityDirectoryPages } from "@/lib/city-pages";
import { compareCategories } from "@/lib/compare";
import { routes } from "@/lib/routes";

const pages = Object.entries(routes).filter(([key]) => key !== "home" && key !== "blogPost" && key !== "city");
const blogCategories = getBlogCategories();

export default function SitemapPage() {
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
          {blogPosts.map((post) => (
            <Link key={post.slug} href={post.href}>
              Blog: {post.title}
            </Link>
          ))}
          {blogCategories.map((category) => (
            <Link key={category.slug} href={category.href}>
              Blog Category: {category.name}
            </Link>
          ))}
          {compareCategories.map((category) => (
            <Link key={category.slug} href={category.href}>
              Compare: {category.category}
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
        </div>
      </section>
    </main>
  );
}

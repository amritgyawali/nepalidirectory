import Link from "next/link";
import { CategoryTile } from "@/components/directory/CategoryTile";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/blog";
import { categories, categoryGroups } from "@/lib/data";
import { getDirectoryCategory } from "@/lib/directory-categories";
import { getIndexableHubSlugs, isLiveHubHref, type IndexableHubSlugs } from "@/lib/indexable-hubs";
import { getSearchHref, routes } from "@/lib/routes";
import { buildWebPageJsonLd, uniqueKeywords } from "@/lib/seo";
import { buildFaqPageJsonLd, buildLinkItemListJsonLd } from "@/lib/structured-data";

const pageUrl = `${siteUrl}${routes.categories}`;
const pageDescription =
  "Browse Nepal's services directory by business category, from restaurants, hotels and shops to healthcare, schools, IT companies and home services.";

const faqs = [
  {
    question: "What business categories does Nepali Directory cover?",
    answer:
      "Nepali Directory covers restaurants, hotels, doctors, hospitals, schools, IT companies, shops, clothing stores, tailors, hardware stores and home services such as plumbers and electricians, grouped into home services, medical and healthcare, food and hospitality, and professional services.",
  },
  {
    question: "How do I find a service provider in a specific city?",
    answer:
      "Open a category guide and choose the city section, or search for the service together with the city or district name, for example \"plumber in Pokhara\".",
  },
  {
    question: "Why does a category link open a search instead of a guide?",
    answer:
      "A category guide is published only once enough verified profiles qualify for it. Until then the link opens a search for the same service so you can still find matching businesses.",
  },
];

export const revalidate = 300;

/** Unpublished category hubs 404, so they fall back to a search for the same label. */
function getCategoryDestination(label: string, hubs: IndexableHubSlugs, href?: string): string {
  const slug = label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const destination = href ?? getDirectoryCategory(slug)?.href;
  return destination && isLiveHubHref(destination, hubs) ? destination : getSearchHref(label);
}

export default async function CategoriesPage() {
  const hubs = await getIndexableHubSlugs();
  // Only published hubs belong in the ItemList; search fallbacks are noindex utility URLs.
  const liveCategoryLinks = categories
    .map((category) => ({ name: category.name, href: getCategoryDestination(category.name, hubs, category.href) }))
    .filter((link) => !link.href.startsWith(routes.search));
  const jsonLd = [
    {
      ...buildWebPageJsonLd({
        name: "Nepal services directory and business categories",
        description: pageDescription,
        url: pageUrl,
        keywords: uniqueKeywords([
          "Nepal services directory",
          "business categories Nepal",
          ...categories.map((category) => `${category.name} Nepal`),
          ...categoryGroups.map((group) => group.title),
        ]),
        breadcrumb: true,
      }),
      "@type": "CollectionPage",
      ...(liveCategoryLinks.length ? { mainEntity: { "@id": `${pageUrl}#itemlist` } } : {}),
    },
    buildLinkItemListJsonLd({ name: "Nepal business categories", pageUrl, items: liveCategoryLinks }),
    buildFaqPageJsonLd(faqs, pageUrl),
  ];
  return (
    <main>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: "Categories" }]} currentPath={routes.categories} />
      <section className="page-head">
        <div className="container">
          <h1 className="page-title">Nepal services directory and business categories</h1>
          <p className="page-copy">
            Explore common local business and service categories in Nepal. Open a directory guide
            where one is available, or search by service and city while profiles complete review.
          </p>
          <div className="filter-row filter-row--top">
            <strong>Most searched:</strong>
            {categories.slice(0, 8).map((category, index) => (
              <Link className={index === 0 ? "chip chip--active" : "chip"} key={category.name} href={getCategoryDestination(category.name, hubs, category.href)}>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="home-category-grid">
            {categories.map((category) => (
              <CategoryTile
                key={category.name}
                {...category}
                href={getCategoryDestination(category.name, hubs, category.href)}
              />
            ))}
          </div>
          <div className="category-groups">
            {categoryGroups.map((group) => {
              const Icon = group.icon;
              return (
                <section className="category-group" key={group.title}>
                  <div className="category-group__head">
                    <span>
                      <Icon size={25} aria-hidden />
                    </span>
                    <div>
                      <h2>{group.title}</h2>
                      <p>{group.description}</p>
                    </div>
                  </div>
                  <div className="category-group__links">
                    {group.items.map((item) => (
                      <Link href={getCategoryDestination(item, hubs)} key={item}>
                        {item}
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container article-faq">
          <h2>Category questions</h2>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

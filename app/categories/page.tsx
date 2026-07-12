import Link from "next/link";
import { CategoryTile } from "@/components/directory/CategoryTile";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { categories, categoryGroups } from "@/lib/data";
import { getDirectoryCategory } from "@/lib/directory-categories";
import { getSearchHref } from "@/lib/routes";

function getCategoryDestination(label: string): string {
  const slug = label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return getDirectoryCategory(slug)?.href ?? getSearchHref(label);
}

export default function CategoriesPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Categories" }]} />
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
              <Link className={index === 0 ? "chip chip--active" : "chip"} key={category.name} href={category.href}>
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
              <CategoryTile key={category.name} {...category} />
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
                      <Link href={getCategoryDestination(item)} key={item}>
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
    </main>
  );
}

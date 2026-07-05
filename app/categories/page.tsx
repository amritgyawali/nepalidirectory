import Link from "next/link";
import { CategoryTile } from "@/components/directory/CategoryTile";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { categories, categoryGroups } from "@/lib/data";
import { routes } from "@/lib/routes";

export default function CategoriesPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Categories" }]} />
      <section className="page-head">
        <div className="container">
          <h1 className="page-title">Browse business categories</h1>
          <p className="page-copy">
            Find verified local businesses across 140+ categories in every district of Nepal, from
            plumbers in Pokhara to wedding photographers in Kathmandu.
          </p>
          <div className="filter-row filter-row--top">
            <strong>Most searched:</strong>
            {categories.slice(0, 8).map((category, index) => (
              <Link className={index === 0 ? "chip chip--active" : "chip"} key={category.name} href={routes.search}>
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
                      <Link href={routes.search} key={item}>
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

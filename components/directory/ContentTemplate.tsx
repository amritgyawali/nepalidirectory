import Link from "next/link";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { ContentPage } from "@/lib/content";

export function ContentTemplate({ page }: { page: ContentPage }) {
  return (
    <main>
      <Breadcrumbs items={[{ label: page.title }]} />
      <PageHero title={page.title} subtitle={page.subtitle} cta={page.cta} />
      <section className="section">
        <div className="container prose-card">
          {page.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {page.cta ? (
            <Link className="button button--primary" href={page.cta.href}>
              {page.cta.label}
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}

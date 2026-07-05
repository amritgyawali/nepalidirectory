import Link from "next/link";

type PageHeroProps = {
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function PageHero({ title, subtitle, cta, secondary }: PageHeroProps) {
  return (
    <section className="page-head">
      <div className="container page-hero">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-copy">{subtitle}</p>
        </div>
        {(cta || secondary) && (
          <div className="page-hero__actions">
            {cta ? (
              <Link className="button button--primary" href={cta.href}>
                {cta.label}
              </Link>
            ) : null}
            {secondary ? (
              <Link className="button button--outline" href={secondary.href}>
                {secondary.label}
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

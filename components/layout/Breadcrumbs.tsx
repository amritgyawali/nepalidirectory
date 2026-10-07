import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { routes } from "@/lib/routes";
import { buildBreadcrumbListJsonLd } from "@/lib/structured-data";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /** Path of the current page; lets the final crumb resolve to an absolute URL in the schema. */
  currentPath?: string;
  /**
   * Emit a BreadcrumbList that mirrors the visible trail. Disable on templates that already
   * publish their own BreadcrumbList so a page never carries two competing trails.
   */
  schema?: boolean;
};

export function Breadcrumbs({ items, currentPath, schema = true }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {schema ? (
        <JsonLd
          data={buildBreadcrumbListJsonLd(
            items.map((item) => ({ name: item.label, href: item.href })),
            currentPath,
          )}
        />
      ) : null}
      <div className="container breadcrumb__inner">
        <Link href={routes.home}>Home</Link>
        {items.map((item, index) => (
          <span key={`${item.label}-${item.href ?? "current"}`}>
            {" "}
            /{" "}
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}

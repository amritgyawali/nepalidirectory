import Link from "next/link";
import { routes } from "@/lib/routes";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="breadcrumb">
      <div className="container breadcrumb__inner">
        <Link href={routes.home}>Home</Link>
        {items.map((item) => (
          <span key={`${item.label}-${item.href ?? "current"}`}>
            {" "}
            /{" "}
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

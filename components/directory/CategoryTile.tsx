import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type CategoryTileProps = {
  name: string;
  count?: string;
  href: string;
  icon: LucideIcon;
  color: string;
};

export function CategoryTile({ name, count, href, icon: Icon, color }: CategoryTileProps) {
  return (
    <Link className="category-tile" href={href}>
      <span className="category-tile__icon" style={{ backgroundColor: color }}>
        <Icon size={23} aria-hidden />
      </span>
      <span className="category-tile__name">{name}</span>
      {count ? <span className="category-tile__count">{count} listings</span> : null}
    </Link>
  );
}

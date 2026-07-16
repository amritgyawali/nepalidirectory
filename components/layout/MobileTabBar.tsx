"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Home, LayoutGrid, MapPinned, Search } from "lucide-react";
import { routes } from "@/lib/routes";

const tabs = [
  {
    label: "Home",
    href: routes.home,
    icon: Home,
    isActive: (path: string) => path === "/"
  },
  {
    label: "Categories",
    href: routes.categories,
    icon: LayoutGrid,
    isActive: (path: string) => path.startsWith("/categories") || path.startsWith("/category")
  },
  {
    label: "Search",
    href: routes.search,
    icon: Search,
    isActive: (path: string) => path.startsWith("/search")
  },
  {
    label: "Cities",
    href: routes.city,
    icon: MapPinned,
    isActive: (path: string) => path.startsWith("/city") || path.startsWith("/province")
  },
  {
    label: "Guides",
    href: routes.blog,
    icon: BookOpenText,
    isActive: (path: string) => path.startsWith("/blog")
  }
];

export function MobileTabBar() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="mobile-tabbar" aria-label="Quick navigation">
      {tabs.map((tab) => {
        const active = tab.isActive(pathname);
        return (
          <Link key={tab.href} href={tab.href} aria-current={active ? "page" : undefined}>
            <span className="mobile-tabbar__icon">
              <tab.icon size={20} aria-hidden strokeWidth={active ? 2.4 : 2} />
            </span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

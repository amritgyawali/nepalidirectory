"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpenText,
  Building2,
  CalendarDays,
  ChevronRight,
  LayoutGrid,
  LifeBuoy,
  Map,
  MapPinned,
  Menu,
  Scale,
  Search,
  Star,
  Tag,
  X
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { primaryNav, routes } from "@/lib/routes";

const menuPrimary = [
  { label: "Categories", href: routes.categories, icon: LayoutGrid },
  { label: "Cities", href: routes.city, icon: MapPinned },
  { label: "Guides", href: routes.blog, icon: BookOpenText },
  { label: "Compare businesses", href: routes.compareBusiness, icon: Scale }
];

const menuQuick = [
  { label: "Search", href: routes.search, icon: Search },
  { label: "Deals & offers", href: routes.deals, icon: Tag },
  { label: "Write a review", href: routes.writeReview, icon: Star },
  { label: "Events", href: routes.events, icon: CalendarDays },
  { label: "Map", href: routes.map, icon: Map },
  { label: "Help center", href: routes.help, icon: LifeBuoy }
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const iconFor = (label: string) => {
    if (label === "Categories") return <LayoutGrid size={15} aria-hidden />;
    if (label === "Cities") return <MapPinned size={15} aria-hidden />;
    if (label === "Guides") return <BookOpenText size={15} aria-hidden />;
    if (label === "Compare") return <Scale size={15} aria-hidden />;
    if (label === "Add Business") return <Building2 size={15} aria-hidden />;
    return null;
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Logo />
          <nav className="site-nav" aria-label="Main navigation">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                className={item.featured ? "site-nav__link site-nav__link--featured" : "site-nav__link"}
                href={item.href}
              >
                {iconFor(item.label)}
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="site-header__mobile">
            <Link href={routes.search} aria-label="Search businesses">
              <Search size={19} aria-hidden />
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>
      </header>
      <nav id="mobile-menu" className="mobile-menu" data-open={menuOpen} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        <div className="mobile-menu__list">
          {menuPrimary.map((item) => (
            <Link key={item.href} href={item.href} tabIndex={menuOpen ? 0 : -1}>
              <item.icon size={18} aria-hidden />
              {item.label}
              <ChevronRight size={17} aria-hidden />
            </Link>
          ))}
        </div>
        <p className="mobile-menu__label">Discover</p>
        <div className="mobile-menu__quick">
          {menuQuick.map((item) => (
            <Link key={item.href} href={item.href} tabIndex={menuOpen ? 0 : -1}>
              <item.icon size={17} aria-hidden />
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mobile-menu__auth">
          <Link className="button button--outline" href={routes.login} tabIndex={menuOpen ? 0 : -1}>
            Log In
          </Link>
          <Link className="button button--dark" href={routes.register} tabIndex={menuOpen ? 0 : -1}>
            Sign Up
          </Link>
        </div>
        <Link className="button button--primary mobile-menu__cta" href={routes.claimListing} tabIndex={menuOpen ? 0 : -1}>
          <Building2 size={17} aria-hidden />
          Add your business
        </Link>
      </nav>
    </>
  );
}

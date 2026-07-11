"use client";

import Link from "next/link";
import { BookOpenText, Building2, LayoutGrid, MapPinned, Scale } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { primaryNav } from "@/lib/routes";

export function Header() {
  const iconFor = (label: string) => {
    if (label === "Categories") return <LayoutGrid size={15} aria-hidden />;
    if (label === "Cities") return <MapPinned size={15} aria-hidden />;
    if (label === "Guides") return <BookOpenText size={15} aria-hidden />;
    if (label === "Compare") return <Scale size={15} aria-hidden />;
    if (label === "Add Business") return <Building2 size={15} aria-hidden />;
    return null;
  };

  return (
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
      </div>
    </header>
  );
}

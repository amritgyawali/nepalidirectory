"use client";

import Link from "next/link";
import { Building2, Megaphone, Search, Star, Tag } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { primaryNav } from "@/lib/routes";

export function Header() {
  const iconFor = (label: string) => {
    if (label === "Find People") return <Search size={15} aria-hidden />;
    if (label === "Deals") return <Tag size={15} aria-hidden />;
    if (label === "Add Business") return <Building2 size={15} aria-hidden />;
    if (label === "Advertise") return <Megaphone size={15} aria-hidden />;
    if (label === "Write a Review") return <Star size={15} aria-hidden fill="#FFD400" />;
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

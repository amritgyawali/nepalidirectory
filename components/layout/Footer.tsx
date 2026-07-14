import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { cityDirectoryPages } from "@/lib/city-pages";
import { directoryCategories } from "@/lib/directory-categories";
import { footerGroups, routes } from "@/lib/routes";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          <div>
            <Logo inverted />
            <p className="footer__copy">
              Nepal&apos;s local business directory for reviewed profiles and practical city and
              category guides. Find restaurants, hotels, professionals and services as qualified
              listings go live.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="footer__title">{group.title}</h2>
              <ul className="footer__list">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="footer__title">Popular Categories</h2>
            <div className="footer__cities">
              {directoryCategories.map((category) => (
                <Link key={category.slug} href={category.href}>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="footer__title">City Guides</h2>
            <div className="footer__cities">
              {cityDirectoryPages.map((city) => (
                <Link key={city.slug} href={city.href}>
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="footer__legal">
            <Link href={routes.privacy}>Privacy</Link>
            <Link href={routes.terms}>Terms of Use</Link>
            <Link href={routes.editorialPolicy}>Editorial Policy</Link>
            <Link href={routes.directoryMethodology}>Directory Methodology</Link>
            <Link href={routes.sitemap}>Sitemap</Link>
            <Link href={routes.attribution}>Data Attribution</Link>
          </div>
          <p>
            © 2026 Nepali Directory. All rights reserved. Map data ©{" "}
            <Link href={routes.attribution}>OpenStreetMap contributors</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}

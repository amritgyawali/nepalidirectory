import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { getCityHref } from "@/lib/city-pages";
import { cityLinks } from "@/lib/data";
import { footerGroups, routes } from "@/lib/routes";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          <div>
            <Logo inverted />
            <p className="footer__copy">
              Nepal&apos;s trusted local business directory. Find verified restaurants, doctors,
              plumbers, hotels and services across all 7 provinces.
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
            <h2 className="footer__title">City Guides</h2>
            <div className="footer__cities">
              {cityLinks.slice(0, 12).map((city) => (
                <Link key={city} href={getCityHref(city)}>
                  {city}
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

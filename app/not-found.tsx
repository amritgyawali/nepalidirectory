import type { Metadata } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Page not found</h1>
      <p>The page you requested may have moved into the new Next.js route structure.</p>
      <Link className="button button--primary" href={routes.home}>
        Back home
      </Link>
      <nav aria-label="Helpful links">
        <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          <li><Link href={routes.search}>Search</Link></li>
          <li><Link href={routes.categories}>Categories</Link></li>
          <li><Link href={routes.city}>Cities</Link></li>
          <li><Link href={routes.blog}>Blog</Link></li>
          <li><Link href={routes.sitemap}>Sitemap</Link></li>
        </ul>
      </nav>
    </main>
  );
}

import Link from "next/link";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Page not found</h1>
      <p>The page you requested may have moved into the new Next.js route structure.</p>
      <Link className="button button--primary" href={routes.home}>
        Back home
      </Link>
    </main>
  );
}

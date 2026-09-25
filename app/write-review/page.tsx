import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/directory/PageHero";
import { routes } from "@/lib/routes";

export default function WriteReviewPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Reviews" }]} />
      <PageHero
        title="Public reviews are not open yet"
        subtitle="Review submission will remain unavailable until reviewer identity, moderation, abuse prevention and visible evidence are implemented end to end."
        cta={{ label: "Read our publication method", href: routes.directoryMethodology }}
        secondary={{ label: "Browse businesses", href: routes.categories }}
      />
      <section className="section">
        <div className="container answer-summary">
          <h2>Why reviews are paused</h2>
          <p>
            NepaliDirectory does not publish ratings without genuine, approved first-party reviews
            shown on the same business profile. This page will reopen only when that standard can
            be enforced consistently.
          </p>
          <Link href={routes.contact}>Report a listing correction instead</Link>
        </div>
      </section>
    </main>
  );
}

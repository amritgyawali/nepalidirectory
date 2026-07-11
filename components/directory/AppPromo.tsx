import { Apple, Play } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";

export function AppPromo() {
  return (
    <section className="section section--soft app-promo">
      <div className="container app-promo__grid">
        <div className="phone-stack" aria-hidden>
          <div className="phone phone--left">
            <span />
            <div />
            <div />
            <div />
          </div>
          <div className="phone phone--right">
            <span />
            <div />
            <div />
            <div />
          </div>
        </div>
        <div>
          <p className="eyebrow">Available on mobile</p>
          <h2>Take Nepali Directory with you. It&apos;s free.</h2>
          <p>
            Search directory profiles on the go. Save favourites, read reviews and get directions
            from one clean mobile experience.
          </p>
          <div className="app-promo__buttons">
            <Link className="store-button" href={routes.getApp}>
              <Play size={22} fill="currentColor" aria-hidden />
              <span>
                <small>GET IT ON</small>
                Google Play
              </span>
            </Link>
            <Link className="store-button" href={routes.getApp}>
              <Apple size={22} fill="currentColor" aria-hidden />
              <span>
                <small>Download on the</small>
                App Store
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

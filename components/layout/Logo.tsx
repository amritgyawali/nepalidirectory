import Link from "next/link";
import { routes } from "@/lib/routes";

type LogoProps = {
  inverted?: boolean;
};

export function Logo({ inverted = false }: LogoProps) {
  return (
    <Link className="logo" href={routes.home} aria-label="Nepali Directory home">
      <span className="logo__mark">ND</span>
      <span className="logo__text" data-inverted={inverted}>
        Nepali
        <br />
        <span>Directory</span>
      </span>
    </Link>
  );
}

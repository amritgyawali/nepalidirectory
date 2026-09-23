import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FillImage } from "@/components/ui/FillImage";

type CityCardProps = {
  name: string;
  listings: string;
  image: string;
  href: string;
};

export function CityCard({ name, listings, image, href }: CityCardProps) {
  return (
    <Link className="city-card" href={href}>
      <FillImage src={image} alt={name} sizes="(max-width: 1040px) 50vw, 240px" />
      <span className="city-card__shade" />
      <span className="city-card__content">
        <strong>{name}</strong>
        <span>{listings}</span>
      </span>
      <ArrowUpRight className="city-card__arrow" size={18} aria-hidden />
    </Link>
  );
}

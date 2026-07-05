import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { FillImage } from "@/components/ui/FillImage";

type GuideCardProps = {
  href: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  meta?: string;
  dateTime?: string;
  actionLabel?: string;
  className?: string;
  sizes?: string;
};

export function GuideCard({
  href,
  title,
  category,
  excerpt,
  image,
  imageAlt,
  meta,
  dateTime,
  actionLabel,
  className = "",
  sizes = "(max-width: 1040px) 100vw, 360px"
}: GuideCardProps) {
  const classes = ["article-card", className].filter(Boolean).join(" ");

  return (
    <Link className={classes} href={href}>
      <span className="article-card__image">
        <FillImage src={image} alt={imageAlt} sizes={sizes} />
      </span>
      <span>{category}</span>
      <h3>{title}</h3>
      <p>{excerpt}</p>
      {meta ? (
        <small>
          {dateTime ? (
            <time dateTime={dateTime}>{meta}</time>
          ) : (
            <>
              <Clock size={13} aria-hidden />
              {meta}
            </>
          )}
        </small>
      ) : null}
      {actionLabel ? (
        <strong>
          {actionLabel} <ArrowRight size={15} aria-hidden />
        </strong>
      ) : null}
    </Link>
  );
}

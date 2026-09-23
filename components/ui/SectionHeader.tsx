import { ArrowRight } from "lucide-react";
import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  id?: string;
  eyebrow?: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
};

export function SectionHeader({ title, id, eyebrow, description, action }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={id}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href}>
          {action.label}
          <ArrowRight size={15} aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}

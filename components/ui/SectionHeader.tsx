import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
};

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <Link href={action.href}>{action.label}</Link> : null}
    </div>
  );
}

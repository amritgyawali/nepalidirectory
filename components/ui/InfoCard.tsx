import type { LucideIcon } from "lucide-react";

type InfoCardProps = {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
};

export function InfoCard({ title, children, icon: Icon }: InfoCardProps) {
  return (
    <section className="info-card">
      <div className="info-card__title">
        {Icon ? <Icon size={18} aria-hidden /> : null}
        <h2>{title}</h2>
      </div>
      <div className="info-card__body">{children}</div>
    </section>
  );
}

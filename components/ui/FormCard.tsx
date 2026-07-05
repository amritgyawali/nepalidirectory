import Link from "next/link";

type Field = {
  label: string;
  type?: string;
  placeholder?: string;
};

type FormCardProps = {
  title: string;
  description: string;
  fields: Field[];
  submitLabel: string;
  helperLink?: { label: string; href: string };
  embedded?: boolean;
};

export function FormCard({ title, description, fields, submitLabel, helperLink, embedded = false }: FormCardProps) {
  const form = (
    <form className={embedded ? "auth-card auth-card--embedded" : "auth-card"}>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="auth-card__fields">
        {fields.map((field) => (
          <label key={field.label}>
            <span>{field.label}</span>
            <input type={field.type ?? "text"} placeholder={field.placeholder} />
          </label>
        ))}
      </div>
      <button className="button button--primary" type="button">
        {submitLabel}
      </button>
      {helperLink ? <Link href={helperLink.href}>{helperLink.label}</Link> : null}
    </form>
  );

  if (embedded) {
    return form;
  }

  return <main className="auth-wrap">{form}</main>;
}

import { serializeJsonLd } from "@/lib/seo";

/**
 * Renders one or more schema.org nodes as a single JSON-LD script. Null entries are dropped so
 * callers can pass conditional nodes inline.
 */
export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const nodes = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!nodes.length) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(nodes.length === 1 ? nodes[0] : nodes) }}
    />
  );
}

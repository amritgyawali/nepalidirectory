export type RichTextSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

/** Parse only safe same-site Markdown links. Raw HTML and external URLs remain inert text. */
export function parseInternalMarkdownLinks(value: string): RichTextSegment[] {
  const pattern = /\[([^\]\n]{1,120})\]\((\/(?!\/)[^)\s]+)\)/g;
  const segments: RichTextSegment[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(value)) !== null) {
    if (match.index > cursor) segments.push({ type: "text", value: value.slice(cursor, match.index) });
    segments.push({ type: "link", label: match[1], href: match[2] });
    cursor = match.index + match[0].length;
  }
  if (cursor < value.length) segments.push({ type: "text", value: value.slice(cursor) });
  return segments.length ? segments : [{ type: "text", value }];
}

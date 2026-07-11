import Link from "next/link";
import { parseInternalMarkdownLinks } from "@/lib/markdown-links";

export function SafeRichParagraph({ children }: { children: string }) {
  return (
    <p>
      {parseInternalMarkdownLinks(children).map((segment, index) =>
        segment.type === "link" ? (
          <Link href={segment.href} key={`${segment.href}-${index}`}>{segment.label}</Link>
        ) : (
          <span key={`text-${index}`}>{segment.value}</span>
        ),
      )}
    </p>
  );
}

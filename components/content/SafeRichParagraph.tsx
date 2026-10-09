import Link from "next/link";
import { isLiveHubHref, type IndexableHubSlugs } from "@/lib/hub-links";
import { parseInternalMarkdownLinks } from "@/lib/markdown-links";

/**
 * With `hubs`, a link to a city/category hub that is not published (it would 404) renders as
 * plain text, so article copy never sends crawlers to a "Not found (404)" URL.
 */
export function SafeRichParagraph({ children, hubs }: { children: string; hubs?: IndexableHubSlugs }) {
  return (
    <p>
      {parseInternalMarkdownLinks(children).map((segment, index) =>
        segment.type === "link" && (!hubs || isLiveHubHref(segment.href, hubs)) ? (
          <Link href={segment.href} key={`${segment.href}-${index}`}>{segment.label}</Link>
        ) : (
          <span key={`text-${index}`}>{segment.type === "link" ? segment.label : segment.value}</span>
        ),
      )}
    </p>
  );
}

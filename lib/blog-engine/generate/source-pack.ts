/**
 * Generation pass 1 — source pack (prompt §8.4.1): fetch the top 3-5 cluster item URLs, extract
 * main text, truncate each to ~1500 chars, and join into a SOURCES block. Tolerant of individual
 * fetch failures (a source that 404s just drops out of the pack).
 */
import type { FetchFn } from "../../ai-core/providers/http";
import { extractMainText } from "../../acquire";
import type { TrendItem } from "../types";

export type SourcePack = { text: string; urls: string[] };

export async function buildSourcePack(
  items: TrendItem[],
  fetchFn: FetchFn = fetch,
  maxItems = 5,
): Promise<SourcePack> {
  const candidates = items.slice(0, maxItems);
  const parts: string[] = [];
  const urls: string[] = [];

  for (const item of candidates) {
    try {
      const res = await fetchFn(item.url, { headers: { "user-agent": "NepaliDirectoryBot/1.0" } });
      if (!res.ok) continue;
      const html = await res.text();
      const text = extractMainText(html, 1500);
      if (!text) continue;
      parts.push(`SOURCE (${item.url}):\n${item.title}\n${text}`);
      urls.push(item.url);
    } catch {
      // tolerant — one broken source URL should not fail the whole pack
    }
  }

  // Fall back to headline + summary when nothing was crawlable (still grounded, just thinner).
  if (parts.length === 0) {
    for (const item of candidates) {
      parts.push(`SOURCE (${item.url}):\n${item.title}\n${item.summary ?? ""}`);
      urls.push(item.url);
    }
  }

  return { text: parts.join("\n\n"), urls };
}

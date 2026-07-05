/**
 * HTML extraction (prompt sec. 6.4): main text + JSON-LD. Lightweight regex/DOM-free extraction
 * (no jsoup/cheerio dependency) — enough to feed the ATTRIBUTE_EXTRACT prompt.
 */

/** Parse all <script type="application/ld+json"> blocks; skips malformed ones. */
export function extractJsonLd(html: string): unknown[] {
  const out: unknown[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      out.push(JSON.parse(m[1].trim()));
    } catch {
      // ignore invalid JSON-LD
    }
  }
  return out;
}

/** Strip scripts/styles/tags to plain visible text, collapse whitespace, and truncate. */
export function extractMainText(html: string, maxChars = 1500): string {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxChars ? text.slice(0, maxChars) : text;
}

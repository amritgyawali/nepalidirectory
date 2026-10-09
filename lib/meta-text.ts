/** Brand suffix the root layout's title template appends to every page title. */
export const TITLE_SUFFIX = " | Nepali Directory";
/** Google shows roughly 600px of a title (about 60 characters) before truncating it. */
export const MAX_TITLE_LENGTH = 60;
/** Google usually shows about 155-160 characters of a meta description. */
export const MAX_DESCRIPTION_LENGTH = 160;

/**
 * A page title for Next.js metadata. Short titles keep the brand suffix from the root template;
 * titles that would be truncated with it are emitted as-is, so the topic words stay visible in
 * search results instead of the brand pushing them past the cut-off.
 */
export function seoTitle(title: string): string | { absolute: string } {
  return `${title}${TITLE_SUFFIX}`.length <= MAX_TITLE_LENGTH ? title : { absolute: title };
}

/** The final document title `seoTitle()` produces, for og:title/twitter:title. */
export function fullSeoTitle(title: string): string {
  const value = seoTitle(title);
  return typeof value === "string" ? `${value}${TITLE_SUFFIX}` : value.absolute;
}

/**
 * Shortens a meta description to Google's display length at a natural boundary (sentence, then
 * clause, then word) so the snippet ends cleanly instead of being cut mid-word with an ellipsis.
 */
export function metaDescription(text: string, max = MAX_DESCRIPTION_LENGTH): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const head = clean.slice(0, max);
  const sentenceEnd = Math.max(head.lastIndexOf(". "), head.lastIndexOf("? "), head.lastIndexOf("! "));
  if (sentenceEnd >= max * 0.6) return head.slice(0, sentenceEnd + 1);
  const clauseEnd = Math.max(head.lastIndexOf(", "), head.lastIndexOf("; "), head.lastIndexOf(": "));
  if (clauseEnd >= max * 0.6) return `${head.slice(0, clauseEnd).replace(/\s+(and|or|with|for|to|the|a|an)$/i, "")}.`;
  const wordEnd = head.slice(0, max - 1).lastIndexOf(" ");
  return `${head.slice(0, wordEnd > 0 ? wordEnd : max - 1).replace(/[\s,;:]+$/, "")}…`;
}

/**
 * The best snippet among candidate descriptions: the first that fits Google's display length,
 * otherwise the first candidate shortened at a natural boundary.
 */
export function pickMetaDescription(...candidates: Array<string | undefined>): string {
  const usable = candidates.map((value) => value?.replace(/\s+/g, " ").trim()).filter((value): value is string => Boolean(value));
  return usable.find((value) => value.length >= 70 && value.length <= MAX_DESCRIPTION_LENGTH) ?? metaDescription(usable[0] ?? "");
}

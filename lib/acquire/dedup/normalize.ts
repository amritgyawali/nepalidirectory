/**
 * Normalization for entity resolution (prompt sec. 6.6). Phone normalization strips the Nepal
 * country code (+977) and a leading trunk 0 so "+977 9812-345678", "9779812345678" and
 * "09812345678" all compare equal.
 */

export function normalizePhone(raw: string | undefined | null): string {
  if (!raw) return "";
  let digits = raw.replace(/\D+/g, "");
  if (digits.startsWith("977")) digits = digits.slice(3);
  digits = digits.replace(/^0+/, "");
  return digits;
}

/** Lowercase, strip punctuation, collapse whitespace — the base for trigram similarity. */
export function normalizeName(raw: string | undefined | null): string {
  if (!raw) return "";
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9ऀ-ॿ\s]/g, " ") // keep latin, digits, Devanagari
    .replace(/\s+/g, " ")
    .trim();
}

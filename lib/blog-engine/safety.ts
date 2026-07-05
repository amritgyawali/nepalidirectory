/**
 * Brand-safety hard filter (prompt §8.3): a business directory must not monetize tragedy. This
 * runs in code, BEFORE the TREND_SELECTOR_V1 prompt even sees the cluster — the AI selector is a
 * second, softer gate on top of this one. Configurable via `BRAND_SAFETY_BLOCKLIST` (comma-
 * separated extra terms, ORed into the default patterns).
 */

const DEFAULT_BLOCKLIST: RegExp[] = [
  /\belection[s]?\b/i,
  /\b(prime minister|parliament|political party|politic(s|al))\b/i,
  /\b(death|dies|dead|killed|fatal|casualt(y|ies))\b/i,
  /\b(accident|crash|collision|derail)\b/i,
  /\b(disaster|earthquake|flood victim|landslide victim)\b/i,
  /\b(crime|murder|rape|assault|arrest(ed)?|robbery)\b/i,
  /\b(communal|religious conflict|riot|clash)\b/i,
  /\b(porn|adult content|nsfw|explicit)\b/i,
];

function extraPatterns(): RegExp[] {
  const raw = process.env.BRAND_SAFETY_BLOCKLIST;
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => new RegExp(s, "i"));
}

/** true = safe to proceed; false = blocked by the hard filter. */
export function isBrandSafe(text: string): boolean {
  const patterns = [...DEFAULT_BLOCKLIST, ...extraPatterns()];
  return !patterns.some((re) => re.test(text));
}

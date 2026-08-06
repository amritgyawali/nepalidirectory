/**
 * One unambiguous date format for every public surface (audit sec. 6).
 *
 * `toLocaleDateString("en-NP")` renders 6 August 2026 as "8/6/2026" — read as 8 June by most of
 * the world and as 6 August by the rest. A "last checked" date that half the audience misreads is
 * worse than useless on a page whose whole argument is freshness, so dates are always spelled out.
 */
const directoryDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function toDate(value: Date | string | number | null | undefined): Date | null {
  if (value == null) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "6 August 2026", or undefined when the value is missing or unparseable. */
export function formatDirectoryDate(
  value: Date | string | number | null | undefined,
): string | undefined {
  const date = toDate(value);
  return date ? directoryDateFormat.format(date) : undefined;
}

/** Machine-readable ISO date for a `<time dateTime>` attribute. */
export function toIsoDate(
  value: Date | string | number | null | undefined,
): string | undefined {
  return toDate(value)?.toISOString();
}

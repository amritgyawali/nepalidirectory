/**
 * Time helpers. NPT (Nepal) is UTC+05:45 with no DST (prompt: APP_TIMEZONE=Asia/Kathmandu).
 */

const NPT_OFFSET_MIN = 5 * 60 + 45; // +05:45

/**
 * The next occurrence of 00:15 NPT strictly after `now` (prompt §5.2: budget-exhausted jobs
 * re-run "tomorrow 00:15 NPT"). Computed via fixed offset (Nepal has no DST).
 */
export function nextMidnight0015NPT(now: Date = new Date()): Date {
  const offsetMs = NPT_OFFSET_MIN * 60_000;
  // Shift into "NPT wall-clock" space, floor to the day, add 1 day + 15 min, shift back to UTC.
  const nptNow = new Date(now.getTime() + offsetMs);
  const y = nptNow.getUTCFullYear();
  const m = nptNow.getUTCMonth();
  const d = nptNow.getUTCDate();
  let target = Date.UTC(y, m, d, 0, 15, 0, 0) - offsetMs; // 00:15 NPT today, in UTC ms
  if (target <= now.getTime()) target += 24 * 60 * 60_000; // already passed → tomorrow
  return new Date(target);
}

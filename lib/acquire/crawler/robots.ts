/**
 * Minimal robots.txt parser + matcher (prompt sec. 6.4: "respect robots.txt"). Selects the most
 * specific matching User-agent group (falling back to `*`) and applies longest-match Allow/Disallow
 * with `*`/`$` wildcard support. Not a full RFC 9309 implementation, but conservative: it errs
 * toward disallowing when a Disallow matches.
 */

export type RobotsGroup = { agents: string[]; allow: string[]; disallow: string[] };

export function parseRobots(txt: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | null = null;
  let lastWasAgent = false;

  for (const rawLine of txt.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();

    if (field === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], allow: [], disallow: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else if (field === "allow" && current) {
      current.allow.push(value);
      lastWasAgent = false;
    } else if (field === "disallow" && current) {
      current.disallow.push(value);
      lastWasAgent = false;
    } else {
      lastWasAgent = false;
    }
  }
  return groups;
}

function ruleToRegex(rule: string): RegExp {
  const anchoredEnd = rule.endsWith("$");
  const body = anchoredEnd ? rule.slice(0, -1) : rule;
  const escaped = body.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escaped}${anchoredEnd ? "$" : ""}`);
}

function pickGroup(groups: RobotsGroup[], userAgent: string): RobotsGroup | null {
  const ua = userAgent.toLowerCase();
  let specific: RobotsGroup | null = null;
  let wildcard: RobotsGroup | null = null;
  for (const g of groups) {
    for (const a of g.agents) {
      if (a === "*") wildcard = g;
      else if (ua.includes(a) || a.includes(ua.split("/")[0])) specific = g;
    }
  }
  return specific ?? wildcard;
}

/** True if `userAgent` may fetch `path` under `groups`. Empty rule set = allowed. */
export function isAllowed(groups: RobotsGroup[], userAgent: string, path: string): boolean {
  const group = pickGroup(groups, userAgent);
  if (!group) return true;

  let bestAllow = -1;
  let bestDisallow = -1;
  for (const rule of group.allow) {
    if (rule && ruleToRegex(rule).test(path)) bestAllow = Math.max(bestAllow, rule.length);
  }
  for (const rule of group.disallow) {
    if (rule === "") continue; // "Disallow:" (empty) means allow all
    if (ruleToRegex(rule).test(path)) bestDisallow = Math.max(bestDisallow, rule.length);
  }
  if (bestDisallow < 0) return true;
  return bestAllow >= bestDisallow; // Allow wins ties (spec)
}

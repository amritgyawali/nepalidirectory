#!/usr/bin/env node
/**
 * Ping IndexNow (Bing, Yandex, Seznam, Naver — and through Bing, ChatGPT search and Copilot) about
 * changed URLs. Run only after the pages are live in production, or engines will fetch a 404.
 *
 *   node scripts/indexnow-submit.mjs                       # the wedding-photographer city pages
 *   node scripts/indexnow-submit.mjs /blog/a /blog/b ...   # specific paths or absolute URLs
 *   node scripts/indexnow-submit.mjs --dry-run             # print the payload, send nothing
 *
 * The key is read from lib/seo-config.ts so it can never drift from the verification file the app
 * serves at /<key>.txt.
 */
import { readFileSync } from "node:fs";

const SITE = "https://www.nepalidirectory.com";
const CITIES = [
  "kathmandu", "pokhara", "lalitpur", "bhaktapur", "chitwan",
  "butwal", "biratnagar", "dharan", "birgunj", "nepalgunj",
];

const config = readFileSync(new URL("../lib/seo-config.ts", import.meta.url), "utf8");
const key = config.match(/indexNowKey\s*=\s*"([a-f0-9]{8,128})"/)?.[1];
if (!key) {
  console.error("Could not read indexNowKey from lib/seo-config.ts");
  process.exit(1);
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const paths = args.filter((arg) => arg !== "--dry-run");
const defaults = CITIES.flatMap((city) => [
  `/blog/best-wedding-photographers-in-${city}`,
  `/blog/best-wedding-photographer-${city}`,
]).concat(["/blog", "/llms.txt", "/llms-full.txt", "/sitemap-blog.xml"]);

const host = new URL(SITE).hostname;
const urlList = [...new Set((paths.length ? paths : defaults).map((value) => new URL(value, `${SITE}/`)))]
  .filter((url) => url.hostname === host)
  .map((url) => url.toString());

const payload = { host, key, keyLocation: `${SITE}/${key}.txt`, urlList };

if (dryRun) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(15_000),
});
console.log(`IndexNow ${response.status} for ${urlList.length} URLs`);
if (!(response.ok || response.status === 202)) {
  console.error(await response.text());
  process.exit(1);
}

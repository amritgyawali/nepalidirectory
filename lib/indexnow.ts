import { siteUrl } from "@/lib/blog";
import { indexNowKey } from "@/lib/seo-config";

export type IndexNowResult = { submitted: boolean; count: number; status?: number; reason?: string };

export async function submitIndexNow(urls: string[]): Promise<IndexNowResult> {
  if (process.env.NODE_ENV !== "production" || process.env.INDEXNOW_ENABLED === "false") {
    return { submitted: false, count: 0, reason: "IndexNow disabled outside production." };
  }

  const canonicalHost = new URL(siteUrl).hostname;
  const urlList = [...new Set(urls)]
    .map((value) => new URL(value, `${siteUrl}/`))
    .filter((url) => url.protocol === "https:" && url.hostname === canonicalHost)
    .map((url) => url.toString())
    .slice(0, 10_000);
  if (!urlList.length) return { submitted: false, count: 0, reason: "No canonical URLs supplied." };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: canonicalHost,
        key: indexNowKey,
        keyLocation: `${siteUrl}/${indexNowKey}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    return {
      submitted: response.ok || response.status === 202,
      count: urlList.length,
      status: response.status,
      reason: response.ok || response.status === 202 ? undefined : `IndexNow returned ${response.status}.`,
    };
  } catch (error) {
    return {
      submitted: false,
      count: urlList.length,
      reason: error instanceof Error ? error.message : "IndexNow request failed.",
    };
  }
}

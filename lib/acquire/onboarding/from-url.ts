/**
 * AI-assisted onboarding from a URL (prompt sec. 6.3, Tier 3). Owner pastes their website / public
 * page URL -> polite crawler fetches (robots-respected) -> ATTRIBUTE_EXTRACT pulls structured
 * fields -> a pre-filled draft the owner edits/approves (saved later with data_source='owner').
 * This function does the fetch+extract; it does NOT persist (the owner must approve first).
 */
import type { ProviderRegistry, PromptRegistry } from "../../ai-core";
import { parseJsonResponse } from "../../ai-core";
import type { Crawler } from "../crawler/crawler";

export type OnboardingDeps = {
  crawler: Crawler;
  prompts: PromptRegistry;
  providers: ProviderRegistry;
  siteName: string;
};

export type OnboardingDraft = {
  url: string;
  allowed: boolean;
  fromCache: boolean;
  phone?: string;
  website: string;
  hours?: string;
  services: string[];
  attributes: Record<string, unknown>;
  sourceTextLength: number;
};

export async function onboardingFromUrl(url: string, deps: OnboardingDeps): Promise<OnboardingDraft> {
  const crawl = await deps.crawler.fetchListingUrl(url);
  if (!crawl.allowedByRobots) {
    return {
      url,
      allowed: false,
      fromCache: crawl.fromCache,
      website: url,
      services: [],
      attributes: {},
      sourceTextLength: 0,
    };
  }

  const template = deps.prompts.get("ATTRIBUTE_EXTRACT_V1");
  const rendered = deps.prompts.render("ATTRIBUTE_EXTRACT_V1", {
    site_name: deps.siteName,
    page_text: crawl.text,
    json_ld: JSON.stringify(crawl.jsonLd).slice(0, 2000),
  });

  const text = (
    await deps.providers.chain().completeJson(
      {
        taskKey: template.key,
        system: rendered.system,
        user: rendered.user,
        temperature: template.temperature,
        maxTokens: 500,
      },
      template.jsonSchema ?? "{}",
    )
  ).text;

  const extracted = parseJsonResponse(text) as {
    phone?: string;
    website?: string;
    hours?: string;
    services?: string[];
    attributes?: Record<string, unknown>;
  };

  return {
    url,
    allowed: true,
    fromCache: crawl.fromCache,
    phone: extracted.phone,
    website: extracted.website ?? url,
    hours: extracted.hours,
    services: Array.isArray(extracted.services) ? extracted.services : [],
    attributes: extracted.attributes ?? {},
    sourceTextLength: crawl.text.length,
  };
}

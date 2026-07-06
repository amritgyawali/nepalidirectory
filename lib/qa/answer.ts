/**
 * AI-generated answer for community Q&A (autonomy layer): every question gets an immediate,
 * grounded answer instead of waiting for a human. Same grounding contract as the concierge
 * (§9.3) — the model may only recommend businesses returned by our own search, never from memory.
 *
 * Upgrade path mirrors search/concierge: with a real provider configured (AI_ENABLED +
 * CONCIERGE_ENABLED) it writes a conversational answer via QA_ANSWER_V1; otherwise (or if the
 * provider errors) it falls back to the deterministic, zero-external-call public-AI floor so the
 * endpoint always answers. Asking a question also records a demand signal when nothing matches,
 * feeding the admin queue and blog topic pipeline just like search does.
 */
import { loadAiConfig } from "../ai-core";
import type { Listing } from "../enrich";
import { getDefaultDiscoverRuntime } from "../discover";
import { localAutopilotSearch, type PublicAiListing } from "../public-ai";

export type QaSourceListing = {
  id: number;
  slug: string;
  name: string;
  area: string;
  neighborhood?: string;
  categories: string[];
  phone?: string;
  website?: string;
  href: string;
};

export type QaAnswer = {
  question: string;
  answer: string;
  mode: "provider" | "free-local";
  listings: QaSourceListing[];
  followups: string[];
};

function href(slug: string, name: string): string {
  return `/search?q=${encodeURIComponent(name || slug)}`;
}

function fromListing(l: Listing): QaSourceListing {
  return {
    id: l.id,
    slug: l.slug,
    name: l.name,
    area: l.area,
    neighborhood: l.neighborhood,
    categories: l.categories,
    phone: l.phone,
    website: l.website,
    href: href(l.slug, l.name),
  };
}

function fromPublic(l: PublicAiListing): QaSourceListing {
  return {
    id: l.id,
    slug: l.slug,
    name: l.name,
    area: l.area,
    neighborhood: l.neighborhood,
    categories: l.categories,
    phone: l.phone,
    website: l.website,
    href: l.href ?? href(l.slug, l.name),
  };
}

/** Compact projection handed to the model — only fields it is allowed to reference. */
function forPrompt(listings: QaSourceListing[]): Array<Record<string, unknown>> {
  return listings.map((l) => ({
    name: l.name,
    area: l.area,
    neighborhood: l.neighborhood,
    categories: l.categories,
    phone: l.phone,
    website: l.website,
  }));
}

export async function answerQuestion(question: string): Promise<QaAnswer> {
  const trimmed = question.trim();
  const config = loadAiConfig();

  // Deterministic baseline: always available, zero external calls, and the source of follow-ups.
  const floor = localAutopilotSearch(trimmed, undefined, 5);
  const floorListings = floor.listings.map(fromPublic);

  if (config.enabled && config.conciergeEnabled) {
    try {
      const runtime = getDefaultDiscoverRuntime();
      const { results } = await runtime.search(trimmed, 5);
      const listings = results.length ? results.map((r) => fromListing(r.listing)) : floorListings;

      const template = runtime.prompts.get("QA_ANSWER_V1");
      const rendered = runtime.prompts.render("QA_ANSWER_V1", {
        site_name: runtime.config.siteName,
        question: trimmed,
        results_json: JSON.stringify(forPrompt(listings)),
      });
      const { text } = await runtime.providers.chain().complete({
        taskKey: template.key,
        system: rendered.system,
        user: rendered.user,
        temperature: template.temperature,
        maxTokens: 320,
      });

      const answer = text.trim();
      if (answer) {
        return { question: trimmed, answer, mode: "provider", listings, followups: floor.followups };
      }
    } catch {
      // fall through to the deterministic floor below
    }
  }

  return {
    question: trimmed,
    answer: floor.message,
    mode: "free-local",
    listings: floorListings,
    followups: floor.followups,
  };
}

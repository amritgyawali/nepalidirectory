/**
 * ENRICH_LISTING handler (prompt §7): one AI call fills description/meta/FAQ/tags/category/
 * attributes from ONLY the listing's structured facts, writes provenance (`description_source
 * ='ai_v1'`, `ai_enriched_at`), recomputes quality_score, and enqueues a cheap EMBED_LISTING.
 *
 * Guardrails: owner-authored descriptions are never overwritten; low category_confidence keeps
 * the old category and flags for admin; invalid JSON gets one corrective retry then fails
 * (replayable); all-providers-over-budget re-queues to next-day 00:15 NPT.
 */
import type { JobHandler } from "../ai-core/worker";
import type { AiRequest, ProviderRegistry } from "../ai-core/types";
import type { PromptTemplate } from "../ai-core/prompts/types";
import type { RenderedPrompt } from "../ai-core/prompts/registry";
import { PromptRegistry } from "../ai-core/prompts/registry";
import { AllProvidersExhaustedError, JsonValidationError, RetryableAtError } from "../ai-core/errors";
import { nextMidnight0015NPT } from "../ai-core/time";
import { parseJsonResponse } from "../ai-core/json";
import type { ListingRepository } from "./types";
import { computeQualityScore } from "./quality";
import {
  buildFactsJson,
  buildTaxonomyJson,
  validateEnrichment,
  type EnrichmentOutput,
} from "./facts";

export type EnrichDeps = {
  listings: ListingRepository;
  prompts: PromptRegistry;
  siteName: string;
  taxonomy: string[];
  maxTokens?: number;
};

async function requestEnrichment(
  providers: ProviderRegistry,
  template: PromptTemplate,
  rendered: RenderedPrompt,
  maxTokens: number,
): Promise<EnrichmentOutput> {
  const schema = template.jsonSchema ?? "{}";
  const base: AiRequest = {
    taskKey: template.key,
    system: rendered.system,
    user: rendered.user,
    temperature: template.temperature,
    maxTokens,
  };

  let issues: string[] = [];
  let lastRaw = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const req: AiRequest =
      attempt === 0
        ? base
        : {
            ...base,
            user: `${base.user}\n\nPREVIOUS OUTPUT WAS INVALID: ${issues.join("; ")}. Return corrected JSON only.`,
          };

    let text: string;
    try {
      text = (await providers.chain().completeJson(req, schema)).text;
    } catch (err) {
      if (
        err instanceof AllProvidersExhaustedError &&
        err.reasons.length > 0 &&
        err.reasons.every((r) => r.endsWith(":budget"))
      ) {
        throw new RetryableAtError(nextMidnight0015NPT(), "all providers over budget; retry next day");
      }
      throw err;
    }
    lastRaw = text;

    let parsed: unknown;
    try {
      parsed = parseJsonResponse(text);
    } catch {
      issues = ["output was not valid JSON"];
      continue;
    }
    const validation = validateEnrichment(parsed);
    if (validation.ok) return validation.value;
    issues = validation.issues;
  }
  throw new JsonValidationError(issues, lastRaw);
}

export function makeEnrichListingHandler(deps: EnrichDeps): JobHandler {
  return async ({ job, providers, log, enqueue }) => {
    const listingId = Number((job.payload as { listingId?: unknown }).listingId);
    if (!Number.isFinite(listingId)) throw new Error("ENRICH_LISTING: payload.listingId required");

    const listing = await deps.listings.get(listingId);
    if (!listing) throw new Error(`ENRICH_LISTING: listing ${listingId} not found`);

    if (listing.descriptionSource === "owner") {
      log(`[enrich] skip ${listingId} (owner-authored)`);
      return { listingId, skipped: "owner" };
    }

    const template = deps.prompts.get("LISTING_ENRICH_V1");
    const rendered = deps.prompts.render("LISTING_ENRICH_V1", {
      site_name: deps.siteName,
      facts_json: buildFactsJson(listing),
      crawl_snippet: "",
      taxonomy_json: buildTaxonomyJson(deps.taxonomy),
    });

    const out = await requestEnrichment(providers, template, rendered, deps.maxTokens ?? 800);

    listing.description = out.description_en;
    listing.descriptionSource = "ai_v1";
    listing.aiEnrichedAt = new Date();
    listing.metaTitle = out.meta_title;
    listing.metaDescription = out.meta_description;
    listing.faqs = out.faqs.map((f) => ({ question: f.q, answer: f.a }));
    listing.tags = out.tags.slice(0, 8);
    listing.attributes = { ...listing.attributes, ...out.attributes };
    listing.categoryConfidence = out.category_confidence;

    if (out.category_confidence >= 0.6 && out.category_slug) {
      if (!listing.categories.includes(out.category_slug)) {
        listing.categories = [out.category_slug, ...listing.categories];
      }
      listing.needsCategoryReview = false;
    } else {
      listing.needsCategoryReview = true; // keep old category, flag for admin (§7)
    }

    listing.qualityScore = computeQualityScore(listing);
    await deps.listings.update(listing);

    await enqueue({ type: "EMBED_LISTING", payload: { listingId }, priority: 3 });

    log(`[enrich] listing ${listingId} → quality ${listing.qualityScore}`);
    return {
      listingId,
      qualityScore: listing.qualityScore,
      category: listing.categories[0],
      needsCategoryReview: Boolean(listing.needsCategoryReview),
      descriptionWords: out.description_en.trim().split(/\s+/).length,
    };
  };
}

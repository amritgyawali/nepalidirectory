/**
 * MERGE_ADJUDICATE handler (prompt sec. 6.6): for a 0.65–0.90 merge candidate, ask the AI
 * adjudicator (MERGE_ADJUDICATE_V1) whether the two records are the same/branch/distinct and
 * write its verdict + confidence back. The final decision stays with a human in the admin merge
 * queue (HARD RULE 10) — this handler never auto-merges.
 */
import type { JobHandler, PromptRegistry } from "../../ai-core";
import { parseJsonResponse } from "../../ai-core";
import type { Listing, ListingRepository } from "../../enrich/types";
import type { MergeCandidateRepository } from "../stores/merge-candidates";

export type MergeAdjudicateDeps = {
  listings: ListingRepository;
  mergeCandidates: MergeCandidateRepository;
  prompts: PromptRegistry;
  siteName: string;
};

function summarize(l: Listing) {
  return {
    name: l.name,
    phone: l.phone,
    area: l.area,
    district: l.district,
    ward: l.ward,
    categories: l.categories,
    address: l.address,
    coordinates: l.coordinates,
  };
}

const VERDICTS = ["same", "distinct", "branch"] as const;

export function makeMergeAdjudicateHandler(deps: MergeAdjudicateDeps): JobHandler {
  return async ({ job, providers }) => {
    const candidateId = Number((job.payload as { candidateId?: unknown }).candidateId);
    if (!Number.isFinite(candidateId)) throw new Error("MERGE_ADJUDICATE: payload.candidateId required");

    const mc = await deps.mergeCandidates.get(candidateId);
    if (!mc) throw new Error(`MERGE_ADJUDICATE: candidate ${candidateId} not found`);
    const a = await deps.listings.get(mc.aId);
    const b = await deps.listings.get(mc.bId);
    if (!a || !b) throw new Error(`MERGE_ADJUDICATE: candidate ${candidateId} missing listings`);

    const template = deps.prompts.get("MERGE_ADJUDICATE_V1");
    const rendered = deps.prompts.render("MERGE_ADJUDICATE_V1", {
      a_json: JSON.stringify(summarize(a)),
      b_json: JSON.stringify(summarize(b)),
      features_json: JSON.stringify(mc.features),
    });

    const text = (
      await providers.chain().completeJson(
        {
          taskKey: template.key,
          system: rendered.system,
          user: rendered.user,
          temperature: template.temperature,
          maxTokens: 300,
        },
        template.jsonSchema ?? "{}",
      )
    ).text;

    const parsed = parseJsonResponse(text) as { verdict?: unknown; confidence?: unknown; reason?: unknown };
    const verdict = VERDICTS.includes(parsed.verdict as (typeof VERDICTS)[number])
      ? (parsed.verdict as string)
      : "distinct";
    const confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0;

    await deps.mergeCandidates.update(candidateId, { aiVerdict: verdict, aiConfidence: confidence });
    return { candidateId, verdict, confidence, humanReviewRequired: true };
  };
}

/**
 * Generation pass 3 — fact-check (prompt §8.4.3, BLOG_FACTCHECK_V1): draft vs SOURCES. A
 * `revise` verdict gets exactly one auto-revision; still failing after that lands in REVIEW with
 * the claims attached — it is never auto-rejected or auto-published.
 */
import type { ProviderRegistry } from "../../ai-core/types";
import type { PromptRegistry } from "../../ai-core/prompts/registry";
import { completeParsedJson } from "../../ai-core/json";
import type { BlogPostFactcheck } from "../types";

export async function factCheck(
  providers: ProviderRegistry,
  prompts: PromptRegistry,
  sourcePack: string,
  bodyMarkdown: string,
): Promise<BlogPostFactcheck> {
  const template = prompts.get("BLOG_FACTCHECK_V1");
  const rendered = prompts.render("BLOG_FACTCHECK_V1", {
    source_pack: sourcePack,
    body_markdown: bodyMarkdown,
  });

  const parsed = (await completeParsedJson(
    providers,
    {
      taskKey: template.key,
      system: rendered.system,
      user: rendered.user,
      temperature: template.temperature,
      maxTokens: 600,
    },
    template.jsonSchema ?? "{}",
  )) as {
    verdict?: string;
    unsupported_claims?: { claim: string; why: string }[];
  };

  const unsupportedClaims = parsed.unsupported_claims ?? [];
  return {
    verdict: parsed.verdict?.toLowerCase() === "pass" || unsupportedClaims.length === 0 ? "pass" : "revise",
    unsupportedClaims,
  };
}

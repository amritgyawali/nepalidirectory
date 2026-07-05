import type { JobHandler, PromptRegistry } from "@/lib/ai-core";
import { parseJsonResponse, type ProviderRegistry } from "@/lib/ai-core";
import type { ListingRepository } from "@/lib/enrich";
import { getEvergreenPage } from "./evergreen";
import type { SeoPageIntroRepository } from "./stores";

export function makeEvergreenPageHandler(options: {
  prompts: PromptRegistry;
  providers: ProviderRegistry;
  siteName: string;
  seoPageIntros?: SeoPageIntroRepository;
}): JobHandler {
  return async ({ job }) => {
    const categorySlug = typeof job.payload.categorySlug === "string" ? job.payload.categorySlug : "";
    const citySlug = typeof job.payload.citySlug === "string" ? job.payload.citySlug : "";
    const page = getEvergreenPage(categorySlug, citySlug);
    if (!page) throw new Error(`evergreen page failed quality gates: ${categorySlug}/${citySlug}`);

    const rendered = options.prompts.render("CATEGORY_INTRO_V1", {
      site_name: options.siteName,
      category: page.categoryName,
      city: page.cityName,
      n: String(page.listingCount),
      localities: page.notableLocalities.join(", "),
      avg: page.averageRating.toFixed(1),
    });
    const result = await options.providers.chain().completeJson(
      {
        taskKey: "CATEGORY_INTRO_V1",
        system: rendered.system,
        user: rendered.user,
        temperature: rendered.template.temperature,
        maxTokens: 700,
      },
      rendered.template.jsonSchema ?? "{}",
    );
    const json = parseJsonResponse(result.text) as Record<string, unknown>;
    const introMd = typeof json.intro_md === "string" ? json.intro_md : "";
    const metaTitle = typeof json.meta_title === "string" ? json.meta_title : page.metaTitle;
    const metaDescription = typeof json.meta_description === "string" ? json.meta_description : page.metaDescription;
    if (introMd) {
      await options.seoPageIntros?.upsert({
        categorySlug,
        citySlug,
        introMd,
        metaTitle,
        metaDescription,
        listingCount: page.listingCount,
        averageQualityScore: page.qualityAverage,
        generatedAt: new Date(),
      });
    }
    return {
      categorySlug,
      citySlug,
      listingCount: page.listingCount,
      introGenerated: Boolean(introMd),
      metaTitle,
    };
  };
}

export function makeTranslateNeHandler(options: {
  listings: ListingRepository;
  prompts: PromptRegistry;
  providers: ProviderRegistry;
  siteName: string;
}): JobHandler {
  return async ({ job }) => {
    const listingId = typeof job.payload.listingId === "number" ? job.payload.listingId : null;
    if (!listingId) throw new Error("TRANSLATE_NE requires listingId");
    const listing = await options.listings.get(listingId);
    if (!listing) throw new Error(`listing not found: ${listingId}`);
    if (!listing.description) return { translated: false, reason: "missing English description", listingId };

    const rendered = options.prompts.render("TRANSLATE_NE_V1", {
      site_name: options.siteName,
      description_en: listing.description,
      faqs_json: JSON.stringify(listing.faqs),
    });
    const result = await options.providers.chain().completeJson(
      {
        taskKey: "TRANSLATE_NE_V1",
        system: rendered.system,
        user: rendered.user,
        temperature: rendered.template.temperature,
        maxTokens: 900,
      },
      rendered.template.jsonSchema ?? "{}",
    );
    const json = parseJsonResponse(result.text) as { description_ne?: unknown };
    if (typeof json.description_ne !== "string" || !json.description_ne.trim()) {
      throw new Error("TRANSLATE_NE returned no description_ne");
    }
    await options.listings.update({
      ...listing,
      descriptionNe: json.description_ne,
      descriptionNeUpdatedAt: new Date(),
    });
    return { translated: true, listingId };
  };
}

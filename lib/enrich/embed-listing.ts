/**
 * EMBED_LISTING handler (prompt §7): cheap job that embeds `name + category + description +
 * tags + locality` and stores the vector in `listing_embeddings`. Uses the embedding pipeline
 * (Ollama-first, §5.3), so it stays at ~$0.
 */
import type { JobHandler } from "../ai-core/worker";
import type { EmbeddingRepository, Listing, ListingRepository } from "./types";

export type EmbedDeps = {
  listings: ListingRepository;
  embeddings: EmbeddingRepository;
};

/** The text we embed (prompt §7). */
export function buildEmbeddingText(l: Listing): string {
  const locality = l.neighborhood ?? l.area;
  return [l.name, l.categories.join(" "), l.description ?? "", l.tags.join(" "), locality]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function makeEmbedListingHandler(deps: EmbedDeps): JobHandler {
  return async ({ job, providers, log }) => {
    const listingId = Number((job.payload as { listingId?: unknown }).listingId);
    if (!Number.isFinite(listingId)) throw new Error("EMBED_LISTING: payload.listingId required");

    const listing = await deps.listings.get(listingId);
    if (!listing) throw new Error(`EMBED_LISTING: listing ${listingId} not found`);

    const text = buildEmbeddingText(listing);
    const vector = await providers.embedder().embed(text);
    if (vector.length === 0) throw new Error(`EMBED_LISTING: empty embedding for listing ${listingId}`);

    await deps.embeddings.set(listingId, vector, providers.embedder().id());
    log(`[embed] listing ${listingId} → dim ${vector.length}`);
    return { listingId, dim: vector.length };
  };
}

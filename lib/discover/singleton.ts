/**
 * One discover runtime per process — same rationale as `lib/blog-engine/singleton.ts`: Next.js API
 * routes need to share the same in-memory listings/embeddings/logs a request handler creates fresh
 * would otherwise never see. Postgres-backed once `DATABASE_URL` is set; purely a dev/demo
 * convenience otherwise.
 */
import { createDiscoverRuntime, type DiscoverRuntime } from "./runtime";

let instance: DiscoverRuntime | null = null;

export function getDefaultDiscoverRuntime(): DiscoverRuntime {
  if (!instance) instance = createDiscoverRuntime();
  return instance;
}

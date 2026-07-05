/** sha256 hex — cache keys (prompt §5.2). Server-only (node:crypto). */
import { createHash } from "node:crypto";

export function sha256(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

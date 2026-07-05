import { defineConfig } from "vitest/config";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the `@/…` path alias (tsconfig paths) so tests can import app modules like `@/lib/*`.
// Only rewrites specifiers beginning with `@/` — scoped npm packages (`@scope/pkg`) are untouched.
const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: `${root}/` }],
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});

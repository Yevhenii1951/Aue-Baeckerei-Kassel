import { defineProject } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineProject({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    name: "integration",
    include: ["tests/integration/**/*.test.ts"],
    setupFiles: ["tests/integration/setup-env.ts"],
    // Integration files share one test database: each beforeAll runs
    // resetTestDatabase (DROP SCHEMA public CASCADE) and bootstrap_roles.sql,
    // which cannot take concurrent catalog locks. Sequential execution comes
    // from --no-file-parallelism in the test:integration npm script. Do not
    // drop that flag.
  },
});
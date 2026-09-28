import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import path from "node:path";
import { vi } from "vitest";

const envFile = path.join(process.cwd(), ".env.test.local");
if (existsSync(envFile)) {
  loadEnvFile(envFile);
}

// The `server-only` package throws when imported outside a React Server
// Component; the stores under test import it transitively.
vi.mock("server-only", () => ({}));

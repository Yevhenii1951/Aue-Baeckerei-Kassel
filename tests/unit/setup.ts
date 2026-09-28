// The `server-only` package throws when imported outside a React Server
// Component. Unit tests import modules that pull it in transitively, so stub
// it here once instead of per test file.
import { vi } from "vitest";

vi.mock("server-only", () => ({}));

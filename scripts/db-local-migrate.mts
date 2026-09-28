import { readFileSync } from "node:fs";
import { z } from "zod";
import { bootstrapRoles, runMigrations } from "../src/lib/db/runner.ts";

function localEnv(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    return readFileSync(new URL("../.env.local", import.meta.url), "utf8")
      .match(new RegExp(`^${name}=(.+)$`, "m"))?.[1]?.trim();
  } catch {
    return undefined;
  }
}

const environment = z.object({
  DATABASE_URL: z.string().min(1),
  DEV_DATABASE_NAME: z.string().min(1),
}).safeParse({
  DATABASE_URL: localEnv("DATABASE_URL"),
  DEV_DATABASE_NAME: localEnv("DEV_DATABASE_NAME"),
});

if (!environment.success) {
  throw new Error("DATABASE_URL and DEV_DATABASE_NAME are required for local migrations.");
}
const databaseUrl = environment.data.DATABASE_URL;
const devName = environment.data.DEV_DATABASE_NAME;

// A unix-socket DSN (postgresql://user@/db?host=/var/run/postgresql) has no
// host, so new URL() cannot parse it. Match the socket form first, then the
// host:port form. Anything else is refused, including remote hosts.
const socketForm = /^postgres(?:ql)?:\/\/[^/]+@\/([^?]+)\?host=[^&]+$/.exec(databaseUrl);
if (socketForm) {
  if (socketForm[1] !== devName) {
    throw new Error(`DATABASE_URL must target local database ${devName}.`);
  }
} else {
  let parsed: URL;
  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL is not a valid URL.");
  }
  if (
    !["localhost", "127.0.0.1", "::1"].includes(parsed.hostname) ||
    parsed.pathname !== `/${devName}`
  ) {
    throw new Error(`DATABASE_URL must target local database ${devName}.`);
  }
}

await bootstrapRoles(environment.data.DATABASE_URL);
const applied = await runMigrations(environment.data.DATABASE_URL);
console.log(`Local migrations applied: ${applied.length === 0 ? "none (all current)" : applied.join(", ")}`);

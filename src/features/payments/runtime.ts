import "server-only";
import { getServerPool } from "@/lib/db/serverPool";
import { createOrder } from "@/features/ordering/orderService";
import { serverEnv } from "@/lib/env/server";
import { assertEnvGroup, isEnvGroupEnabled } from "@/lib/env/groups";
import { createStripeCheckoutClient } from "./stripeClient";
import type { StartCheckoutDeps } from "./checkout";

export function createCheckoutRuntime(
  locale: string,
  returnPath: string,
): StartCheckoutDeps | null {
  if (!isEnvGroupEnabled("payments")) return null;

  assertEnvGroup("payments");

  const pool = getServerPool();
  const stripe = createStripeCheckoutClient();
  const baseUrl = serverEnv.URL;
  if (!pool || !stripe || !baseUrl) return null;

  return {
    stripe,
    baseUrl: baseUrl.replace(/\/$/, ""),
    locale,
    returnPath,
    createOrder: (input) => createOrder(pool, input),
  };
}

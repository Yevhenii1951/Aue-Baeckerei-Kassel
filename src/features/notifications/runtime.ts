import "server-only";
import { serverEnv } from "@/lib/env/server";
import { assertEnvGroup, isEnvGroupEnabled } from "@/lib/env/groups";
import { brevoSenderFromEnv, createBrevoAdapter } from "./brevo";
import {
  buildOrderConfirmation,
  type OrderConfirmationData,
} from "./orderConfirmation";

/**
 * Sends the order confirmation. Resolves even when delivery fails: the order
 * is already committed and the customer is already at Stripe, so a provider
 * outage must not become the customer's error.
 */
export async function sendOrderConfirmationIfEnabled(
  data: OrderConfirmationData,
): Promise<void> {
  if (!isEnvGroupEnabled("email")) return;

  assertEnvGroup("email");

  const sender = brevoSenderFromEnv(
    serverEnv.EMAIL_SENDER_NAME,
    serverEnv.EMAIL_SENDER_ADDRESS,
  );
  const apiKey = serverEnv.BREVO_API_KEY;
  if (!sender || !apiKey) return;

  const adapter = createBrevoAdapter(apiKey, sender);

  // The order number is stable, so a retry cannot produce a second mail.
  await adapter.send(buildOrderConfirmation(data), data.orderNumber);
}

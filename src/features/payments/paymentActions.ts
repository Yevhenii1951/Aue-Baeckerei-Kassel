"use server";

import type { CheckoutFormValues } from "@/features/ordering/checkout-form";
import { isEnvGroupEnabled } from "@/lib/env/groups";
import { createCheckoutRuntime } from "./runtime";
import { startCheckout, type StartCheckoutResult } from "./checkout";

export type StartStripeCheckoutResult = StartCheckoutResult;

export async function startStripeCheckoutAction(input: {
  cart: { productId: string; quantity: number }[];
  customer: CheckoutFormValues;
  locale: string;
  returnPath: string;
}): Promise<StartStripeCheckoutResult> {
  if (!isEnvGroupEnabled("payments")) {
    return {
      ok: false,
      code: "CHECKOUT_FAILED",
      message: "Online-Zahlung ist gerade nicht aktiviert.",
    };
  }

  const runtime = createCheckoutRuntime(input.locale, input.returnPath);
  if (!runtime) {
    return {
      ok: false,
      code: "CHECKOUT_FAILED",
      message: "Online-Zahlung ist gerade nicht verfügbar.",
    };
  }

  return startCheckout(runtime, { cart: input.cart, customer: input.customer });
}

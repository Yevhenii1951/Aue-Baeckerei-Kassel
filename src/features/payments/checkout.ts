import type { CreateOrderResult } from "@/features/ordering/orderService";
import type { StripeCheckoutClient } from "./stripeClient";

export type StartCheckoutInput = {
  cart: { productId: string; quantity: number }[];
  customer: unknown;
};

export type StartCheckoutDeps = {
  baseUrl: string;
  createOrder: (input: unknown) => Promise<CreateOrderResult>;
  locale: string;
  stripe: StripeCheckoutClient;
  returnPath: string;
};

export type StartCheckoutResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; code: "ORDER_FAILED" | "CHECKOUT_FAILED"; message: string };

/**
 * Creates the order first and hands its server-calculated total to Stripe.
 * The cart sent by the browser is only ever a list of product ids and
 * quantities: prices, discounts and delivery fees are resolved here.
 */
export async function startCheckout(
  deps: StartCheckoutDeps,
  input: StartCheckoutInput,
): Promise<StartCheckoutResult> {
  const order = await deps.createOrder({
    cart: input.cart,
    customer: input.customer,
  });

  if (!order.ok) {
    return { ok: false, code: "ORDER_FAILED", message: order.message };
  }

  const returnPath = `${deps.returnPath.replace(/\/$/, "")}`;

  try {
    const session = await deps.stripe.createCheckoutSession({
      lines: order.lines,
      deliveryFeeCents: order.deliveryFeeCents,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      locale: deps.locale,
      successUrl: `${deps.baseUrl}${returnPath}/erfolg?order=${encodeURIComponent(order.orderNumber)}`,
      cancelUrl: `${deps.baseUrl}${returnPath}?payment=cancelled`,
    });

    return { ok: true, checkoutUrl: session.url };
  } catch {
    return {
      ok: false,
      code: "CHECKOUT_FAILED",
      message: "Der Bezahlvorgang konnte nicht gestartet werden.",
    };
  }
}

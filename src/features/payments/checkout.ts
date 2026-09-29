import type { CheckoutFormValues } from "@/features/ordering/checkout-form";
import type { CreateOrderResult } from "@/features/ordering/orderService";
import { formatDate, type DeliveryTimeData } from "@/features/ordering/checkoutLabels";
import type { OrderConfirmationData } from "@/features/notifications/orderConfirmation";
import type { StripeCheckoutClient } from "./stripeClient";

export type StartCheckoutInput = {
  cart: { productId: string; quantity: number }[];
  customer: CheckoutFormValues;
};

export type StartCheckoutDeps = {
  baseUrl: string;
  createOrder: (input: unknown) => Promise<CreateOrderResult>;
  /**
   * Runs after the payment session exists. A throwing implementation must not
   * stop the customer: the order is already committed either way.
   */
  onOrderConfirmed?: (data: OrderConfirmationData) => Promise<void>;
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

    await notifyOrderConfirmed(deps.onOrderConfirmed, order, input.customer);

    return { ok: true, checkoutUrl: session.url };
  } catch {
    return {
      ok: false,
      code: "CHECKOUT_FAILED",
      message: "Der Bezahlvorgang konnte nicht gestartet werden.",
    };
  }
}

async function notifyOrderConfirmed(
  onOrderConfirmed: StartCheckoutDeps["onOrderConfirmed"],
  order: Extract<CreateOrderResult, { ok: true }>,
  customer: CheckoutFormValues,
): Promise<void> {
  if (!onOrderConfirmed) return;

  try {
    await onOrderConfirmed({
      orderNumber: order.orderNumber,
      customerName: customer.name,
      customerEmail: customer.email,
      mode: customer.mode,
      deliveryLabel:
        customer.mode === "delivery" ? germanDeliveryTimeLabel(customer) : null,
      lines: order.lines,
      subtotalCents: order.subtotalCents,
      deliveryFeeCents: order.deliveryFeeCents,
      totalCents: order.totalCents,
    });
  } catch {
    // The order is already stored and the customer is already at Stripe.
    // A failed confirmation must not undo either.
  }
}

// The confirmation email is a German business notification, so it formats the
// delivery window in German regardless of the locale the customer ordered in.
function germanDeliveryTimeLabel(data: DeliveryTimeData): string {
  if (data.express) {
    return "Express — in ca. 2 Std.";
  }

  const parts = data.deliverySlotId.split("-");
  const time = parts[parts.length - 1];

  return `${formatDate(data.deliveryDate, "de")}, ${time} Uhr`;
}

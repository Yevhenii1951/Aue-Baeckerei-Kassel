import "server-only";
import Stripe from "stripe";
import { serverEnv } from "@/lib/env/server";
import type { OrderLine } from "@/features/ordering/orderService";

export interface StripeCheckoutSessionInput {
  cancelUrl: string;
  deliveryFeeCents: number;
  lines: OrderLine[];
  locale: string;
  orderId: string;
  orderNumber: string;
  successUrl: string;
}

export interface StripeCheckoutSessionResult {
  id: string;
  url: string;
}

export interface StripeCheckoutClient {
  createCheckoutSession(
    input: StripeCheckoutSessionInput,
  ): Promise<StripeCheckoutSessionResult>;
}

export function createStripeCheckoutClient(): StripeCheckoutClient | null {
  const secretKey = serverEnv.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  const stripe = new Stripe(secretKey);

  return {
    async createCheckoutSession(input): Promise<StripeCheckoutSessionResult> {
      const paypalEnabled = serverEnv.STRIPE_PAYPAL_ENABLED === "true";
      const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
        paypalEnabled ? ["card", "paypal"] : ["card"];

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: paymentMethodTypes,
        locale: input.locale === "de" || input.locale === "en" ? input.locale : "de",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        client_reference_id: input.orderId,
        line_items: toLineItems(input.lines, input.deliveryFeeCents),
        metadata: {
          orderId: input.orderId,
          orderNumber: input.orderNumber,
        },
        payment_intent_data: {
          metadata: { orderId: input.orderId, orderNumber: input.orderNumber },
        },
      });

      if (!session.url) {
        throw new Error("Stripe Checkout returned no URL");
      }

      return { id: session.id, url: session.url };
    },
  };
}

function toLineItems(
  lines: OrderLine[],
  deliveryFeeCents: number,
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map(
    (line) => ({
      quantity: line.quantity,
      price_data: {
        currency: "eur",
        unit_amount: line.unitPriceCents,
        product_data: { name: line.name },
      },
    }),
  );

  if (deliveryFeeCents > 0) {
    items.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: deliveryFeeCents,
        product_data: { name: "Liefergebühr" },
      },
    });
  }

  return items;
}

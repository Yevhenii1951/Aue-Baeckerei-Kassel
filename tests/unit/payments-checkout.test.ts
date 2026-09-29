import { describe, expect, it, vi } from "vitest";
import { startCheckout, type StartCheckoutDeps } from "@/features/payments/checkout";
import { deliveryTimeLabel } from "@/features/ordering/checkoutLabels";
import type { CreateOrderResult } from "@/features/ordering/orderService";
import type { StripeCheckoutSessionInput } from "@/features/payments/stripeClient";

const customer = {
  name: "Max Mustermann",
  email: "max@example.de",
  phone: "0561 1234567",
  mode: "delivery" as const,
  deliveryDate: "2026-10-02",
  deliverySlotId: "slot-1-1000",
  express: false,
  payment: "stripe" as const,
  street: "Hauptstr. 1",
  zip: "34117",
  city: "Kassel",
  notes: "",
};

function orderResult(overrides: Partial<Extract<CreateOrderResult, { ok: true }>> = {}) {
  return {
    ok: true,
    orderId: "order-uuid",
    orderNumber: "ABE-2026-0042",
    subtotalCents: 1250,
    deliveryFeeCents: 450,
    totalCents: 1700,
    lines: [
      { name: "Hausbrot", unitPriceCents: 450, quantity: 2, lineTotalCents: 900 },
      { name: "Caffè Crema", unitPriceCents: 350, quantity: 1, lineTotalCents: 350 },
    ],
    ...overrides,
  } satisfies Extract<CreateOrderResult, { ok: true }>;
}

type Deps = StartCheckoutDeps & { createOrder: ReturnType<typeof vi.fn> };

function deps(
  order: CreateOrderResult,
  createCheckoutSession = vi
    .fn()
    .mockResolvedValue({ id: "cs_1", url: "https://checkout.stripe.test/cs_1" }),
) {
  const createOrder = vi.fn().mockResolvedValue(order);
  const value: Deps = {
    baseUrl: "https://aue-baeckerei.test",
    locale: "de",
    returnPath: "/de/kasse",
    stripe: { createCheckoutSession },
    createOrder,
  };

  return { value, createOrder, createCheckoutSession };
}

describe("startCheckout", () => {
  it("sends the order the server calculated, never the cart the client sent", async () => {
    const { value, createCheckoutSession } = deps(orderResult());

    const result = await startCheckout(value, {
      cart: [{ productId: "hausbrot", quantity: 2 }],
      customer,
    });

    expect(result).toEqual({ ok: true, checkoutUrl: "https://checkout.stripe.test/cs_1" });

    const session = createCheckoutSession.mock
      .calls[0][0] as StripeCheckoutSessionInput;
    expect(session.lines).toEqual([
      { name: "Hausbrot", unitPriceCents: 450, quantity: 2, lineTotalCents: 900 },
      { name: "Caffè Crema", unitPriceCents: 350, quantity: 1, lineTotalCents: 350 },
    ]);
    expect(session.deliveryFeeCents).toBe(450);
  });

  it("stops before Stripe when the order could not be created", async () => {
    const { value, createCheckoutSession } = deps({
      ok: false,
      code: "FULL_SLOT",
      message: "Dieser Lieferzeitraum ist leider ausgebucht.",
    });

    const result = await startCheckout(value, {
      cart: [{ productId: "hausbrot", quantity: 1 }],
      customer,
    });

    expect(result).toEqual({
      ok: false,
      code: "ORDER_FAILED",
      message: "Dieser Lieferzeitraum ist leider ausgebucht.",
    });
    expect(createCheckoutSession).not.toHaveBeenCalled();
  });

  it("builds success and cancel URLs that return to the checkout", async () => {
    const { value, createCheckoutSession } = deps(orderResult());

    await startCheckout(value, { cart: [{ productId: "hausbrot", quantity: 1 }], customer });

    const session = createCheckoutSession.mock
      .calls[0][0] as StripeCheckoutSessionInput;
    expect(session.successUrl).toBe(
      "https://aue-baeckerei.test/de/kasse/erfolg?order=ABE-2026-0042",
    );
    expect(session.cancelUrl).toBe(
      "https://aue-baeckerei.test/de/kasse?payment=cancelled",
    );
  });

  it("reports a failed session instead of throwing to the customer", async () => {
    const createCheckoutSession = vi
      .fn()
      .mockRejectedValue(new Error("Stripe is unreachable"));
    const { value } = deps(orderResult(), createCheckoutSession);

    const result = await startCheckout(value, {
      cart: [{ productId: "hausbrot", quantity: 1 }],
      customer,
    });

    expect(result).toEqual({
      ok: false,
      code: "CHECKOUT_FAILED",
      message: "Der Bezahlvorgang konnte nicht gestartet werden.",
    });
  });

  it("hands the server order to the confirmation callback", async () => {
    const onOrderConfirmed = vi.fn().mockResolvedValue(undefined);
    const { value } = deps(orderResult());
    value.onOrderConfirmed = onOrderConfirmed;

    await startCheckout(value, {
      cart: [{ productId: "hausbrot", quantity: 1 }],
      customer,
    });

    expect(onOrderConfirmed).toHaveBeenCalledWith({
      orderNumber: "ABE-2026-0042",
      customerName: "Max Mustermann",
      customerEmail: "max@example.de",
      mode: "delivery",
      deliveryLabel: deliveryTimeLabel(customer),
      lines: [
        { name: "Hausbrot", unitPriceCents: 450, quantity: 2, lineTotalCents: 900 },
        { name: "Caffè Crema", unitPriceCents: 350, quantity: 1, lineTotalCents: 350 },
      ],
      subtotalCents: 1250,
      deliveryFeeCents: 450,
      totalCents: 1700,
    });
  });

  it("still returns the checkout url when the confirmation email fails", async () => {
    const onOrderConfirmed = vi
      .fn()
      .mockRejectedValue(new Error("Brevo is down"));
    const { value } = deps(orderResult());
    value.onOrderConfirmed = onOrderConfirmed;

    const result = await startCheckout(value, {
      cart: [{ productId: "hausbrot", quantity: 1 }],
      customer,
    });

    expect(result).toEqual({ ok: true, checkoutUrl: "https://checkout.stripe.test/cs_1" });
    expect(onOrderConfirmed).toHaveBeenCalledOnce();
  });
});

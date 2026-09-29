import { describe, expect, it, vi } from "vitest";
import { buildOrderConfirmation } from "@/features/notifications/orderConfirmation";
import { formatEuroCents } from "@/lib/format";
import type { EmailAdapter } from "@/features/notifications/domain";

const order = {
  orderNumber: "ABE-2026-0042",
  customerName: "Max Mustermann",
  customerEmail: "max@example.de",
  mode: "delivery" as const,
  deliveryLabel: "2026-10-02, 10:00 Uhr",
  lines: [
    { name: "Hausbrot", unitPriceCents: 450, quantity: 2, lineTotalCents: 900 },
    { name: "Caffè Crema", unitPriceCents: 350, quantity: 1, lineTotalCents: 350 },
  ],
  subtotalCents: 1250,
  deliveryFeeCents: 450,
  totalCents: 1700,
};

function recordingAdapter(): EmailAdapter & { calls: [unknown, string][] } {
  const calls: [unknown, string][] = [];
  return {
    calls,
    send: async (message, idempotencyKey) => {
      calls.push([message, idempotencyKey]);
      return { providerMessageId: "<202609290000@example>" };
    },
  };
}

describe("order confirmation email", () => {
  it("addresses the customer and carries the server total", () => {
    const message = buildOrderConfirmation(order);

    expect(message.to).toBe("max@example.de");
    expect(message.subject).toBe("Deine Bestellung ABE-2026-0042");
    expect(message.text).toContain("Hallo Max Mustermann,");
    expect(message.text).toContain(`2 × Hausbrot — ${formatEuroCents(900, "de")}`);
    expect(message.text).toContain(`Liefergebühr: ${formatEuroCents(450, "de")}`);
    expect(message.text).toContain(`Gesamt: ${formatEuroCents(1700, "de")}`);
    expect(message.text).toContain("Lieferung: 2026-10-02, 10:00 Uhr");
  });

  it("omits the delivery fee for pickup orders", () => {
    const message = buildOrderConfirmation({
      ...order,
      mode: "pickup",
      deliveryLabel: null,
      deliveryFeeCents: 0,
      totalCents: 1250,
    });

    expect(message.text).not.toContain("Liefergebühr");
    expect(message.text).toContain("Abholung in der Bäckerei");
    expect(message.text).toContain(`Gesamt: ${formatEuroCents(1250, "de")}`);
  });

  it("escapes customer input in the html part", () => {
    const message = buildOrderConfirmation({
      ...order,
      customerName: '<script>alert("x")</script>',
    });

    expect(message.html).not.toContain("<script>");
    expect(message.html).toContain("&lt;script&gt;");
  });

  it("uses the order number as idempotency key so a retry cannot double-send", async () => {
    const adapter = recordingAdapter();
    const message = buildOrderConfirmation(order);

    await adapter.send(message, order.orderNumber);
    await adapter.send(message, order.orderNumber);

    expect(adapter.calls[0][1]).toBe("ABE-2026-0042");
    expect(adapter.calls[1][1]).toBe("ABE-2026-0042");
  });
});

describe("brevo adapter", () => {
  it("reports a provider outage instead of pretending to have sent", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    const { createBrevoAdapter } = await import("@/features/notifications/brevo");
    const adapter = createBrevoAdapter("test-key", {
      name: "Aue-Bäckerei Kassel",
      address: "backstube@example.test",
    });

    await expect(
      adapter.send(
        { to: "max@example.de", subject: "s", text: "t", html: "t" },
        "ABE-2026-0042",
      ),
    ).rejects.toThrow("Brevo delivery failed");

    vi.unstubAllGlobals();
  });

  it("rejects a response without a message id", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ unexpected: true }), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const { createBrevoAdapter } = await import("@/features/notifications/brevo");
    const adapter = createBrevoAdapter("test-key", {
      name: "Aue-Bäckerei Kassel",
      address: "backstube@example.test",
    });

    await expect(
      adapter.send(
        { to: "max@example.de", subject: "s", text: "t", html: "t" },
        "ABE-2026-0042",
      ),
    ).rejects.toThrow("Brevo response invalid");

    vi.unstubAllGlobals();
  });
});

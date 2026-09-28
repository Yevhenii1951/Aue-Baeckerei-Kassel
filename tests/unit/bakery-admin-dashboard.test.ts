import { describe, expect, it } from "vitest";
import {
  demoOrders,
  orderTotalCents,
  sumRevenueCents,
  topProducts,
} from "@/features/bakery-admin/demoDashboard";

describe("admin dashboard derived values", () => {
  it("totals an order across items", () => {
    const order = demoOrders()[0];

    expect(order.items.length).toBe(2);

    const expected =
      order.items.reduce(
        (sum, item) => sum + item.quantity * item.priceCents,
        0,
      );

    expect(orderTotalCents(order.items)).toBe(expected);
    expect(orderTotalCents([{ name: "Hausbrot", quantity: 2, priceCents: 450 }])).toBe(900);
  });

  it("sums revenue across today's orders", () => {
    const orders = demoOrders();

    expect(orders.length).toBeGreaterThan(0);
    expect(sumRevenueCents(orders)).toBe(
      orders.reduce(
        (sum, order) => sum + orderTotalCents(order.items),
        0,
      ),
    );
  });

  it("ranks top products by quantity descending", () => {
    const orders = [
      {
        id: "X",
        customer: "A",
        mode: "pickup" as const,
        time: "08:00",
        status: "new" as const,
        items: [
          { name: "Brezel", quantity: 5, priceCents: 100 },
          { name: "Brot", quantity: 2, priceCents: 200 },
        ],
      },
      {
        id: "Y",
        customer: "B",
        mode: "pickup" as const,
        time: "08:05",
        status: "new" as const,
        items: [{ name: "Brezel", quantity: 3, priceCents: 100 }],
      },
    ];

    const ranked = topProducts(orders);

    expect(ranked[0]?.name).toBe("Brezel");
    expect(ranked[0]?.quantity).toBe(8);
    expect(ranked[0]?.revenueCents).toBe(800);
    expect(ranked[1]?.name).toBe("Brot");
  });

  it("limits the top-product list", () => {
    const ranked = topProducts(demoOrders(), 1);

    expect(ranked).toHaveLength(1);
  });
});
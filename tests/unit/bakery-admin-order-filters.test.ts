import { describe, expect, it } from "vitest";
import { addDays, demoOrders } from "@/features/bakery-admin/demoDashboard";
import {
  applyOrderFilters,
  filterByDate,
  filterByMode,
  filterByStatus,
} from "@/features/bakery-admin/orderFilters";

const today = "2026-09-28";
const tomorrow = addDays(today, 1);

describe("admin order filters", () => {
  it("filters demo orders by date", () => {
    const orders = demoOrders(today);

    expect(filterByDate(orders, today).every((order) => order.date === today)).toBe(true);
    expect(filterByDate(orders, tomorrow).every((order) => order.date === tomorrow)).toBe(true);
  });

  it("filters demo orders by operational status", () => {
    const ready = filterByStatus(demoOrders(today), "ready");

    expect(ready).toHaveLength(1);
    expect(ready.every((order) => order.status === "ready")).toBe(true);
  });

  it("filters demo orders by fulfillment type", () => {
    const pickup = filterByMode(demoOrders(today), "pickup");

    expect(pickup.length).toBeGreaterThan(0);
    expect(pickup.every((order) => order.mode === "pickup")).toBe(true);
  });

  it("shows only tomorrow pickup orders for the verification scenario", () => {
    const result = applyOrderFilters(demoOrders(today), {
      date: tomorrow,
      status: "all",
      mode: "pickup",
    });

    expect(result).toHaveLength(2);
    expect(result.every((order) => order.date === tomorrow)).toBe(true);
    expect(result.every((order) => order.mode === "pickup")).toBe(true);
  });
});

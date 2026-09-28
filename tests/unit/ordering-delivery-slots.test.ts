import { describe, expect, it } from "vitest";
import {
  deliveryChargeCents,
  zoneForPostalCode,
} from "@/features/ordering/delivery";
import {
  EXPRESS_FEE_CENTS,
  berlinDateString,
  buildDeliverySlots,
  isExpressAvailable,
} from "@/features/ordering/deliverySlots";

const NOON_BERLIN = new Date("2026-09-28T12:00:00+02:00");

describe("delivery slots", () => {
  it("builds 2-hour slots between 10:00 and 20:00", () => {
    const slots = buildDeliverySlots("2026-09-28");

    expect(slots).toHaveLength(5);
    expect(slots.map((slot) => `${slot.startTime}-${slot.endTime}`)).toEqual([
      "10:00-12:00",
      "12:00-14:00",
      "14:00-16:00",
      "16:00-18:00",
      "18:00-20:00",
    ]);
    expect(slots.every((slot) => !slot.express)).toBe(true);
  });

  it("drops slots that already ended today", () => {
    const now = new Date("2026-09-28T14:50:00+02:00");
    const slots = buildDeliverySlots("2026-09-28", now);

    expect(slots.map((slot) => slot.startTime)).toEqual([
      "14:00",
      "16:00",
      "18:00",
    ]);
  });

  it("keeps all slots for a later date at the same time", () => {
    const now = new Date("2026-09-28T14:50:00+02:00");
    const slots = buildDeliverySlots("2026-09-29", now);

    expect(slots).toHaveLength(5);
  });

  it("includes the date in the slot id", () => {
    const [slot] = buildDeliverySlots("2026-09-28");

    expect(slot?.id).toBe("2026-09-28-10:00");
  });
});

describe("express delivery", () => {
  it("is available in zones 1 and 2 before noon", () => {
    const beforeNoon = new Date("2026-09-28T09:30:00+02:00");

    expect(isExpressAvailable(1, beforeNoon)).toBe(true);
    expect(isExpressAvailable(2, beforeNoon)).toBe(true);
  });

  it("is unavailable at noon or later", () => {
    expect(isExpressAvailable(1, NOON_BERLIN)).toBe(false);
    expect(isExpressAvailable(2, NOON_BERLIN)).toBe(false);
  });

  it("is unavailable in zone 3 and for unknown zones", () => {
    const beforeNoon = new Date("2026-09-28T09:30:00+02:00");

    expect(isExpressAvailable(3, beforeNoon)).toBe(false);
    expect(isExpressAvailable(null, beforeNoon)).toBe(false);
  });

  it("carries a fixed surcharge", () => {
    expect(EXPRESS_FEE_CENTS).toBe(300);
  });
});

describe("delivery fee totals", () => {
  it("adds the express surcharge to the zone fee", () => {
    const zone = zoneForPostalCode("34117");

    expect(zone).toBe(1);
    expect(deliveryChargeCents(1500, zone ?? 1) + EXPRESS_FEE_CENTS).toBe(550);
  });

  it("keeps delivery free above the threshold even with no express", () => {
    const zone = zoneForPostalCode("34128");

    expect(zone).toBe(2);
    expect(deliveryChargeCents(3000, zone ?? 2)).toBe(0);
  });

  it("shows the express surcharge when the zone delivery is free", () => {
    const zone = zoneForPostalCode("34123");

    expect(zone).toBe(2);
    expect(deliveryChargeCents(3500, zone ?? 2)).toBe(0);
    expect(deliveryChargeCents(3500, zone ?? 2) + EXPRESS_FEE_CENTS).toBe(300);
  });

  it("resolves the Berlin date for the express window", () => {
    expect(berlinDateString(NOON_BERLIN)).toBe("2026-09-28");
  });
});
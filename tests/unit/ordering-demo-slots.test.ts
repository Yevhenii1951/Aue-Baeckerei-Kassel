import { describe, expect, it } from "vitest";
import { demoPickupSlots } from "@/features/ordering/demoSlots";
import { getSlotStatus } from "@/features/ordering/preorder";

describe("demo pickup slots", () => {
  it("is deterministic for the same date", () => {
    expect(demoPickupSlots("2026-09-29")).toEqual(
      demoPickupSlots("2026-09-29"),
    );
  });

  it("stays within capacity", () => {
    for (const slot of demoPickupSlots("2026-09-29")) {
      expect(slot.reserved).toBeLessThanOrEqual(slot.capacity);
    }
  });

  it("exposes all three capacity states on a single day", () => {
    const statuses = demoPickupSlots("2026-09-29").map((slot) =>
      getSlotStatus(slot),
    );

    expect(statuses).toContain("available");
    expect(statuses).toContain("limited");
    expect(statuses).toContain("full");
  });

  it("builds 30-minute slots from early morning until evening", () => {
    const slots = demoPickupSlots("2026-09-29");

    expect(slots[0]?.startTime).toBe("06:30");
    expect(slots.at(-1)?.startTime).toBe("19:00");
    expect(slots.every((slot) => slot.date === "2026-09-29")).toBe(true);
  });
});
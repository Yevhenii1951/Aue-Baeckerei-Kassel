import { describe, expect, it } from "vitest";
import {
  buildPickupSlots,
  earliestPreorderDate,
  getSlotStatus,
  nextNDates,
} from "@/features/ordering/preorder";

describe("preorder cutoff", () => {
  it("uses tomorrow before the 20:00 Berlin cutoff", () => {
    const now = new Date("2026-09-28T17:30:00.000Z");

    expect(earliestPreorderDate(now)).toBe("2026-09-29");
  });

  it("uses the day after tomorrow after the 20:00 Berlin cutoff", () => {
    const now = new Date("2026-09-28T18:30:00.000Z");

    expect(earliestPreorderDate(now)).toBe("2026-09-30");
  });
});

describe("preorder date range", () => {
  it("lists consecutive calendar days from the earliest date", () => {
    expect(nextNDates("2026-09-29", 3)).toEqual([
      "2026-09-29",
      "2026-09-30",
      "2026-10-01",
    ]);
  });
});

describe("pickup slots", () => {
  it("creates 30-minute slots with default capacity", () => {
    const slots = buildPickupSlots("2026-09-29", {
      startTime: "06:30",
      endTime: "08:00",
      capacity: 15,
    });

    expect(slots.map((slot) => `${slot.startTime}-${slot.endTime}`)).toEqual([
      "06:30-07:00",
      "07:00-07:30",
      "07:30-08:00",
    ]);
    expect(slots.every((slot) => slot.capacity === 15)).toBe(true);
  });

  it("marks slots by remaining capacity", () => {
    expect(getSlotStatus({ capacity: 15, reserved: 15 })).toBe("full");
    expect(getSlotStatus({ capacity: 15, reserved: 13 })).toBe("limited");
    expect(getSlotStatus({ capacity: 15, reserved: 4 })).toBe("available");
  });
});

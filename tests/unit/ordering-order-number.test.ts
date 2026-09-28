import { describe, expect, it } from "vitest";
import { createDemoOrderNumber } from "@/features/ordering/orderNumber";

describe("demo order number", () => {
  it("formats the required pattern", () => {
    expect(createDemoOrderNumber(2026, 1)).toBe("B-2026-0001");
  });

  it("pads to four digits", () => {
    expect(createDemoOrderNumber(2026, 42)).toBe("B-2026-0042");
  });

  it("keeps numbers beyond four digits untruncated", () => {
    expect(createDemoOrderNumber(2026, 12345)).toBe("B-2026-12345");
  });
});
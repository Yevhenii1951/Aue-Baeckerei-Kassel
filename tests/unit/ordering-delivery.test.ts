import { describe, expect, it } from "vitest";
import {
  deliveryChargeCents,
  deliveryFeeCents,
  freeThresholdCents,
  normalizePostalCode,
  zoneForPostalCode,
} from "@/features/ordering/delivery";

describe("delivery zones", () => {
  it("maps Kassel inner-city postal codes to zone 1", () => {
    expect(zoneForPostalCode("34117")).toBe(1);
    expect(zoneForPostalCode("34119")).toBe(1);
  });

  it("maps middle Kassel postal codes to zone 2", () => {
    expect(zoneForPostalCode("34121")).toBe(2);
    expect(zoneForPostalCode("34123")).toBe(2);
    expect(zoneForPostalCode("34125")).toBe(2);
    expect(zoneForPostalCode("34128")).toBe(2);
  });

  it("maps outer Kassel postal codes to zone 3", () => {
    expect(zoneForPostalCode("34127")).toBe(3);
    expect(zoneForPostalCode("34131")).toBe(3);
    expect(zoneForPostalCode("34134")).toBe(3);
  });

  it("returns null for postal codes outside Kassel", () => {
    expect(zoneForPostalCode("10115")).toBeNull();
    expect(zoneForPostalCode("98117")).toBeNull();
  });

  it("returns null for malformed input", () => {
    expect(zoneForPostalCode("")).toBeNull();
    expect(zoneForPostalCode("3412")).toBeNull();
    expect(zoneForPostalCode("12a45")).toBeNull();
  });

  it("normalises spaced input", () => {
    expect(zoneForPostalCode(" 341 17 ")).toBe(1);
    expect(normalizePostalCode(" 34 117 ")).toBe("34117");
  });
});

describe("delivery fees", () => {
  it("exposes the configured zone fees", () => {
    expect(deliveryFeeCents(1)).toBe(250);
    expect(deliveryFeeCents(2)).toBe(450);
    expect(deliveryFeeCents(3)).toBe(650);
  });

  it("exposes the free-delivery thresholds", () => {
    expect(freeThresholdCents(1)).toBe(2000);
    expect(freeThresholdCents(2)).toBe(3000);
    expect(freeThresholdCents(3)).toBe(4000);
  });

  it("charges the fee below the threshold", () => {
    expect(deliveryChargeCents(1500, 1)).toBe(250);
    expect(deliveryChargeCents(2999, 2)).toBe(450);
  });

  it("waives the fee at and above the threshold", () => {
    expect(deliveryChargeCents(2000, 1)).toBe(0);
    expect(deliveryChargeCents(4000, 3)).toBe(0);
    expect(deliveryChargeCents(7990, 2)).toBe(0);
  });
});
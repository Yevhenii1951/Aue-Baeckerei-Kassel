import { describe, expect, it } from "vitest";
import { parseCheckoutForm } from "@/features/ordering/checkout-form";

describe("checkout form validation", () => {
  const base = {
    name: "Anna Beispiel",
    email: "anna@example.de",
    phone: "+49 561 123456",
    mode: "pickup",
    payment: "stripe",
    street: "",
    zip: "",
    city: "",
    notes: "",
  };

  it("accepts a pickup order without delivery address", () => {
    const result = parseCheckoutForm(base);

    expect(result.success).toBe(true);
  });

  it("requires delivery address for a delivery order", () => {
    const result = parseCheckoutForm({ ...base, mode: "delivery" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.street).toBeTypeOf("string");
      expect(result.fieldErrors.zip).toBeTypeOf("string");
      expect(result.fieldErrors.city).toBeTypeOf("string");
    }
  });

  it("accepts a delivery order with a complete address", () => {
    const result = parseCheckoutForm({
      ...base,
      mode: "delivery",
      street: "Kölnische Str. 1",
      zip: "34117",
      city: "Kassel",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid postal code for delivery", () => {
    const result = parseCheckoutForm({
      ...base,
      mode: "delivery",
      street: "Kölnische Str. 1",
      city: "Kassel",
      zip: "12a",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.zip).toBeTypeOf("string");
    }
  });

  it("rejects an unknown payment method", () => {
    const result = parseCheckoutForm({ ...base, payment: "bitcoin" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.payment).toBeTypeOf("string");
    }
  });

  it("rejects a missing name", () => {
    const result = parseCheckoutForm({ ...base, name: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.name).toBeTypeOf("string");
    }
  });
});
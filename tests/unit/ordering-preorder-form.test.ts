import { describe, expect, it } from "vitest";
import { parsePreorderForm } from "@/features/ordering/preorder-form";

describe("preorder form validation", () => {
  const valid = {
    name: "Anna Beispiel",
    email: "anna@example.de",
    phone: "+49 561 123456",
    notes: "Bitte frische Brötchen",
  };

  it("accepts a complete form", () => {
    const result = parsePreorderForm(valid);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Anna Beispiel");
      expect(result.data.notes).toBe("Bitte frische Brötchen");
    }
  });

  it("defaults notes to an empty string when omitted", () => {
    const withoutNotes = {
      name: valid.name,
      email: valid.email,
      phone: valid.phone,
    };
    const result = parsePreorderForm(withoutNotes);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.notes).toBe("");
    }
  });

  it("rejects a missing name", () => {
    const result = parsePreorderForm({ ...valid, name: " " });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.name).toBeTypeOf("string");
    }
  });

  it("rejects an invalid email", () => {
    const result = parsePreorderForm({ ...valid, email: "nicht-eine-mail" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.email).toBeTypeOf("string");
    }
  });

  it("rejects a malformed phone number", () => {
    const result = parsePreorderForm({ ...valid, phone: "123" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.phone).toBeTypeOf("string");
    }
  });

  it("reports only the failing fields", () => {
    const result = parsePreorderForm({ ...valid, name: "", email: "kaputt" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.fieldErrors).sort()).toEqual(["email", "name"]);
    }
  });
});
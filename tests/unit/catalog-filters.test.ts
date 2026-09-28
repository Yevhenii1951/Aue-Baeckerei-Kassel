import { describe, expect, it } from "vitest";
import { filterProducts } from "@/features/catalog/filters";
import { demoProducts } from "@/features/catalog/demoProducts";

describe("catalog filters", () => {
  it("returns only products from the requested category", () => {
    const breads = filterProducts(demoProducts, { category: "bread" });

    expect(breads.length).toBeGreaterThan(5);
    expect(breads.every((product) => product.category === "bread")).toBe(true);
  });

  it("matches products by tag", () => {
    const vegan = filterProducts(demoProducts, { tags: ["vegan"] });

    expect(vegan.length).toBeGreaterThan(3);
    expect(vegan.every((product) => product.tags.includes("vegan"))).toBe(true);
  });

  it("can exclude allergen codes", () => {
    const withoutMilk = filterProducts(demoProducts, {
      excludeAllergens: ["G"],
    });

    expect(withoutMilk.length).toBeGreaterThan(0);
    expect(
      withoutMilk.every((product) => !product.allergens.includes("G")),
    ).toBe(true);
  });

  it("combines category, tag and search filters", () => {
    const result = filterProducts(demoProducts, {
      category: "snacks",
      tags: ["vegetarisch"],
      query: "bagel",
    });

    expect(result.map((product) => product.name)).toEqual(["Avocado Bagel"]);
  });
});

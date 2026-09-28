import { describe, expect, it } from "vitest";
import { demoProducts } from "@/features/catalog/demoProducts";
import {
  buildProductJsonLd,
  findProductBySlug,
  relatedProducts,
} from "@/features/catalog/productDetails";

describe("catalog product details", () => {
  it("finds products by route slug", () => {
    const product = findProductBySlug("hausbrot");

    expect(product?.name).toBe("Hausbrot");
    expect(findProductBySlug("unknown-product")).toBeUndefined();
  });

  it("prefers related products from the same category and shared tags", () => {
    const product = requiredProduct("hausbrot");
    const related = relatedProducts(product, 3);

    expect(related).toHaveLength(3);
    expect(related.every((candidate) => candidate.id !== product.id)).toBe(true);
    expect(related.every((candidate) => candidate.category === "bread")).toBe(true);
  });

  it("builds product JSON-LD with euro offer data", () => {
    const product = requiredProduct("baguette");
    const jsonLd = buildProductJsonLd(
      product,
      "https://example.test/de/sortiment/baguette",
    );

    expect(jsonLd["@type"]).toBe("Product");
    expect(jsonLd.offers.price).toBe("3.80");
    expect(jsonLd.offers.priceCurrency).toBe("EUR");
    expect(jsonLd.offers.url).toBe("https://example.test/de/sortiment/baguette");
  });
});

function requiredProduct(slug: string) {
  const product = demoProducts.find((candidate) => candidate.id === slug);
  if (!product) throw new Error(`Missing test product ${slug}`);
  return product;
}

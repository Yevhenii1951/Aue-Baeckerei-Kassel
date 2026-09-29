import { demoProducts } from "./demoProducts";
import type { AllergenCode, Product, ProductCategory } from "./types";

export type ProductLabels = {
  category: (category: ProductCategory) => string;
  allergen: (code: AllergenCode) => string;
  onRequest: string;
  noAllergens: string;
  ingredients: string;
  allergens: string;
};

export type ProductJsonLd = {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  image?: string;
  category: string;
  sku: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: "EUR";
    availability: "https://schema.org/InStock";
    url: string;
  };
};

export function findProductBySlug(slug: string): Product | undefined {
  return demoProducts.find((product) => product.id === slug);
}

export function relatedProducts(product: Product, limit = 3): Product[] {
  const scored = demoProducts
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => ({
      product: candidate,
      score: relatedScore(product, candidate),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.product.name.localeCompare(right.product.name, "de-DE");
    });

  return scored.slice(0, limit).map((candidate) => candidate.product);
}

export function ingredientText(product: Product, labels: ProductLabels): string {
  if (product.ingredients.length > 0) return product.ingredients.join(", ");
  return labels.onRequest;
}

export function allergenText(product: Product, labels: ProductLabels): string {
  if (product.allergens.length === 0) return labels.noAllergens;
  return product.allergens
    .map((code) => `${code} (${labels.allergen(code)})`)
    .join(", ");
}

export function buildProductJsonLd(
  product: Product,
  url: string,
  labels: ProductLabels,
): ProductJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${new URL(url).origin}${product.imageUrl}`,
    category: labels.category(product.category),
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url,
    },
  };
}

function relatedScore(product: Product, candidate: Product): number {
  const categoryScore = candidate.category === product.category ? 4 : 0;
  const tagScore = candidate.tags.filter((tag) => product.tags.includes(tag)).length;
  return categoryScore + tagScore;
}

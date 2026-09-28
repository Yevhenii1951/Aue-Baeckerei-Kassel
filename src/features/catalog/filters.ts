import type { Product, ProductCategory, ProductFilter } from "./types";

export function filterProducts(
  products: Product[],
  filter: ProductFilter,
): Product[] {
  const query = filter.query?.trim().toLocaleLowerCase("de-DE");

  return products.filter((product) => {
    if (filter.category !== undefined && product.category !== filter.category) {
      return false;
    }

    if (filter.tags?.some((tag) => !product.tags.includes(tag))) {
      return false;
    }

    if (
      filter.excludeAllergens?.some((code) => product.allergens.includes(code))
    ) {
      return false;
    }

    if (query === undefined || query.length === 0) {
      return true;
    }

    const haystack = [
      product.name,
      product.description,
      product.unit,
      ...product.ingredients,
      ...product.tags,
    ]
      .join(" ")
      .toLocaleLowerCase("de-DE");

    return haystack.includes(query);
  });
}

export function productsByCategory(
  products: Product[],
  category: ProductCategory,
): Product[] {
  return filterProducts(products, { category });
}

import type {
  Product,
  ProductCategory,
  ProductFilter,
  ProductSort,
} from "./types";

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

export function sortProducts(
  products: Product[],
  sort: ProductSort,
): Product[] {
  const copy = [...products];

  if (sort === "price-asc") {
    return copy.sort((left, right) => left.priceCents - right.priceCents);
  }

  if (sort === "price-desc") {
    return copy.sort((left, right) => right.priceCents - left.priceCents);
  }

  if (sort === "name-asc") {
    return copy.sort((left, right) => left.name.localeCompare(right.name, "de-DE"));
  }

  return copy.sort((left, right) => {
    const leftPopular = left.tags.includes("beliebt") ? 0 : 1;
    const rightPopular = right.tags.includes("beliebt") ? 0 : 1;

    if (leftPopular !== rightPopular) {
      return leftPopular - rightPopular;
    }

    return left.name.localeCompare(right.name, "de-DE");
  });
}

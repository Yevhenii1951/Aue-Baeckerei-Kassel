export type ProductCategory =
  | "bread"
  | "rolls"
  | "sweets"
  | "drinks"
  | "snacks"
  | "fineGoods";

export type AllergenCode = "A" | "C" | "F" | "G" | "H" | "N";

export type Product = {
  id: string;
  category: ProductCategory;
  name: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  unit: string;
  ingredients: string[];
  allergens: AllergenCode[];
  tags: string[];
  preorder: boolean;
  shop: boolean;
};

export type ProductFilter = {
  category?: ProductCategory;
  tags?: string[];
  excludeAllergens?: AllergenCode[];
  query?: string;
};

export type ProductSort = "beliebt" | "name-asc" | "price-asc" | "price-desc";

export const categoryLabels: Record<ProductCategory, string> = {
  bread: "Brote",
  rolls: "Brötchen",
  sweets: "Süßes",
  drinks: "Getränke",
  snacks: "Snacks",
  fineGoods: "Feinkost",
};

export const allergenLabels: Record<AllergenCode, string> = {
  A: "Gluten",
  C: "Eier",
  F: "Senf",
  G: "Milch",
  H: "Schalenfrüchte",
  N: "Sesam",
};

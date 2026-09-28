"use client";

import { useMemo, useState } from "react";
import { filterProducts, sortProducts } from "@/features/catalog/filters";
import {
  type AllergenCode,
  type Product,
  type ProductCategory,
  type ProductSort,
} from "@/features/catalog/types";
import { useCart } from "@/features/ordering/cart-provider";
import { CategoryTabs } from "./CategoryTabs";
import { ProductGridCard } from "./ProductGridCard";
import { ShopCartSummary } from "./ShopCartSummary";

type CatalogShopProps = {
  products: Product[];
  locale: string;
};

const categories: ProductCategory[] = [
  "bread",
  "rolls",
  "sweets",
  "drinks",
  "snacks",
  "fineGoods",
];
const tagFilters = ["vegan", "dinkel", "beliebt", "premium", "mittag"];
const allergenFilters: AllergenCode[] = ["A", "C", "F", "G", "H", "N"];

export function CatalogShop({ products, locale }: CatalogShopProps): React.ReactElement {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [allergen, setAllergen] = useState<AllergenCode | "">("");
  const [sort, setSort] = useState<ProductSort>("beliebt");
  const { items, totals, addToCart } = useCart();

  const visibleProducts = useMemo(() => {
    const filtered = filterProducts(products, {
      category: category === "all" ? undefined : category,
      tags: tag ? [tag] : undefined,
      excludeAllergens: allergen ? [allergen] : undefined,
      query,
    });

    return sortProducts(filtered, sort);
  }, [allergen, category, products, query, sort, tag]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="grid gap-6">
        <CategoryTabs
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />

        <div className="grid gap-3 rounded-lg border border-brand-deep/10 bg-paper p-4 lg:grid-cols-[1fr_auto_auto_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Suchen: Brot, Kaffee, vegan..."
            className="min-h-11 rounded-lg border border-brand-deep/15 bg-white px-3"
          />
          <select
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="min-h-11 rounded-lg border border-brand-deep/15 bg-white px-3"
          >
            <option value="">Alle Tags</option>
            {tagFilters.map((candidate) => (
              <option key={candidate} value={candidate}>
                {candidate}
              </option>
            ))}
          </select>
          <select
            value={allergen}
            onChange={(event) => setAllergen(event.target.value as AllergenCode)}
            className="min-h-11 rounded-lg border border-brand-deep/15 bg-white px-3"
          >
            <option value="">Allergene erlauben</option>
            {allergenFilters.map((candidate) => (
              <option key={candidate} value={candidate}>
                Ohne {candidate}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as ProductSort)}
            className="min-h-11 rounded-lg border border-brand-deep/15 bg-white px-3"
          >
            <option value="beliebt">Beliebt</option>
            <option value="name-asc">Name</option>
            <option value="price-asc">Preis aufsteigend</option>
            <option value="price-desc">Preis absteigend</option>
          </select>
        </div>

        <p className="text-sm font-medium text-ink/65">
          {visibleProducts.length} Produkte · Warenkorb {totals.lines.length}
        </p>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductGridCard
              key={product.id}
              product={product}
              locale={locale}
              quantity={
                items.find((item) => item.productId === product.id)
                  ?.quantity ?? 0
              }
              onAdd={addToCart}
              onPreorder={addToCart}
            />
          ))}
        </div>
      </div>

      <ShopCartSummary />
    </div>
  );
}

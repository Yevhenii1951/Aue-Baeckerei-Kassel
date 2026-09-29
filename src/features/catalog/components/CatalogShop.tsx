"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { filterProducts, sortProducts } from "@/features/catalog/filters";
import {
  ALLERGEN_CODES,
  PRODUCT_CATEGORIES,
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
  initialCategory?: ProductCategory | "all";
};

const categories = PRODUCT_CATEGORIES;
const tagFilters = [
  "vegan",
  "dinkel",
  "beliebt",
  "proteinreich",
  "geschenk",
  "premium",
  "mittag",
] as const;
const allergenFilters = ALLERGEN_CODES;
const PRODUCT_SORTS: ProductSort[] = ["beliebt", "name-asc", "price-asc", "price-desc"];

export function CatalogShop({
  products,
  locale,
  initialCategory = "all",
}: CatalogShopProps): React.ReactElement {
  const [category, setCategory] = useState<ProductCategory | "all">(initialCategory);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [allergen, setAllergen] = useState<AllergenCode | "">("");
  const [sort, setSort] = useState<ProductSort>("beliebt");
  const { items, totals, addToCart } = useCart();
  const t = useTranslations("catalog");

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
            placeholder={t("searchPlaceholder")}
            className="min-h-11 rounded-lg border border-brand-deep/15 bg-white px-3"
          />
          <select
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="min-h-11 rounded-lg border border-brand-deep/15 bg-white px-3"
          >
            <option value="">{t("allTags")}</option>
            {tagFilters.map((candidate) => (
              <option key={candidate} value={candidate}>
                {t(`tags.${candidate}`)}
              </option>
            ))}
          </select>
          <select
            value={allergen}
            onChange={(event) => setAllergen(event.target.value as AllergenCode)}
            className="min-h-11 rounded-lg border border-brand-deep/15 bg-white px-3"
          >
            <option value="">{t("excludeAllergen")}</option>
            {allergenFilters.map((candidate) => (
              <option key={candidate} value={candidate}>
                {t("without", { code: t(`allergens.${candidate}`) })}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as ProductSort)}
            className="min-h-11 rounded-lg border border-brand-deep/15 bg-white px-3"
          >
            {PRODUCT_SORTS.map((candidate) => (
              <option key={candidate} value={candidate}>
                {t(`sorts.${candidate}`)}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm font-medium text-ink/65">
          {t("summary", {
            count: visibleProducts.length,
            cartCount: totals.lines.length,
          })}
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

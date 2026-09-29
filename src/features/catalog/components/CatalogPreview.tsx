import { getTranslations, getLocale } from "next-intl/server";
import { demoProducts } from "@/features/catalog/demoProducts";
import { filterProducts } from "@/features/catalog/filters";
import { formatEuroCents } from "@/lib/format";
import { tagLabel } from "@/features/catalog/tagLabel";
import type { Product, ProductCategory } from "@/features/catalog/types";

const visibleCategories: ProductCategory[] = [
  "bread",
  "rolls",
  "sweets",
  "drinks",
  "snacks",
  "fineGoods",
];

export async function CatalogPreview(): Promise<React.ReactElement> {
  const t = await getTranslations("catalog");
  const locale = await getLocale();
  const allergenLabels = (code: string): string => t(`allergens.${code}`);

  return (
    <div className="grid gap-8">
      <div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {visibleCategories.map((category) => (
            <div
              key={category}
              className="rounded-lg border border-brand-deep/10 bg-paper p-4"
            >
              <p className="text-2xl font-semibold">
                {filterProducts(demoProducts, { category }).length}
              </p>
              <p className="mt-1 text-sm text-ink/65">
                {t(`categories.${category}`)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["vegan", "dinkel", "beliebt", "proteinreich", "geschenk"] as const).map(
            (tag) => (
              <span
                key={tag}
                className="rounded-lg border border-sage/20 bg-cream px-3 py-1 text-sm font-medium text-sage"
              >
                {tagLabel(t, tag)}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-10">
        {visibleCategories.map((category) => (
          <section key={category} className="grid gap-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="font-display text-3xl font-semibold">
                {t(`categories.${category}`)}
              </h3>
              <p className="text-sm font-medium text-ink/60">
                {t("productCount", { count: filterProducts(demoProducts, { category }).length })}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filterProducts(demoProducts, { category }).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryLabel={t(`categories.${category}`)}
                  allergenLabels={allergenLabels}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  categoryLabel,
  allergenLabels,
  locale,
}: {
  product: Product;
  categoryLabel: string;
  allergenLabels: (code: string) => string;
  locale: string;
}): React.ReactElement {
  return (
    <article className="flex min-h-56 flex-col justify-between rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card">
      <div>
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-sage">
            {categoryLabel}
          </p>
          <p className="font-semibold text-brand-dark">
            {formatEuroCents(product.priceCents, locale)}
          </p>
        </div>
        <h3 className="mt-3 text-xl font-semibold">{product.name}</h3>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          {product.description}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {product.allergens.map((code) => (
          <span
            key={code}
            title={allergenLabels(code)}
            className="rounded-md border border-brand-deep/10 px-2 py-1 text-xs font-semibold text-ink/70"
          >
            {code}
          </span>
        ))}
        {product.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-amber-soft px-2 py-1 text-xs font-semibold text-brand-deep"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

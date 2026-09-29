import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { demoProducts } from "@/features/catalog/demoProducts";
import { filterProducts } from "@/features/catalog/filters";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/features/catalog/types";

function representativeImage(category: ProductCategory): string {
  const representative =
    demoProducts.find(
      (product) => product.category === category && product.tags.includes("beliebt"),
    ) ?? demoProducts.find((product) => product.category === category);
  return representative?.imageUrl ?? "";
}

export async function CategoryGallery(): Promise<React.ReactElement> {
  const t = await getTranslations("catalog");
  const locale = await getLocale();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PRODUCT_CATEGORIES.map((category) => {
        const label = t(`categories.${category}`);
        const count = filterProducts(demoProducts, { category }).length;
        return (
          <Link
            key={category}
            href={`/${locale}/sortiment/kategorie/${category}`}
            className="group overflow-hidden rounded-lg border border-brand-deep/10 bg-paper shadow-card transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={representativeImage(category)}
                alt={label}
                fill
                sizes="(min-width: 1024px) 20rem, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between gap-3 p-5">
              <div>
                <h3 className="font-display text-2xl font-semibold">{label}</h3>
                <p className="mt-1 text-sm text-ink/65">
                  {t("productCount", { count })}
                </p>
              </div>
              <ArrowRight
                className="size-5 text-brand-dark transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { formatEuroCents } from "@/lib/format";
import type { Product } from "@/features/catalog/types";

type ProductGridCardProps = {
  product: Product;
  locale: string;
  quantity: number;
  onAdd: (product: Product) => void;
  onPreorder: (product: Product) => void;
};

export function ProductGridCard({
  product,
  locale,
  quantity,
  onAdd,
  onPreorder,
}: ProductGridCardProps): React.ReactElement {
  const t = useTranslations("catalog");

  return (
    <article className="flex min-h-80 flex-col justify-between overflow-hidden rounded-lg border border-brand-deep/10 bg-paper shadow-card">
      <div>
        <Link href={`/${locale}/sortiment/${product.id}`} className="block">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={1200}
            height={900}
            sizes="(min-width: 1280px) 21rem, (min-width: 768px) 50vw, 100vw"
            className="aspect-[4/3] w-full object-cover"
          />
        </Link>
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <p className="text-sm font-medium text-sage">
            {t(`categories.${product.category}`)}
          </p>
          <p className="font-semibold text-brand-dark">
            {formatEuroCents(product.priceCents, locale)}
          </p>
        </div>
        <h2 className="mt-3 px-5 text-xl font-semibold">
          <Link href={`/${locale}/sortiment/${product.id}`} className="hover:text-brand">
            {product.name}
          </Link>
        </h2>
        <p className="mt-3 px-5 text-sm leading-6 text-ink/70">
          {product.description}
        </p>
      </div>

      <div className="mt-5 grid gap-4 p-5 pt-0">
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-amber-soft px-2 py-1 text-xs font-semibold text-brand-deep"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="min-h-11 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-cream"
          >
            {quantity > 0 ? t("inCart", { count: quantity }) : t("addToCart")}
          </button>
          <button
            type="button"
            onClick={() => onPreorder(product)}
            className="min-h-11 rounded-lg border border-brand-deep/15 px-4 py-2 text-sm font-semibold text-brand-dark"
          >
            {product.preorder ? t("preorder") : t("shopItem")}
          </button>
        </div>
      </div>
    </article>
  );
}

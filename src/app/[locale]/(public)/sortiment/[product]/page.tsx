import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { demoProducts } from "@/features/catalog/demoProducts";
import {
  allergenText,
  buildProductJsonLd,
  findProductBySlug,
  ingredientText,
  relatedProducts,
  type ProductLabels,
} from "@/features/catalog/productDetails";
import { tagLabel } from "@/features/catalog/tagLabel";
import type { AllergenCode, ProductCategory } from "@/features/catalog/types";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { localizedSiteUrl, parseSupportedLocale } from "@/features/seo/site";
import { formatEuroCents } from "@/lib/format";

type ProductPageProps = Readonly<{
  params: Promise<{ locale: string; product: string }>;
}>;

export function generateStaticParams(): Array<{ product: string }> {
  return demoProducts.map((product) => ({ product: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, product: slug } = await params;
  const product = findProductBySlug(slug);
  if (!product) return {};

  return buildPublicMetadata({
    locale: parseSupportedLocale(locale),
    path: `/sortiment/${product.id}`,
    title: `${product.name} | Sortiment`,
    description: product.description,
  });
}

export default async function ProductPage({ params }: ProductPageProps): Promise<React.ReactElement> {
  const { locale, product: slug } = await params;
  setRequestLocale(locale);
  const product = findProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("sortiment");
  const tc = await getTranslations("catalog");
  const related = relatedProducts(product);
  const labels: ProductLabels = {
    category: (category: ProductCategory) => tc(`categories.${category}`),
    allergen: (code: AllergenCode) => tc(`allergens.${code}`),
    onRequest: tc("onRequest"),
    noAllergens: tc("noAllergens"),
    ingredients: tc("ingredients"),
    allergens: tc("allergensHeading"),
  };
  const productUrl = localizedSiteUrl(parseSupportedLocale(locale), `/sortiment/${product.id}`);

  return (
    <div className="bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductJsonLd(product, productUrl, labels)),
        }}
      />
      <section className="border-b border-brand-deep/10 bg-paper">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-8 lg:grid-cols-[1fr_22rem]">
          <div>
            <Link href={`/${locale}/sortiment`} className="text-sm font-semibold text-sage">
              ← {t("title")}
            </Link>
            <p className="mt-6 text-sm font-semibold text-sage">
              {labels.category(product.category)}
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold">{product.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
              {product.description}
            </p>
          </div>
          <aside className="rounded-lg border border-brand-deep/10 bg-cream p-5 shadow-card">
            <p className="text-sm font-semibold text-sage">{t("price")}</p>
            <p className="mt-2 text-3xl font-semibold text-brand-dark">
              {formatEuroCents(product.priceCents, locale)}
            </p>
            <p className="mt-1 text-sm text-ink/65">
              {t("perUnit", { unit: product.unit })}
            </p>
            <div className="mt-6 grid gap-3">
              <Link href={`/${locale}/sortiment`} className="btn-amber text-center">
                {t("addToCart")}
              </Link>
              <Link
                href={`/${locale}/vorbestellen`}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-brand-deep/15 px-6 py-2.5 font-semibold text-brand-dark"
              >
                {t("preorder")}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-8 lg:grid-cols-[1fr_22rem]">
        <div className="grid gap-6">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={1200}
            height={900}
            priority
            sizes="(min-width: 1024px) 44rem, 100vw"
            className="aspect-[4/3] w-full rounded-lg object-cover shadow-card"
          />
          <InfoBlock title={labels.ingredients} value={ingredientText(product, labels)} />
          <InfoBlock title={labels.allergens} value={allergenText(product, labels)} />
          <InfoBlock
            title={t("tags")}
            value={product.tags.map((tag) => tagLabel(tc, tag)).join(", ")}
          />
        </div>
        <div className="rounded-lg border border-brand-deep/10 bg-paper p-5">
          <h2 className="font-display text-2xl font-semibold">{t("related")}</h2>
          <div className="mt-5 grid gap-3">
            {related.map((candidate) => (
              <Link
                key={candidate.id}
                href={`/${locale}/sortiment/${candidate.id}`}
                className="rounded-lg border border-brand-deep/10 bg-cream p-3"
              >
                <span className="block font-semibold">{candidate.name}</span>
                <span className="text-sm text-ink/65">
                  {formatEuroCents(candidate.priceCents, locale)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ title, value }: Readonly<{ title: string; value: string }>): React.ReactElement {
  return (
    <section className="rounded-lg border border-brand-deep/10 bg-paper p-5">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-3 leading-7 text-ink/72">{value}</p>
    </section>
  );
}

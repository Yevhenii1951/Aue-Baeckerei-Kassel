import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { demoProducts } from "@/features/catalog/demoProducts";
import { CatalogShop } from "@/features/catalog/components/CatalogShop";
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/features/catalog/types";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { parseSupportedLocale } from "@/features/seo/site";

type CategoryPageProps = Readonly<{
  params: Promise<{ locale: string; category: string }>;
}>;

export function generateStaticParams(): Array<{ category: string }> {
  return PRODUCT_CATEGORIES.map((category) => ({ category }));
}

function parseCategory(raw: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((candidate) => candidate === raw);
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category: raw } = await params;
  const category = parseCategory(raw);
  if (!category) return {};
  const t = await getTranslations({ locale, namespace: "catalog" });
  const ts = await getTranslations({ locale, namespace: "sortiment" });

  return buildPublicMetadata({
    locale: parseSupportedLocale(locale),
    path: `/sortiment/kategorie/${category}`,
    title: `${t(`categories.${category}`)} | Sortiment`,
    description: ts("intro"),
  });
}

export default async function CategoryPage({ params }: CategoryPageProps): Promise<React.ReactElement> {
  const { locale, category: raw } = await params;
  setRequestLocale(locale);
  const category = parseCategory(raw);
  if (!category) notFound();

  const ts = await getTranslations("sortiment");
  const tc = await getTranslations("catalog");

  return (
    <div className="bg-cream">
      <section className="border-b border-brand-deep/10 bg-paper">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8">
          <Link href={`/${locale}/sortiment`} className="text-sm font-semibold text-brand">
            {"\u2190"} {ts("title")}
          </Link>
          <h1 className="mt-4 font-display text-5xl font-semibold">
            {tc(`categories.${category}`)}
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-ink/72">{ts("intro")}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
        <CatalogShop products={demoProducts} locale={locale} initialCategory={category} />
      </section>
    </div>
  );
}
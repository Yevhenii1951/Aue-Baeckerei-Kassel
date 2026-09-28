import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { parseSupportedLocale } from "@/features/seo/site";
import { CatalogPreview } from "@/features/catalog/components/CatalogPreview";
import {
  ConversionSections,
  type ConversionCard,
} from "@/features/content/components/ConversionSections";

type PathCard = {
  title: string;
  text: string;
  cta: string;
};

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "home" });
  return buildPublicMetadata({
    locale: parseSupportedLocale(locale),
    path: "",
    title: translations("title"),
    description: translations("intro"),
  });
}

export default async function HomePage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const paths = t.raw("paths") as PathCard[];
  const steps = t.raw("steps") as string[];
  const bestsellers = t.raw("bestsellers") as string[];
  const trustItems = t.raw("trustItems") as string[];
  const conversionCards = t.raw("conversionCards") as ConversionCard[];

  return (
    <div className="bg-porcelain">
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-brand-deep text-cream">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          autoPlay
          muted
          loop
          playsInline
          poster=""
        >
          <source src="/373419_medium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(23_18_14/0.92),rgb(23_18_14/0.56)_48%,rgb(23_18_14/0.18))]" />
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col justify-end gap-10 px-4 py-12 sm:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold text-lime">
              {t("eyebrow")}
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[0.96] sm:text-7xl lg:text-8xl">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/80 sm:text-xl">
              {t("intro")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}#vorbestellen`} className="btn-lime">
                {t("primaryCta")}
              </Link>
              <Link href={`/${locale}#sortiment`} className="btn-ghost-dark">
                {t("secondaryCta")}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/20 pt-5 text-sm text-cream/80 sm:grid-cols-[1fr_auto] sm:items-end">
            <p>{t("heroNote")}</p>
            <div className="inline-flex w-fit items-center gap-3 rounded-lg border border-lime/50 bg-brand-deep/72 px-4 py-3 shadow-dining-soft">
              <span>{t("cutoffLabel")}</span>
              <strong className="text-lime">{t("cutoffTime")}</strong>
            </div>
          </div>
        </div>
      </section>

      <section
        id="vorbestellen"
        className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-12 sm:px-8 lg:grid-cols-3"
      >
        <div className="lg:col-span-3">
          <h2 className="font-display text-4xl font-semibold">
            {t("pathsTitle")}
          </h2>
        </div>
        {paths.map((path) => (
          <article
            key={path.title}
            className="premium-surface flex min-h-60 flex-col justify-between gap-8 rounded-lg p-6"
          >
            <div>
              <h3 className="text-2xl font-semibold">{path.title}</h3>
              <p className="mt-4 leading-7 text-ink/72">{path.text}</p>
            </div>
            <p className="font-semibold text-brand-dark">{path.cta}</p>
          </article>
        ))}
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="font-display text-4xl font-semibold">
              {t("stepsTitle")}
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-ink/70">
              {t("intro")}
            </p>
          </div>
          <ol className="grid gap-3">
            {steps.map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[3rem_1fr] items-center gap-4 rounded-lg border border-brand-deep/10 bg-porcelain p-4"
              >
                <span className="flex size-12 items-center justify-center rounded-lg bg-brand-deep font-semibold text-lime">
                  {index + 1}
                </span>
                <span className="leading-7 text-ink/78">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="sortiment"
        className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8"
      >
        <div>
          <h2 className="font-display text-4xl font-semibold">
            {t("assortmentTitle")}
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-ink/72">
            {t("assortmentText")}
          </p>
        </div>
        <div className="mt-8">
          <CatalogPreview />
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {bestsellers.map((item) => (
            <p
              key={item}
              className="rounded-lg border border-brand-deep/10 bg-paper px-4 py-3 text-sm font-semibold text-sage"
            >
              {t("bestsellersTitle")}: {item}
            </p>
          ))}
        </div>
      </section>

      <ConversionSections
        title={t("conversionTitle")}
        text={t("conversionText")}
        cards={conversionCards}
      />

      <section id="cafe" className="bg-brand-deep text-cream">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h2 className="font-display text-4xl font-semibold">
              {t("cafeTitle")}
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-cream/75">
              {t("cafeText")}
            </p>
          </div>
          <ul className="grid gap-3">
            {trustItems.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-white/10 bg-white/10 px-5 py-4"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

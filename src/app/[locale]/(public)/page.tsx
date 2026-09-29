import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import {
  ArrowRight,
  Coffee,
  ShoppingBag,
  Store,
} from "lucide-react";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { parseSupportedLocale } from "@/features/seo/site";
import { buildBakeryJsonLd } from "@/features/seo/bakeryJsonLd";
import { CategoryGallery } from "@/features/catalog/components/CategoryGallery";
import { CONVERSION } from "@/features/content/companyPages";
import { ConversionSections } from "@/features/content/components/ConversionSections";
import { Reveal } from "@/features/content/components/Reveal";

type PathCard = {
  title: string;
  text: string;
  cta: string;
};

const PATH_ICONS = [Store, ShoppingBag, Coffee];
const PATH_HREFS = ["vorbestellen", "sortiment", "kafe"];

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
  const supportedLocale = parseSupportedLocale(locale);
  const t = await getTranslations("home");
  const paths = t.raw("paths") as PathCard[];
  const steps = t.raw("steps") as string[];

  return (
    <div className="bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBakeryJsonLd(supportedLocale)),
        }}
      />
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-brand-deep text-cream">
        <div
          className="hero-still absolute inset-0 h-full w-full bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url(/hero-oven.jpg)" }}
        />
        <video
          className="hero-video absolute inset-0 h-full w-full object-cover opacity-50"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-oven.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/hero-oven.mp4" type="video/mp4" />
        </video>
        <div className="hero-vignette absolute inset-0" />
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col justify-end gap-10 px-4 py-12 sm:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="hero-rise mb-5 text-sm font-semibold text-amber">
              {t("eyebrow")}
            </p>
            <h1 className="hero-rise hero-rise-2 font-display text-5xl font-semibold leading-[0.96] sm:text-7xl lg:text-8xl">
              {t("title")}
            </h1>
            <p className="hero-rise hero-rise-3 mt-6 max-w-2xl text-lg leading-8 text-cream/80 sm:text-xl">
              {t("intro")}
            </p>
            <div className="hero-rise hero-rise-3 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/${supportedLocale}/vorbestellen`}
                className="btn-amber arrow-slide"
              >
                {t("primaryCta")}
                <ArrowRight className="size-5" />
              </Link>
              <Link
                href={`/${supportedLocale}/sortiment`}
                className="btn-ghost-dark"
              >
                {t("secondaryCta")}
              </Link>
            </div>
          </div>

          <div className="hero-rise hero-rise-4 flex flex-col gap-4">
            <p className="border-t border-white/20 pt-5 text-sm text-cream/80">
              {t("heroNote")}
            </p>
            <div className="inline-flex w-fit items-center gap-3 rounded-lg border border-amber/50 bg-brand-deep/72 px-4 py-3 shadow-card">
              <span>{t("cutoffLabel")}</span>
              <strong className="text-amber">{t("cutoffTime")}</strong>
            </div>
          </div>
        </div>
      </section>

      <section
        id="vorbestellen"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8"
      >
        <Reveal>
          <h2 className="font-display text-4xl font-semibold">
            {t("pathsTitle")}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {paths.map((path, index) => {
            const Icon = PATH_ICONS[index];
            const href = `/${supportedLocale}/${PATH_HREFS[index]}`;

            return (
              <Reveal key={path.title} delayMs={index * 120}>
                <Link
                  href={href}
                  className="group flex min-h-64 flex-col justify-between gap-8 rounded-lg bg-white/75 p-7 ring-1 ring-brand-deep/5 transition-shadow duration-300 hover:shadow-card"
                >
                  <div>
                    <span className="flex size-12 items-center justify-center rounded-full bg-amber-soft text-brand-deep">
                      <Icon className="size-6" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-6 text-2xl font-semibold">{path.title}</h3>
                    <p className="mt-4 leading-7 text-ink/72">{path.text}</p>
                  </div>
                  <p className="flex items-center gap-2 font-semibold text-brand-dark">
                    {path.cta}
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={2}
                    />
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="font-display text-4xl font-semibold">
              {t("stepsTitle")}
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-ink/70">
              {t("intro")}
            </p>
          </div>
          <ol className="max-w-2xl">
            {steps.map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-t border-brand-deep/15 py-7 first:border-t-0 first:pt-0"
              >
                <span className="font-display text-3xl font-medium italic text-amber">
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
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8"
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
          <CategoryGallery />
        </div>
      </section>

      <ConversionSections
        title={CONVERSION.title}
        text={CONVERSION.text}
        cards={CONVERSION.cards}
      />
    </div>
  );
}
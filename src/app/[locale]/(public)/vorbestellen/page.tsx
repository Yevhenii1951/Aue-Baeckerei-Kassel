import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PreorderFlow } from "@/features/ordering/PreorderFlow";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { parseSupportedLocale } from "@/features/seo/site";

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vorbestellen" });

  return buildPublicMetadata({
    locale: parseSupportedLocale(locale),
    path: "/vorbestellen",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function VorbestellenPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<React.ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("vorbestellen");

  return (
    <div className="bg-cream">
      <section className="border-b border-brand-deep/10 bg-paper">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8">
          <p className="text-sm font-semibold text-sage">{t("eyebrow")}</p>
          <h1 className="mt-4 font-display text-5xl font-semibold">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-ink/72">{t("intro")}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
        <PreorderFlow locale={parseSupportedLocale(locale)} />
      </section>
    </div>
  );
}
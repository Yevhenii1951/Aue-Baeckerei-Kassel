import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckoutFlow } from "@/features/ordering/CheckoutFlow";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { parseSupportedLocale } from "@/features/seo/site";
import { isEnvGroupEnabled } from "@/lib/env/groups";

type KassePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ payment?: string }>;
};

export async function generateMetadata({
  params,
}: KassePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kasse" });

  return buildPublicMetadata({
    locale: parseSupportedLocale(locale),
    path: "/kasse",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function KassePage({
  params,
  searchParams,
}: KassePageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kasse");
  const { payment } = await searchParams;

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
        <CheckoutFlow
          locale={parseSupportedLocale(locale)}
          paymentsEnabled={isEnvGroupEnabled("payments")}
          paymentCancelled={payment === "cancelled"}
        />
      </section>
    </div>
  );
}
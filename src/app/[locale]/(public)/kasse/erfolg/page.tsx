import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { parseSupportedLocale } from "@/features/seo/site";

type SuccessPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
};

export async function generateMetadata({
  params,
}: SuccessPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kasse" });

  // Thank-you page: reachable by URL and by the Stripe redirect, never indexed.
  return {
    ...buildPublicMetadata({
      locale: parseSupportedLocale(locale),
      path: "/kasse/erfolg",
      title: t("successTitle"),
      description: t("successIntro"),
    }),
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: SuccessPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kasse");
  const { order } = await searchParams;

  return (
    <div className="bg-cream">
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8">
        <p className="text-sm font-semibold text-brand">{t("eyebrow")}</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-brand-deep">
          {t("successTitle")}
        </h1>
        <p className="mt-5 leading-7 text-ink/72">{t("successIntro")}</p>

        {order ? (
          <p className="mt-6 rounded-lg border border-brand-deep/10 bg-paper px-4 py-3 font-semibold text-brand-deep">
            {t("orderNumber")}: {order}
          </p>
        ) : null}

        <p className="mt-6 leading-7 text-ink/72">{t("successNext")}</p>

        <Link
          href={`/${locale}/sortiment`}
          className="btn-amber mt-8 inline-flex"
        >
          {t("successBack")}
        </Link>
      </section>
    </div>
  );
}

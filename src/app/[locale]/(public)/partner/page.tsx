import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { COMPANY_PAGES } from "@/features/content/companyPages";
import { CompanyPage } from "@/features/content/components/CompanyPage";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { parseSupportedLocale } from "@/features/seo/site";

const page = COMPANY_PAGES.partner;

type PartnerPageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({
  params,
}: PartnerPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPublicMetadata({
    locale: parseSupportedLocale(locale),
    path: page.path,
    title: page.metaTitle,
    description: page.description,
  });
}

export default async function PartnerPage({
  params,
}: PartnerPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CompanyPage page={page} locale={locale} />;
}

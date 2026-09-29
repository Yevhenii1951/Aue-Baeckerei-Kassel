import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LegalDraft from "@/features/legal/components/LegalDraft";
import LegalSectionBlock from "@/features/legal/components/LegalSectionBlock";
import {
  LOGS_SECTION,
  NECESSARY_DATA_SECTION,
  ORDER_DATA_SECTION,
  PAYMENT_MOCK_SECTION,
  PRE_LAUNCH_SECTION,
  THIRD_PARTY_SECTION,
} from "@/features/legal/privacySections";
import { parseSupportedLocale } from "@/features/seo/site";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "contactLegal" });
  return buildPublicMetadata({ locale: parseSupportedLocale(locale), path: "/datenschutz", title: translations("privacyTitle"), description: translations("legalWarning") });
}

// Impressum and Datenschutz stay German in every locale on purpose: German law
// requires the German wording, and a translated version would not be legally
// equivalent. ABE-030 therefore leaves this page out of the i18n scope.

export default async function PrivacyPage({ params }: Readonly<{ params: Promise<{ locale: string }> }>): Promise<React.ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations("contactLegal");
  const sections = [
    NECESSARY_DATA_SECTION,
    THIRD_PARTY_SECTION,
    ORDER_DATA_SECTION,
    PAYMENT_MOCK_SECTION,
    LOGS_SECTION,
    PRE_LAUNCH_SECTION,
  ];

  return (
    <LegalDraft title={translations("privacyTitle")} warning={translations("legalWarning")}>
      {sections.map((section) => (
        <LegalSectionBlock key={section.title} section={section} />
      ))}
    </LegalDraft>
  );
}

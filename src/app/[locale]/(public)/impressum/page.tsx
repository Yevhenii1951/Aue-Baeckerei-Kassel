import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LegalDraft from "@/features/legal/components/LegalDraft";
import { parseSupportedLocale } from "@/features/seo/site";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "contactLegal" });
  return buildPublicMetadata({ locale: parseSupportedLocale(locale), path: "/impressum", title: translations("imprintTitle"), description: translations("legalWarning") });
}

export default async function ImprintPage({ params }: Readonly<{ params: Promise<{ locale: string }> }>): Promise<React.ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations("contactLegal");
  return (
    <LegalDraft title={translations("imprintTitle")} warning={translations("legalWarning")}>
      <section><h2 className="text-xl font-semibold">Anbieter-Platzhalter</h2><p>Firmenname (Rechtsform)<br />Straße, PLZ Ort</p></section>
      <section><h2 className="text-xl font-semibold">Kontakt-Platzhalter</h2><p>Telefon: +49 000 0000000<br />E-Mail: kontakt@example.com</p></section>
      <p>Vertretungsberechtigte Person sowie Register- und Steuerangaben sind bewusst nicht erfunden und vor einem realen Start zu ergänzen.</p>
    </LegalDraft>
  );
}

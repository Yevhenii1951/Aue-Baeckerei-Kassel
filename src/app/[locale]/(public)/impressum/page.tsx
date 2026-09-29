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

// Impressum and Datenschutz stay German in every locale on purpose: German law
// requires the German wording, and a translated version would not be legally
// equivalent. ABE-030 therefore leaves this page out of the i18n scope.

export default async function ImprintPage({ params }: Readonly<{ params: Promise<{ locale: string }> }>): Promise<React.ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations("contactLegal");
  return (
    <LegalDraft title={translations("imprintTitle")} warning={translations("legalWarning")}>
      <section><h2 className="text-xl font-semibold">Anbieter-Platzhalter</h2><p>Firmenname (Rechtsform)<br />Straße, PLZ Ort</p></section>
      <section><h2 className="text-xl font-semibold">Kontakt-Platzhalter</h2><p>Telefon: +49 000 0000000<br />E-Mail: kontakt@example.com</p></section>
      <p>Vertretungsberechtigte Person sowie Register- und Steuerangaben sind bewusst nicht erfunden und vor einem realen Start zu ergänzen.</p>
      <section><h2 className="text-xl font-semibold">Hinweis zu diesem Portfolio-Projekt</h2>
        <p>Diese Website ist ein Portfolio- und Demonstrationsprojekt und stellt kein Angebot eines realen Geschäftsbetriebs dar. Produkte, Preise, Kontaktdaten und Bestellabläufe sind Beispieldaten.</p>
        <p>Die Produktfotos veranschaulichen das Sortiment. Ihre Herkunft und die jeweiligen Nutzungsbedingungen sind im Projekt-Repository dokumentiert. Sollen die Fotos nicht vom Betreiber selbst aufgenommen worden sein, sind die Quellen und Lizenzen vor einer kommerziellen Nutzung zu prüfen und die erforderlichen Nutzungsrechte zu klären.</p>
        <p>Alle Bilder werden vom eigenen Server ausgeliefert. Externe Bild-CDNs, Tracking und Einbindungen Dritter sind nicht Bestandteil dieser Website.</p>
      </section>
    </LegalDraft>
  );
}

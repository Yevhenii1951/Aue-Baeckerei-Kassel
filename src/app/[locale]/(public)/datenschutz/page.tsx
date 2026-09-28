import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LegalDraft from "@/features/legal/components/LegalDraft";
import { parseSupportedLocale } from "@/features/seo/site";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "contactLegal" });
  return buildPublicMetadata({ locale: parseSupportedLocale(locale), path: "/datenschutz", title: translations("privacyTitle"), description: translations("legalWarning") });
}

export default async function PrivacyPage({ params }: Readonly<{ params: Promise<{ locale: string }> }>): Promise<React.ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations("contactLegal");
  return (
    <LegalDraft title={translations("privacyTitle")} warning={translations("legalWarning")}>
      <section><h2 className="text-xl font-semibold">Technisch notwendige Daten</h2><p>Diese Basis speichert technisch notwendige Einstellungen ohne Werbe-Tracking. Es ist kein Kundenkonto erforderlich.</p></section>
      <section><h2 className="text-xl font-semibold">Optionale Inhalte Dritter</h2>
        <p>Externe Inhalte werden erst nach Ihrer ausdrücklichen Zustimmung geladen. Die Website startet im technisch notwendigen Modus und ruft vor der Zustimmung keine Drittanbieter-Server ab.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Notwendig:</strong> Warenkorb, Abhol- und Lieferauswahl, Sprachauswahl. Diese Werte liegen ausschließlich lokal im Browser (localStorage) und werden nicht übertragen.</li>
          <li><strong>Karte (optional):</strong> OpenStreetMap-Kacheln und Kartendaten von <code>openstreetmap.org</code>. Beim Laden dieser Inhalte sieht der Betreiber von OpenStreetMap Ihre IP-Adresse. Die Zustimmung gilt bis zum Widerruf und lässt sich im Seitenfuß jederzeit widerrufen.</li>
        </ul>
        <p>Nicht eingesetzt und daher nicht beschrieben: Analyse- oder Trackingdienste, Google Reviews, Instagram-Einbettungen, Werbenetzwerke. Bewertungen oder Social-Media-Inhalte werden nicht nachgeladen.</p>
      </section>
      <section><h2 className="text-xl font-semibold">Vor dem realen Betrieb</h2><p>Verantwortlicher, Auftragsverarbeiter, Rechtsgrundlagen, Empfänger, Übermittlungen, konkrete Speicherfristen und Betroffenenrechte müssen anhand der tatsächlichen Konfiguration geprüft und ergänzt werden.</p></section>
    </LegalDraft>
  );
}

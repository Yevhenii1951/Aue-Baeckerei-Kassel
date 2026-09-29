export type CompanySlug = "kontakt" | "kafe" | "karriere" | "partner";

export type CompanyPage = {
  slug: CompanySlug;
  path: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  notice: string;
  facts: { label: string; value: string }[];
  highlights: { title: string; text: string }[];
  photoSlots?: { title: string; text: string; image: string; alt: string }[];
  cta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

/**
 * The same convention as the local-SEO pages: the copy lives in one German
 * content module and renders unchanged in every locale, because a translated
 * marketing page would be a second, worse page. Only the chrome around it is
 * localised. Contact data is taken from the sources that already exist —
 * the bakery JSON-LD for address and hours, the Impressum placeholders for
 * phone and mail — and is never invented.
 */

const CONTACT_PAGE: CompanyPage = {
  slug: "kontakt",
  path: "/kontakt",
  title: "So findest du uns",
  metaTitle: "Kontakt | Aue Bäckerei Kassel am Bebelplatz",
  description:
    "Adresse, Öffnungszeiten und Kontaktwege der Handwerksbäckerei am Bebelplatz 12 in Kassel. Liefergebiet, Vorbestellung und Öffnungszeiten im Überblick.",
  intro:
    "Die Backstube liegt am Bebelplatz 12 zwischen Karlsaue und Innenstadt. Wer vorbeikommt, riecht es zuerst; wer Brot braucht, bestellt bis 20:00 Uhr für den nächsten Tag.",
  notice:
    "Diese Seite ist Teil einer Portfolio-Demo. Telefonnummer und E-Mail-Adresse sind Platzhalter und vor einem echten Livegang zu ersetzen.",
  facts: [
    { label: "Adresse", value: "Bebelplatz 12, 34119 Kassel" },
    {
      label: "Öffnungszeiten",
      value: "Mo–Fr 07:00–18:00 · Sa 08:00–16:00 · So Ruhetag",
    },
    { label: "Telefon", value: "+49 000 0000000" },
    { label: "E-Mail", value: "kontakt@example.com" },
    { label: "Vorbestellung bis", value: "20:00 Uhr für den Folgetag" },
    { label: "Liefergebiet", value: "Kassel in drei Zonen bis 8 km" },
  ],
  highlights: [
    {
      title: "Vorbestellen statt anstehen",
      text: "Abholung läuft in 30-Minuten-Fenstern. Du wählst das Fenster, holst es ab und gehst weiter — das Brot ist abends für dich gebacken.",
    },
    {
      title: "Lieferung in drei Zonen",
      text: "Die Postleitzahl entscheidet über Gebühr und Zeitfenster. Bis 8 km ab Bebelplatz, Express in Zone 1 und 2.",
    },
    {
      title: "Fragen zur Zutatenliste",
      text: "Zutaten und Allergene stehen auf jeder Produktseite. Unklar? Frag im Verkauf oder ruf in der Backstube an.",
    },
  ],
  cta: { label: "Jetzt vorbestellen", href: "/vorbestellen" },
  secondaryCta: { label: "Liefergebiet prüfen", href: "/lieferung" },
};

const CAFE_PAGE: CompanyPage = {
  slug: "kafe",
  path: "/kafe",
  title: "Café an der Backstube",
  metaTitle: "Café in Kassel | Kaffee, Kuchen und Brot am Bebelplatz",
  description:
    "Café an der Backstube am Bebelplatz in Kassel: Kaffee am Fenster, Kuchen aus der Vitrine und frisches Brot zum Mitnehmen. Öffnungszeiten Mo bis Sa.",
  intro:
    "Unser Café ist die ruhige Hälfte der Backstube: Plätze am Fenster, ein Tresen und eine Vitrine, die nur zeigt, was der Ofen am selben Morgen hervorgebracht hat. Kein festes Menüprogramm — der Teig entscheidet, und die Preise stehen an der Vitrine.",
  notice:
    "Die Aufnahmen stammen aus dem laufenden Betrieb. Für den Livegang sind Quelle und Lizenz der Fotos noch zu dokumentieren.",
  facts: [
    {
      label: "Öffnungszeiten",
      value: "Mo–Fr 07:00–18:00 · Sa 08:00–16:00 · So Ruhetag",
    },
    { label: "Adresse", value: "Bebelplatz 12, 34119 Kassel" },
    { label: "Plätze", value: "Fensterplätze und Tresen" },
    { label: "Küche", value: "Filter und Espresso, Kuchen aus der Vitrine" },
  ],
  highlights: [
    {
      title: "Cappuccino + Zimtschnecke",
      text: "Der schnelle Klassiker für den Vormittag, warm, süß und nicht zu schwer.",
    },
    {
      title: "Earl Grey + Käsekuchen",
      text: "Ruhiger Nachmittag am Fenster mit cremigem Kuchen und Bergamotte.",
    },
    {
      title: "Caffè Crema + Brownie",
      text: "Kräftiger Kaffee zu Schokolade, ideal für die kleine Arbeitspause.",
    },
    {
      title: "Mango Lassi + Apfel-Mandel-Schnecke",
      text: "Fruchtig, vegan möglich und perfekt für warme Kasseler Tage.",
    },
  ],
  photoSlots: [
    {
      title: "Fensterplatz",
      text: "Der helle Sitzbereich am Fenster mit Kaffee und Zeitung — der Platz, den Stammgäste zuerst besetzen.",
      image: "/cafe/fensterplatz-1.webp",
      alt: "Sitzbereich am Fenster des Cafés mit Kaffee und Zeitung",
    },
    {
      title: "Fensterplatz II",
      text: "Die zweite Perspektive vom Fensterplatz, mit Blick in den Gastraum.",
      image: "/cafe/fensterplatz-2.webp",
      alt: "Zweite Perspektive vom Fensterplatz des Cafés",
    },
    {
      title: "Backstubenblick",
      text: "Ofen, Hände und frisches Brot — die Verbindung zwischen Café und Handwerk.",
      image: "/cafe/backstubenblick.webp",
      alt: "Blick in die Backstube mit Ofen und frischem Brot",
    },
  ],
  cta: { label: "Sortiment ansehen", href: "/sortiment" },
  secondaryCta: { label: "Brot vorbestellen", href: "/vorbestellen" },
};

const CAREER_PAGE: CompanyPage = {
  slug: "karriere",
  path: "/karriere",
  title: "Arbeiten bei uns",
  metaTitle: "Karriere | Aue Bäckerei Kassel",
  description:
    "Arbeiten in einer Handwerksbäckerei in Kassel: Frühschicht in der Backstube, Verkauf am Tresen und ein Team, das mit Uhrzeiten statt mit Meetings arbeitet.",
  intro:
    "Die Backstube startet um vier Uhr. Wer morgens gern weiß, was er backt, ist hier richtig. Wir suchen Menschen, die zuverlässig sind, früh anfangen wollen und gern mit den Händen arbeiten.",
  notice:
    "Konkrete Stellenanzeigen und Arbeitszeiten nennt dieser Betrieb erst mit einem echten Personalbedarf. Bis dahin sammeln wir Initiativbewerbungen.",
  facts: [
    { label: "Bereiche", value: "Backstube, Verkauf, Auslieferung" },
    { label: "Schichtbeginn", value: "Frühschist ab 04:00 Uhr" },
    { label: "Ausbildung", value: "Bäcker:in, Konditor:in, Verkauf" },
    { label: "Bewerbung", value: "kontakt@example.com" },
  ],
  highlights: [
    {
      title: "Frühschicht mit Ende am Nachmittag",
      text: "Die Schicht beginnt vor der Stadt und ist fertig, wenn die Liefertouren laufen. Danach ist Schluss.",
    },
    {
      title: "Handwerk vor Prozess",
      text: "Teigführung, Ofentemperatur, Ausbackgrad: wer hier arbeitet, lernt das Handwerk von Grund auf.",
    },
    {
      title: "Werkzeug und Arbeitskleidung",
      text: "Backstube, Waage und Arbeitskleidung werden gestellt. Über die Details sprechen wir im Gespräch.",
    },
  ],
  cta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  secondaryCta: { label: "Café ansehen", href: "/kafe" },
};

export const CONVERSION = {
  title: "Mehr als eine Bäckertüte",
  text: "Für Kassel, Familien und Büros: Lieferung, Brot-Abo und Catering bleiben bewusst einfache Anfrage-Flows, bis echte Zahlungs- und Lieferintegrationen folgen.",
  cards: [
    {
      title: "Lieferung in Kassel",
      text: "Innenstadt frei ab 20 €, weitere Stadtteile mit fairer Lieferpauschale. PLZ-Prüfung und Karte folgen als consent-sicherer Schritt.",
      meta: "Zone 1–3",
      cta: "Liefergebiet prüfen",
    },
    {
      title: "Brot-Abo",
      text: "Single, Familie oder Flex: wöchentlich frisches Brot und Brötchen, mit Urlaubspause und Abholung oder Lieferung.",
      meta: "ab 12,90 € pro Woche",
      cta: "Abo vormerken",
    },
    {
      title: "Firmenservice",
      text: "Brotzeit-Boxen, Frühstück im Büro und Konferenzverpflegung für Teams in Kassel.",
      meta: "B2B auf Rechnung",
      cta: "Anfrage vorbereiten",
    },
  ],
};

const PARTNER_PAGE: CompanyPage = {
  slug: "partner",
  path: "/partner",
  title: "Partner werden",
  metaTitle: "Partner werden | Brot-Abo, Lieferung und Firmenservice",
  description:
    "Partner werden bei einer Handwerksbäckerei in Kassel: Brot-Abo, Lieferung in drei Zonen und Firmenservice für Büros und Teams.",
  intro:
    "Lieferung, Brot-Abo und Firmenservice laufen über Anfragen statt über einen B2B-Shop. Das ist Absicht: Mengen, Rhythmus und Abholung stimmen wir gemeinsam ab, bevor etwas zugesagt wird.",
  notice:
    "Angebote und Konditionen entstehen aus dem jeweiligen Gespräch. Die genannten Startpreise sind Richtwerte der Demo.",
  facts: [
    { label: "Brot-Abo", value: CONVERSION.cards[1].meta },
    { label: "Lieferung", value: "Zone 1–3, frei ab 20 €" },
    { label: "Firmenservice", value: CONVERSION.cards[2].meta },
    { label: "Anfrage", value: "kontakt@example.com" },
  ],
  highlights: CONVERSION.cards.map((card) => ({
    title: `${card.title} · ${card.meta}`,
    text: card.text,
  })),
  cta: { label: "Liefergebiet prüfen", href: "/lieferung" },
  secondaryCta: { label: "Sortiment ansehen", href: "/sortiment" },
};

export const COMPANY_PAGES: Record<CompanySlug, CompanyPage> = {
  kontakt: CONTACT_PAGE,
  kafe: CAFE_PAGE,
  karriere: CAREER_PAGE,
  partner: PARTNER_PAGE,
};

export const COMPANY_PAGE_LIST: CompanyPage[] = Object.values(COMPANY_PAGES);

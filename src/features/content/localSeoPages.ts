export type LocalSeoPage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  facts: { label: string; value: string }[];
  highlights: { title: string; text: string }[];
  cta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export const LOCAL_SEO_PAGES: LocalSeoPage[] = [
  {
    slug: "lieferung-kassel",
    title: "Brotlieferung in Kassel",
    metaTitle: "Brotlieferung Kassel | Lieferzonen und Abholung | Aue Bäckerei",
    description:
      "Backstube in Kassel: Brotlieferung in drei Zonen rund um die Innenstadt. Liefergebühr, Freigrenze und Abholzeitfenster im Überblick, PLZ-Prüfung ohne Konto.",
    intro:
      "Unser Liefergebiet reicht von der Kasseler Innenstadt bis in die angrenzenden Stadtteile. Sie prüfen Ihre Postleitzahl, sehen die Gebühr für Ihre Zone und wählen ein Zeitfenster — ohne Kundenkonto und ohne Vorkasse.",
    facts: [
      { label: "Zone 1 · bis 2 km", value: "PLZ 34117, 34119 · 2,50 € · frei ab 20,00 €" },
      { label: "Zone 2 · bis 5 km", value: "PLZ 34121, 34123, 34125, 34128 · 4,50 € · frei ab 30,00 €" },
      { label: "Zone 3 · bis 8 km", value: "PLZ 34127, 34130, 34131, 34132, 34134 · 6,50 € · frei ab 40,00 €" },
    ],
    highlights: [
      {
        title: "Zeitfenster statt fixer Uhrzeit",
        text: "Sie wählen ein Lieferfenster zwischen 10:00 und 20:00 Uhr. Express ist in Zone 1 und 2 möglich, wenn Sie bis 12:00 Uhr bestellen.",
      },
      {
        title: "Abholung bleibt kostenlos",
        text: "Wer nicht liefern lassen möchte, holt im Zeitfenster ab. Für die Backstube ist das der einfachste Weg.",
      },
      {
        title: "Karte erst nach Zustimmung",
        text: "Die Übersichtskarte kommt von OpenStreetMap und wird erst geladen, wenn Sie zustimmen. Die PLZ-Prüfung funktioniert auch ohne Karte.",
      },
    ],
    cta: { label: "Liefergebiet prüfen", href: "/lieferung" },
    secondaryCta: { label: "Sortiment ansehen", href: "/sortiment" },
  },
  {
    slug: "brot-abo-kassel",
    title: "Brot-Abo in Kassel",
    metaTitle: "Brot-Abo Kassel | Wöchentlich frisches Brot | Aue Bäckerei",
    description:
      "Brot-Abo in Kassel für Single, Familie und Flex: wöchentlich frisches Brot und Brötchen aus Nordhessen, mit Abholung oder Lieferung und Pause im Urlaub.",
    intro:
      "Ein Abo ist der einfachste Weg, jede Woche Sauerteigbrot und Brötchen zu bekommen, ohne morgens zur Backstube zu laufen. Sie legen Umfang und Rhythmus fest und pausieren im Urlaub.",
    facts: [
      { label: "Rhythmus", value: "wöchentlich, mit Urlaubspause" },
      { label: "Abholung oder Lieferung", value: "beides möglich" },
      { label: "Zutaten", value: "regional aus Nordhessen" },
    ],
    highlights: [
      {
        title: "Sauerteig mit langer Teigführung",
        text: "Der Teig bekommt Zeit statt Schnellkorn. Das ist der Unterschied, den Sie am ersten Sonntag schmecken.",
      },
      {
        title: "Pause ohne Diskussion",
        text: "Im Urlaub läuft das Abo weiter, aber ohne Abholung und ohne Lieferung. Es entstehen keine Leerlieferungen.",
      },
      {
        title: "Vom Sortiment aus wählen",
        text: "Brot, Brötchen und Feingebäck lassen sich kombinieren — der Warenkorb merkt sich Ihre Auswahl für den nächsten Durchgang.",
      },
    ],
    cta: { label: "Sortiment für das Abo wählen", href: "/sortiment" },
    secondaryCta: { label: "Abholung planen", href: "/vorbestellen" },
  },
  {
    slug: "catering-kassel",
    title: "Catering und Firmenservice in Kassel",
    metaTitle: "Catering Kassel | Brotzeit-Boxen für Teams | Aue Bäckerei",
    description:
      "Brotzeit-Boxen, Frühstück im Büro und Konferenzverpflegung aus einer Kasseler Handwerksbäckerei. Lieferung ins Büro, Abrechnung auf Rechnung.",
    intro:
      "Für Teams in Kassel beliefern wir Frühstück und Brotzeit ins Büro. Sie stimmen Menge, Zeitpunkt und Lieferadresse ab, wir liefern in Ihre Zone.",
    facts: [
      { label: "Sorten", value: "Brotzeit-Boxen, Frühstück, Konferenzverpflegung" },
      { label: "Abrechnung", value: "auf Rechnung für Firmen" },
      { label: "Lieferung", value: "im Kasseler Liefergebiet, auch ins Büro" },
    ],
    highlights: [
      {
        title: "Frühstück, das pünktlich ankommt",
        text: "Wir liefern vor Beginn der Besprechung, nicht irgendwann am Vormittag. Das Zeitfenster bestimmen Sie.",
      },
      {
        title: "Boxen statt Einzelstücke",
        text: "Brot, Brötchen und Aufstrich sind als Box zusammengestellt. Auf Wunsch mit vegetarischer Auswahl.",
      },
      {
        title: "Allergene gekennzeichnet",
        text: "Zutaten und Allergene sind auf den Produkten ausgewiesen — für die Information Ihrer Gäste.",
      },
    ],
    cta: { label: "Frühstückssortiment ansehen", href: "/sortiment" },
    secondaryCta: { label: "Lieferzone prüfen", href: "/lieferung" },
  },
  {
    slug: "cafe-kassel",
    title: "Café in Kassel",
    metaTitle: "Café Kassel | Kaffee und Kuchen zum Mitnehmen | Aue Bäckerei",
    description:
      "Café in Kassel zwischen Karlsaue und Bebelplatz: Kaffee aus der Region, Kuchen aus der Vitrine und Brot zum Mitnehmen. Öffnungszeiten Mo bis Sa.",
    intro:
      "Das Café ist die ruhige Seite der Backstube: Kaffee am Fenster, Kuchen in der Vitrine und eine Pause zwischen Karlsaue und Bebelplatz. Sie können auch Brot für unterwegs mitnehmen.",
    facts: [
      { label: "Öffnungszeiten", value: "Mo–Fr 07:00–18:00 · Sa 08:00–16:00 · So Ruhetag" },
      { label: "Kaffee", value: "Cappuccino, Caffè Crema, Earl Grey, Mango Lassi" },
      { label: "Kuchen", value: "Zimtschnecke, Käsekuchen, Brownie, Streuselkuchen" },
    ],
    highlights: [
      {
        title: "Kombinationen, die funktionieren",
        text: "Cappuccino und Zimtschnecke für den schnellen Morgen, Earl Grey mit Käsekuchen für den ruhigen Nachmittag.",
      },
      {
        title: "Kuchen aus der eigenen Backstube",
        text: "Was in der Vitrine liegt, wurde hier gebacken — nicht von einem Lieferanten zugeliefert.",
      },
      {
        title: "Brot zum Mitnehmen",
        text: "Ohne Termin vorbeikommen, ein Sauerteigbrot mitnehmen und weitergehen.",
      },
    ],
    cta: { label: "Sortiment ansehen", href: "/sortiment" },
    secondaryCta: { label: "Abholung vorbestellen", href: "/vorbestellen" },
  },
  {
    slug: "sauerteigbrot-kassel",
    title: "Sauerteigbrot aus Kassel",
    metaTitle: "Sauerteigbrot Kassel | Lange Teigführung | Aue Bäckerei",
    description:
      "Sauerteigbrot aus einer Kasseler Handwerksbäckerei: lange Teigführung, regionale Zutaten aus Nordhessen, vielfältige Allergene gekennzeichnet.",
    intro:
      "Sauerteig ist Geduld. Wir geben dem Teig Zeit für die Fermentation und arbeiten mit Getreide aus Nordhessen. Das Ergebnis ist ein Brot, das länger haltbar ist und echter schmeckt.",
    facts: [
      { label: "Teigführung", value: "lang, mit Sauerteigstarter" },
      { label: "Getreide", value: "regional aus Nordhessen" },
      { label: "Sorten", value: "Bauernlaib, Roggenbauer, Dinkel, Vollkorn, Walnussbrot" },
    ],
    highlights: [
      {
        title: "Brot, das über Tage bleibt",
        text: "Durch die lange Teigführung hält ein Sauerteigbrot länger. Für den Vorrat zu Hause ist das der praktische Unterschied.",
      },
      {
        title: "Dinkel und Roggen ohne Kompromiss",
        text: "Wenn Dinkel oder Roggen im Teig sind, sind sie im Produkt klar ausgewiesen — mit Zutaten und Allergenen.",
      },
      {
        title: "Sortiment ansehen",
        text: "Im Sortiment stehen Sauerteig-, Dinkel- und Vollkornbrote mit Preis und Stückgewicht.",
      },
    ],
    cta: { label: "Brot im Sortiment finden", href: "/sortiment" },
    secondaryCta: { label: "Vorbestellen für morgen", href: "/vorbestellen" },
  },
];

export function findLocalSeoPage(slug: string): LocalSeoPage | undefined {
  return LOCAL_SEO_PAGES.find((page) => page.slug === slug);
}

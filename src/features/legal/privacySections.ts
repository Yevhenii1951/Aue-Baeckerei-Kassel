export type LegalSection = {
  title: string;
  paragraphs: string[];
  list?: string[];
  closing?: string;
};

export const NECESSARY_DATA_SECTION: LegalSection = {
  title: "Technisch notwendige Daten",
  paragraphs: [
    "Diese Website arbeitet ohne Kundenkonto. Für den technisch fehlerfreien Betrieb speichert Ihr Browser Einstellungen lokal; sie werden nicht an uns übertragen.",
  ],
  list: [
    "Warenkorb (Artikel, Mengen, Preise) — lokal im Browser.",
    "Abhol- oder Lieferauswahl mit Datum und Zeitfenster — lokal im Browser.",
    "Sprachauswahl — lokal im Browser.",
  ],
};

export const THIRD_PARTY_SECTION: LegalSection = {
  title: "Optionale Inhalte Dritter",
  paragraphs: [
    "Externe Inhalte werden erst nach Ihrer ausdrücklichen Zustimmung geladen. Die Website startet im technisch notwendigen Modus und ruft vor der Zustimmung keinen Drittanbieter-Server ab.",
  ],
  list: [
    "Karte (optional): Kartenkacheln und Kartendaten von openstreetmap.org. Beim Laden dieser Inhalte sieht der Betreiber von OpenStreetMap Ihre IP-Adresse. Die Zustimmung gilt bis zum Widerruf und lässt sich im Seitenfuß jederzeit widerrufen.",
  ],
  closing:
    "Nicht eingesetzt und deshalb nicht beschrieben: Analyse- und Trackingdienste, Google Reviews, Instagram-Einbettungen, Werbenetzwerke. Bewertungen oder Social-Media-Inhalte werden nicht nachgeladen.",
};

export const ORDER_DATA_SECTION: LegalSection = {
  title: "Bestell- und Kontaktdaten",
  paragraphs: [
    "Wenn Sie eine Vorbestellung oder Bestellung absenden, übermitteln Sie Name, E-Mail-Adresse, Telefonnummer, die Lieferadresse bei Lieferung sowie Ihre Bestell- und Abholwünsche. Diese Angaben benötigen wir zur Vorbereitung und Abwicklung Ihrer Bestellung.",
    "Die Daten werden in der Bestellverwaltung gespeichert und nicht an Dritte weitergegeben. Eine Bestellung wird serverseitig aus den veröffentlichten Produktdaten berechnet; Ihre Eingaben können die Preise nicht verändern.",
  ],
};

export const PAYMENT_MOCK_SECTION: LegalSection = {
  title: "Zahlung (Demo)",
  paragraphs: [
    "Der Zahlungsdialog ist eine Vorführung. Es findet keine Zahlung und keine Belastung eines Zahlungsmittels statt, und es werden keine Zahlungs- oder Kartendaten erhoben.",
  ],
  closing:
    "Ein echter Zahlungsanbieter wird erst mit einem gesonderten, zustimmungspflichtigen Schritt eingebunden; dann gelten zusätzlich die Datenschutzbestimmungen dieses Anbieters.",
};

export const LOGS_SECTION: LegalSection = {
  title: "Server-Protokolle",
  paragraphs: [
    "Der Server protokolliert technische Vorgänge, um Fehler zu erkennen und die Sicherheit zu wahren. Protokolle enthalten technische Angaben wie Zeitpunkt, aufgerufene Seite, Statuscode und eine Korrelations-ID. Namen, Telefonnummern, E-Mail-Adressen und Adressen werden aus Protokolldaten entfernt.",
  ],
};

export const PRE_LAUNCH_SECTION: LegalSection = {
  title: "Vor dem realen Betrieb",
  paragraphs: [
    "Verantwortlicher, Auftragsverarbeiter, Rechtsgrundlagen, Empfänger, Übermittlungen, konkrete Speicherfristen und Betroffenenrechte sind anhand der tatsächlichen Konfiguration zu prüfen und zu ergänzen.",
  ],
};

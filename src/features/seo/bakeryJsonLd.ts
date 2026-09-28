import { localizedSiteUrl, type SiteLocale } from "./site";

export type BakeryJsonLd = {
  "@context": "https://schema.org";
  "@type": "Bakery";
  name: string;
  url: string;
  slogan: string;
  servesCuisine: string[];
  priceRange: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    postalCode: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  openingHoursSpecification: Array<{
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
};

export function buildBakeryJsonLd(locale: SiteLocale): BakeryJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "Aue-Bäckerei Kassel",
    url: localizedSiteUrl(locale, ""),
    slogan: "Morgens frisch, abends bestellt.",
    servesCuisine: ["Brot", "Brötchen", "Kuchen", "Kaffee", "Snacks"],
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bebelplatz 12",
      postalCode: "34119",
      addressLocality: "Kassel",
      addressRegion: "Hessen",
      addressCountry: "DE",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "08:00",
        closes: "16:00",
      },
    ],
  };
}

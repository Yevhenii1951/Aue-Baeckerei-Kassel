import { describe, expect, it } from "vitest";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { SITE_NAME, SITE_URL } from "@/features/seo/site";

describe("public metadata", () => {
  it("uses a self-canonical and matching locale alternatives", () => {
    expect(
      buildPublicMetadata({
        locale: "en",
        path: "/impressum",
        title: "Impressum",
        description: "Anbieterkennzeichnung.",
      }),
    ).toMatchObject({
      title: "Impressum",
      description: "Anbieterkennzeichnung.",
      alternates: {
        canonical: `${SITE_URL}/en/impressum`,
        languages: {
          de: `${SITE_URL}/de/impressum`,
          en: `${SITE_URL}/en/impressum`,
          uk: `${SITE_URL}/uk/impressum`,
          "x-default": `${SITE_URL}/de/impressum`,
        },
      },
    });
  });

  it("keeps the Open Graph URL in sync with the canonical URL", () => {
    const metadata = buildPublicMetadata({
      locale: "uk",
      path: "/datenschutz",
      title: "Datenschutz",
      description: "Verarbeitung personenbezogener Daten.",
    });

    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/uk/datenschutz`);
    expect(metadata.openGraph?.alternateLocale).toEqual(["de", "en"]);
  });

  it("points the Open Graph image at the generated locale route", () => {
    const metadata = buildPublicMetadata({
      locale: "de",
      path: "",
      title: "Aue-Bäckerei Kassel",
      description: "Handwerksbäckerei in Kassel.",
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/de/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ]);
  });
});

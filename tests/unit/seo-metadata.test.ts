import { describe, expect, it } from "vitest";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { SITE_URL } from "@/features/seo/site";

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
});

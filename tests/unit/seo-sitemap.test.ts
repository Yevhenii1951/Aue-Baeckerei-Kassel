import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/features/seo/site";

describe("localized sitemap", () => {
  it("publishes canonical locale alternatives for every indexable path", () => {
    const imprint = sitemap().find((entry) =>
      entry.url.endsWith("/de/impressum"),
    );

    expect(imprint).toEqual({
      url: `${SITE_URL}/de/impressum`,
      alternates: {
        languages: {
          de: `${SITE_URL}/de/impressum`,
          en: `${SITE_URL}/en/impressum`,
          uk: `${SITE_URL}/uk/impressum`,
          "x-default": `${SITE_URL}/de/impressum`,
        },
      },
    });
  });

  it("never leaks admin or token routes", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls.some((url) => /admin|token/i.test(url))).toBe(false);
    expect(new Set(urls)).toEqual(new Set(urls));
  });

  it("covers the home page in every locale", () => {
    const urls = sitemap().map((entry) => entry.url);

    for (const locale of ["de", "en", "uk"]) {
      expect(urls).toContain(`${SITE_URL}/${locale}`);
    }
  });
});

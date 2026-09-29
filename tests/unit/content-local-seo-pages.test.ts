import { describe, expect, it } from "vitest";
import {
  findLocalSeoPage,
  LOCAL_SEO_PAGES,
} from "@/features/content/localSeoPages";

const INTERNAL_HREFS = ["/sortiment", "/lieferung", "/vorbestellen", "/kasse"];

describe("local SEO pages", () => {
  it("covers the sales intents ABE-022 lists", () => {
    expect(LOCAL_SEO_PAGES.map((page) => page.slug)).toEqual([
      "lieferung-kassel",
      "brot-abo-kassel",
      "catering-kassel",
      "sauerteigbrot-kassel",
    ]);
  });

  it("leaves the café to its own page so the two cannot compete", () => {
    expect(findLocalSeoPage("cafe-kassel")).toBeUndefined();
    expect(LOCAL_SEO_PAGES.map((page) => page.slug)).not.toContain("cafe-kassel");
  });

  it("gives every page unique metadata", () => {
    const titles = LOCAL_SEO_PAGES.map((page) => page.metaTitle);
    const descriptions = LOCAL_SEO_PAGES.map((page) => page.description);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("mentions Kassel in title and description", () => {
    for (const page of LOCAL_SEO_PAGES) {
      expect(page.metaTitle).toContain("Kassel");
      expect(page.description.toLowerCase()).toContain("kassel");
    }
  });

  it("keeps metadata within sensible lengths for search snippets", () => {
    for (const page of LOCAL_SEO_PAGES) {
      expect(page.metaTitle.length).toBeLessThanOrEqual(70);
      expect(page.description.length).toBeLessThanOrEqual(175);
    }
  });

  it("gives every page a clear primary CTA to an existing route", () => {
    for (const page of LOCAL_SEO_PAGES) {
      expect(page.cta.label.length).toBeGreaterThan(0);
      expect(INTERNAL_HREFS).toContain(page.cta.href);
      expect(INTERNAL_HREFS).toContain(page.secondaryCta.href);
    }
  });

  it("adds no fake reviews, awards or certifications", () => {
    const copy = JSON.stringify(LOCAL_SEO_PAGES).toLowerCase();
    const forbidden = [
      "bewertung",
      "sterne",
      "ausgezeichnet",
      "zertifiziert",
      "kunden sagen",
      "top 10",
      "beste bäckerei",
    ];

    for (const claim of forbidden) {
      expect(copy).not.toContain(claim);
    }
  });

  it("finds a page by slug and returns undefined otherwise", () => {
    expect(findLocalSeoPage("lieferung-kassel")?.title).toBe("Brotlieferung in Kassel");
    expect(findLocalSeoPage("gibt-es-nicht")).toBeUndefined();
  });
});

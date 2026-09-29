import { describe, expect, it } from "vitest";
import {
  COMPANY_PAGES,
  COMPANY_PAGE_LIST,
  type CompanySlug,
} from "@/features/content/companyPages";
import { buildBakeryJsonLd } from "@/features/seo/bakeryJsonLd";

const KNOWN_HREFS = [
  "/sortiment",
  "/lieferung",
  "/vorbestellen",
  "/kontakt",
  "/kafe",
  "/kontakt",
];

function factValue(slug: CompanySlug, label: string): string {
  const fact = COMPANY_PAGES[slug].facts.find((entry) => entry.label === label);
  if (!fact) throw new Error(`${slug} has no fact "${label}"`);
  return fact.value;
}

describe("company pages", () => {
  it("ships the four pages the site chrome links to", () => {
    expect(COMPANY_PAGE_LIST.map((page) => page.slug)).toEqual([
      "kontakt",
      "kafe",
      "karriere",
      "partner",
    ]);
  });

  it("gives every page unique metadata within snippet lengths", () => {
    const titles = COMPANY_PAGE_LIST.map((page) => page.metaTitle);
    const descriptions = COMPANY_PAGE_LIST.map((page) => page.description);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);

    for (const page of COMPANY_PAGE_LIST) {
      expect(page.metaTitle.length).toBeLessThanOrEqual(70);
      expect(page.description.length).toBeLessThanOrEqual(175);
      expect(page.description.toLowerCase()).toContain("kassel");
    }
  });

  it("sends both calls to action to existing routes", () => {
    for (const page of COMPANY_PAGE_LIST) {
      expect(KNOWN_HREFS).toContain(page.cta.href);
      expect(KNOWN_HREFS).toContain(page.secondaryCta.href);
    }
  });

  it("keeps contact data in sync with the structured data", () => {
    const { address, openingHoursSpecification } = buildBakeryJsonLd("de");
    const [weekdays, saturday] = openingHoursSpecification;

    expect(factValue("kontakt", "Adresse")).toBe(
      `${address.streetAddress}, ${address.postalCode} ${address.addressLocality}`,
    );
    expect(factValue("kontakt", "Öffnungszeiten")).toContain(
      `${weekdays.opens}–${weekdays.closes}`,
    );
    expect(factValue("kontakt", "Öffnungszeiten")).toContain(
      `${saturday.opens}–${saturday.closes}`,
    );
  });

  it("marks the café gallery and the demo contact data as pending", () => {
    expect(COMPANY_PAGES.kafe.photoSlots).toHaveLength(3);
    expect(COMPANY_PAGES.kafe.notice.length).toBeGreaterThan(0);
    expect(COMPANY_PAGES.kontakt.notice).toContain("Platzhalter");
  });

  it("adds no fake reviews, awards or certifications", () => {
    const copy = JSON.stringify(COMPANY_PAGE_LIST).toLowerCase();
    const forbidden = [
      "bewertung",
      "sterne",
      "ausgezeichnet",
      "zertifiziert",
      "kunden sagen",
      "beste bäckerei",
    ];

    for (const claim of forbidden) {
      expect(copy).not.toContain(claim);
    }
  });
});

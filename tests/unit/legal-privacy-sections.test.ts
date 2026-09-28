import { describe, expect, it } from "vitest";
import {
  LOGS_SECTION,
  NECESSARY_DATA_SECTION,
  ORDER_DATA_SECTION,
  PAYMENT_MOCK_SECTION,
  PRE_LAUNCH_SECTION,
  THIRD_PARTY_SECTION,
  type LegalSection,
} from "@/features/legal/privacySections";

const allSections: LegalSection[] = [
  NECESSARY_DATA_SECTION,
  THIRD_PARTY_SECTION,
  ORDER_DATA_SECTION,
  PAYMENT_MOCK_SECTION,
  LOGS_SECTION,
  PRE_LAUNCH_SECTION,
];

const allCopy = allSections
  .flatMap((section) => [
    section.title,
    ...section.paragraphs,
    ...(section.list ?? []),
    section.closing ?? "",
  ])
  .join(" ")
  .toLowerCase();

describe("privacy sections", () => {
  it("covers the categories ABE-024 requires", () => {
    expect(allCopy).toContain("warenkorb");
    expect(allCopy).toContain("openstreetmap.org");
    expect(allCopy).toContain("bestell");
    expect(allCopy).toContain("zahlung");
    expect(allCopy).toContain("protokoll");
  });

  it("states that the payment step is a demo and takes no card data", () => {
    expect(allCopy).toContain("keine zahlung");
    expect(allCopy).toContain("keine zahlungs- oder kartendaten");
  });

  it("names the embeds that are deliberately absent", () => {
    expect(allCopy).toContain("nicht eingesetzt");
    expect(allCopy).toContain("google reviews");
  });

  it("keeps the placeholder status unmistakable", () => {
    expect(PRE_LAUNCH_SECTION.paragraphs.join(" ")).toContain(
      "zu prüfen",
    );
  });

  it("gives every section a unique heading", () => {
    const titles = allSections.map((section) => section.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("has no empty paragraphs", () => {
    for (const section of allSections) {
      expect(section.title.length).toBeGreaterThan(0);
      expect(section.paragraphs.length).toBeGreaterThan(0);
      for (const paragraph of section.paragraphs) {
        expect(paragraph.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

import { describe, expect, it } from "vitest";
import { buildBakeryJsonLd } from "@/features/seo/bakeryJsonLd";

describe("bakery JSON-LD", () => {
  it("describes Aue-Bäckerei as a local bakery in Kassel", () => {
    const jsonLd = buildBakeryJsonLd("de");

    expect(jsonLd["@type"]).toBe("Bakery");
    expect(jsonLd.name).toBe("Aue-Bäckerei Kassel");
    expect(jsonLd.address.addressLocality).toBe("Kassel");
    expect(jsonLd.servesCuisine).toContain("Brot");
    expect(jsonLd.url).toContain("/de");
  });
});

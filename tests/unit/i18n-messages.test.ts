import { describe, it, expect } from "vitest";
import { mergeMessagesWithGermanFallback } from "@/i18n/mergeMessages";
import { ALLERGEN_CODES, PRODUCT_CATEGORIES } from "@/features/catalog/types";
import de from "@/messages/de.json";
import en from "@/messages/en.json";
import uk from "@/messages/uk.json";

type LeafEntry = [string, unknown];

type MessageTree = { [key: string]: unknown };

function leafEntries(node: unknown, prefix = ""): LeafEntry[] {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    return [[prefix, node]];
  }
  return Object.entries(node as Record<string, unknown>).flatMap(([key, value]) =>
    leafEntries(value, prefix ? `${prefix}.${key}` : key),
  );
}

function stringPaths(messages: unknown): string[] {
  return leafEntries(messages)
    .filter(([, value]) => typeof value === "string")
    .map(([path]) => path);
}

describe("base German fallback merge", () => {
  it("keeps a German value when the locale lacks the key", () => {
    const merged = mergeMessagesWithGermanFallback(
      { nav: { home: "Startseite", menu: "Speisekarte" } },
      { nav: { menu: "Меню" } },
    );
    const nav = merged.nav as { home: string; menu: string };
    expect(nav.menu).toBe("Меню");
    expect(nav.home).toBe("Startseite");
  });

  it("never yields an empty block for missing translations", () => {
    const merged = mergeMessagesWithGermanFallback({ greeting: "Wilkommen" }, {});
    expect(merged.greeting).toBe("Wilkommen");
  });

  it("keeps locale values where present", () => {
    const merged = mergeMessagesWithGermanFallback(
      { nav: { office: "Kontakt" } },
      { nav: { office: "Contact" } },
    );
    expect((merged.nav as Record<string, string>).office).toBe("Contact");
  });
});

describe("base message files", () => {
  it("are valid JSON objects", () => {
    for (const messages of [de, en, uk]) {
      expect(messages).toBeTypeOf("object");
    }
  });

  it("never leaves a translated message empty", () => {
    for (const messages of [de, en, uk]) {
      for (const value of leafEntries(messages).map(([, value]) => value)) {
        if (typeof value === "string") {
          expect(value.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("have en/uk key paths as a subset of de (canonical German)", () => {
    const dePaths = new Set(leafEntries(de).map(([path]) => path));
    for (const messages of [en, uk]) {
      for (const [path, value] of leafEntries(messages)) {
        if (typeof value === "string") {
          expect(dePaths.has(path), `"${path}" exists in de`).toBe(true);
        }
      }
    }
  });

  it("translate every German key in en and uk", () => {
    const dePaths = stringPaths(de);
    for (const messages of [en, uk]) {
      const paths = new Set(stringPaths(messages));
      expect(dePaths.filter((path) => !paths.has(path))).toEqual([]);
    }
  });

  it("declare the same top-level namespaces in all locales", () => {
    for (const messages of [en, uk]) {
      expect(Object.keys(messages).sort()).toEqual(Object.keys(de).sort());
    }
  });

  it("cover every category and allergen code used by the catalogue", () => {
    for (const messages of [de, en, uk]) {
      const catalog = (messages as MessageTree).catalog as MessageTree;
      const categories = catalog.categories as MessageTree;
      const allergens = catalog.allergens as MessageTree;

      expect(Object.keys(categories).sort()).toEqual([...PRODUCT_CATEGORIES].sort());
      expect(Object.keys(allergens).sort()).toEqual([...ALLERGEN_CODES].sort());
    }
  });
});

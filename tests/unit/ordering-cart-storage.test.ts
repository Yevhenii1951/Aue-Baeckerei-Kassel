import { describe, expect, it } from "vitest";
import {
  CART_STORAGE_KEY,
  parseCartStorage,
  serializeCart,
} from "@/features/ordering/cartStorage";
import type { CartItemInput } from "@/features/ordering/cart";

const items: CartItemInput[] = [
  {
    productId: "hausbrot",
    name: "Hausbrot",
    category: "bread",
    unitPriceCents: 450,
    quantity: 2,
  },
  {
    productId: "caffe-crema",
    name: "Caffè Crema",
    category: "drinks",
    unitPriceCents: 350,
    quantity: 1,
  },
];

describe("cart storage", () => {
  it("round-trips a serialized cart", () => {
    expect(parseCartStorage(serializeCart(items))).toEqual(items);
  });

  it("returns an empty cart when nothing is stored", () => {
    expect(parseCartStorage(null)).toEqual([]);
  });

  it("falls back to an empty cart on malformed JSON", () => {
    expect(parseCartStorage("not json")).toEqual([]);
  });

  it("drops a line with an invalid shape instead of crashing", () => {
    const malformed = JSON.stringify([
      { productId: "", name: "x", category: "bread", unitPriceCents: -1, quantity: 0 },
    ]);

    expect(parseCartStorage(malformed)).toEqual([]);
  });

  it("drops a line with an unknown category", () => {
    const foreignRestaurantLine = JSON.stringify([
      {
        productId: "menu",
        name: "Menu",
        category: "fineDining",
        unitPriceCents: 2500,
        quantity: 1,
      },
    ]);

    expect(parseCartStorage(foreignRestaurantLine)).toEqual([]);
  });

  it("uses a versioned storage key", () => {
    expect(CART_STORAGE_KEY).toMatch(/^aue\.cart\.v\d+$/);
  });
});
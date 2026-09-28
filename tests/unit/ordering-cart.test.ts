import { describe, expect, it } from "vitest";
import {
  calculateCart,
  setCartItemQuantity,
  type CartItemInput,
} from "@/features/ordering/cart";

const cartItems: CartItemInput[] = [
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

describe("cart totals", () => {
  it("calculates line totals and subtotal in integer cents", () => {
    const cart = calculateCart(cartItems);

    expect(cart.lines.map((line) => line.lineTotalCents)).toEqual([900, 350]);
    expect(cart.subtotalCents).toBe(1250);
    expect(cart.totalCents).toBe(1250);
  });

  it("applies a breakfast bundle discount for bread plus drink", () => {
    const cart = calculateCart(cartItems, { breakfastBundle: true });

    expect(cart.discountCents).toBe(125);
    expect(cart.totalCents).toBe(1125);
  });

  it("updates quantities without mutating the original cart", () => {
    const updated = setCartItemQuantity(cartItems, "hausbrot", 3);

    expect(cartItems[0]?.quantity).toBe(2);
    expect(updated[0]?.quantity).toBe(3);
  });

  it("removes an item when quantity is zero", () => {
    const updated = setCartItemQuantity(cartItems, "caffe-crema", 0);

    expect(updated.map((item) => item.productId)).toEqual(["hausbrot"]);
  });
});

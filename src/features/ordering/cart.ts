import type { ProductCategory } from "@/features/catalog/types";

export type CartItemInput = {
  productId: string;
  name: string;
  category: ProductCategory;
  unitPriceCents: number;
  quantity: number;
};

export type CartLine = CartItemInput & {
  lineTotalCents: number;
};

export type CartTotals = {
  lines: CartLine[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
};

export type CartOptions = {
  breakfastBundle?: boolean;
};

export function calculateCart(
  items: CartItemInput[],
  options: CartOptions = {},
): CartTotals {
  const lines = items
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      ...item,
      lineTotalCents: item.unitPriceCents * item.quantity,
    }));
  const subtotalCents = lines.reduce(
    (total, line) => total + line.lineTotalCents,
    0,
  );
  const discountCents =
    options.breakfastBundle && hasBreadAndDrink(lines)
      ? Math.round(subtotalCents * 0.1)
      : 0;

  return {
    lines,
    subtotalCents,
    discountCents,
    totalCents: subtotalCents - discountCents,
  };
}

export function setCartItemQuantity(
  items: CartItemInput[],
  productId: string,
  quantity: number,
): CartItemInput[] {
  return items
    .map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(0, quantity) }
        : item,
    )
    .filter((item) => item.quantity > 0);
}

function hasBreadAndDrink(lines: CartLine[]): boolean {
  const hasBread = lines.some((line) => line.category === "bread");
  const hasDrink = lines.some((line) => line.category === "drinks");

  return hasBread && hasDrink;
}

import { z } from "zod";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/features/catalog/types";
import type { CartItemInput } from "./cart";

export const CART_STORAGE_KEY = "aue.cart.v1";

const categoryValues = PRODUCT_CATEGORIES as [
  ProductCategory,
  ...ProductCategory[],
];

const cartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(categoryValues),
  unitPriceCents: z.number().int().nonnegative(),
  quantity: z.number().int().min(1),
});

const cartItemsSchema = z.array(cartItemSchema);

export function parseCartStorage(raw: string | null): CartItemInput[] {
  if (raw === null) {
    return [];
  }
  try {
    return cartItemsSchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function serializeCart(items: CartItemInput[]): string {
  return JSON.stringify(items);
}
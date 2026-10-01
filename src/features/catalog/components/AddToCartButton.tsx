"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/features/ordering/cart-provider";
import type { Product } from "@/features/catalog/types";

type AddToCartButtonProps = {
  product: Product;
};

export function AddToCartButton({ product }: AddToCartButtonProps): React.ReactElement {
  const t = useTranslations("catalog");
  const { items, addToCart } = useCart();
  const quantity = items.find((item) => item.productId === product.id)?.quantity ?? 0;

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className="btn-amber text-center"
    >
      {quantity > 0 ? t("inCart", { count: quantity }) : t("addToCart")}
    </button>
  );
}
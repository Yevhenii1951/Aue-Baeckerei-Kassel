"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "@/features/ordering/cart-provider";

export function CartToggleButton() {
  const { items, isOpen, openCart } = useCart();
  const t = useTranslations("cart");
  const count = items.length;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-label={count > 0 ? t("openCount", { count }) : t("open")}
      className="relative inline-flex size-11 items-center justify-center rounded-lg border border-white/20 text-cream transition-colors duration-300 hover:border-amber hover:text-amber"
    >
      <ShoppingCart className="size-5" strokeWidth={1.75} aria-hidden="true" />
      {count > 0 ? (
        <span
          key={count}
          aria-hidden="true"
          className="cart-badge-pop absolute -right-1.5 -top-1.5 inline-grid size-5 place-items-center rounded-full bg-amber text-xs font-bold leading-5 text-brand-deep"
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

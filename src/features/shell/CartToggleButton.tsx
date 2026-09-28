"use client";

import { useCart } from "@/features/ordering/cart-provider";

export function CartToggleButton() {
  const { items, isOpen, openCart } = useCart();
  const count = items.length;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      className="inline-flex items-center gap-2 rounded-lg bg-amber px-3 py-2 font-semibold text-brand-deep"
    >
      Warenkorb
      {count > 0 ? (
        <span
          aria-label={`${count} Artikel`}
          className="size-5 rounded-full bg-brand-deep text-xs leading-5 text-cream"
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
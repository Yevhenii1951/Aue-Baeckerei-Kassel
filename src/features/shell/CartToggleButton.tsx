"use client";

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
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg bg-amber px-3 py-2 font-semibold text-brand-deep sm:justify-start"
    >
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sm:hidden"
      >
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      <span className="hidden sm:inline">{t("title")}</span>
      {count > 0 ? (
        <span
          aria-hidden="true"
          className="inline-grid size-5 place-items-center rounded-full bg-brand-deep text-xs leading-5 text-cream"
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

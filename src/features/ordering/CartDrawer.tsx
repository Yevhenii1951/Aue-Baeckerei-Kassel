"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { SiteLocale } from "@/features/seo/site";
import { formatEuroCents } from "@/lib/format";
import { useCart } from "./cart-provider";

type CartDrawerProps = {
  locale: SiteLocale;
};

export function CartDrawer({ locale }: CartDrawerProps) {
  const { isOpen, totals, changeQuantity, closeCart } = useCart();
  const t = useTranslations("cart");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // The store lives in a module singleton, so isOpen survives navigation. Without
  // this the drawer stays on top of the page the "Zur Vorbestellung" link leads to.
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        role="presentation"
        aria-hidden="true"
        onClick={closeCart}
        className="absolute inset-0 touch-none bg-ink/60 backdrop-blur-sm"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-paper px-4 py-4 shadow-panel sm:px-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-brand-deep">{t("title")}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            aria-label={t("close")}
            className="size-11 rounded-lg border border-brand-deep/15 text-lg text-brand-deep"
          >
            ×
          </button>
        </div>

        {totals.lines.length === 0 ? (
          <div className="grid flex-1 place-content-center gap-4 text-center">
            <p className="text-ink/65">{t("emptyCart")}</p>
            <Link
              href={`/${locale}/sortiment`}
              className="mx-auto min-h-11 rounded-lg bg-brand px-4 py-2 font-semibold text-cream"
            >
              {t("toAssortment")}
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-4 grid gap-3">
              {totals.lines.map((line) => (
                <li
                  key={line.productId}
                  className="rounded-lg border border-brand-deep/10 bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-brand-deep">
                        {line.name}
                      </p>
                      <p className="text-sm text-ink/65">
                        {line.quantity} x{" "}
                        {formatEuroCents(line.unitPriceCents, locale)}
                      </p>
                    </div>
                    <p className="font-semibold text-brand-deep">
                      {formatEuroCents(line.lineTotalCents, locale)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(line.productId, line.quantity - 1)
                      }
                      aria-label={t("decrease", { name: line.name })}
                      className="size-11 rounded-md border border-brand-deep/15 text-brand-deep"
                    >
                      –
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(line.productId, line.quantity + 1)
                      }
                      aria-label={t("increase", { name: line.name })}
                      className="size-11 rounded-md border border-brand-deep/15 text-brand-deep"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-1 border-t border-brand-deep/10 pt-4 text-sm text-ink/70">
              <p className="flex justify-between">
                <span>{t("subtotal")}</span>
                <span>{formatEuroCents(totals.subtotalCents, locale)}</span>
              </p>
              {totals.discountCents > 0 ? (
                <p className="flex justify-between text-amber">
                  <span>{t("bundle")}</span>
                  <span>-{formatEuroCents(totals.discountCents, locale)}</span>
                </p>
              ) : null}
              <p className="flex justify-between pt-2 text-base font-semibold text-brand-deep">
                <span>{t("total")}</span>
                <span>{formatEuroCents(totals.totalCents, locale)}</span>
              </p>
            </div>

            <Link
              href={`/${locale}/vorbestellen`}
              className="mt-6 min-h-11 rounded-lg bg-amber px-4 py-2 text-center font-semibold text-brand-deep"
            >
              {t("toPreorder")}
            </Link>
          </>
        )}
      </aside>
    </div>
  );
}
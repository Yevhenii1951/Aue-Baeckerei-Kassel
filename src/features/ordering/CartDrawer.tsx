"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { SiteLocale } from "@/features/seo/site";
import { useCart } from "./cart-provider";
import { formatPrice } from "./price";

type CartDrawerProps = {
  locale: SiteLocale;
};

export function CartDrawer({ locale }: CartDrawerProps) {
  const { isOpen, totals, changeQuantity, closeCart } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Warenkorb"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-paper px-4 py-4 shadow-panel sm:px-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-brand-deep">Warenkorb</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            aria-label="Warenkorb schließen"
            className="size-10 rounded-lg border border-brand-deep/15 text-lg text-brand-deep"
          >
            ×
          </button>
        </div>

        {totals.lines.length === 0 ? (
          <div className="grid flex-1 place-content-center gap-4 text-center">
            <p className="text-ink/65">Dein Warenkorb ist noch leer.</p>
            <Link
              href={`/${locale}/sortiment`}
              className="mx-auto rounded-lg bg-brand px-4 py-2 font-semibold text-cream"
            >
              Zum Sortiment
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
                        {line.quantity} x {formatPrice(line.unitPriceCents)}
                      </p>
                    </div>
                    <p className="font-semibold text-brand-deep">
                      {formatPrice(line.lineTotalCents)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(line.productId, line.quantity - 1)
                      }
                      aria-label={`${line.name} reduzieren`}
                      className="size-9 rounded-md border border-brand-deep/15 text-brand-deep"
                    >
                      –
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(line.productId, line.quantity + 1)
                      }
                      aria-label={`${line.name} erhöhen`}
                      className="size-9 rounded-md border border-brand-deep/15 text-brand-deep"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-1 border-t border-brand-deep/10 pt-4 text-sm text-ink/70">
              <p className="flex justify-between">
                <span>Zwischensumme</span>
                <span>{formatPrice(totals.subtotalCents)}</span>
              </p>
              {totals.discountCents > 0 ? (
                <p className="flex justify-between text-amber">
                  <span>Frühstücks-Bundle</span>
                  <span>-{formatPrice(totals.discountCents)}</span>
                </p>
              ) : null}
              <p className="flex justify-between pt-2 text-base font-semibold text-brand-deep">
                <span>Gesamt</span>
                <span>{formatPrice(totals.totalCents)}</span>
              </p>
            </div>

            <Link
              href={`/${locale}/vorbestellen`}
              className="mt-6 min-h-11 rounded-lg bg-amber px-4 py-2 text-center font-semibold text-brand-deep"
            >
              Zur Vorbestellung
            </Link>
          </>
        )}
      </aside>
    </div>
  );
}
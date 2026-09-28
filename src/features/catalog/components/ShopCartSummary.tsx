"use client";

import { useCart } from "@/features/ordering/cart-provider";
import { formatPrice } from "@/features/ordering/price";

export function ShopCartSummary(): React.ReactElement {
  const { items, totals, changeQuantity, openCart } = useCart();

  return (
    <aside className="sticky bottom-0 rounded-t-lg border border-brand-deep/10 bg-brand-deep p-4 text-cream shadow-panel lg:top-24 lg:rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Warenkorb</h2>
          <p className="mt-1 text-sm text-cream/70">
            {items.length === 0
              ? "Noch leer"
              : `${items.length} Positionen ausgewählt`}
          </p>
        </div>
        <p className="font-semibold text-amber">
          {formatPrice(totals.totalCents)}
        </p>
      </div>

      <div className="mt-4 grid max-h-72 gap-3 overflow-y-auto">
        {totals.lines.map((line) => (
          <div
            key={line.productId}
            className="grid grid-cols-[1fr_auto] gap-3 rounded-lg bg-white/10 p-3"
          >
            <div>
              <p className="font-medium">{line.name}</p>
              <p className="text-sm text-cream/65">
                {line.quantity} x {formatPrice(line.unitPriceCents)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  changeQuantity(line.productId, line.quantity - 1)
                }
                className="size-8 rounded-md border border-white/20"
                aria-label={`${line.name} reduzieren`}
              >
                -
              </button>
              <button
                type="button"
                onClick={() =>
                  changeQuantity(line.productId, line.quantity + 1)
                }
                className="size-8 rounded-md border border-white/20"
                aria-label={`${line.name} erhöhen`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {totals.discountCents > 0 ? (
        <p className="mt-4 text-sm text-amber">
          Frühstücks-Bundle: -{formatPrice(totals.discountCents)}
        </p>
      ) : null}

      <button
        type="button"
        className="mt-4 min-h-11 w-full rounded-lg bg-amber px-4 py-2 font-semibold text-brand-deep disabled:opacity-55"
        disabled={items.length === 0}
        onClick={openCart}
      >
        Zur Vorbestellung
      </button>
    </aside>
  );
}
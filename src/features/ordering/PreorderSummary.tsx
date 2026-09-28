"use client";

import { useCart } from "./cart-provider";
import { formatPrice } from "./price";

export function PreorderSummary(): React.ReactElement {
  const { items, totals } = useCart();

  return (
    <aside className="rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-brand-deep">
        Deine Auswahl
      </h2>
      <p className="mt-1 text-sm text-ink/65">
        {items.length} {items.length === 1 ? "Position" : "Positionen"}
      </p>

      <ul className="mt-4 grid gap-2">
        {totals.lines.map((line) => (
          <li
            key={line.productId}
            className="flex items-baseline justify-between gap-3 text-sm"
          >
            <span className="text-ink/75">
              {line.quantity} × {line.name}
            </span>
            <span className="font-medium text-brand-deep">
              {formatPrice(line.lineTotalCents)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-1 border-t border-brand-deep/10 pt-3 text-sm text-ink/70">
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
    </aside>
  );
}
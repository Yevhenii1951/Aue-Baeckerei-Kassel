"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatEuroCents } from "@/lib/format";
import { useCart } from "./cart-provider";
import type { CartTotals } from "./cart";

type PreorderSummaryProps = {
  deliveryFeeCents?: number | null;
  // The confirmation screen renders the order that was just submitted, while
  // the cart is already empty, so the totals are frozen at submit time.
  frozenTotals?: CartTotals | null;
};

export function PreorderSummary({
  deliveryFeeCents = null,
  frozenTotals = null,
}: PreorderSummaryProps): React.ReactElement {
  const { items, totals } = useCart();
  const tc = useTranslations("cart");
  const tv = useTranslations("vorbestellen");
  const locale = useLocale();
  const shown = frozenTotals ?? totals;
  const totalCents = shown.totalCents + (deliveryFeeCents ?? 0);

  return (
    <aside className="rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-brand-deep">
        {tv("selection")}
      </h2>
      <p className="mt-1 text-sm text-ink/65">
        {tv("itemCount", { count: frozenTotals ? shown.lines.length : items.length })}
      </p>

      <ul className="mt-4 grid gap-2">
        {shown.lines.map((line) => (
          <li
            key={line.productId}
            className="flex items-baseline justify-between gap-3 text-sm"
          >
            <span className="text-ink/75">
              {line.quantity} × {line.name}
            </span>
            <span className="font-medium text-brand-deep">
              {formatEuroCents(line.lineTotalCents, locale)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-1 border-t border-brand-deep/10 pt-3 text-sm text-ink/70">
        <p className="flex justify-between">
          <span>{tc("subtotal")}</span>
          <span>{formatEuroCents(shown.subtotalCents, locale)}</span>
        </p>
        {shown.discountCents > 0 ? (
          <p className="flex justify-between text-amber">
            <span>{tc("bundle")}</span>
            <span>-{formatEuroCents(shown.discountCents, locale)}</span>
          </p>
        ) : null}
        {deliveryFeeCents !== null ? (
          <p className="flex justify-between">
            <span>{tc("delivery")}</span>
            <span>
              {deliveryFeeCents === 0
                ? tc("free")
                : formatEuroCents(deliveryFeeCents, locale)}
            </span>
          </p>
        ) : null}
        <p className="flex justify-between pt-2 text-base font-semibold text-brand-deep">
          <span>{tc("total")}</span>
          <span>{formatEuroCents(totalCents, locale)}</span>
        </p>
      </div>
    </aside>
  );
}
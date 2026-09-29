"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatEuroCents } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import { AdminOrder } from "./demoDashboard";
import { OrderStatusPath } from "./OrderStatusPath";

export function OrderCard({
  order,
}: {
  order: AdminOrder;
}): React.ReactElement {
  const t = useTranslations("admin.orderCard");
  const tm = useTranslations("admin.filters");
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
  const totalCents = order.items.reduce(
    (sum, item) => sum + item.quantity * item.priceCents,
    0,
  );
  const pieces = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <li
      className="rounded-lg border border-brand-deep/10 bg-paper p-4 shadow-card"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-brand-deep">
            {order.id} · {order.customer}
          </p>
          <p className="text-sm text-ink/60">
            {tm(order.mode)} · {t("atTime", { time: order.time })} ·{" "}
            {t("positions", { count: order.items.length })},{" "}
            {t("pieces", { count: pieces })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <div className="mt-3 border-t border-brand-deep/10 pt-3">
        <OrderStatusPath status={order.status} />
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left text-sm text-brand-deep hover:underline mt-2"
      >
        {t("details")}
      </button>

      {expanded && (
        <div className="mt-2 grid gap-2 text-sm">
          <ul>
            {order.items.map((item) => (
              <li key={item.name} className="flex items-baseline">
                <span className="font-medium text-ink/75">
                  {item.name}
                </span>
                <span className="mx-2">×</span>
                <span className="font-medium text-brand-deep">{item.quantity}</span>
                <span className="ml-2 text-ink/55">= {formatEuroCents(
                  item.quantity * item.priceCents,
                  locale,
                )}</span>
              </li>
            ))}
          </ul>

          <p className="font-medium text-brand-deep">
            {t("total", { price: formatEuroCents(totalCents, locale) })}
          </p>
          <p className="mt-1 text-xs text-ink/60">
            {t("note", { note: order.notes ?? t("noNote") })}
          </p>

            <div className="mt-2 flex gap-2">
              <button
                className="rounded border border-brand-deep/15 bg-white px-3 py-1 text-xs font-medium text-brand-deep hover:bg-brand-deep/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
                aria-label={t("cancelAria")}
              >
                {t("cancelDemo")}
              </button>
              <button
                className="rounded border border-brand-deep/15 bg-white px-3 py-1 text-xs font-medium text-brand-deep hover:bg-brand-deep/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
                aria-label={t("refundAria")}
              >
                {t("refundDemo")}
              </button>
          </div>
        </div>
      )}
    </li>
  );
}
"use client";

import { useTranslations } from "next-intl";
import type { AdminOrder } from "./demoDashboard";
import { OrderCard } from "./OrderCard";

export function OrderList({
  orders,
}: {
  orders: AdminOrder[];
}): React.ReactElement {
  const t = useTranslations("admin.orders");

  return (
    <section id="bestellungen" className="rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card">
      <h2 className="text-lg font-semibold text-brand-deep">{t("title")}</h2>
      <p className="text-sm text-ink/60 mb-4">{t("count", { count: orders.length })}</p>
      <ul className="mt-4 grid gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ul>
    </section>
  );
}
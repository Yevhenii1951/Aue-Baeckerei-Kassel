"use client";

import Link from "next/link";
import { useClientNow } from "@/features/ordering/useClientNow";
import { berlinDateString } from "@/features/ordering/deliverySlots";
import { formatPrice } from "@/features/ordering/price";
import { aggregateBackliste } from "./backliste";
import {
  CUTOFF_NOTE,
  CUTOFF_TIME,
  demoBacklisteOrders,
  demoOrders,
  orderTotalCents,
  sumRevenueCents,
  topProducts,
  type AdminOrder,
} from "./demoDashboard";

const ORDER_STATUS_LABEL: Record<AdminOrder["status"], string> = {
  new: "Neu",
  preparing: "In Zubereitung",
  ready: "Bereit",
};

export function AdminDashboard(): React.ReactElement {
  const now = useClientNow();

  if (now === null) {
    return <div className="grid gap-8" />;
  }

  const day = berlinDateString(now);
  const orders = demoOrders();
  const revenueCents = sumRevenueCents(orders);
  const popular = topProducts(orders);
  const backlog = aggregateBackliste(demoBacklisteOrders(day), day);

  return (
    <div className="grid gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-sage">Inhaberansicht</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-brand-deep">
            Dashboard — {formatDay(day)}
          </h1>
          <p className="mt-2 text-sm text-ink/65">
            Demo-Daten, bis die Bestell-Persistenz eingeführt ist.
          </p>
        </div>
        <Link
          href="/admin/login"
          className="rounded-lg border border-brand-deep/15 bg-white px-4 py-2 text-sm font-semibold text-brand-deep"
        >
          Staff-Login
        </Link>
      </header>

      <nav aria-label="Betriebsansicht">
        <Link href="#bestellungen" className="text-sm text-brand underline-offset-4 hover:underline">
          Heutige Bestellungen
        </Link>
        <span className="mx-3 text-ink/30">·</span>
        <Link href="#backliste" className="text-sm text-brand underline-offset-4 hover:underline">
          Backliste
        </Link>
      </nav>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Bestellungen heute"
          value={String(orders.length)}
        />
        <KpiTile label="Umsatz heute" value={formatPrice(revenueCents)} />
        <KpiTile
          label="Top-Produkt"
          value={popular[0]?.name ?? "—"}
          note={popular[0] ? `${popular[0].quantity} Stück` : undefined}
        />
        <KpiTile
          label="Vorbestell-Cutoff"
          value={CUTOFF_TIME}
          note={CUTOFF_NOTE}
        />
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <OrderList orders={orders} />
        <BacklistePanel items={backlog.productTotals} />
      </section>
    </div>
  );
}

function KpiTile({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}): React.ReactElement {
  return (
    <div className="rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card">
      <p className="text-sm font-medium text-ink/60">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-brand-deep">{value}</p>
      {note ? <p className="mt-2 text-xs text-ink/55">{note}</p> : null}
    </div>
  );
}

function OrderList({ orders }: { orders: AdminOrder[] }): React.ReactElement {
  return (
    <section id="bestellungen" className="rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card">
      <h2 className="text-lg font-semibold text-brand-deep">
        Heutige Bestellungen
      </h2>
      <ul className="mt-4 grid gap-3">
        {orders.map((order) => (
          <li
            key={order.id}
            className="flex flex-wrap items-center justify-between gap-2 border-t border-brand-deep/10 pt-3"
          >
            <div>
              <p className="font-medium text-brand-deep">
                {order.id} · {order.customer}
              </p>
              <p className="text-sm text-ink/60">
                {order.mode === "delivery" ? "Lieferung" : "Abholung"} ·{" "}
                {order.time} Uhr · {lineLabel(order)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <span className="font-medium text-brand-deep">
                {formatPrice(orderTotalCents(order.items))}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatusBadge({ status }: { status: AdminOrder["status"] }): React.ReactElement {
  const tone =
    status === "new"
      ? "border-amber/50 bg-amber/10 text-brand-deep"
      : status === "preparing"
        ? "border-sage/50 bg-sage/10 text-sage"
        : "border-brand-deep/20 bg-paper text-brand-deep";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

function BacklistePanel({
  items,
}: {
  items: { name: string; quantity: number }[];
}): React.ReactElement {
  return (
    <section id="backliste" className="rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card">
      <h2 className="text-lg font-semibold text-brand-deep">Backliste</h2>
      <p className="mt-1 text-sm text-ink/60">Produktionsmengen je Zeitraum</p>
      <ul className="mt-4 grid gap-2">
        {items.map((row) => (
          <li
            key={row.name}
            className="flex items-baseline justify-between border-t border-brand-deep/10 pt-2 text-sm"
          >
            <span className="text-ink/75">{row.name}</span>
            <span className="font-medium text-brand-deep">
              {row.quantity} Stück
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function lineLabel(order: AdminOrder): string {
  const count = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return `${order.items.length} ${order.items.length === 1 ? "Position" : "Positionen"}, ${count} Stück`;
}

function formatDay(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
"use client";

import * as React from "react";
import Link from "next/link";
import { useClientNow } from "@/features/ordering/useClientNow";
import { berlinDateString } from "@/features/ordering/deliverySlots";
import { formatPrice } from "@/features/ordering/price";
import { aggregateBackliste } from "./backliste";
import {
  demoOrders,
  sumRevenueCents,
  topProducts,
  CUTOFF_TIME,
  CUTOFF_NOTE,
  demoBacklisteOrders,
} from "./demoDashboard";
import { applyOrderFilters } from "./orderFilters";
import type { OrderFilters as OrderFilterState } from "./orderFilters";
import { OrderList } from "./OrderList";
import { OrderFilters } from "./OrderFilters";

const KPI_LABELS = {
  orders: "Bestellungen heute",
  revenue: "Umsatz heute",
  topProduct: "Top-Produkt",
  cutoff: "Vorbestell-Cutoff",
};

export function AdminDashboard(): React.ReactElement {
  const now = useClientNow();
  const [filter, setFilter] = React.useState<OrderFilterState>({
    date: "",
    status: "all",
    mode: "all",
  });

  if (now === null) {
    return <div />;
  }

  const day = berlinDateString(now);
  const allOrders = demoOrders(day);
  const activeFilter = { ...filter, date: filter.date || day };

  const displayedOrders = applyOrderFilters(allOrders, activeFilter);
  const revenueCents = sumRevenueCents(displayedOrders);
  const popular = topProducts(displayedOrders);
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
        <nav>
          <Link
            href="/admin/login"
            className="rounded-lg border border-brand-deep/15 bg-white px-4 py-2 text-sm font-semibold text-brand-deep"
          >
            Staff-Login
          </Link>
        </nav>
      </header>

      <OrderFilters
        date={activeFilter.date === day ? "today" : "tomorrow"}
        status={filter.status}
        mode={filter.mode}
        onDateChange={(d) =>
          setFilter((f) => ({ ...f, date: d === "today" ? day : addDay(day) }))
        }
        onStatusChange={s => setFilter((f) => ({ ...f, status: s }))}
        onModeChange={m => setFilter((f) => ({ ...f, mode: m }))}
        reset={() => setFilter({ date: day, status: "all", mode: "all" })}
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-medium text-ink/60">{KPI_LABELS.orders}</p>
          <p className="mt-1 text-2xl font-semibold text-brand-deep">{displayedOrders.length}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink/60">{KPI_LABELS.revenue}</p>
          <p className="mt-1 text-2xl font-semibold text-brand-deep">{formatPrice(revenueCents)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink/60">{KPI_LABELS.topProduct}</p>
          <p className="mt-1 text-2xl font-semibold text-brand-deep">
            {popular[0]?.name ?? "—"}
            {popular[0] ? ` ${popular[0].quantity} Stück` : ""}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink/60">{KPI_LABELS.cutoff}</p>
          <p className="mt-1 text-2xl font-semibold text-brand-deep">{CUTOFF_TIME}</p>
          <p className="mt-1 text-xs text-ink/55">{CUTOFF_NOTE}</p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <OrderList orders={displayedOrders} />
        <section id="backliste" className="rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card">
          <h2 className="text-lg font-semibold text-brand-deep">Backliste</h2>
          <p className="mt-1 text-sm text-ink/60">Produktionsmengen je Zeitraum</p>
          <ul className="mt-4 grid gap-2">
            {backlog.productTotals.map((row) => (
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
      </section>
    </div>
  );
}

function addDay(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}

function formatDay(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

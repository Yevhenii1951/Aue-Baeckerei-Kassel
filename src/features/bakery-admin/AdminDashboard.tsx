"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useClientNow } from "@/features/ordering/useClientNow";
import { berlinDateString } from "@/features/ordering/deliverySlots";
import { formatEuroCents } from "@/lib/format";
import { aggregateBackliste } from "./backliste";
import {
  demoOrders,
  sumRevenueCents,
  topProducts,
  CUTOFF_TIME,
  demoBacklisteOrders,
} from "./demoDashboard";
import { applyOrderFilters } from "./orderFilters";
import type { OrderFilters as OrderFilterState } from "./orderFilters";
import { OrderList } from "./OrderList";
import { OrderFilters } from "./OrderFilters";
import { BacklistePanel } from "./BacklistePanel";

export function AdminDashboard(): React.ReactElement {
  const t = useTranslations("admin");
  const locale = useLocale();
  const now = useClientNow();
  const [filter, setFilter] = React.useState<OrderFilterState>({
    date: "",
    status: "all",
    mode: "all",
  });
  const [backlisteDate, setBacklisteDate] = React.useState("");

  if (now === null) {
    return <div />;
  }

  const day = berlinDateString(now);
  const allOrders = demoOrders(day);
  const activeFilter = { ...filter, date: filter.date || day };
  const activeBacklisteDate = backlisteDate || addDay(day);

  const displayedOrders = applyOrderFilters(allOrders, activeFilter);
  const revenueCents = sumRevenueCents(displayedOrders);
  const popular = topProducts(displayedOrders);
  const backlog = aggregateBackliste(
    demoBacklisteOrders(activeBacklisteDate),
    activeBacklisteDate,
  );

  return (
    <div className="grid gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-sage">{t("dashboard.ownerView")}</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-brand-deep">
            {t("dashboard.title")} — {formatDay(day, locale)}
          </h1>
          <p className="mt-2 text-sm text-ink/65">{t("dashboard.demoDataNote")}</p>
        </div>
        <nav>
          <Link
            href={`/${locale}/admin/login`}
            className="rounded-lg border border-brand-deep/15 bg-white px-4 py-2 text-sm font-semibold text-brand-deep"
          >
            {t("dashboard.staffLogin")}
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
          <p className="text-sm font-medium text-ink/60">{t("dashboard.kpiOrders")}</p>
          <p className="mt-1 text-2xl font-semibold text-brand-deep">{displayedOrders.length}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink/60">{t("dashboard.kpiRevenue")}</p>
          <p className="mt-1 text-2xl font-semibold text-brand-deep">
            {formatEuroCents(revenueCents, locale)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink/60">{t("dashboard.kpiTopProduct")}</p>
          <p className="mt-1 text-2xl font-semibold text-brand-deep">
            {popular[0]?.name ?? "—"}
            {popular[0]
              ? ` ${t("orderCard.pieces", { count: popular[0].quantity })}`
              : ""}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink/60">{t("dashboard.kpiCutoff")}</p>
          <p className="mt-1 text-2xl font-semibold text-brand-deep">
            {t("dashboard.cutoffTime", { time: CUTOFF_TIME })}
          </p>
          <p className="mt-1 text-xs text-ink/55">{t("dashboard.cutoffNote")}</p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <OrderList orders={displayedOrders} />
        <BacklistePanel
          backliste={backlog}
          selectedDate={activeBacklisteDate}
          onDateChange={setBacklisteDate}
          minDate={day}
        />
      </section>
    </div>
  );
}

function addDay(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}

function formatDay(date: string, locale: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
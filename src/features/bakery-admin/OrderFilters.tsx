"use client";

import type { AdminOrderStatus } from "./demoDashboard";
import type { OrderModeFilter } from "./orderFilters";

type DateFilter = "today" | "tomorrow";
type StatusFilter = "all" | AdminOrderStatus;

export function OrderFilters({
  date,
  status,
  mode,
  onDateChange,
  onStatusChange,
  onModeChange,
  reset,
}: {
  date: DateFilter;
  status: StatusFilter;
  mode: OrderModeFilter;
  onDateChange: (date: DateFilter) => void;
  onStatusChange: (status: StatusFilter) => void;
  onModeChange: (mode: OrderModeFilter) => void;
  reset: () => void;
}): React.ReactElement {
  return (
    <div className="rounded-lg border border-brand-deep/10 bg-paper p-4 shadow-card mb-6">
      <h3 className="text-sm font-medium text-brand-deep mb-3">Filter</h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="text-xs text-ink/60 block">Datum</label>
        <select
          value={date}
          onChange={(e) => onDateChange(e.target.value as DateFilter)}
          className="w-full rounded border border-brand-deep/15 px-3 py-2 text-sm text-brand-deep"
        >
          <option value="today">Heute</option>
          <option value="tomorrow">Morgen</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="text-xs text-ink/60 block">Status</label>
        <select
          value={status === "all" ? "all" : status}
          onChange={(e) =>
            onStatusChange(
              e.target.value === "all" ? "all" : (e.target.value as AdminOrderStatus),
            )
          }
          className="w-full rounded border border-brand-deep/15 px-3 py-2 text-sm text-brand-deep"
        >
          <option value="all">Alle</option>
          <option value="new">Neu</option>
          <option value="preparing">In Zubereitung</option>
          <option value="ready">Bereit</option>
          <option value="collected">Abgeholt</option>
          <option value="delivered">Geliefert</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="text-xs text-ink/60 block">Erfüllung</label>
        <select
          value={mode === "all" ? "all" : mode}
          onChange={(e) =>
            onModeChange(
              e.target.value === "all" ? "all" : (e.target.value as "pickup" | "delivery"),
            )
          }
          className="w-full rounded border border-brand-deep/15 px-3 py-2 text-sm text-brand-deep"
        >
          <option value="all">Alle</option>
          <option value="pickup">Abholung</option>
          <option value="delivery">Lieferung</option>
        </select>
      </div>

      <button
        onClick={reset}
        className="mt-3 rounded border border-brand-deep/15 bg-white px-4 py-2 text-sm font-medium text-brand-deep hover:bg-brand-deep/5 transition-colors w-full"
      >
        Filter zurücksetzen
      </button>
    </div>
  );
}

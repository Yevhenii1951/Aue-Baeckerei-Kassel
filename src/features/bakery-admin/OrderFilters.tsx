"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("admin.filters");
  const ts = useTranslations("admin.statuses");

  return (
    <div className="rounded-lg border border-brand-deep/10 bg-paper p-4 shadow-card mb-6">
      <h3 className="text-sm font-medium text-brand-deep mb-3">{t("title")}</h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="text-xs text-ink/60 block">{t("date")}</label>
        <select
          value={date}
          onChange={(e) => onDateChange(e.target.value as DateFilter)}
          className="w-full rounded border border-brand-deep/15 px-3 py-2 text-sm text-brand-deep"
        >
          <option value="today">{t("today")}</option>
          <option value="tomorrow">{t("tomorrow")}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="text-xs text-ink/60 block">{t("status")}</label>
        <select
          value={status === "all" ? "all" : status}
          onChange={(e) =>
            onStatusChange(
              e.target.value === "all" ? "all" : (e.target.value as AdminOrderStatus),
            )
          }
          className="w-full rounded border border-brand-deep/15 px-3 py-2 text-sm text-brand-deep"
        >
          <option value="all">{t("all")}</option>
          <option value="new">{ts("new")}</option>
          <option value="preparing">{ts("preparing")}</option>
          <option value="ready">{ts("ready")}</option>
          <option value="collected">{ts("collected")}</option>
          <option value="delivered">{ts("delivered")}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="text-xs text-ink/60 block">{t("fulfillment")}</label>
        <select
          value={mode === "all" ? "all" : mode}
          onChange={(e) =>
            onModeChange(
              e.target.value === "all" ? "all" : (e.target.value as "pickup" | "delivery"),
            )
          }
          className="w-full rounded border border-brand-deep/15 px-3 py-2 text-sm text-brand-deep"
        >
          <option value="all">{t("all")}</option>
          <option value="pickup">{t("pickup")}</option>
          <option value="delivery">{t("delivery")}</option>
        </select>
      </div>

      <button
        onClick={reset}
        className="mt-3 rounded border border-brand-deep/15 bg-white px-4 py-2 text-sm font-medium text-brand-deep hover:bg-brand-deep/5 transition-colors w-full"
      >
        {t("reset")}
      </button>
    </div>
  );
}
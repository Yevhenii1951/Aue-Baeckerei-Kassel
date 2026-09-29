"use client";

import { useTranslations } from "next-intl";
import type { AdminOrderStatus } from "./demoDashboard";

const TONE: Record<AdminOrderStatus, string> = {
  new: "border-amber/50 bg-amber/10 text-brand-deep",
  preparing: "border-sage/50 bg-sage/10 text-sage",
  ready: "border-brand-deep/20 bg-paper text-brand-deep",
  collected: "border-amber/50 bg-amber/10 text-brand-deep",
  delivered: "border-amber/50 bg-amber/10 text-brand-deep",
};

export function StatusBadge({
  status,
}: {
  status: AdminOrderStatus;
}): React.ReactElement {
  const t = useTranslations("admin.statuses");

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${TONE[status]}`}
    >
      {t(status)}
    </span>
  );
}
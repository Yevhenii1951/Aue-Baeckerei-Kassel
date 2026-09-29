"use client";

import { useTranslations } from "next-intl";
import { ORDER_STATUS_PATH, type AdminOrderStatus } from "./demoDashboard";

export function OrderStatusPath({
  status,
}: {
  status: AdminOrderStatus;
}): React.ReactElement {
  const t = useTranslations("admin");
  const current = ORDER_STATUS_PATH.indexOf(status);

  return (
    <ol
      className="flex flex-wrap items-center gap-x-1 gap-y-2 text-xs text-ink/60"
      aria-label={t("orders.statusPathAria")}
    >
      {ORDER_STATUS_PATH.map((step, index) => {
        const tone = index < current ? "text-ink/40" : index === current
          ? "font-semibold text-brand-deep"
          : "text-ink/60";

        return (
          <li key={step} className="flex items-center gap-1">
            {index > 0 ? <span aria-hidden>→</span> : null}
            <span className={tone}>{t(`statuses.${step}`)}</span>
          </li>
        );
      })}
    </ol>
  );
}
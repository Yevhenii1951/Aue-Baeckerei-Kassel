"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatEuroCents } from "@/lib/format";
import type { DeliveryZone } from "./delivery";
import { deliveryChargeCents, deliveryZoneInfo } from "./delivery";
import { EXPRESS_FEE_CENTS } from "./deliverySlots";

type DeliveryPanelProps = {
  zone: DeliveryZone | null;
  subtotalCents: number;
  express: boolean;
};

export function DeliveryPanel({
  zone,
  subtotalCents,
  express,
}: DeliveryPanelProps): React.ReactElement {
  const t = useTranslations("lieferung");
  const locale = useLocale();

  if (zone === null) {
    return (
      <p className="rounded-lg border border-brand-deep/10 bg-paper p-4 text-sm text-ink/70">
        {t("enterPlz")}
      </p>
    );
  }

  const info = deliveryZoneInfo(zone);
  const charge =
    deliveryChargeCents(subtotalCents, zone) + (express ? EXPRESS_FEE_CENTS : 0);

  return (
    <div className="rounded-lg border border-brand/30 bg-paper p-4">
      <p className="font-semibold text-brand-deep">
        {t("checkServed", { zone })}
      </p>
      <p className="mt-1 text-sm text-ink/70">
        {t("checkFee", {
          fee: formatEuroCents(info.feeCents, locale),
          threshold: formatEuroCents(info.freeThresholdCents, locale),
        })}
        {express
          ? ` ${t("expressIncluded", {
              fee: formatEuroCents(EXPRESS_FEE_CENTS, locale),
            })}`
          : ""}
        {charge === 0 ? ` ${t("orderFree")}` : ""}
      </p>
    </div>
  );
}

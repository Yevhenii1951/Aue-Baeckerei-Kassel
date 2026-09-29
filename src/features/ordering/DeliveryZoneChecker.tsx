"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatEuroCents } from "@/lib/format";
import {
  deliveryChargeCents,
  deliveryZoneInfo,
  zoneForPostalCode,
} from "./delivery";

type DeliveryZoneCheckerProps = {
  subtotalCents: number;
};

export function DeliveryZoneChecker({
  subtotalCents,
}: DeliveryZoneCheckerProps): React.ReactElement {
  const [plz, setPlz] = useState("");
  const t = useTranslations("lieferung");
  const locale = useLocale();
  const result = useMemo(() => {
    const zone = zoneForPostalCode(plz);
    if (zone === null) {
      return null;
    }
    const info = deliveryZoneInfo(zone);
    return {
      info,
      charge: deliveryChargeCents(subtotalCents, zone),
    };
  }, [plz, subtotalCents]);

  return (
    <div className="surface mt-8 p-5">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-brand-deep">
          {t("checkTitle")}
        </span>
        <div className="flex flex-wrap gap-2">
          <input
            value={plz}
            onChange={(event) => setPlz(event.target.value)}
            placeholder={t("checkPlaceholder")}
            inputMode="numeric"
            className="min-h-11 w-52 rounded-lg border border-brand-deep/15 bg-white px-3"
          />
        </div>
      </label>

      {result ? (
        <div className="mt-4 rounded-lg border border-brand/30 bg-paper p-4">
          <p className="font-semibold text-brand-deep">
            {t("checkServed", { zone: result.info.zone })}
          </p>
          <p className="mt-1 text-sm text-ink/70">
            {t("checkFee", {
              fee: formatEuroCents(result.info.feeCents, locale),
              threshold: formatEuroCents(result.info.freeThresholdCents, locale),
            })}
          </p>
          {result.charge === 0 ? (
            <p className="mt-1 text-sm font-medium text-brand">
              {t("freeNow")}
            </p>
          ) : null}
        </div>
      ) : plz.length > 0 ? (
        <p className="mt-4 text-sm text-red-700">
          {t("checkNotServed", { plz })}
        </p>
      ) : null}
    </div>
  );
}
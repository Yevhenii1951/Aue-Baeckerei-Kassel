"use client";

import { useMemo, useState } from "react";
import {
  deliveryChargeCents,
  deliveryZoneInfo,
  zoneForPostalCode,
} from "./delivery";
import { formatPrice } from "./price";

type DeliveryZoneCheckerProps = {
  subtotalCents: number;
};

export function DeliveryZoneChecker({
  subtotalCents,
}: DeliveryZoneCheckerProps): React.ReactElement {
  const [plz, setPlz] = useState("");
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
          Liefergebiet prüfen
        </span>
        <div className="flex flex-wrap gap-2">
          <input
            value={plz}
            onChange={(event) => setPlz(event.target.value)}
            placeholder="PLZ, z. B. 34117"
            inputMode="numeric"
            className="min-h-11 w-52 rounded-lg border border-brand-deep/15 bg-white px-3"
          />
        </div>
      </label>

      {result ? (
        <div className="mt-4 rounded-lg border border-sage/30 bg-paper p-4">
          <p className="font-semibold text-brand-deep">
            Zone {result.info.zone} — deine Bestellung liefern wir.
          </p>
          <p className="mt-1 text-sm text-ink/70">
            Lieferkosten {formatPrice(result.info.feeCents)}, ab{" "}
            {formatPrice(result.info.freeThresholdCents)} Warenwert frei.
          </p>
          {result.charge === 0 ? (
            <p className="mt-1 text-sm font-medium text-sage">
              Dein aktueller Warenwert: Lieferung kostenlos.
            </p>
          ) : null}
        </div>
      ) : plz.length > 0 ? (
        <p className="mt-4 text-sm text-red-700">
          Diese PLZ liegt außerhalb unseres Liefergebiets oder ist ungültig.
        </p>
      ) : null}
    </div>
  );
}
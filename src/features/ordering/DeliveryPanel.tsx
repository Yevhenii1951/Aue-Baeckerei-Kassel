"use client";

import type { DeliveryZone } from "./delivery";
import {
  deliveryChargeCents,
  deliveryZoneInfo,
} from "./delivery";
import { formatPrice } from "./price";

type DeliveryPanelProps = {
  zone: DeliveryZone | null;
  subtotalCents: number;
};

export function DeliveryPanel({
  zone,
  subtotalCents,
}: DeliveryPanelProps): React.ReactElement {
  if (zone === null) {
    return (
      <p className="rounded-lg border border-brand-deep/10 bg-paper p-4 text-sm text-ink/70">
        Gib deine PLZ an, um Lieferkosten und Liefergebiet zu sehen.
      </p>
    );
  }

  const info = deliveryZoneInfo(zone);
  const charge = deliveryChargeCents(subtotalCents, zone);

  return (
    <div className="rounded-lg border border-sage/30 bg-paper p-4">
      <p className="font-semibold text-brand-deep">
        Zone {zone} — wir liefern zu dir.
      </p>
      <p className="mt-1 text-sm text-ink/70">
        Lieferkosten {formatPrice(info.feeCents)}, ab{" "}
        {formatPrice(info.freeThresholdCents)} Warenwert frei.
        {charge === 0
          ? " Für diese Bestellung ist die Lieferung kostenlos."
          : ""}
      </p>
    </div>
  );
}
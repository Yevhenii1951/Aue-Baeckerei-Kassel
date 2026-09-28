"use client";

import type { DeliveryZone } from "./delivery";
import {
  EXPRESS_FEE_CENTS,
  berlinDateString,
  buildDeliverySlots,
  isExpressAvailable,
} from "./deliverySlots";
import { formatPrice } from "./price";
import { nextNDates } from "./preorder";
import {
  setDeliveryDate,
  setDeliverySlot,
  setFulfillmentMode,
  useFulfillment,
} from "./fulfillment-store";
import { useClientNow } from "./useClientNow";

type DeliveryScheduleProps = {
  zone: DeliveryZone | null;
  error?: string;
};

const DELIVERY_DATE_COUNT = 3;

export function DeliverySchedule({
  zone,
  error,
}: DeliveryScheduleProps): React.ReactElement {
  const selection = useFulfillment();
  const now = useClientNow();

  if (now === null) {
    return <div className="grid gap-3" />;
  }

  const dates = nextNDates(berlinDateString(now), DELIVERY_DATE_COUNT);
  const effectiveDate = dates.includes(selection.deliveryDate)
    ? selection.deliveryDate
    : dates[0];
  const selectedSlotId = selection.deliverySlotId.startsWith(effectiveDate)
    ? selection.deliverySlotId
    : null;
  const express = selection.express && selectedSlotId !== null;

  return (
    <section className="grid gap-3">
      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-brand-deep">
          Abholung oder Lieferung
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {(["pickup", "delivery"] as const).map((mode) => (
            <div key={mode} className="rounded-lg border border-brand-deep/15">
              <label className="flex cursor-pointer items-center gap-2 px-3 py-2.5">
                <input
                  type="radio"
                  name="fulfillment-mode"
                  value={mode}
                  checked={selection.mode === mode}
                  onChange={() => setFulfillmentMode(mode)}
                />
                <span className="text-sm font-medium">
                  {mode === "pickup" ? "Abholung" : "Lieferung"}
                </span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      {selection.mode === "delivery" ? (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {dates.map((date) => {
              const selected = date === effectiveDate;

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setDeliveryDate(date)}
                  aria-pressed={selected}
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-medium ${
                    selected
                      ? "border-brand bg-brand text-cream"
                      : "border-brand-deep/15 bg-white text-brand-deep"
                  }`}
                >
                  {formatDate(date)}
                </button>
              );
            })}
          </div>

          <div className="mt-1 grid grid-cols-2 gap-2">
            {buildDeliverySlots(effectiveDate, now).map((slot) => {
              const selected = selectedSlotId === slot.id;

              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setDeliverySlot(slot.id, false)}
                  aria-pressed={selected}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                    selected
                      ? "border-brand bg-brand text-cream"
                      : "border-brand-deep/15 bg-white text-brand-deep"
                  }`}
                >
                  {slot.startTime}–{slot.endTime} Uhr
                </button>
              );
            })}

            {isExpressAvailable(zone, now) &&
            effectiveDate === berlinDateString(now) ? (
              <button
                type="button"
                onClick={() =>
                  setDeliverySlot(`${effectiveDate}-express`, true)
                }
                aria-pressed={express}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  express
                    ? "border-amber bg-amber text-brand-deep"
                    : "border-amber/40 bg-paper text-brand-deep"
                }`}
              >
                Express — in ca. 2 Std. (+{formatPrice(EXPRESS_FEE_CENTS)})
              </button>
            ) : null}
          </div>
        </>
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </section>
  );
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
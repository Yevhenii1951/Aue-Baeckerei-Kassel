"use client";

import * as React from "react";
import type { Backliste } from "./backliste";
import { backlisteCsv, backlisteSlots } from "./backliste";

type BacklistePanelProps = {
  backliste: Backliste;
  selectedDate: string;
  onDateChange: (date: string) => void;
  minDate: string;
};

export function BacklistePanel({
  backliste,
  selectedDate,
  onDateChange,
  minDate,
}: BacklistePanelProps): React.ReactElement {
  const slots = backlisteSlots(backliste);

  return (
    <section
      id="backliste"
      className="rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card print:border-0 print:bg-white print:p-0 print:shadow-none"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 print:block">
        <div>
          <p className="text-sm font-semibold text-sage print:text-ink">Produktion</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-deep">Backliste</h2>
          <p className="mt-1 text-sm text-ink/60">
            Produktmengen und Slots für {formatDate(selectedDate)}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <label className="grid gap-1 text-sm font-medium text-ink/70">
            Produktionsdatum
            <input
              type="date"
              min={minDate}
              value={selectedDate}
              onChange={(event) => onDateChange(event.target.value)}
              className="rounded-lg border border-brand-deep/15 bg-white px-3 py-2 text-sm text-brand-deep"
            />
          </label>
          <button
            type="button"
            onClick={() => downloadCsv(backliste)}
            className="self-end rounded-lg border border-brand-deep/15 bg-white px-4 py-2 text-sm font-semibold text-brand-deep"
          >
            CSV exportieren
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="self-end rounded-lg bg-brand-deep px-4 py-2 text-sm font-semibold text-paper"
          >
            Drucken
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] print:block">
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/55">
            Gesamtmengen
          </h3>
          <ul className="mt-3 grid gap-2">
            {backliste.productTotals.map((row) => (
              <li
                key={row.productId}
                className="flex items-baseline justify-between border-t border-brand-deep/10 pt-2 text-sm"
              >
                <span className="text-ink/75">{row.name}</span>
                <span className="font-medium text-brand-deep">{row.quantity} Stück</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-x-auto print:mt-6 print:overflow-visible">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/55">
            Produkt x Slot
          </h3>
          <table className="mt-3 min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-brand-deep/15 text-ink/60">
                <th className="py-2 pr-4 font-semibold">Produkt</th>
                {slots.map((slot) => (
                  <th key={slot} className="px-3 py-2 text-right font-semibold">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {backliste.slotMatrix.map((row) => (
                <tr key={row.productId} className="border-b border-brand-deep/10">
                  <th className="py-2 pr-4 font-medium text-brand-deep">{row.name}</th>
                  {slots.map((slot) => (
                    <td key={slot} className="px-3 py-2 text-right text-ink/75">
                      {row.slots[slot] ?? 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </section>
  );
}

function downloadCsv(backliste: Backliste): void {
  const blob = new Blob([backlisteCsv(backliste)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `backliste-${backliste.productionDate}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

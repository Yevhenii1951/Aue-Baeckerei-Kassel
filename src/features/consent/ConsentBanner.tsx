"use client";

import { denyMapConsent, grantMapConsent, useConsent } from "./consent-store";

export function ConsentBanner() {
  const { map } = useConsent();

  if (map !== "pending") {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Einstellungen für externe Inhalte"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-brand-deep/20 bg-paper px-4 py-4 shadow-panel sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/75">
          Diese Website lädt standardmäßig keine Inhalte Dritter. Die
          Lieferkarte kommt von OpenStreetMap und wird erst nach Ihrer
          Zustimmung geladen. Notwendig für den Betrieb ist nur diese
          Einstellung; ein Kundenkonto gibt es nicht.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={grantMapConsent}
            className="min-h-11 flex-1 rounded-lg bg-brand-deep px-4 py-2 text-sm font-semibold text-cream sm:flex-none"
          >
            Karte laden
          </button>
          <button
            type="button"
            onClick={denyMapConsent}
            className="min-h-11 flex-1 rounded-lg border border-brand-deep/20 px-4 py-2 text-sm font-medium text-brand-deep sm:flex-none"
          >
            Ohne Karte
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { resetConsent, useConsent } from "./consent-store";

export function ConsentRevokeLink() {
  const { map } = useConsent();

  if (map !== "granted") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={resetConsent}
      className="min-h-11 text-sm text-cream/70 underline underline-offset-4 hover:text-cream"
    >
      Kartenzustimmung widerrufen
    </button>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { denyMapConsent, grantMapConsent, useConsent } from "./consent-store";

export function ConsentBanner() {
  const { map } = useConsent();
  const t = useTranslations("consent");

  if (map !== "pending") {
    return null;
  }

  return (
    <div
      role="region"
      aria-label={t("ariaLabel")}
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-brand-deep/20 bg-paper px-4 py-4 shadow-panel sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/75">{t("text")}</p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={grantMapConsent}
            className="min-h-11 flex-1 rounded-lg bg-brand-deep px-4 py-2 text-sm font-semibold text-cream sm:flex-none"
          >
            {t("loadMap")}
          </button>
          <button
            type="button"
            onClick={denyMapConsent}
            className="min-h-11 flex-1 rounded-lg border border-brand-deep/20 px-4 py-2 text-sm font-medium text-brand-deep sm:flex-none"
          >
            {t("noMap")}
          </button>
        </div>
      </div>
    </div>
  );
}
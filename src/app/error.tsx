"use client";

import { useTranslations } from "next-intl";

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations("shell");

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-brand-deep">{t("retryHeading")}</h1>
      <p className="max-w-md text-ink/70">{t("retryText")}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-brand px-6 py-3 font-medium text-cream"
      >
        {t("retry")}
      </button>
    </main>
  );
}
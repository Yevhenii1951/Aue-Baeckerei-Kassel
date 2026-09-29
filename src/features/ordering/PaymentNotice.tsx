"use client";

import { useTranslations } from "next-intl";

type PaymentNoticeProps = {
  cancelled: boolean;
  error: string | null;
};

export function PaymentNotice({ cancelled, error }: PaymentNoticeProps) {
  const t = useTranslations("kasse");

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
      >
        {error}
      </p>
    );
  }

  if (cancelled) {
    return (
      <p
        role="status"
        className="rounded-lg border border-brand-deep/20 bg-amber-soft px-4 py-3 text-sm text-brand-deep"
      >
        {t("cancelledNotice")}
      </p>
    );
  }

  return null;
}

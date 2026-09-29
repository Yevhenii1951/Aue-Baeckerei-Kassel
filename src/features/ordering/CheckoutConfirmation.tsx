"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { SiteLocale } from "@/features/seo/site";
import { formatEuroCents } from "@/lib/format";
import { PreorderSummary } from "./PreorderSummary";
import type { CartTotals } from "./cart";

export type ConfirmedOrder = {
  orderNumber: string;
  mode: "pickup" | "delivery";
  paymentLabel: string;
  address?: string;
  deliveryLabel?: string;
  deliveryFeeCents?: number;
  // The cart is emptied at submit time, so the summary needs its own copy of
  // the totals that were shown to the customer.
  totals: CartTotals;
};

type CheckoutConfirmationProps = {
  confirmed: ConfirmedOrder;
  firstName: string;
  locale: SiteLocale;
};

export function CheckoutConfirmation({
  confirmed,
  firstName,
  locale,
}: CheckoutConfirmationProps): React.ReactElement {
  const t = useTranslations("kasse");

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section className="rounded-lg border border-brand/30 bg-paper p-6 shadow-card">
        <h2 className="font-display text-3xl font-semibold text-brand-deep">
          {t("thanks", { firstName: firstName ? `, ${firstName}` : "" })}
        </h2>
        <p className="mt-2 text-sm uppercase tracking-wide text-amber">
          {t("demoNotice")}
        </p>
        <p className="mt-4 text-brand-deep">
          {t("orderNumber")}:{" "}
          <strong className="font-semibold">{confirmed.orderNumber}</strong>
        </p>
        <dl className="mt-4 grid gap-2 text-sm text-ink/75">
          <div className="flex justify-between gap-4">
            <dt>{t("fulfilment")}</dt>
            <dd className="font-medium text-brand-deep">
              {t(`mode.${confirmed.mode}`)}
            </dd>
          </div>
          {confirmed.deliveryLabel ? (
            <div className="flex justify-between gap-4">
              <dt>{t("deliveryTime")}</dt>
              <dd className="text-right font-medium text-brand-deep">
                {confirmed.deliveryLabel}
              </dd>
            </div>
          ) : null}
          {confirmed.address ? (
            <div className="flex justify-between gap-4">
              <dt>{t("deliveryAddress")}</dt>
              <dd className="text-right font-medium text-brand-deep">
                {confirmed.address}
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt>{t("paymentLabel")}</dt>
            <dd className="font-medium text-brand-deep">
              {confirmed.paymentLabel}
            </dd>
          </div>
          {confirmed.deliveryFeeCents !== undefined && (
            <div className="flex justify-between gap-4">
              <dt>{t("deliveryFee")}</dt>
              <dd className="font-medium text-brand-deep">
                {formatEuroCents(confirmed.deliveryFeeCents, locale)}
              </dd>
            </div>
          )}
        </dl>

        <div
          role="img"
          aria-label={t("qrLabel")}
          className="mt-6 grid size-24 place-content-center border-2 border-dashed border-brand-deep/25 text-xs text-ink/40"
        >
          QR
        </div>
        <p className="mt-1 text-xs text-ink/50">{t("qrCaption")}</p>

        <Link
          href={`/${locale}/sortiment`}
          className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 font-semibold text-cream"
        >
          {t("backToAssortment")}
        </Link>
      </section>
      <PreorderSummary
        deliveryFeeCents={confirmed.deliveryFeeCents}
        frozenTotals={confirmed.totals}
      />
    </div>
  );
}
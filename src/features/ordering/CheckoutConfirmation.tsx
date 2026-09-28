"use client";

import Link from "next/link";
import type { SiteLocale } from "@/features/seo/site";
import { formatPrice } from "./price";
import { PreorderSummary } from "./PreorderSummary";

export type ConfirmedOrder = {
  orderNumber: string;
  mode: "pickup" | "delivery";
  paymentLabel: string;
  address?: string;
  deliveryLabel?: string;
  deliveryFeeCents?: number;
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
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section className="rounded-lg border border-sage/30 bg-paper p-6 shadow-card">
        <h2 className="font-display text-3xl font-semibold text-brand-deep">
          Vielen Dank{firstName ? `, ${firstName}` : ""}!
        </h2>
        <p className="mt-2 text-sm uppercase tracking-wide text-amber">
          Demo-Strecke ohne echte Zahlung
        </p>
        <p className="mt-4 text-brand-deep">
          Bestellnummer:{" "}
          <strong className="font-semibold">{confirmed.orderNumber}</strong>
        </p>
        <dl className="mt-4 grid gap-2 text-sm text-ink/75">
          <div className="flex justify-between gap-4">
            <dt>Erfüllung</dt>
            <dd className="font-medium text-brand-deep">
              {confirmed.mode === "pickup" ? "Abholung" : "Lieferung"}
            </dd>
          </div>
          {confirmed.deliveryLabel ? (
            <div className="flex justify-between gap-4">
              <dt>Lieferzeit</dt>
              <dd className="text-right font-medium text-brand-deep">
                {confirmed.deliveryLabel}
              </dd>
            </div>
          ) : null}
          {confirmed.address ? (
            <div className="flex justify-between gap-4">
              <dt>Lieferadresse</dt>
              <dd className="text-right font-medium text-brand-deep">
                {confirmed.address}
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt>Zahlung</dt>
            <dd className="font-medium text-brand-deep">
              {confirmed.paymentLabel}
            </dd>
          </div>
          {confirmed.deliveryFeeCents !== undefined && (
            <div className="flex justify-between gap-4">
              <dt>Lieferkosten</dt>
              <dd className="font-medium text-brand-deep">
                {formatPrice(confirmed.deliveryFeeCents)}
              </dd>
            </div>
          )}
        </dl>

        <div
          role="img"
          aria-label="QR-Code Platzhalter für die Abholung"
          className="mt-6 grid size-24 place-content-center border-2 border-dashed border-brand-deep/25 text-xs text-ink/40"
        >
          QR
        </div>
        <p className="mt-1 text-xs text-ink/50">Abhol-QR (Demo)</p>

        <Link
          href={`/${locale}/sortiment`}
          className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 font-semibold text-cream"
        >
          Zurück zum Sortiment
        </Link>
      </section>
      <PreorderSummary deliveryFeeCents={confirmed.deliveryFeeCents} />
    </div>
  );
}
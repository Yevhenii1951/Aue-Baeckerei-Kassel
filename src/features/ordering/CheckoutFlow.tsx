"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteLocale } from "@/features/seo/site";
import { useCart } from "./cart-provider";
import {
  PAYMENT_METHODS,
  parseCheckoutForm,
  type CheckoutFormValues,
} from "./checkout-form";
import { createDemoOrderNumber } from "./orderNumber";
import { CheckoutCustomerForm } from "./CheckoutCustomerForm";
import { PreorderSummary } from "./PreorderSummary";

type CheckoutFlowProps = {
  locale: SiteLocale;
};

type ConfirmedOrder = {
  orderNumber: string;
  mode: "pickup" | "delivery";
  paymentLabel: string;
  address?: string;
};

const EMPTY_FORM: CheckoutFormValues = {
  name: "",
  email: "",
  phone: "",
  mode: "pickup",
  payment: "stripe",
  street: "",
  zip: "",
  city: "",
  notes: "",
};

export function CheckoutFlow({ locale }: CheckoutFlowProps): React.ReactElement {
  const { items } = useCart();
  const [form, setForm] = useState<CheckoutFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sequence, setSequence] = useState(1);
  const [confirmed, setConfirmed] = useState<ConfirmedOrder | null>(null);

  if (items.length === 0) {
    return (
      <div className="grid place-content-center gap-4 py-20 text-center">
        <p className="max-w-md text-ink/70">
          Dein Warenkorb ist noch leer.
        </p>
        <Link
          href={`/${locale}/sortiment`}
          className="mx-auto rounded-lg bg-brand px-4 py-2 font-semibold text-cream"
        >
          Zum Sortiment
        </Link>
      </div>
    );
  }

  function updateField(
    field: keyof CheckoutFormValues,
    value: string,
  ): void {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const result = parseCheckoutForm(form);
    if (!result.success) {
      setErrors(result.fieldErrors);
      return;
    }

    setErrors({});
    const paymentLabel =
      PAYMENT_METHODS.find((method) => method.id === result.data.payment)
        ?.label ?? result.data.payment;
    setConfirmed({
      orderNumber: createDemoOrderNumber(new Date().getFullYear(), sequence),
      mode: result.data.mode,
      paymentLabel,
      address:
        result.data.mode === "delivery"
          ? `${result.data.street}, ${result.data.zip} ${result.data.city}`
          : undefined,
    });
    setSequence((current) => current + 1);
  }

  if (confirmed) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-lg border border-sage/30 bg-paper p-6 shadow-card">
          <h2 className="font-display text-3xl font-semibold text-brand-deep">
            Vielen Dank{form.name ? `, ${form.name.split(" ")[0]}` : ""}!
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
        <PreorderSummary />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <CheckoutCustomerForm
        values={form}
        errors={errors}
        onChange={updateField}
        onSubmit={handleSubmit}
      />
      <PreorderSummary />
    </div>
  );
}
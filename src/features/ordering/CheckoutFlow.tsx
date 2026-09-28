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
import { deliveryChargeCents, zoneForPostalCode } from "./delivery";
import { EXPRESS_FEE_CENTS } from "./deliverySlots";
import { useFulfillment } from "./fulfillment-store";
import { CheckoutCustomerForm } from "./CheckoutCustomerForm";
import { CheckoutConfirmation, type ConfirmedOrder } from "./CheckoutConfirmation";
import { DeliveryPanel } from "./DeliveryPanel";
import { DeliverySchedule } from "./DeliverySchedule";
import { PreorderSummary } from "./PreorderSummary";

type CheckoutFlowProps = {
  locale: SiteLocale;
};

const EMPTY_FORM: CheckoutFormValues = {
  name: "",
  email: "",
  phone: "",
  mode: "pickup",
  deliveryDate: "",
  deliverySlotId: "",
  express: false,
  payment: "stripe",
  street: "",
  zip: "",
  city: "",
  notes: "",
};

export function CheckoutFlow({ locale }: CheckoutFlowProps): React.ReactElement {
  const { items, totals } = useCart();
  const selection = useFulfillment();
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

  const effectiveForm: CheckoutFormValues = {
    ...form,
    mode: selection.mode,
    deliveryDate: selection.deliveryDate,
    deliverySlotId: selection.deliverySlotId,
    express: selection.express,
  };

  function updateField(
    field: keyof CheckoutFormValues,
    value: string,
  ): void {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  const deliveryZone =
    selection.mode === "delivery" ? zoneForPostalCode(effectiveForm.zip) : null;
  const deliveryCost =
    selection.mode === "delivery" && deliveryZone !== null
      ? deliveryChargeCents(totals.totalCents, deliveryZone) +
        (selection.express ? EXPRESS_FEE_CENTS : 0)
      : 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const result = parseCheckoutForm(effectiveForm);
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
      deliveryLabel:
        result.data.mode === "delivery"
          ? deliveryTimeLabel(result.data)
          : undefined,
      deliveryFeeCents:
        result.data.mode === "delivery" && deliveryZone !== null
          ? deliveryCost
          : undefined,
    });
    setSequence((current) => current + 1);
  }

  if (confirmed) {
    const firstName = form.name ? form.name.split(" ")[0] : "";

    return (
      <CheckoutConfirmation
        confirmed={confirmed}
        firstName={firstName}
        locale={locale}
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="grid gap-6">
        <DeliverySchedule zone={deliveryZone} error={errors.deliverySlotId} />
        {selection.mode === "delivery" ? (
          <DeliveryPanel
            zone={deliveryZone}
            subtotalCents={totals.totalCents}
            express={selection.express}
          />
        ) : null}
        <CheckoutCustomerForm
          values={effectiveForm}
          errors={errors}
          onChange={updateField}
          onSubmit={handleSubmit}
        />
      </div>
      <PreorderSummary
        deliveryFeeCents={
          selection.mode === "delivery" ? deliveryCost : null
        }
      />
    </div>
  );
}

function deliveryTimeLabel(data: {
  express: boolean;
  deliveryDate: string;
  deliverySlotId: string;
}): string {
  if (data.express) {
    return "Express — in ca. 2 Std.";
  }

  const parts = data.deliverySlotId.split("-");
  const time = parts[parts.length - 1];

  return `${formatDate(data.deliveryDate)}, ${time} Uhr`;
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
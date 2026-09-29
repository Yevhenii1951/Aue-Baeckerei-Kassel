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
import { deliveryTimeLabel } from "./checkoutLabels";
import { PaymentNotice } from "./PaymentNotice";
import { useStripeCheckout } from "./useStripeCheckout";
import { DeliveryPanel } from "./DeliveryPanel";
import { DeliverySchedule } from "./DeliverySchedule";
import { PreorderSummary } from "./PreorderSummary";

type CheckoutFlowProps = {
  locale: SiteLocale;
  paymentsEnabled: boolean;
  paymentCancelled: boolean;
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

export function CheckoutFlow({
  locale,
  paymentsEnabled,
  paymentCancelled,
}: CheckoutFlowProps): React.ReactElement {
  const { items, totals } = useCart();
  const selection = useFulfillment();
  const [form, setForm] = useState<CheckoutFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sequence, setSequence] = useState(1);
  const [confirmed, setConfirmed] = useState<ConfirmedOrder | null>(null);
  const { payWithStripe, pending, error: paymentError } = useStripeCheckout({
    cart: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    locale,
    returnPath: `/${locale}/kasse`,
  });

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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const result = parseCheckoutForm(effectiveForm);
    if (!result.success) {
      setErrors(result.fieldErrors);
      return;
    }

    setErrors({});

    if (paymentsEnabled && result.data.payment === "stripe") {
      await payWithStripe(result.data);
      return;
    }

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
        <PaymentNotice cancelled={paymentCancelled} error={paymentError} />
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
          pending={pending}
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

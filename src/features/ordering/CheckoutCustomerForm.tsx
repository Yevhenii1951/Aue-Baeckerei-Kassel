"use client";

import { useTranslations } from "next-intl";
import type { CheckoutFormValues } from "./checkout-form";
import { PAYMENT_METHODS } from "./checkout-form";

type CheckoutCustomerFormProps = {
  values: CheckoutFormValues;
  errors: Record<string, string>;
  pending: boolean;
  onChange: (field: keyof CheckoutFormValues, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const inputClass =
  "min-h-11 w-full rounded-lg border border-brand-deep/15 bg-white px-3 text-brand-deep";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium text-brand-deep">{label}</span>
      {children}
      {error ? <span className="text-sm text-red-700">{error}</span> : null}
    </label>
  );
}

export function CheckoutCustomerForm({
  values,
  errors,
  pending,
  onChange,
  onSubmit,
}: CheckoutCustomerFormProps): React.ReactElement {
  const t = useTranslations("kasse");
  const tv = useTranslations("validation");

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <fieldset className="grid gap-4">
        <legend className="text-sm font-medium text-brand-deep">
          {t("contactLegend")}
        </legend>
        <Field label={t("fieldName")} error={errors.name ? tv(errors.name) : undefined}>
          <input
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
            className={inputClass}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
          />
        </Field>
        <Field label={t("fieldEmail")} error={errors.email ? tv(errors.email) : undefined}>
          <input
            type="email"
            value={values.email}
            onChange={(event) => onChange("email", event.target.value)}
            className={inputClass}
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
        <Field label={t("fieldPhone")} error={errors.phone ? tv(errors.phone) : undefined}>
          <input
            type="tel"
            value={values.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            className={inputClass}
            autoComplete="tel"
            inputMode="tel"
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>

        {values.mode === "delivery" ? (
          <>
            <Field
              label={t("fieldStreet")}
              error={errors.street ? tv(errors.street) : undefined}
            >
              <input
                value={values.street}
                onChange={(event) => onChange("street", event.target.value)}
                className={inputClass}
                autoComplete="street-address"
                aria-invalid={Boolean(errors.street)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label={t("fieldZip")}
                error={errors.zip ? tv(errors.zip) : undefined}
              >
                <input
                  value={values.zip}
                  onChange={(event) => onChange("zip", event.target.value)}
                  className={inputClass}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  aria-invalid={Boolean(errors.zip)}
                />
              </Field>
              <Field
                label={t("fieldCity")}
                error={errors.city ? tv(errors.city) : undefined}
              >
                <input
                  value={values.city}
                  onChange={(event) => onChange("city", event.target.value)}
                  className={inputClass}
                  autoComplete="address-level2"
                  aria-invalid={Boolean(errors.city)}
                />
              </Field>
            </div>
          </>
        ) : null}
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-brand-deep">
          {t("paymentLegend")}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {PAYMENT_METHODS.map((method) => (
            <div key={method.id} className="rounded-lg border border-brand-deep/15">
              <label className="flex cursor-pointer items-center gap-2 px-3 py-2.5">
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={values.payment === method.id}
                  onChange={() => onChange("payment", method.id)}
                />
                <span className="text-sm font-medium">
                  {t(`methodLabels.${method.id}`)}
                </span>
              </label>
            </div>
          ))}
        </div>
        {errors.payment ? (
          <p className="text-sm text-red-700">{tv(errors.payment)}</p>
        ) : null}
      </fieldset>

      <Field
        label={t("fieldNotes")}
        error={errors.notes ? tv(errors.notes) : undefined}
      >
        <textarea
          rows={3}
          value={values.notes}
          onChange={(event) => onChange("notes", event.target.value)}
          className="w-full rounded-lg border border-brand-deep/15 bg-white px-3 py-2 text-brand-deep"
          aria-invalid={Boolean(errors.notes)}
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="min-h-12 rounded-lg bg-amber px-4 py-2 font-semibold text-brand-deep disabled:opacity-60"
      >
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
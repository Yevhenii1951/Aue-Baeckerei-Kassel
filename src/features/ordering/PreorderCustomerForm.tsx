"use client";

import type { PreorderFormValues } from "./preorder-form";

type PreorderCustomerFormProps = {
  values: PreorderFormValues;
  errors: Record<string, string>;
  onChange: (field: keyof PreorderFormValues, value: string) => void;
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

export function PreorderCustomerForm({
  values,
  errors,
  onChange,
  onSubmit,
}: PreorderCustomerFormProps): React.ReactElement {
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <Field label="Name *" error={errors.name}>
        <input
          value={values.name}
          onChange={(event) => onChange("name", event.target.value)}
          className={inputClass}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <Field label="E-Mail *" error={errors.email}>
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

      <Field label="Telefon *" error={errors.phone}>
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

      <Field label="Notizen für die Bäckerei" error={errors.notes}>
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
        className="min-h-11 rounded-lg bg-amber px-4 py-2 font-semibold text-brand-deep"
      >
        Vorbestellung absenden
      </button>
    </form>
  );
}
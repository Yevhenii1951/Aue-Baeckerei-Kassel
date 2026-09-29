"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import type { SiteLocale } from "@/features/seo/site";
import { useCart } from "./cart-provider";
import { earliestPreorderDate, nextNDates } from "./preorder";
import { demoPickupSlots } from "./demoSlots";
import {
  parsePreorderForm,
  type PreorderFormValues,
} from "./preorder-form";
import { PreorderSlotPicker } from "./PreorderSlotPicker";
import { PreorderSummary } from "./PreorderSummary";
import { PreorderCustomerForm } from "./PreorderCustomerForm";

type PreorderFlowProps = {
  locale: SiteLocale;
};

type SelectedSlot = {
  date: string;
  slotId: string;
};

const DATE_COUNT = 7;
const EMPTY_FORM: PreorderFormValues = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

function subscribeNothing(): () => void {
  return () => {};
}

export function PreorderFlow({ locale }: PreorderFlowProps): React.ReactElement {
  const { items } = useCart();
  const firstDate = useSyncExternalStore(
    subscribeNothing,
    () => earliestPreorderDate(new Date()),
    () => "",
  );
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<SelectedSlot | null>(null);
  const [form, setForm] = useState<PreorderFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);

  const mounted = firstDate !== "";
  const effectiveDate = date ?? firstDate;

  if (!mounted) {
    return <div className="grid gap-8 py-8 lg:grid-cols-[1fr_22rem]" />;
  }

  if (items.length === 0) {
    return (
      <div className="grid place-content-center gap-4 py-20 text-center">
        <p className="max-w-md text-ink/70">
          Dein Warenkorb ist noch leer. Wähle zuerst aus dem Sortiment.
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

  const dates = nextNDates(effectiveDate, DATE_COUNT);
  const selectedSlotId = slot?.date === effectiveDate ? slot.slotId : null;
  const selectedSlot =
    demoPickupSlots(effectiveDate).find(
      (candidate) => candidate.id === selectedSlotId,
    ) ?? null;

  function updateField(
    field: keyof PreorderFormValues,
    value: string,
  ): void {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!selectedSlotId) {
      setErrors({ slot: "Bitte wähle einen Abholzeitraum." });
      return;
    }

    const result = parsePreorderForm(form);
    if (!result.success) {
      setErrors(result.fieldErrors);
      return;
    }

    setErrors({});
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-lg border border-sage/30 bg-paper p-6 shadow-card">
          <h2 className="font-display text-3xl font-semibold text-brand-deep">
            Vielen Dank{form.name ? `, ${form.name.split(" ")[0]}` : ""}!
          </h2>
          <p className="mt-3 text-ink/70">
            Deine Vorbestellung ist als Demo bei uns eingegangen. Abholung am{" "}
            <strong className="text-brand-deep">{formatDate(effectiveDate)}</strong>{" "}
            um{" "}
            <strong className="text-brand-deep">
              {selectedSlot?.startTime}–{selectedSlot?.endTime} Uhr
            </strong>
            .
          </p>
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
      <div className="grid gap-8">
        <section className="grid gap-3">
          <h2 className="text-lg font-semibold text-brand-deep">
            Wann möchtest du abholen?
          </h2>
          <p className="text-sm text-ink/65">
            Nach 20 Uhr gilt die Vorbestellung für übermorgen.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {dates.map((candidate) => {
              const selected = candidate === effectiveDate;
              return (
                <button
                  key={candidate}
                  type="button"
                  onClick={() => setDate(candidate)}
                  aria-pressed={selected}
                  className={`min-h-11 rounded-lg border px-3 py-2 text-left text-sm font-medium ${
                    selected
                      ? "border-brand bg-brand text-cream"
                      : "border-brand-deep/15 bg-white text-brand-deep"
                  }`}
                >
                  {formatDate(candidate)}
                </button>
              );
            })}
          </div>
          {errors.slot ? (
            <p className="text-sm text-red-700">{errors.slot}</p>
          ) : null}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-semibold text-brand-deep">
            Abholzeitraum
          </h2>
          <PreorderSlotPicker
            slots={demoPickupSlots(effectiveDate)}
            selectedId={selectedSlotId}
            onSelect={(slotId) =>
              setSlot(slotId ? { date: effectiveDate, slotId } : null)
            }
          />
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-semibold text-brand-deep">
            Deine Kontaktdaten
          </h2>
          <PreorderCustomerForm
            values={form}
            errors={errors}
            onChange={updateField}
            onSubmit={handleSubmit}
          />
        </section>
      </div>

      <PreorderSummary />
    </div>
  );
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
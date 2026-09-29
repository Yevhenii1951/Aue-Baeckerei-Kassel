"use client";

import {
  getSlotStatus,
  type PickupSlot,
  type SlotStatus,
} from "./preorder";

type PreorderSlotPickerProps = {
  slots: PickupSlot[];
  selectedId: string | null;
  onSelect: (slotId: string | null) => void;
};

const STATUS_LABELS: Record<SlotStatus, string> = {
  available: "Noch frei",
  limited: "Wenige Plätze",
  full: "Ausgebucht",
};

const STATUS_CLASSES: Record<SlotStatus, string> = {
  available: "border-brand-deep/15 bg-white text-brand-deep",
  limited: "border-amber/60 bg-amber/10 text-brand-deep",
  full: "border-brand-deep/10 bg-brand-deep/5 text-ink/40",
};

export function PreorderSlotPicker({
  slots,
  selectedId,
  onSelect,
}: PreorderSlotPickerProps): React.ReactElement {
  return (
    <div className="grid grid-cols-2 gap-2">
      {slots.map((slot) => {
        const status = getSlotStatus(slot);
        const full = status === "full";
        const selected = slot.id === selectedId;

        return (
          <button
            key={slot.id}
            type="button"
            disabled={full}
            aria-pressed={selected}
            onClick={() => onSelect(selected ? null : slot.id)}
            className={`flex min-h-11 flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left ${
              selected
                ? "border-brand bg-brand text-cream"
                : STATUS_CLASSES[status]
            }`}
          >
            <span className="font-medium">
              {slot.startTime}–{slot.endTime} Uhr
            </span>
            <span className={selected ? "text-cream/75 text-xs" : "text-xs opacity-70"}>
              {STATUS_LABELS[status]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
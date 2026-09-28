"use client";

import { useEffect, useSyncExternalStore } from "react";

export type FulfillmentMode = "pickup" | "delivery";

export type FulfillmentSelection = {
  mode: FulfillmentMode;
  deliveryDate: string;
  deliverySlotId: string;
  express: boolean;
};

const STORAGE_KEY = "aue.fulfillment.v1";

const DEFAULT_SELECTION: FulfillmentSelection = {
  mode: "pickup",
  deliveryDate: "",
  deliverySlotId: "",
  express: false,
};

let selection: FulfillmentSelection = DEFAULT_SELECTION;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): FulfillmentSelection {
  return selection;
}

function getServerSnapshot(): FulfillmentSelection {
  return DEFAULT_SELECTION;
}

function persist(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
  } catch {
    // storage unavailable (private mode, quota) — selection stays in memory
  }
}

function setSelection(next: FulfillmentSelection): void {
  selection = next;
  emit();
  persist();
}

export function setFulfillmentMode(mode: FulfillmentMode): void {
  setSelection({ ...selection, mode });
}

export function setDeliveryDate(deliveryDate: string): void {
  const keepSlot =
    selection.deliverySlotId !== "" &&
    selection.deliverySlotId.startsWith(deliveryDate);

  setSelection({
    ...selection,
    deliveryDate,
    deliverySlotId: keepSlot ? selection.deliverySlotId : "",
    express: keepSlot ? selection.express : false,
  });
}

export function setDeliverySlot(deliverySlotId: string, express: boolean): void {
  const date = deliverySlotId.slice(0, deliverySlotId.lastIndexOf("-"));

  setSelection({ ...selection, deliveryDate: date, deliverySlotId, express });
}

function parseStored(raw: string | null): FulfillmentSelection {
  if (raw === null) {
    return DEFAULT_SELECTION;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FulfillmentSelection>;
    const deliverySlotId =
      typeof parsed.deliverySlotId === "string" ? parsed.deliverySlotId : "";
    const deliveryDate =
      typeof parsed.deliveryDate === "string" && parsed.deliveryDate !== ""
        ? parsed.deliveryDate
        : deliverySlotId.slice(0, deliverySlotId.lastIndexOf("-"));

    return {
      mode: parsed.mode === "delivery" ? "delivery" : "pickup",
      deliveryDate,
      deliverySlotId,
      express: parsed.express === true,
    };
  } catch {
    return DEFAULT_SELECTION;
  }
}

export function useFulfillment(): FulfillmentSelection {
  useEffect(() => {
    let stored: FulfillmentSelection;
    try {
      stored = parseStored(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      stored = DEFAULT_SELECTION;
    }
    if (JSON.stringify(stored) !== JSON.stringify(selection)) {
      setSelection(stored);
    }
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
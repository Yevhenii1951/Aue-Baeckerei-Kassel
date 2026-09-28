"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  PENDING_CONSENT,
  parseConsentStorage,
  serializeConsent,
  type ConsentState,
  type MapConsentChoice,
} from "./consentStorage";

const CONSENT_CHANGE_EVENT = "aue-consent-change";

let state: ConsentState = PENDING_CONSENT;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  window.addEventListener(CONSENT_CHANGE_EVENT, listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
    window.removeEventListener(CONSENT_CHANGE_EVENT, listener);
  };
}

function getSnapshot(): ConsentState {
  return state;
}

function getServerSnapshot(): ConsentState {
  return PENDING_CONSENT;
}

function persist(): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, serializeConsent(state));
  } catch {
    // Storage unavailable (private mode, quota): the choice stays in memory
    // for this visit and is not persisted.
  }
}

function applyChoice(choice: MapConsentChoice): void {
  state = { map: choice, version: CONSENT_VERSION };
  persist();
  emit();
}

export function grantMapConsent(): void {
  applyChoice("granted");
}

export function denyMapConsent(): void {
  applyChoice("denied");
}

export function resetConsent(): void {
  state = PENDING_CONSENT;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Storage unavailable: the reset still applies for this visit.
  }
  emit();
}

export function useConsent(): ConsentState {
  useEffect(() => {
    let stored: ConsentState = PENDING_CONSENT;

    try {
      stored = parseConsentStorage(
        window.localStorage.getItem(CONSENT_STORAGE_KEY),
      );
    } catch {
      stored = PENDING_CONSENT;
    }

    if (stored.map !== state.map) {
      state = stored;
      emit();
    }
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

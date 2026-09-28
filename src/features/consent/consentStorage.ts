import { z } from "zod";

export const CONSENT_STORAGE_KEY = "aue.consent.v1";
export const CONSENT_VERSION = 1;

export type MapConsentChoice = "pending" | "granted" | "denied";

export type ConsentState = {
  map: MapConsentChoice;
  version: number;
};

export const PENDING_CONSENT: ConsentState = {
  map: "pending",
  version: CONSENT_VERSION,
};

const consentStateSchema = z.object({
  map: z.enum(["granted", "denied"]),
  version: z.literal(CONSENT_VERSION),
});

export function parseConsentStorage(raw: string | null): ConsentState {
  if (raw === null) {
    return PENDING_CONSENT;
  }

  try {
    const parsed = consentStateSchema.parse(JSON.parse(raw));
    return { map: parsed.map, version: parsed.version };
  } catch {
    return PENDING_CONSENT;
  }
}

export function serializeConsent(state: ConsentState): string {
  return JSON.stringify({ map: state.map, version: state.version });
}

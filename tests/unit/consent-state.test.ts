import { describe, expect, it } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  parseConsentStorage,
  serializeConsent,
  type ConsentState,
} from "@/features/consent/consentStorage";

const grantedMap: ConsentState = { map: "granted", version: CONSENT_VERSION };

describe("consent storage", () => {
  it("treats a fresh visitor as undecided", () => {
    expect(parseConsentStorage(null)).toEqual({
      map: "pending",
      version: CONSENT_VERSION,
    });
  });

  it("round-trips a granted map choice", () => {
    const stored = serializeConsent(grantedMap);

    expect(stored.startsWith("{")).toBe(true);
    expect(parseConsentStorage(stored)).toEqual(grantedMap);
  });

  it("keeps a denied choice denied", () => {
    expect(
      parseConsentStorage(
        serializeConsent({ map: "denied", version: CONSENT_VERSION }),
      ).map,
    ).toBe("denied");
  });

  it("falls back to pending for malformed json", () => {
    expect(parseConsentStorage("not-json").map).toBe("pending");
  });

  it("falls back to pending when the map value is unknown", () => {
    expect(parseConsentStorage(JSON.stringify({ map: "maybe" })).map).toBe(
      "pending",
    );
  });

  it("falls back to pending for an outdated version", () => {
    expect(
      parseConsentStorage(JSON.stringify({ map: "granted", version: 0 })).map,
    ).toBe("pending");
  });

  it("uses a namespaced storage key", () => {
    expect(CONSENT_STORAGE_KEY).toBe("aue.consent.v1");
  });
});

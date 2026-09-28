export type DeliveryZone = 1 | 2 | 3;

export type DeliveryZoneInfo = {
  zone: DeliveryZone;
  distanceKm: number;
  feeCents: number;
  freeThresholdCents: number;
  note: string;
};

export const DELIVERY_ZONES: DeliveryZoneInfo[] = [
  {
    zone: 1,
    distanceKm: 2,
    feeCents: 250,
    freeThresholdCents: 2000,
    note: "Erste Innenstadt, PLZ 34117 und 34119.",
  },
  {
    zone: 2,
    distanceKm: 5,
    feeCents: 450,
    freeThresholdCents: 3000,
    note: "PLZ 34121, 34123, 34125 und 34128.",
  },
  {
    zone: 3,
    distanceKm: 8,
    feeCents: 650,
    freeThresholdCents: 4000,
    note: "PLZ 34127, 34130, 34131, 34132 und 34134.",
  },
];

const ZONE_PLZS: Record<DeliveryZone, string[]> = {
  1: ["34117", "34119"],
  2: ["34121", "34123", "34125", "34128"],
  3: ["34127", "34130", "34131", "34132", "34134"],
};

export function normalizePostalCode(input: string): string {
  return input.trim().replace(/\s+/g, "");
}

export function zoneForPostalCode(input: string): DeliveryZone | null {
  const plz = normalizePostalCode(input);
  if (!/^[0-9]{5}$/.test(plz)) {
    return null;
  }
  for (const zone of [1, 2, 3] as const) {
    if (ZONE_PLZS[zone].includes(plz)) {
      return zone;
    }
  }
  return null;
}

export function deliveryZoneInfo(zone: DeliveryZone): DeliveryZoneInfo {
  return DELIVERY_ZONES[zone - 1];
}

export function deliveryFeeCents(zone: DeliveryZone): number {
  return deliveryZoneInfo(zone).feeCents;
}

export function freeThresholdCents(zone: DeliveryZone): number {
  return deliveryZoneInfo(zone).freeThresholdCents;
}

export function deliveryChargeCents(
  subtotalCents: number,
  zone: DeliveryZone,
): number {
  return subtotalCents >= freeThresholdCents(zone) ? 0 : deliveryFeeCents(zone);
}
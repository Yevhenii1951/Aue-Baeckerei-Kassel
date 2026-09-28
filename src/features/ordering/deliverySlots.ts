import type { DeliveryZone } from "./delivery";

export type DeliveryOrderSlot = {
  id: string;
  startTime: string;
  endTime: string;
  express: boolean;
};

export const EXPRESS_FEE_CENTS = 300;

const BERLIN_TIME_ZONE = "Europe/Berlin";
const SLOT_START = "10:00";
const SLOT_END = "20:00";
const SLOT_STEP_MINUTES = 120;
const EXPRESS_CUTOFF_MINUTES = 12 * 60;

export function buildDeliverySlots(
  date: string,
  now?: Date,
): DeliveryOrderSlot[] {
  const start = timeToMinutes(SLOT_START);
  const end = timeToMinutes(SLOT_END);
  const nowMinutes = now !== undefined ? berlinMinutes(now) : null;
  const isToday = now !== undefined ? berlinDateString(now) === date : false;

  const slots: DeliveryOrderSlot[] = [];

  for (let cursor = start; cursor < end; cursor += SLOT_STEP_MINUTES) {
    const slotEnd = cursor + SLOT_STEP_MINUTES;

    if (isToday && nowMinutes !== null && slotEnd <= nowMinutes) {
      continue;
    }

    slots.push({
      id: `${date}-${minutesToTime(cursor)}`,
      startTime: minutesToTime(cursor),
      endTime: minutesToTime(slotEnd),
      express: false,
    });
  }

  return slots;
}

export function isExpressAvailable(
  zone: DeliveryZone | null,
  now: Date,
): boolean {
  return zone !== null && zone <= 2 && berlinMinutes(now) < EXPRESS_CUTOFF_MINUTES;
}

export function berlinDateString(date: Date): string {
  const parts = getBerlinParts(date);

  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function berlinMinutes(date: Date): number {
  const parts = getBerlinParts(date);

  return parts.hour * 60 + parts.minute;
}

function getBerlinParts(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} {
  const formatter = new Intl.DateTimeFormat("de-DE", {
    timeZone: BERLIN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

function minutesToTime(minutes: number): string {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${pad(hour)}:${pad(minute)}`;
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}
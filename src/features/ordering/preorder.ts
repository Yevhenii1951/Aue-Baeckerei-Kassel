export type SlotStatus = "available" | "limited" | "full";

export type PickupSlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  reserved: number;
};

export type BuildPickupSlotsInput = {
  startTime: string;
  endTime: string;
  capacity: number;
  reservedByStartTime?: Record<string, number>;
};

const BERLIN_TIME_ZONE = "Europe/Berlin";
const DEFAULT_CUTOFF_HOUR = 20;
const DEFAULT_CUTOFF_MINUTE = 0;
const SLOT_MINUTES = 30;

export function earliestPreorderDate(
  now: Date,
  cutoffHour = DEFAULT_CUTOFF_HOUR,
  cutoffMinute = DEFAULT_CUTOFF_MINUTE,
): string {
  const berlin = getBerlinParts(now);
  const afterCutoff =
    berlin.hour > cutoffHour ||
    (berlin.hour === cutoffHour && berlin.minute >= cutoffMinute);

  return addDaysToDateString(
    `${berlin.year}-${pad(berlin.month)}-${pad(berlin.day)}`,
    afterCutoff ? 2 : 1,
  );
}

export function buildPickupSlots(
  date: string,
  input: BuildPickupSlotsInput,
): PickupSlot[] {
  const start = timeToMinutes(input.startTime);
  const end = timeToMinutes(input.endTime);

  if (end <= start) {
    return [];
  }

  const slots: PickupSlot[] = [];

  for (let cursor = start; cursor < end; cursor += SLOT_MINUTES) {
    const startTime = minutesToTime(cursor);
    const endTime = minutesToTime(cursor + SLOT_MINUTES);

    slots.push({
      id: `${date}-${startTime}`,
      date,
      startTime,
      endTime,
      capacity: input.capacity,
      reserved: input.reservedByStartTime?.[startTime] ?? 0,
    });
  }

  return slots;
}

export function getSlotStatus(
  slot: Pick<PickupSlot, "capacity" | "reserved">,
): SlotStatus {
  const remaining = slot.capacity - slot.reserved;

  if (remaining <= 0) {
    return "full";
  }

  if (remaining <= Math.ceil(slot.capacity * 0.2)) {
    return "limited";
  }

  return "available";
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

function addDaysToDateString(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days, 12));

  return [
    next.getUTCFullYear(),
    pad(next.getUTCMonth() + 1),
    pad(next.getUTCDate()),
  ].join("-");
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

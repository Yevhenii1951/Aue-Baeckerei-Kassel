import {
  buildPickupSlots,
  type PickupSlot,
} from "./preorder";

// Demo reservation data until a seeded database exists (ABE-020). Values are
// deterministic per (date, slot) and derived from an FNV-1a hash, so a reload
// shows identical capacity states.

const DEMO_CAPACITY = 15;
const SLOT_START = "06:30";
const SLOT_END = "19:30";

export function demoPickupSlots(date: string): PickupSlot[] {
  const slots = buildPickupSlots(date, {
    startTime: SLOT_START,
    endTime: SLOT_END,
    capacity: DEMO_CAPACITY,
  });

  return slots.map((slot) => ({
    ...slot,
    reserved: reservedFor(date, slot.startTime),
  }));
}

function reservedFor(date: string, startTime: string): number {
  const hour = Number(startTime.split(":")[0]);
  const noise = hashString(`${date}-${startTime}`) % 3;
  const base = hour <= 9 ? 13 : hour <= 14 ? 10 : 4;

  return Math.min(DEMO_CAPACITY, base + noise);
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
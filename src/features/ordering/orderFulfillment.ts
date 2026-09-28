import type { PoolClient } from "pg";
import type { CreateOrderErrorCode, CreateOrderInput } from "./orderService";

export type FulfillmentDecision =
  | ResolvedFulfillment
  | { status: "error"; error: FulfillmentError };

export type ResolvedFulfillment = {
  status: "ok";
  scheduledFor: Date;
  pickupSlotId: string | null;
  deliveryZoneId: string | null;
  deliveryFeeCents: number;
  deliveryAddress: string | null;
};

type FulfillmentError = {
  ok: false;
  code: CreateOrderErrorCode;
  message: string;
};

export async function resolveFulfillment(
  client: PoolClient,
  input: CreateOrderInput,
  subtotalCents: number,
): Promise<FulfillmentDecision> {
  if (input.customer.mode === "pickup") {
    if (!input.pickupSlotId) {
      return failure("INVALID_INPUT", "Bitte wähle einen Abholzeitraum.");
    }
    return resolvePickup(client, input.pickupSlotId);
  }

  return resolveDelivery(client, input, subtotalCents);
}

async function resolvePickup(
  client: PoolClient,
  slotId: string,
): Promise<FulfillmentDecision> {
  const slot = await client.query<{
    starts_at: Date;
    capacity: number;
    used: string;
  }>(
    `SELECT starts_at, capacity,
       (SELECT count(*) FROM orders
        WHERE pickup_slot_id = pickup_slots.id AND status <> 'cancelled') AS used
     FROM pickup_slots
     WHERE id = $1 AND active
     FOR UPDATE`,
    [slotId],
  );
  if (slot.rowCount === 0) {
    return failure("INVALID_INPUT", "Der Abholzeitraum ist nicht verfügbar.");
  }
  if (Number(slot.rows[0].used) >= slot.rows[0].capacity) {
    return failure("FULL_SLOT", "Der Abholzeitraum ist leider voll.");
  }
  return resolved(slot.rows[0].starts_at, slotId, null, 0, null);
}

async function resolveDelivery(
  client: PoolClient,
  input: CreateOrderInput,
  subtotalCents: number,
): Promise<FulfillmentDecision> {
  const zone = await client.query<{
    id: string;
    fee_cents: number;
    free_delivery_cents: number;
  }>(
    `SELECT id, fee_cents, free_delivery_cents FROM delivery_zones
     WHERE active AND $1 = ANY(postal_codes)`,
    [input.customer.zip],
  );
  if (zone.rowCount === 0) {
    return failure("UNAVAILABLE_DELIVERY", "Diese PLZ liegt nicht im Liefergebiet.");
  }
  const fee = subtotalCents >= zone.rows[0].free_delivery_cents ? 0 : zone.rows[0].fee_cents;
  const address = `${input.customer.street}, ${input.customer.zip} ${input.customer.city}`;

  return resolved(
    scheduledFromDeliverySlot(input.customer.deliverySlotId),
    null,
    zone.rows[0].id,
    fee,
    address,
  );
}

function scheduledFromDeliverySlot(slotId: string): Date {
  const date = slotId.slice(0, 10);
  const time = slotId.endsWith("express") ? "12:00" : slotId.slice(11);
  return new Date(`${date}T${time}:00+02:00`);
}

function resolved(
  scheduledFor: Date,
  pickupSlotId: string | null,
  deliveryZoneId: string | null,
  deliveryFeeCents: number,
  deliveryAddress: string | null,
): ResolvedFulfillment {
  return {
    status: "ok",
    scheduledFor,
    pickupSlotId,
    deliveryZoneId,
    deliveryFeeCents,
    deliveryAddress,
  };
}

function failure(
  code: CreateOrderErrorCode,
  message: string,
): FulfillmentDecision {
  return { status: "error", error: { ok: false, code, message } };
}

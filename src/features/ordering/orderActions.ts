"use server";

import { getServerPool } from "@/lib/db/serverPool";
import { createOrder, type CreateOrderInput, type CreateOrderResult } from "./orderService";

export async function createOrderAction(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const pool = getServerPool();
  if (!pool) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Bestellungen sind serverseitig noch nicht konfiguriert.",
    };
  }

  return createOrder(pool, input);
}

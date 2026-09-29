import type { Pool, PoolClient } from "pg";
import { z } from "zod";
import { checkoutFormSchema } from "./checkout-form";
import { resolveFulfillment } from "./orderFulfillment";

export type CreateOrderResult =
  | {
      ok: true;
      orderId: string;
      orderNumber: string;
      subtotalCents: number;
      deliveryFeeCents: number;
      totalCents: number;
      lines: OrderLine[];
    }
  | { ok: false; code: CreateOrderErrorCode; message: string };

export type OrderLine = {
  name: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
};

export type CreateOrderErrorCode =
  | "INVALID_INPUT"
  | "INVALID_CART"
  | "FULL_SLOT"
  | "UNAVAILABLE_PRODUCT"
  | "UNAVAILABLE_DELIVERY";

const cartItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().positive().max(99),
});

export const createOrderSchema = z.object({
  cart: z.array(cartItemSchema).min(1),
  customer: checkoutFormSchema,
  pickupSlotId: z.string().uuid().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
};

export async function createOrder(
  pool: Pool,
  input: unknown,
): Promise<CreateOrderResult> {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return error("INVALID_INPUT", "Bitte prüfe deine Bestelldaten.");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await createOrderInTransaction(client, parsed.data);
    if (!result.ok) {
      await client.query("ROLLBACK");
      return result;
    }
    await client.query("COMMIT");
    return result;
  } catch (cause) {
    await client.query("ROLLBACK");
    throw cause;
  } finally {
    client.release();
  }
}

async function createOrderInTransaction(
  client: PoolClient,
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const products = await loadProducts(client, input.cart.map((item) => item.productId));
  if (products.size !== new Set(input.cart.map((item) => item.productId)).size) {
    return error("UNAVAILABLE_PRODUCT", "Ein Produkt ist nicht verfügbar.");
  }

  const subtotalCents = input.cart.reduce((total, item) => {
    const product = products.get(item.productId);
    if (!product) return total;
    return total + product.price_cents * item.quantity;
  }, 0);
  if (subtotalCents <= 0) return error("INVALID_CART", "Der Warenkorb ist leer.");

  const fulfillment = await resolveFulfillment(client, input, subtotalCents);
  if (fulfillment.status === "error") return fulfillment.error;

  const order = await client.query<{ id: string; order_number: string }>(
    `INSERT INTO orders (
       fulfillment_type, pickup_slot_id, delivery_zone_id, customer_name,
       customer_email, customer_phone, delivery_address, customer_note,
       subtotal_cents, delivery_fee_cents, total_cents, scheduled_for
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING id, order_number::text`,
    [
      input.customer.mode,
      fulfillment.pickupSlotId,
      fulfillment.deliveryZoneId,
      input.customer.name,
      input.customer.email,
      input.customer.phone,
      fulfillment.deliveryAddress,
      input.customer.notes || null,
      subtotalCents,
      fulfillment.deliveryFeeCents,
      subtotalCents + fulfillment.deliveryFeeCents,
      fulfillment.scheduledFor,
    ],
  );

  for (const item of input.cart) {
    const product = products.get(item.productId);
    if (!product) continue;
    await client.query(
      `INSERT INTO order_items (
         order_id, product_id, product_name, unit_price_cents, quantity,
         line_total_cents
       ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        order.rows[0].id,
        product.id,
        product.name,
        product.price_cents,
        item.quantity,
        product.price_cents * item.quantity,
      ],
    );
  }

  return {
    ok: true,
    orderId: order.rows[0].id,
    orderNumber: order.rows[0].order_number,
    subtotalCents,
    deliveryFeeCents: fulfillment.deliveryFeeCents,
    totalCents: subtotalCents + fulfillment.deliveryFeeCents,
    lines: input.cart.flatMap((item) => {
      const product = products.get(item.productId);
      if (!product) return [];
      return [
        {
          name: product.name,
          unitPriceCents: product.price_cents,
          quantity: item.quantity,
          lineTotalCents: product.price_cents * item.quantity,
        },
      ];
    }),
  };
}

async function loadProducts(
  client: PoolClient,
  slugs: string[],
): Promise<Map<string, ProductRow>> {
  const result = await client.query<ProductRow>(
    `SELECT id, slug, name, price_cents FROM products
     WHERE published AND slug = ANY($1)`,
    [[...new Set(slugs)]],
  );

  return new Map(result.rows.map((row) => [row.slug, row]));
}

function error(code: CreateOrderErrorCode, message: string): CreateOrderResult {
  return { ok: false, code, message };
}

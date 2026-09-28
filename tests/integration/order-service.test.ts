import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { resolveTestDatabaseUrl } from "@/lib/db/fuse";
import { bootstrapRoles, runMigrations } from "@/lib/db/runner";
import { resetTestDatabase } from "@/lib/db/reset";
import { createOrder, type CreateOrderInput } from "@/features/ordering/orderService";

describe("order service", () => {
  let pool: Pool;

  beforeAll(async () => {
    const databaseUrl = resolveTestDatabaseUrl(process.env as EnvSource);
    await bootstrapRoles(databaseUrl);
    await resetTestDatabase(databaseUrl);
    await runMigrations(databaseUrl);
    pool = new Pool({ connectionString: databaseUrl, max: 2 });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("creates an order and items with server-side prices", async () => {
    const slotId = await seedProductAndSlot("2026-10-01T08:00:00+02:00", 3);
    const result = await createOrder(pool, orderInput(slotId, 2));

    expect(result).toMatchObject({ ok: true, orderNumber: "1" });
    const rows = await pool.query(
      `SELECT o.subtotal_cents, o.total_cents, i.product_name,
              i.unit_price_cents, i.quantity, i.line_total_cents
       FROM orders o
       JOIN order_items i ON i.order_id = o.id`,
    );

    expect(rows.rows).toEqual([
      {
        subtotal_cents: 900,
        total_cents: 900,
        product_name: "Hausbrot",
        unit_price_cents: 450,
        quantity: 2,
        line_total_cents: 900,
      },
    ]);
  });

  it("rejects a full pickup slot without partial records", async () => {
    const slotId = await seedProductAndSlot("2026-10-02T08:00:00+02:00", 1);
    await createOrder(pool, orderInput(slotId, 1));
    const before = await countOrdersAndItems();

    const result = await createOrder(pool, orderInput(slotId, 1));
    const after = await countOrdersAndItems();

    expect(result).toEqual({
      ok: false,
      code: "FULL_SLOT",
      message: "Der Abholzeitraum ist leider voll.",
    });
    expect(after).toEqual(before);
  });

  async function seedProductAndSlot(startsAt: string, capacity: number): Promise<string> {
    await pool.query(
      `INSERT INTO products (slug, name, category, price_cents, published)
       VALUES ('hausbrot', 'Hausbrot', 'bread', 450, true)
       ON CONFLICT (slug) DO UPDATE SET price_cents = EXCLUDED.price_cents`,
    );
    const result = await pool.query<{ id: string }>(
      `INSERT INTO pickup_slots (starts_at, ends_at, capacity)
       VALUES ($1, $1::timestamptz + interval '30 minutes', $2)
       RETURNING id`,
      [startsAt, capacity],
    );

    return result.rows[0].id;
  }

  async function countOrdersAndItems(): Promise<{ orders: number; items: number }> {
    const orders = await pool.query<{ count: string }>("SELECT count(*) FROM orders");
    const items = await pool.query<{ count: string }>("SELECT count(*) FROM order_items");

    return { orders: Number(orders.rows[0].count), items: Number(items.rows[0].count) };
  }
});

function orderInput(pickupSlotId: string, quantity: number): CreateOrderInput {
  return {
    pickupSlotId,
    cart: [{ productId: "hausbrot", quantity }],
    customer: {
      name: "Maren Beispiel",
      email: "maren@example.test",
      phone: "+4912345678",
      mode: "pickup",
      deliveryDate: "",
      deliverySlotId: "",
      express: false,
      payment: "bar",
      street: "",
      zip: "",
      city: "",
      notes: "",
    },
  };
}

type EnvSource = Record<string, string | undefined>;

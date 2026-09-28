import { beforeAll, describe, expect, it } from "vitest";
import { Client } from "pg";
import { resolveTestDatabaseUrl } from "@/lib/db/fuse";
import { bootstrapRoles, runMigrations } from "@/lib/db/runner";
import { resetTestDatabase } from "@/lib/db/reset";

const TABLES = ["products", "orders", "order_items", "pickup_slots", "delivery_zones"];

async function withRole<T>(
  databaseUrl: string,
  role: string,
  run: (client: Client) => Promise<T>,
): Promise<T> {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query(`SET ROLE ${role}`);
    return await run(client);
  } finally {
    await client.end();
  }
}

describe("ecommerce schema", () => {
  let databaseUrl: string;

  beforeAll(async () => {
    databaseUrl = resolveTestDatabaseUrl(process.env as EnvSource);
    await bootstrapRoles(databaseUrl);
    await resetTestDatabase(databaseUrl);
    await runMigrations(databaseUrl);

    const owner = new Client({ connectionString: databaseUrl });
    await owner.connect();
    try {
      await owner.query(
        `INSERT INTO staff_profiles (auth_user_id, display_name, role)
         VALUES ('00000000-0000-0000-0000-000000000018', 'Backstube', 'STAFF')`,
      );
    } finally {
      await owner.end();
    }
  });

  it("creates the ecommerce tables with RLS enabled", async () => {
    const rows = await withRole(databaseUrl, "service_role", async (client) =>
      (await client.query(
        `SELECT relname FROM pg_class
         WHERE relnamespace = 'public'::regnamespace
           AND relkind = 'r'
           AND relrowsecurity
           AND relname = ANY($1)
         ORDER BY relname`,
        [TABLES],
      )).rows,
    );

    expect(rows.map((row) => row.relname)).toEqual([...TABLES].sort());
  });

  it("stores prices as integer cents and timestamps as timestamptz", async () => {
    const rows = await withRole(databaseUrl, "service_role", async (client) =>
      (await client.query(
        `SELECT table_name, column_name, data_type
         FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = ANY($1)
           AND (column_name LIKE '%cents' OR column_name IN ('created_at', 'updated_at', 'scheduled_for', 'starts_at', 'ends_at'))`,
        [TABLES],
      )).rows,
    );

    const cents = rows.filter((row) => row.column_name.endsWith("cents"));
    const timestamps = rows.filter((row) => !row.column_name.endsWith("cents"));

    expect(cents.every((row) => row.data_type === "integer")).toBe(true);
    expect(timestamps.every((row) => row.data_type === "timestamp with time zone")).toBe(true);
  });

  it("limits public reads to published products and active delivery zones", async () => {
    await seedPublicRows(databaseUrl);

    const rows = await withRole(databaseUrl, "anon", async (client) => {
      const products = await client.query("SELECT slug FROM products ORDER BY slug");
      const zones = await client.query("SELECT name FROM delivery_zones ORDER BY name");

      return { products: products.rows, zones: zones.rows };
    });

    expect(rows.products.map((row) => row.slug)).toEqual(["hausbrot"]);
    expect(rows.zones.map((row) => row.name)).toEqual(["Zone 1"]);
    await expect(
      withRole(databaseUrl, "anon", (client) => client.query("SELECT id FROM orders")),
    ).rejects.toThrow();
  });

  it("lets active staff manage operational ecommerce records", async () => {
    await withRole(databaseUrl, "authenticated", async (client) => {
      await client.query("SELECT set_config('request.jwt.claims', $1, false)", [
        JSON.stringify({ sub: "00000000-0000-0000-0000-000000000018" }),
      ]);
      const slotId = await insertPickupSlot(client);
      const orderId = await insertOrder(client, slotId);
      await client.query(
        `INSERT INTO order_items (order_id, product_name, unit_price_cents, quantity, line_total_cents)
         VALUES ($1, 'Hausbrot', 450, 2, 900)`,
        [orderId],
      );
      const result = await client.query("SELECT status FROM orders WHERE id = $1", [orderId]);

      expect(result.rows[0].status).toBe("new");
    });
  });
});

async function seedPublicRows(databaseUrl: string): Promise<void> {
  await withRole(databaseUrl, "service_role", async (client) => {
    await client.query(
      `INSERT INTO products (slug, name, category, price_cents, published)
       VALUES ('hausbrot', 'Hausbrot', 'brot', 450, true),
              ('probe', 'Probe', 'brot', 100, false)`,
    );
    await client.query(
      `INSERT INTO delivery_zones (name, postal_codes, fee_cents, free_delivery_cents, active)
       VALUES ('Zone 1', ARRAY['34117'], 250, 2000, true),
              ('Pause', ARRAY['34119'], 450, 3000, false)`,
    );
  });
}

async function insertPickupSlot(client: Client): Promise<string> {
  const result = await client.query(
    `INSERT INTO pickup_slots (starts_at, ends_at, capacity)
     VALUES ('2026-09-29T06:30:00+02:00', '2026-09-29T07:00:00+02:00', 15)
     RETURNING id`,
  );

  return result.rows[0].id;
}

async function insertOrder(client: Client, slotId: string): Promise<string> {
  const result = await client.query(
    `INSERT INTO orders (
       fulfillment_type, pickup_slot_id, customer_name, customer_email,
       customer_phone, subtotal_cents, total_cents, scheduled_for
     ) VALUES ('pickup', $1, 'Maren', 'maren@example.test', '+4912345', 900, 900,
       '2026-09-29T06:30:00+02:00')
     RETURNING id`,
    [slotId],
  );

  return result.rows[0].id;
}

type EnvSource = Record<string, string | undefined>;

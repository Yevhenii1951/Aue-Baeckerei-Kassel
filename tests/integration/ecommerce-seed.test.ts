import { beforeAll, describe, expect, it } from "vitest";
import { Client } from "pg";
import { resolveTestDatabaseUrl } from "@/lib/db/fuse";
import { bootstrapRoles, runMigrations, runSeeds } from "@/lib/db/runner";
import { resetTestDatabase } from "@/lib/db/reset";

describe("ecommerce demo seed", () => {
  let databaseUrl: string;

  beforeAll(async () => {
    databaseUrl = resolveTestDatabaseUrl(process.env as EnvSource);
    await bootstrapRoles(databaseUrl);
    await resetTestDatabase(databaseUrl);
    await runMigrations(databaseUrl);
    await runSeeds(databaseUrl);
  });

  it("populates public catalogue and delivery zones", async () => {
    const rows = await withRole("anon", async (client) => {
      const products = await client.query<{ count: string }>(
        "SELECT count(*) FROM products WHERE published",
      );
      const zones = await client.query<{ count: string }>(
        "SELECT count(*) FROM delivery_zones WHERE active",
      );

      return { products: products.rows[0].count, zones: zones.rows[0].count };
    });

    expect(Number(rows.products)).toBe(66);
    expect(Number(rows.zones)).toBe(3);
  });

  it("populates pickup slots and demo orders for admin views", async () => {
    const rows = await withRole("service_role", async (client) => {
      const slots = await client.query<{ count: string }>("SELECT count(*) FROM pickup_slots");
      const orders = await client.query<{ count: string }>("SELECT count(*) FROM orders");
      const items = await client.query<{ count: string }>("SELECT count(*) FROM order_items");
      const totals = await client.query<{ mismatches: string }>(
        `SELECT count(*) AS mismatches
         FROM orders o
         JOIN (
           SELECT order_id, sum(line_total_cents)::integer AS item_total
           FROM order_items
           GROUP BY order_id
         ) i ON i.order_id = o.id
         WHERE o.subtotal_cents <> i.item_total`,
      );

      return {
        slots: slots.rows[0].count,
        orders: orders.rows[0].count,
        items: items.rows[0].count,
        mismatches: totals.rows[0].mismatches,
      };
    });

    expect(Number(rows.slots)).toBe(5);
    expect(Number(rows.orders)).toBe(3);
    expect(Number(rows.items)).toBe(5);
    expect(Number(rows.mismatches)).toBe(0);
  });

  async function withRole<T>(role: string, run: (client: Client) => Promise<T>): Promise<T> {
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();
    try {
      await client.query(`SET ROLE ${role}`);
      return await run(client);
    } finally {
      await client.end();
    }
  }
});

type EnvSource = Record<string, string | undefined>;

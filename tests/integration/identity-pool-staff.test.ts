import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { resolveTestDatabaseUrl } from "@/lib/db/fuse";
import { bootstrapRoles, runMigrations, runSeeds } from "@/lib/db/runner";
import { resetTestDatabase } from "@/lib/db/reset";
import { insertAuditEvent } from "@/lib/db/audit";
import { createPostgresStaffStore } from "@/features/identity/postgresStaffStore";


async function insertAdminStaff(pool: Pool, authUserId: string, displayName: string) {
  await pool.query(
    `INSERT INTO staff_profiles (auth_user_id, display_name, role)
     VALUES ($1, $2, 'ADMIN')`,
    [authUserId, displayName],
  );
}

describe("base pool-first staff store", () => {
  let databaseUrl: string;
  let pool: Pool;

  beforeAll(async () => {
    databaseUrl = resolveTestDatabaseUrl(process.env as Record<string, string | undefined>);
    await bootstrapRoles(databaseUrl);
    await resetTestDatabase(databaseUrl);
    await runMigrations(databaseUrl);
    await runSeeds(databaseUrl);
    pool = new Pool({ connectionString: databaseUrl });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("reads a staff profile through the pool-based store", async () => {
    const authUserId = "00000000-0000-0000-0000-000000000033";
    await insertAdminStaff(pool, authUserId, "pool-staff");

    const store = createPostgresStaffStore(pool);
    const staff = await store.listStaff();
    const profile = staff.find((entry) => entry.authUserId === authUserId);

    expect(profile?.displayName).toBe("pool-staff");
    await pool.query("DELETE FROM staff_profiles WHERE auth_user_id = $1", [authUserId]);
  });

  it("writes an audit event through the shared pool helper", async () => {
    const authUserId = "00000000-0000-0000-0000-000000000034";
    await insertAdminStaff(pool, authUserId, "audit-staff");
    const { rows } = await pool.query<{ id: string }>(
      "SELECT id FROM staff_profiles WHERE auth_user_id = $1",
      [authUserId],
    );
    const correlationId = "base-pool-test";

    await insertAuditEvent(pool, {
      actorId: rows[0].id,
      action: "admin.staff.update",
      entityType: "staff_profile",
      entityId: null,
      afterData: { note: "pool audit smoke" },
      correlationId,
    });

    const auditRows = await pool.query<{ correlation_id: string }>(
      "SELECT correlation_id FROM audit_events WHERE correlation_id = $1",
      [correlationId],
    );
    expect(auditRows.rows).toHaveLength(1);
    await pool.query("DELETE FROM staff_profiles WHERE auth_user_id = $1", [authUserId]);
  });
});

import { describe, expect, it } from "vitest";
import { parseServerEnv } from "@/lib/env/schemas";
import {
  assertEnvGroup,
  ENV_GROUPS,
  isEnvGroupEnabled,
  missingEnvGroupKeys,
} from "@/lib/env/groups";

const minimal = { DATABASE_URL: "postgresql://user@localhost:5432/app_dev" };

describe("optional env groups", () => {
  it("treats every group as disabled when no flag is set", () => {
    const env = parseServerEnv(minimal);

    for (const group of ENV_GROUPS) {
      expect(isEnvGroupEnabled(group, env)).toBe(false);
    }
  });

  it("reports no requirements for a disabled group even when keys are absent", () => {
    const env = parseServerEnv(minimal);

    for (const group of ENV_GROUPS) {
      expect(missingEnvGroupKeys(group, env)).toEqual([]);
      expect(() => assertEnvGroup(group, env)).not.toThrow();
    }
  });

  it("accepts an enabled group once its keys are present", () => {
    const env = parseServerEnv({
      ...minimal,
      ENABLE_PAYMENTS: "true",
      STRIPE_SECRET_KEY: "sk_test_123",
      STRIPE_WEBHOOK_SECRET: "whsec_123",
    });

    expect(missingEnvGroupKeys("payments", env)).toEqual([]);
    expect(() => assertEnvGroup("payments", env)).not.toThrow();
  });

  it("names the missing keys and the flag to flip off", () => {
    const env = parseServerEnv({ ...minimal, ENABLE_EMAIL: "true" });

    // The sender identity is required too: the bakery has no mail domain yet,
    // so an enabled group without it must fail closed rather than guess one.
    expect(missingEnvGroupKeys("email", env)).toEqual([
      "BREVO_API_KEY",
      "EMAIL_SENDER_NAME",
      "EMAIL_SENDER_ADDRESS",
    ]);
    expect(() => assertEnvGroup("email", env)).toThrow(/BREVO_API_KEY/);
    expect(() => assertEnvGroup("email", env)).toThrow(/EMAIL_SENDER_ADDRESS/);
    expect(() => assertEnvGroup("email", env)).toThrow(/ENABLE_EMAIL=false/);
  });

  it("accepts the email group once the sender identity is configured", () => {
    const env = parseServerEnv({
      ...minimal,
      ENABLE_EMAIL: "true",
      BREVO_API_KEY: "xkeysib-test",
      EMAIL_SENDER_NAME: "Aue-Bäckerei Kassel",
      EMAIL_SENDER_ADDRESS: "backstube@example.test",
    });

    expect(missingEnvGroupKeys("email", env)).toEqual([]);
    expect(() => assertEnvGroup("email", env)).not.toThrow();
  });

  it("treats a whitespace-only key as missing", () => {
    const env = parseServerEnv({
      ...minimal,
      ENABLE_CRON: "true",
      CRON_SECRET: "   ",
    });

    expect(missingEnvGroupKeys("cron", env)).toEqual(["CRON_SECRET"]);
  });

  it("requires an AI budget even when a provider key is configured", () => {
    const env = parseServerEnv({
      ...minimal,
      ENABLE_AI: "true",
      GROQ_API_KEY: "gsk_123",
    });

    expect(missingEnvGroupKeys("ai", env)).toEqual(["AI_MONTHLY_BUDGET_EUR"]);
  });

  it("rejects a non-numeric AI budget at parse time", () => {
    expect(() =>
      parseServerEnv({ ...minimal, AI_MONTHLY_BUDGET_EUR: "viel" }),
    ).toThrow();
  });

  it("accepts a budget with two decimals", () => {
    const env = parseServerEnv({ ...minimal, AI_MONTHLY_BUDGET_EUR: "12.50" });

    expect(env.AI_MONTHLY_BUDGET_EUR).toBe("12.50");
  });
});

import { serverEnv } from "./server";
import type { ServerEnv } from "./schemas";

export const ENV_GROUPS = ["payments", "ai", "email", "cron"] as const;
export type EnvGroup = (typeof ENV_GROUPS)[number];

type GroupFlag =
  | "ENABLE_PAYMENTS"
  | "ENABLE_AI"
  | "ENABLE_EMAIL"
  | "ENABLE_CRON";

type GroupSpec = {
  flag: GroupFlag;
  label: string;
  required: (keyof ServerEnv)[];
};

export const ENV_GROUP_SPECS: Record<EnvGroup, GroupSpec> = {
  payments: {
    flag: "ENABLE_PAYMENTS",
    label: "Zahlungen (Stripe)",
    required: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
  },
  ai: {
    flag: "ENABLE_AI",
    label: "KI-Assistent",
    required: ["AI_MONTHLY_BUDGET_EUR"],
  },
  email: {
    flag: "ENABLE_EMAIL",
    label: "E-Mail-Versand (Brevo)",
    required: ["BREVO_API_KEY"],
  },
  cron: {
    flag: "ENABLE_CRON",
    label: "Cronjobs",
    required: ["CRON_SECRET"],
  },
};

export function isEnvGroupEnabled(
  group: EnvGroup,
  env: ServerEnv = serverEnv,
): boolean {
  return env[ENV_GROUP_SPECS[group].flag] === "true";
}

export function missingEnvGroupKeys(
  group: EnvGroup,
  env: ServerEnv = serverEnv,
): string[] {
  if (!isEnvGroupEnabled(group, env)) return [];
  return ENV_GROUP_SPECS[group].required
    .filter((key) => !env[key])
    .map(String);
}

export function assertEnvGroup(
  group: EnvGroup,
  env: ServerEnv = serverEnv,
): void {
  const missing = missingEnvGroupKeys(group, env);
  if (missing.length === 0) return;
  const { flag, label } = ENV_GROUP_SPECS[group];
  throw new Error(
    `ENV-Gruppe "${label}" ist aktiviert, aber unvollstaendig: ${missing.join(", ")}. ` +
      `In .env ergaenzen oder ${flag}=false setzen.`,
  );
}

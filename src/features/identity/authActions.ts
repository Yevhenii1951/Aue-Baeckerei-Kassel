"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { serverEnv } from "@/lib/env/server";
import { createSupabaseSessionClient } from "@/lib/supabase/session";
import { isSupabaseStaffAuthConfigured } from "./authConfig";
import {
  buildAuthCallbackUrl,
  getAdminLoginPath,
  getAdminPasswordPath,
  getAdminPath,
  parseAuthLocale,
} from "./authPaths";
import { getCurrentStaff } from "./session";

export type AuthActionState = {
  status: "idle" | "success" | "error";
  key: string;
  fieldErrors?: Record<string, string[]>;
};

const signInSchema = z.object({
  locale: z.string(),
  email: z.string().trim().email("invalid_email"),
  password: z.string().min(8, "password_too_short"),
});

const emailSchema = z.object({
  locale: z.string(),
  email: z.string().trim().email("invalid_email"),
});

const passwordSchema = z
  .object({
    locale: z.string(),
    password: z.string().min(8, "password_too_short"),
    confirmPassword: z.string().min(8, "password_too_short"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwords_must_match",
  });

export async function signInWithPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseStaffAuthConfigured()) return errorState("auth_not_configured");

  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationFailed(parsed.error);

  const locale = parseAuthLocale(parsed.data.locale);
  const client = await createSupabaseSessionClient();
  const { error } = await client.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return errorState("invalid_credentials");

  const staff = await getCurrentStaff();
  if (!staff) {
    await client.auth.signOut();
    return errorState("not_staff_member");
  }

  redirect(getAdminPath(locale));
}

export async function sendMagicLinkAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseStaffAuthConfigured()) return errorState("auth_not_configured");

  const parsed = emailSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationFailed(parsed.error);

  const locale = parseAuthLocale(parsed.data.locale);
  const origin = await getRequestOrigin();
  if (!origin) return errorState("set_url_first");

  const client = await createSupabaseSessionClient();
  const { error } = await client.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: buildAuthCallbackUrl(origin, getAdminPath(locale)),
    },
  });
  if (error) return errorState("magic_link_failed");

  return successState("magic_link_sent");
}

export async function sendPasswordResetAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseStaffAuthConfigured()) return errorState("auth_not_configured");

  const parsed = emailSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationFailed(parsed.error);

  const locale = parseAuthLocale(parsed.data.locale);
  const origin = await getRequestOrigin();
  if (!origin) return errorState("set_url_first");

  const client = await createSupabaseSessionClient();
  const { error } = await client.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: buildAuthCallbackUrl(origin, getAdminPasswordPath(locale)),
  });
  if (error) return errorState("reset_email_failed");

  return successState("reset_email_sent");
}

export async function updatePasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseStaffAuthConfigured()) return errorState("auth_not_configured");

  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationFailed(parsed.error);

  const locale = parseAuthLocale(parsed.data.locale);
  const client = await createSupabaseSessionClient();
  const { error } = await client.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return errorState("password_update_failed");

  const staff = await getCurrentStaff();
  if (!staff) {
    await client.auth.signOut();
    redirect(getAdminLoginPath(locale));
  }

  redirect(getAdminPath(locale));
}

export async function signOutAction(locale: string): Promise<void> {
  if (isSupabaseStaffAuthConfigured()) {
    const client = await createSupabaseSessionClient();
    await client.auth.signOut();
  }
  redirect(getAdminLoginPath(parseAuthLocale(locale)));
}

async function getRequestOrigin(): Promise<string | null> {
  if (serverEnv.URL) return serverEnv.URL;
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  if (!host) return null;
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

function errorState(key: string): AuthActionState {
  return { status: "error", key };
}

function successState(key: string): AuthActionState {
  return { status: "success", key };
}

function validationFailed(error: z.ZodError): AuthActionState {
  const fieldErrors: Record<string, string[]> = {};
  for (const [field, messages] of Object.entries(error.flatten().fieldErrors)) {
    if (messages?.length) fieldErrors[field] = messages;
  }
  return {
    status: "error",
    key: "check_fields",
    fieldErrors,
  };
}
"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  updatePasswordAction,
  type AuthActionState,
} from "@/features/identity/authActions";

const initialAuthActionState: AuthActionState = {
  status: "idle",
  key: "",
};

type PasswordUpdateFormProps = {
  locale: string;
};

export function PasswordUpdateForm({
  locale,
}: PasswordUpdateFormProps): React.ReactNode {
  const t = useTranslations("admin.password");
  const [state, action, pending] = useActionState(
    updatePasswordAction,
    initialAuthActionState,
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <label className="block space-y-1 text-sm font-medium">
        <span>{t("newPassword")}</span>
        <input
          required
          autoComplete="new-password"
          minLength={8}
          name="password"
          type="password"
          className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2"
        />
        <FieldError messages={state.fieldErrors?.password} />
      </label>
      <label className="block space-y-1 text-sm font-medium">
        <span>{t("confirmPassword")}</span>
        <input
          required
          autoComplete="new-password"
          minLength={8}
          name="confirmPassword"
          type="password"
          className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2"
        />
        <FieldError messages={state.fieldErrors?.confirmPassword} />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full rounded-md bg-brand px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? t("saving") : t("save")}
      </button>
      <FormMessage state={state} />
    </form>
  );
}

function FieldError({ messages }: { messages?: string[] }): React.ReactNode {
  const t = useTranslations("admin.auth");
  if (!messages?.length) return null;
  const code = messages[0];
  return <span className="text-sm text-brand">{t.has(code) ? t(code) : code}</span>;
}

function FormMessage({ state }: { state: AuthActionState }): React.ReactNode {
  const t = useTranslations("admin.auth");
  if (!state.key) return null;
  const text = t.has(state.key) ? t(state.key) : state.key;
  return (
    <p
      role="status"
      className={
        state.status === "error" ? "text-sm text-brand" : "text-sm text-ink/70"
      }
    >
      {text}
    </p>
  );
}
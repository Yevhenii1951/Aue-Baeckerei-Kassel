"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  sendMagicLinkAction,
  sendPasswordResetAction,
  signInWithPasswordAction,
  type AuthActionState,
} from "@/features/identity/authActions";

const initialAuthActionState: AuthActionState = {
  status: "idle",
  key: "",
};

type AdminLoginFormProps = {
  locale: string;
};

export function AdminLoginForm({
  locale,
}: AdminLoginFormProps): React.ReactNode {
  const t = useTranslations("admin.login");
  const [passwordState, passwordAction, passwordPending] = useActionState(
    signInWithPasswordAction,
    initialAuthActionState,
  );
  const [magicState, magicAction, magicPending] = useActionState(
    sendMagicLinkAction,
    initialAuthActionState,
  );
  const [resetState, resetAction, resetPending] = useActionState(
    sendPasswordResetAction,
    initialAuthActionState,
  );

  return (
    <div className="space-y-5">
      <form action={passwordAction} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <label className="block space-y-1 text-sm font-medium">
          <span>{t("email")}</span>
          <input
            required
            autoComplete="email"
            name="email"
            type="email"
            className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2"
          />
          <FieldError messages={passwordState.fieldErrors?.email} />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          <span>{t("password")}</span>
          <input
            required
            autoComplete="current-password"
            minLength={8}
            name="password"
            type="password"
            className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2"
          />
          <FieldError messages={passwordState.fieldErrors?.password} />
        </label>
        <button
          type="submit"
          disabled={passwordPending}
          className="min-h-11 w-full rounded-md bg-brand px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {passwordPending ? t("signingIn") : t("signIn")}
        </button>
        <FormMessage state={passwordState} />
      </form>

      <div className="border-t border-ink/10 pt-5">
        <form action={magicAction} className="space-y-3">
          <input type="hidden" name="locale" value={locale} />
          <label className="block space-y-1 text-sm font-medium">
            <span>{t("emailForMagicLink")}</span>
            <input
              required
              autoComplete="email"
              name="email"
              type="email"
              className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={magicPending}
            className="min-h-11 w-full rounded-md border border-ink/20 px-4 py-2 font-medium disabled:opacity-60"
          >
            {magicPending ? t("sendingLink") : t("sendMagicLink")}
          </button>
          <FormMessage state={magicState} />
        </form>
      </div>

      <details className="border-t border-ink/10 pt-5">
        <summary className="cursor-pointer text-sm font-medium underline-offset-4 hover:underline">
          {t("resetPassword")}
        </summary>
        <form action={resetAction} className="mt-3 space-y-3">
          <input type="hidden" name="locale" value={locale} />
          <label className="block space-y-1 text-sm font-medium">
            <span>{t("staffEmail")}</span>
            <input
              required
              autoComplete="email"
              name="email"
              type="email"
              className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={resetPending}
            className="min-h-11 w-full rounded-md border border-ink/20 px-4 py-2 font-medium disabled:opacity-60"
          >
            {resetPending ? t("sendingReset") : t("sendResetEmail")}
          </button>
          <FormMessage state={resetState} />
        </form>
      </details>
    </div>
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
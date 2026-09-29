import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PasswordUpdateForm } from "@/features/identity/components/PasswordUpdateForm";
import { isSupabaseStaffAuthConfigured } from "@/features/identity/authConfig";
import {
  getAdminLoginPath,
  parseAuthLocale,
} from "@/features/identity/authPaths";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = parseAuthLocale(rawLocale);
  setRequestLocale(locale);
  const t = await getTranslations("admin.meta");

  return {
    title: t("passwordTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminPasswordPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>): Promise<React.ReactNode> {
  const { locale: rawLocale } = await params;
  const locale = parseAuthLocale(rawLocale);
  setRequestLocale(locale);
  const t = await getTranslations("admin.password");
  const configured = isSupabaseStaffAuthConfigured();

  return (
    <main className="min-h-screen bg-cream px-4 py-10 text-ink sm:px-6">
      <section className="mx-auto max-w-md space-y-6 rounded-md border border-ink/10 bg-cream p-5 shadow-sm">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-ink/70">{t("intro")}</p>
        </div>
        {configured ? (
          <PasswordUpdateForm locale={locale} />
        ) : (
          <p className="text-sm text-brand">{t("notConfigured")}</p>
        )}
        <Link
          href={getAdminLoginPath(locale)}
          className="block text-sm underline-offset-4 hover:underline"
        >
          {t("backToLogin")}
        </Link>
      </section>
    </main>
  );
}
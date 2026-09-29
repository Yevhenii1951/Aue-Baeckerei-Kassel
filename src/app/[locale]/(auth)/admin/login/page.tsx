import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdminLoginForm } from "@/features/identity/components/AdminLoginForm";
import { isSupabaseStaffAuthConfigured } from "@/features/identity/authConfig";
import { getAdminPath, parseAuthLocale } from "@/features/identity/authPaths";
import { getCurrentStaff } from "@/features/identity/session";

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
    title: t("loginTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminLoginPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>): Promise<React.ReactNode> {
  const { locale: rawLocale } = await params;
  const locale = parseAuthLocale(rawLocale);
  setRequestLocale(locale);
  const t = await getTranslations("admin.login");
  const configured = isSupabaseStaffAuthConfigured();
  const staff = configured ? await getCurrentStaff() : null;
  if (staff) redirect(getAdminPath(locale));

  return (
    <main className="min-h-screen bg-cream px-4 py-10 text-ink sm:px-6">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
        <div className="space-y-5 pt-4">
          <Link
            href={`/${locale}`}
            className="text-sm underline-offset-4 hover:underline"
          >
            {t("backToSite")}
          </Link>
          <div className="space-y-3">
            <h1 className="font-display text-4xl font-semibold sm:text-5xl">
              {t("staffAccess")}
            </h1>
            <p className="max-w-2xl text-ink/75">{t("intro")}</p>
          </div>
          {!configured && (
            <p className="max-w-2xl rounded-md border border-brand/30 bg-paper p-4 text-sm text-brand">
              {t("notConfigured")}
            </p>
          )}
        </div>
        <div className="rounded-md border border-ink/10 bg-cream p-5 shadow-sm">
          {configured ? (
            <AdminLoginForm locale={locale} />
          ) : (
            <p className="text-sm text-ink/70">{t("formWillActivate")}</p>
          )}
        </div>
      </section>
    </main>
  );
}
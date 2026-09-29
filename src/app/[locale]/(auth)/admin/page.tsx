import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { parseAuthLocale } from "@/features/identity/authPaths";
import { AdminDashboard } from "@/features/bakery-admin/AdminDashboard";

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
    title: t("dashboardTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminDashboardPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>): Promise<React.ReactNode> {
  const { locale: rawLocale } = await params;
  const locale = parseAuthLocale(rawLocale);
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-cream px-4 py-10 text-ink sm:px-6">
      <section className="mx-auto max-w-6xl">
        <AdminDashboard />
      </section>
    </main>
  );
}
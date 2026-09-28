import type { Metadata } from "next";
import { parseAuthLocale } from "@/features/identity/authPaths";
import { AdminDashboard } from "@/features/bakery-admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>): Promise<React.ReactNode> {
  const { locale: rawLocale } = await params;
  parseAuthLocale(rawLocale);

  return (
    <main className="min-h-screen bg-cream px-4 py-10 text-ink sm:px-6">
      <section className="mx-auto max-w-6xl">
        <AdminDashboard />
      </section>
    </main>
  );
}
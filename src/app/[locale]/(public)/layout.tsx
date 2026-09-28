import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { parseSupportedLocale } from "@/features/seo/site";
import SiteHeader from "@/features/shell/SiteHeader";
import SiteFooter from "@/features/shell/SiteFooter";
import { CartDrawer } from "@/features/ordering/CartDrawer";
import { ConsentBanner } from "@/features/consent/ConsentBanner";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PublicLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("a11y");
  const supported = parseSupportedLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-paper focus:px-4 focus:py-2 focus:font-medium"
      >
        {t("skipToContent")}
      </a>
      <SiteHeader locale={supported} />
      <main
        id="main"
        tabIndex={-1}
        className="w-full flex-1"
      >
        {children}
      </main>
      <SiteFooter locale={supported} />
      <CartDrawer locale={supported} />
      <ConsentBanner />
    </div>
  );
}

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { SiteLocale } from "@/features/seo/site";

type SiteFooterProps = {
  locale: SiteLocale;
};

export default async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations("shell");

  return (
    <footer className="mt-auto border-t border-white/10 bg-brand-deep text-cream">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:px-8">
        <nav aria-label={t("footerNav")}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href={`/${locale}`} className="nav-link">
                {t("navHome")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#sortiment`} className="nav-link">
                {t("navAssortment")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#cafe`} className="nav-link">
                {t("navCafe")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/impressum`} className="nav-link">
                {t("navImprint")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/datenschutz`} className="nav-link">
                {t("navPrivacy")}
              </Link>
            </li>
          </ul>
        </nav>
        <p className="text-cream/70">{t("footerNote")}</p>
      </div>
    </footer>
  );
}

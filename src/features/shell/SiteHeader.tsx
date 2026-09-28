import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { SiteLocale } from "@/features/seo/site";

type SiteHeaderProps = {
  locale: SiteLocale;
};

export default async function SiteHeader({ locale }: SiteHeaderProps) {
  const t = await getTranslations("shell");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-deep/95 text-cream backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <Link
          href={`/${locale}`}
          className="font-display text-2xl font-semibold tracking-tight"
        >
          {t("brandPlaceholder")}
        </Link>
        <nav aria-label={t("primaryNav")}>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href={`/${locale}`} className="nav-link">
                {t("navHome")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/sortiment`} className="nav-link">
                {t("navAssortment")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#vorbestellen`} className="nav-link">
                {t("navPreorder")}
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
      </div>
    </header>
  );
}

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { SiteLocale } from "@/features/seo/site";
import { CartToggleButton } from "./CartToggleButton";
import { MobileMenu, type MobileMenuLink } from "./MobileMenu";

type SiteHeaderProps = {
  locale: SiteLocale;
};

export default async function SiteHeader({ locale }: SiteHeaderProps) {
  const t = await getTranslations("shell");

  const links: MobileMenuLink[] = [
    { href: `/${locale}`, label: t("navHome") },
    { href: `/${locale}/sortiment`, label: t("navAssortment") },
    { href: `/${locale}#vorbestellen`, label: t("navPreorder") },
    { href: `/${locale}#cafe`, label: t("navCafe") },
    { href: `/${locale}/impressum`, label: t("navImprint") },
    { href: `/${locale}/datenschutz`, label: t("navPrivacy") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-deep/95 text-cream backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <Link
          href={`/${locale}`}
          className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap font-display text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {t("brandPlaceholder")}
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <CartToggleButton />
          <nav aria-label={t("primaryNav")} className="hidden lg:block">
            <ul className="flex items-center gap-x-6 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <MobileMenu
            links={links}
            menuLabel={t("menuOpen")}
            closeLabel={t("menuClose")}
            brandLabel={t("brandPlaceholder")}
          />
        </div>
      </div>
    </header>
  );
}

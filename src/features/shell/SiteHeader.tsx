import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { SiteLocale } from "@/features/seo/site";
import { CartToggleButton } from "./CartToggleButton";
import { MobileMenu } from "./MobileMenu";
import { cafeLink, navigationLinks } from "./siteNavigation";

type SiteHeaderProps = {
  locale: SiteLocale;
};

export default async function SiteHeader({ locale }: SiteHeaderProps) {
  const t = await getTranslations("shell");

  const labels = {
    assortment: t("navAssortment"),
    preorder: t("navPreorder"),
    cafe: t("navCafe"),
    contact: t("navContact"),
    career: t("navCareer"),
    partner: t("navPartner"),
    delivery: t("navDelivery"),
    imprint: t("navImprint"),
    privacy: t("navPrivacy"),
  };
  const links = navigationLinks(locale, labels);
  const cafe = cafeLink(locale, labels.cafe);
  // Café after the ordering steps, mirroring the footer. The drawer is the
  // only way to reach the café below sm, where the framed pill is hidden.
  const menuLinks = [...links.slice(0, 2), cafe, ...links.slice(2)];

  return (
    // No backdrop-filter here: it would turn the header into the containing
    // block for the fixed menu drawer, collapsing it to the header height.
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-deep/95 text-cream">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <Link
          href={`/${locale}`}
          className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap font-display text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {t("brandPlaceholder")}
        </Link>

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

        <div className="flex items-center gap-2">
          <Link href={cafe.href} className="nav-cafe-link hidden sm:inline-flex">
            {cafe.label}
          </Link>
          <CartToggleButton />
          <MobileMenu
            links={menuLinks}
            menuLabel={t("menuOpen")}
            closeLabel={t("menuClose")}
            brandLabel={t("brandPlaceholder")}
          />
        </div>
      </div>
    </header>
  );
}

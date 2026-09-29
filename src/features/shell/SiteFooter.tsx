import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { SiteLocale } from "@/features/seo/site";
import { ConsentRevokeLink } from "@/features/consent/ConsentRevokeLink";
import {
  footerNavigationLinks,
  legalLinks,
  SOCIAL_LINKS,
} from "./siteNavigation";

type SiteFooterProps = {
  locale: SiteLocale;
};

export default async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations("shell");
  const labels = {
    assortment: t("navAssortment"),
    preorder: t("navPreorder"),
    contact: t("navContact"),
    career: t("navCareer"),
    partner: t("navPartner"),
    delivery: t("navDelivery"),
    cafe: t("navCafe"),
    imprint: t("navImprint"),
    privacy: t("navPrivacy"),
  };
  const links = footerNavigationLinks(locale, labels);
  const legal = legalLinks(locale, labels);

  return (
    <footer className="mt-auto border-t border-white/10 bg-brand-deep text-cream">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-semibold">
              {t("brandPlaceholder")}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-cream/70">
              {t("footerNote")}
            </p>
            <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="text-sm text-cream/75 underline underline-offset-4 transition-colors duration-300 hover:text-amber"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label={t("footerNav")}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-amber">
              {t("footerNavTitle")}
            </h2>
            <ul className="mt-4 grid gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footerLegalNav")}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-amber">
              {t("footerLegalTitle")}
            </h2>
            <ul className="mt-4 grid gap-2">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ConsentRevokeLink />
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t("brandPlaceholder")}
          </p>
          <p>{t("credit")}</p>
        </div>
      </div>
    </footer>
  );
}

import type { SiteLocale } from "@/features/seo/site";

export type NavLink = {
  href: string;
  label: string;
};

export type NavLabels = {
  assortment: string;
  preorder: string;
  contact: string;
  career: string;
  partner: string;
  delivery: string;
  imprint: string;
  privacy: string;
};

/**
 * The header carries the transaction only; legal pages live in the footer.
 * One source of truth keeps the desktop nav, the drawer and the footer from
 * drifting apart.
 */
export function navigationLinks(
  locale: SiteLocale,
  labels: NavLabels,
): NavLink[] {
  return [
    { href: `/${locale}/sortiment`, label: labels.assortment },
    { href: `/${locale}/vorbestellen`, label: labels.preorder },
    { href: `/${locale}/kontakt`, label: labels.contact },
    { href: `/${locale}/karriere`, label: labels.career },
    { href: `/${locale}/partner`, label: labels.partner },
  ];
}

export function footerNavigationLinks(
  locale: SiteLocale,
  labels: NavLabels,
): NavLink[] {
  return [
    ...navigationLinks(locale, labels),
    { href: `/${locale}/lieferung`, label: labels.delivery },
  ];
}

export function legalLinks(locale: SiteLocale, labels: NavLabels): NavLink[] {
  return [
    { href: `/${locale}/impressum`, label: labels.imprint },
    { href: `/${locale}/datenschutz`, label: labels.privacy },
  ];
}
